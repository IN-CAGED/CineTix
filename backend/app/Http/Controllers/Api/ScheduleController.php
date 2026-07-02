<?php

namespace App\Http\Controllers\Api;

use App\Models\Schedule;

class ScheduleController extends CrudController
{
	protected function modelClass(): string
	{
		return Schedule::class;
	}

	protected function relations(): array
	{
		return ['movie', 'studio'];
	}

	protected function storeRules(): array
	{
		return [
			'movie_id' => ['required', 'integer', 'exists:movies,id'],
			'studio_id' => ['required', 'integer', 'exists:studios,id'],
			'start_time' => ['required', 'date'],
			'end_time' => ['required', 'date', 'after:start_time'],
			'ticket_price' => ['required', 'numeric', 'min:0'],
		];
	}
}
