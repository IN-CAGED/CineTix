<?php

namespace App\Http\Controllers\Api;

use App\Models\Movie;

class MovieController extends CrudController
{
	protected function modelClass(): string
	{
		return Movie::class;
	}

	protected function relations(): array
	{
		return ['schedules'];
	}

	protected function storeRules(): array
	{
		return [
			'title' => ['required', 'string', 'max:255'],
			'duration_minutes' => ['required', 'integer', 'min:1'],
			'genre' => ['required', 'string', 'max:100'],
			'age_rating' => ['required', 'string', 'max:10'],
			'synopsis' => ['nullable', 'string'],
			'poster_url' => ['nullable', 'string', 'max:255'],
		];
	}
}
