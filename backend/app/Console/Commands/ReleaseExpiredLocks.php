<?php

namespace App\Console\Commands;

use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Console\Command;

class ReleaseExpiredLocks extends Command
{
	protected $signature = 'bookings:release-expired';
	protected $description = 'Release seats that have been locked past their expiry time';

	public function handle(): int
	{
		$expiredTickets = Ticket::where('status', 'Locked')
			->where('locked_until', '<=', now())
			->get();

		if ($expiredTickets->isEmpty()) {
			$this->info('No expired locks found.');
			return self::SUCCESS;
		}

		$transactionIds = $expiredTickets->pluck('transaction_id')->unique();

		// Cancel all expired tickets
		Ticket::where('status', 'Locked')
			->where('locked_until', '<=', now())
			->update(['status' => 'Cancelled']);

		// Expire their transactions
		Transaction::whereIn('id', $transactionIds)
			->where('payment_status', 'Pending')
			->update(['payment_status' => 'Expired']);

		$count = $expiredTickets->count();
		$this->info("Released {$count} expired seat lock(s) across {$transactionIds->count()} transaction(s).");

		return self::SUCCESS;
	}
}
