<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
	public function __invoke(): JsonResponse
	{
		return response()->json([
			'status' => 'ok',
			'service' => config('app.name'),
			'environment' => config('app.env'),
			'timestamp' => now()->toISOString(),
		]);
	}
}
