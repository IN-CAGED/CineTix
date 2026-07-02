<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
	use HasFactory;

	protected $fillable = [
		'transaction_id',
		'schedule_id',
		'seat_id',
		'status',
		'locked_until',
		'qr_token',
	];

	protected function casts(): array
	{
		return [
			'locked_until' => 'datetime',
		];
	}

	public function transaction(): BelongsTo
	{
		return $this->belongsTo(Transaction::class);
	}

	public function schedule(): BelongsTo
	{
		return $this->belongsTo(Schedule::class);
	}

	public function seat(): BelongsTo
	{
		return $this->belongsTo(Seat::class);
	}
}
