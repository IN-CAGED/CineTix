<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Validation\Rule;

class TransactionController extends CrudController
{
	protected function modelClass(): string
	{
		return Transaction::class;
	}

	protected function relations(): array
	{
		return ['user', 'schedule'];
	}

	protected function storeRules(): array
	{
		return [
			'user_id' => ['required', 'integer', 'exists:users,id'],
			'schedule_id' => ['required', 'integer', 'exists:schedules,id'],
			'total_amount' => ['required', 'numeric', 'min:0'],
			'payment_status' => ['nullable', Rule::in(['Pending', 'Paid', 'Expired', 'Failed'])],
			'payment_method' => ['nullable', 'string', 'max:50'],
			'payment_ref_id' => ['nullable', 'string', 'max:255'],
		];
	}
}
