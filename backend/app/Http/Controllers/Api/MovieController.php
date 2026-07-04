<?php

namespace App\Http\Controllers\Api;

use App\Models\Movie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
			'poster_url' => ['nullable', 'string', 'max:500'],
			'status' => ['nullable', 'string', 'in:now_showing,coming_soon'],
		];
	}

	/**
	 * Upload a poster image and return its public URL.
	 */
	public function uploadPoster(Request $request): JsonResponse
	{
		$request->validate([
			'poster' => ['required', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
		]);

		$file = $request->file('poster');
		$filename = uniqid('poster_', true) . '.' . $file->getClientOriginalExtension();

		$path = $file->storeAs('posters', $filename, 'public');

		$url = Storage::disk('public')->url($path);

		return response()->json([
			'url' => $url,
			'path' => $path,
		]);
	}

	/**
	 * Override store to handle poster_image file upload alongside normal fields.
	 */
	public function store(Request $request): JsonResponse
	{
		$validated = $request->validate($this->storeRules());

		// If a poster file was uploaded inline, store it
		if ($request->hasFile('poster_image')) {
			$request->validate([
				'poster_image' => ['image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
			]);
			$file = $request->file('poster_image');
			$filename = uniqid('poster_', true) . '.' . $file->getClientOriginalExtension();
			$path = $file->storeAs('posters', $filename, 'public');
			$validated['poster_url'] = Storage::disk('public')->url($path);
		}

		$model = Movie::create($validated);

		return response()->json($model->load($this->relations()), 201);
	}

	/**
	 * Override update to handle poster_image file upload alongside normal fields.
	 */
	public function update(Request $request, string $id): JsonResponse
	{
		$model = $this->modelQuery()->findOrFail($id);
		$validated = $request->validate($this->updateRules($model));

		// If a poster file was uploaded inline, store it
		if ($request->hasFile('poster_image')) {
			$request->validate([
				'poster_image' => ['image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
			]);
			$file = $request->file('poster_image');
			$filename = uniqid('poster_', true) . '.' . $file->getClientOriginalExtension();
			$path = $file->storeAs('posters', $filename, 'public');
			$validated['poster_url'] = Storage::disk('public')->url($path);
		}

		$model->fill($validated)->save();

		return response()->json($model->fresh()->load($this->relations()));
	}
}
