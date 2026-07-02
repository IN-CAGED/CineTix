<?php

namespace App\Http\Controllers\Api;

use App\Models\Seat;

class SeatController extends CrudController
{
	protected function modelClass(): string
	{
		return Seat::class;
	}

	protected function relations(): array
	{
		return ['studio'];
	}

	protected function storeRules(): array
	{
		return [
			'studio_id' => ['required', 'integer', 'exists:studios,id'],
			'seat_number' => ['required', 'string', 'max:10'],
		];
	}
}
