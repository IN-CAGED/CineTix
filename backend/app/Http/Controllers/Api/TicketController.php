<?php

namespace App\Http\Controllers\Api;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class TicketController extends CrudController
{
	protected function modelClass(): string
	{
		return Ticket::class;
	}

	protected function relations(): array
	{
		return ['transaction', 'schedule', 'seat'];
	}

	protected function storeRules(): array
	{
		return [
			'transaction_id' => ['required', 'integer', 'exists:transactions,id'],
			'schedule_id' => ['required', 'integer', 'exists:schedules,id'],
			'seat_id' => ['required', 'integer', 'exists:seats,id'],
			'status' => ['nullable', Rule::in(['Locked', 'Booked', 'Cancelled'])],
			'locked_until' => ['required', 'date'],
			'qr_token' => ['nullable', 'string', 'max:255', 'unique:tickets,qr_token'],
		];
	}

	protected function updateRules(?Model $model = null): array
	{
		$ticketId = $model?->getKey();

		return [
			'transaction_id' => ['required', 'integer', 'exists:transactions,id'],
			'schedule_id' => ['required', 'integer', 'exists:schedules,id'],
			'seat_id' => ['required', 'integer', 'exists:seats,id'],
			'status' => ['nullable', Rule::in(['Locked', 'Booked', 'Cancelled'])],
			'locked_until' => ['required', 'date'],
			'qr_token' => ['nullable', 'string', 'max:255', Rule::unique('tickets', 'qr_token')->ignore($ticketId)],
		];
	}
}
