<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = [
		'movie_id',
		'studio_id',
		'start_time',
		'end_time',
		'ticket_price',
	];

	protected function casts(): array
	{
		return [
			'start_time' => 'datetime',
			'end_time' => 'datetime',
			'ticket_price' => 'decimal:2',
		];
	}

	public function movie(): BelongsTo
	{
		return $this->belongsTo(Movie::class);
	}

	public function studio(): BelongsTo
	{
		return $this->belongsTo(Studio::class);
	}

	public function tickets(): HasMany
	{
		return $this->hasMany(Ticket::class);
	}

	public function transactions(): HasMany
	{
		return $this->hasMany(Transaction::class);
	}
}
