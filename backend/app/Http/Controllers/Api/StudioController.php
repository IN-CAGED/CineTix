<?php

namespace App\Http\Controllers\Api;

use App\Models\Studio;

class StudioController extends CrudController
{
	protected function modelClass(): string
	{
		return Studio::class;
	}

	protected function relations(): array
	{
		return ['seats', 'schedules'];
	}

	protected function storeRules(): array
	{
		return [
			'name' => ['required', 'string', 'max:100'],
			'capacity' => ['required', 'integer', 'min:1'],
		];
	}
}
