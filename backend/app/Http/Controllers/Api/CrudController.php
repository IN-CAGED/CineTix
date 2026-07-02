<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

abstract class CrudController extends Controller
{
	abstract protected function modelClass(): string;

	protected function relations(): array
	{
		return [];
	}

	abstract protected function storeRules(): array;

	protected function updateRules(?Model $model = null): array
	{
		return $this->storeRules();
	}

	protected function modelQuery()
	{
		return ($this->modelClass())::query()->with($this->relations());
	}

	public function index(): JsonResponse
	{
		return response()->json(
			$this->modelQuery()->latest('id')->get()
		);
	}

	public function show(string $id): JsonResponse
	{
		return response()->json(
			$this->modelQuery()->findOrFail($id)
		);
	}

	public function store(Request $request): JsonResponse
	{
		$validated = $request->validate($this->storeRules());
		$model = ($this->modelClass())::create($validated);

		return response()->json($model->load($this->relations()), 201);
	}

	public function update(Request $request, string $id): JsonResponse
	{
		$model = $this->modelQuery()->findOrFail($id);
		$validated = $request->validate($this->updateRules($model));
		$model->fill($validated)->save();

		return response()->json($model->fresh()->load($this->relations()));
	}

	public function destroy(string $id): JsonResponse
	{
		$model = $this->modelQuery()->findOrFail($id);
		$model->delete();

		return response()->json([
			'deleted' => true,
		]);
	}
}
