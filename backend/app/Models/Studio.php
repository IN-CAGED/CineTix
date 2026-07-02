<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Studio extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = [
		'name',
		'capacity',
	];

	public function seats(): HasMany
	{
		return $this->hasMany(Seat::class);
	}

	public function schedules(): HasMany
	{
		return $this->hasMany(Schedule::class);
	}
}
