<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Seat;
use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingController extends Controller
{
	/**
	 * Lock seats for 5 minutes and create a pending transaction.
	 */
	public function lockSeats(Request $request): JsonResponse
	{
		$validated = $request->validate([
			'schedule_id' => ['required', 'integer', 'exists:schedules,id'],
			'seat_ids' => ['required', 'array', 'min:1', 'max:10'],
			'seat_ids.*' => ['required', 'integer', 'exists:seats,id'],
		]);

		$schedule = Schedule::with('studio')->findOrFail($validated['schedule_id']);
		$seatIds = $validated['seat_ids'];

		// Verify all seats belong to the schedule's studio
		$validSeats = Seat::where('studio_id', $schedule->studio_id)
			->whereIn('id', $seatIds)
			->count();

		if ($validSeats !== count($seatIds)) {
			return response()->json([
				'message' => 'One or more seats do not belong to this studio.',
			], 422);
		}

		// Check if any seats are already locked or booked for this schedule
		$takenSeats = Ticket::where('schedule_id', $schedule->id)
			->whereIn('seat_id', $seatIds)
			->whereIn('status', ['Locked', 'Booked'])
			->where(function ($query) {
				$query->where('status', 'Booked')
					->orWhere(function ($q) {
						$q->where('status', 'Locked')
							->where('locked_until', '>', now());
					});
			})
			->pluck('seat_id')
			->toArray();

		if (count($takenSeats) > 0) {
			return response()->json([
				'message' => 'Some seats are no longer available.',
				'taken_seat_ids' => $takenSeats,
			], 409);
		}

		$lockedUntil = now()->addMinutes(5);
		$totalAmount = $schedule->ticket_price * count($seatIds);

		$result = DB::transaction(function () use ($request, $schedule, $seatIds, $totalAmount, $lockedUntil) {
			$transaction = Transaction::create([
				'user_id' => $request->user()->id,
				'schedule_id' => $schedule->id,
				'total_amount' => $totalAmount,
				'payment_status' => 'Pending',
				'expires_at' => $lockedUntil,
			]);

			$tickets = [];
			foreach ($seatIds as $seatId) {
				// Cancel any expired locks for this seat first
				Ticket::where('schedule_id', $schedule->id)
					->where('seat_id', $seatId)
					->where('status', 'Locked')
					->where('locked_until', '<=', now())
					->update(['status' => 'Cancelled']);

				$tickets[] = Ticket::create([
					'transaction_id' => $transaction->id,
					'schedule_id' => $schedule->id,
					'seat_id' => $seatId,
					'status' => 'Locked',
					'locked_until' => $lockedUntil,
				]);
			}

			return [
				'transaction' => $transaction->load('tickets.seat'),
				'tickets' => $tickets,
			];
		});

		return response()->json([
			'message' => 'Seats locked successfully. You have 5 minutes to complete payment.',
			'transaction' => $result['transaction'],
			'expires_at' => $lockedUntil->toISOString(),
		], 201);
	}

	/**
	 * Confirm payment for a pending transaction.
	 */
	public function confirmPayment(Request $request): JsonResponse
	{
		$validated = $request->validate([
			'transaction_id' => ['required', 'integer', 'exists:transactions,id'],
			'payment_method' => ['required', 'string', 'in:card,cash,e-wallet'],
		]);

		$transaction = Transaction::where('id', $validated['transaction_id'])
			->where('user_id', $request->user()->id)
			->where('payment_status', 'Pending')
			->firstOrFail();

		// Check if transaction has expired
		if ($transaction->expires_at && now()->greaterThan($transaction->expires_at)) {
			// Expire the transaction and cancel tickets
			$transaction->update(['payment_status' => 'Expired']);
			Ticket::where('transaction_id', $transaction->id)
				->where('status', 'Locked')
				->update(['status' => 'Cancelled']);

			return response()->json([
				'message' => 'Payment time has expired. Your seats have been released.',
			], 410);
		}

		DB::transaction(function () use ($transaction, $validated) {
			$transaction->update([
				'payment_status' => 'Paid',
				'payment_method' => $validated['payment_method'],
				'payment_ref_id' => 'CTX-' . strtoupper(Str::random(12)),
			]);

			// Update all tickets to Booked and generate QR tokens
			$tickets = Ticket::where('transaction_id', $transaction->id)
				->where('status', 'Locked')
				->get();

			foreach ($tickets as $ticket) {
				$ticket->update([
					'status' => 'Booked',
					'qr_token' => Str::uuid()->toString(),
				]);
			}
		});

		$transaction->refresh()->load(['tickets.seat', 'schedule.movie', 'schedule.studio']);

		return response()->json([
			'message' => 'Payment confirmed! Your tickets are ready.',
			'transaction' => $transaction,
		]);
	}

	/**
	 * Get all tickets for the authenticated user.
	 */
	public function myTickets(Request $request): JsonResponse
	{
		$tickets = Ticket::whereHas('transaction', function ($query) use ($request) {
			$query->where('user_id', $request->user()->id);
		})
			->with(['transaction', 'schedule.movie', 'schedule.studio', 'seat'])
			->where('status', 'Booked')
			->latest('id')
			->get();

		return response()->json($tickets);
	}

	/**
	 * Validate a ticket by QR token (for Cashier use).
	 */
	public function validateTicket(Request $request): JsonResponse
	{
		$validated = $request->validate([
			'qr_token' => ['required', 'string'],
		]);

		$ticket = Ticket::with(['schedule.movie', 'schedule.studio', 'seat', 'transaction.user'])
			->where('qr_token', $validated['qr_token'])
			->first();

		if (! $ticket) {
			return response()->json([
				'valid' => false,
				'message' => 'Ticket not found.',
			], 404);
		}

		if ($ticket->status !== 'Booked') {
			return response()->json([
				'valid' => false,
				'message' => 'Ticket is not valid. Status: ' . $ticket->status,
				'ticket' => $ticket,
			], 422);
		}

		return response()->json([
			'valid' => true,
			'message' => 'Ticket is valid.',
			'ticket' => $ticket,
		]);
	}

	/**
	 * Get available seats for a schedule.
	 */
	public function scheduleSeats(string $scheduleId): JsonResponse
	{
		$schedule = Schedule::with('studio.seats')->findOrFail($scheduleId);
		$seats = $schedule->studio->seats;

		// Get taken seat IDs (locked and not expired, or booked)
		$takenSeatIds = Ticket::where('schedule_id', $schedule->id)
			->where(function ($query) {
				$query->where('status', 'Booked')
					->orWhere(function ($q) {
						$q->where('status', 'Locked')
							->where('locked_until', '>', now());
					});
			})
			->pluck('seat_id')
			->toArray();

		$seatData = $seats->map(function ($seat) use ($takenSeatIds) {
			return [
				'id' => $seat->id,
				'seat_number' => $seat->seat_number,
				'row_label' => $seat->row_label,
				'column_number' => $seat->column_number,
				'status' => in_array($seat->id, $takenSeatIds) ? 'taken' : 'available',
			];
		})->sortBy(['row_label', 'column_number'])->values();

		return response()->json([
			'schedule' => $schedule->load('movie'),
			'seats' => $seatData,
		]);
	}
}
