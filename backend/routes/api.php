<?php

use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SeatController;
use App\Http\Controllers\Api\StudioController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public catalog
Route::apiResource('movies', MovieController::class)->only(['index', 'show']);
Route::apiResource('schedules', ScheduleController::class)->only(['index', 'show']);
Route::get('/schedules/{schedule}/seats', [BookingController::class, 'scheduleSeats']);

// Authenticated customer routes
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/me', [AuthController::class, 'me']);
	Route::post('/logout', [AuthController::class, 'logout']);

	// Booking flow
	Route::post('/bookings/lock-seats', [BookingController::class, 'lockSeats']);
	Route::post('/bookings/confirm-payment', [BookingController::class, 'confirmPayment']);
	Route::get('/bookings/my-tickets', [BookingController::class, 'myTickets']);
	Route::get('/bookings/my-pending', [BookingController::class, 'myPending']);
	Route::post('/bookings/cancel/{id}', [BookingController::class, 'cancelBooking']);
});

// Cashier routes
Route::middleware(['auth:sanctum', 'role:Admin,Cashier'])->group(function () {
	Route::post('/bookings/validate-ticket', [BookingController::class, 'validateTicket']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:Admin,Cashier'])->group(function () {
	Route::post('/movies/upload-poster', [MovieController::class, 'uploadPoster']);
	Route::apiResource('movies', MovieController::class)->except(['index', 'show']);
	Route::apiResource('studios', StudioController::class);
	Route::apiResource('seats', SeatController::class);
	Route::apiResource('schedules', ScheduleController::class)->except(['index', 'show']);
	Route::apiResource('transactions', TransactionController::class);
	Route::apiResource('tickets', TicketController::class);
	Route::apiResource('users', UserController::class);
});

Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
	Route::get('/admin/dashboard', AdminDashboardController::class);
});
