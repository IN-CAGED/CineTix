<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
	use HasFactory;

	protected $fillable = [
		'user_id',
		'schedule_id',
		'total_amount',
		'payment_status',
		'payment_method',
		'payment_ref_id',
		'expires_at',
	];

	protected function casts(): array
	{
		return [
			'total_amount' => 'decimal:2',
			'expires_at' => 'datetime',
		];
	}

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function schedule(): BelongsTo
	{
		return $this->belongsTo(Schedule::class);
	}

	public function tickets(): HasMany
	{
		return $this->hasMany(Ticket::class);
	}
}
