<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movie extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = [
		'title',
		'duration_minutes',
		'genre',
		'age_rating',
		'synopsis',
		'poster_url',
		'status',
		'release_date',
	];

	protected function casts(): array
	{
		return [
			'release_date' => 'date',
		];
	}

	public function schedules(): HasMany
	{
		return $this->hasMany(Schedule::class);
	}
}
