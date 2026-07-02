<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seat extends Model
{
	use HasFactory;

	protected $fillable = [
		'studio_id',
		'seat_number',
		'row_label',
		'column_number',
	];

	public function studio(): BelongsTo
	{
		return $this->belongsTo(Studio::class);
	}

	public function tickets(): HasMany
	{
		return $this->hasMany(Ticket::class);
	}
}
