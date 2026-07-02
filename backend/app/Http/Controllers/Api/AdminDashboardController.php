<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Transaction;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
	public function __invoke(): JsonResponse
	{
		$totalRevenue = Transaction::where('payment_status', 'Paid')->sum('total_amount');

		$todayRevenue = Transaction::where('payment_status', 'Paid')
			->whereDate('created_at', today())
			->sum('total_amount');

		$monthRevenue = Transaction::where('payment_status', 'Paid')
			->whereMonth('created_at', now()->month)
			->whereYear('created_at', now()->year)
			->sum('total_amount');

		$totalTransactions = Transaction::where('payment_status', 'Paid')->count();
		$todayTransactions = Transaction::where('payment_status', 'Paid')
			->whereDate('created_at', today())
			->count();

		$totalTicketsSold = Ticket::where('status', 'Booked')->count();
		$totalUsers = User::where('role', 'Customer')->count();
		$totalMovies = Movie::count();

		$popularMovies = Movie::select('movies.id', 'movies.title', 'movies.poster_url', 'movies.genre')
			->join('schedules', 'movies.id', '=', 'schedules.movie_id')
			->join('tickets', 'schedules.id', '=', 'tickets.schedule_id')
			->where('tickets.status', 'Booked')
			->groupBy('movies.id', 'movies.title', 'movies.poster_url', 'movies.genre')
			->selectRaw('COUNT(tickets.id) as tickets_sold')
			->orderByDesc('tickets_sold')
			->limit(5)
			->get();

		$recentTransactions = Transaction::with(['user', 'schedule.movie'])
			->where('payment_status', 'Paid')
			->latest()
			->limit(10)
			->get();

		return response()->json([
			'total_revenue' => (float) $totalRevenue,
			'today_revenue' => (float) $todayRevenue,
			'month_revenue' => (float) $monthRevenue,
			'total_transactions' => $totalTransactions,
			'today_transactions' => $todayTransactions,
			'total_tickets_sold' => $totalTicketsSold,
			'total_users' => $totalUsers,
			'total_movies' => $totalMovies,
			'popular_movies' => $popularMovies,
			'recent_transactions' => $recentTransactions,
		]);
	}
}
