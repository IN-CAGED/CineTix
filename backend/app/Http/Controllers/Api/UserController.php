<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;

class UserController extends CrudController
{
	protected function modelClass(): string
	{
		return User::class;
	}

	protected function relations(): array
	{
		return ['transactions'];
	}

	protected function storeRules(): array
	{
		return [
			'name' => ['required', 'string', 'max:255'],
			'email' => ['required', 'email', 'max:255', 'unique:users,email'],
			'password' => ['required', 'string', 'min:8'],
			'role' => ['nullable', Rule::in(['Customer', 'Admin', 'Cashier'])],
		];
	}

	protected function updateRules(?Model $model = null): array
	{
		$userId = $model?->getKey();

		return [
			'name' => ['required', 'string', 'max:255'],
			'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
			'password' => ['sometimes', 'string', 'min:8'],
			'role' => ['nullable', Rule::in(['Customer', 'Admin', 'Cashier'])],
		];
	}
}
