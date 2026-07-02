<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Schedule;
use App\Models\Seat;
use App\Models\Studio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
	public function run(): void
	{
		// ── Users ──
		User::create(['name' => 'Admin CineTix', 'email' => 'admin@cinetix.id', 'password' => 'password', 'role' => 'Admin']);
		User::create(['name' => 'Manager CineTix', 'email' => 'manager@cinetix.id', 'password' => 'password', 'role' => 'Admin']);
		User::create(['name' => 'Kasir Satu', 'email' => 'kasir1@cinetix.id', 'password' => 'password', 'role' => 'Cashier']);
		User::create(['name' => 'Kasir Dua', 'email' => 'kasir2@cinetix.id', 'password' => 'password', 'role' => 'Cashier']);
		User::create(['name' => 'Budi Santoso', 'email' => 'budi@gmail.com', 'password' => 'password', 'role' => 'Customer']);
		User::create(['name' => 'Siti Rahayu', 'email' => 'siti@gmail.com', 'password' => 'password', 'role' => 'Customer']);
		User::create(['name' => 'Ahmad Kurniawan', 'email' => 'ahmad@gmail.com', 'password' => 'password', 'role' => 'Customer']);

		// ── Studios + Seats ──
		$studioConfigs = [
			['name' => 'Studio 1 — Regular', 'capacity' => 40, 'rows' => ['A', 'B', 'C', 'D', 'E'], 'cols' => 8],
			['name' => 'Studio 2 — Premium', 'capacity' => 30, 'rows' => ['A', 'B', 'C', 'D', 'E', 'F'], 'cols' => 5],
			['name' => 'Studio 3 — IMAX', 'capacity' => 48, 'rows' => ['A', 'B', 'C', 'D', 'E', 'F'], 'cols' => 8],
		];

		$studios = [];
		foreach ($studioConfigs as $config) {
			$studio = Studio::create([
				'name' => $config['name'],
				'capacity' => $config['capacity'],
			]);

			foreach ($config['rows'] as $row) {
				for ($col = 1; $col <= $config['cols']; $col++) {
					Seat::create([
						'studio_id' => $studio->id,
						'seat_number' => $row . $col,
						'row_label' => $row,
						'column_number' => $col,
					]);
				}
			}

			$studios[] = $studio;
		}

		// ── Movies ──
		$movies = [
			Movie::create([
				'title' => 'The Last Horizon',
				'duration_minutes' => 142,
				'genre' => 'Sci-Fi',
				'age_rating' => 'PG-13',
				'synopsis' => 'In the year 2157, humanity\'s last colony ship embarks on a perilous journey to a distant star system. When their navigation AI malfunctions, the crew must rely on an unlikely alliance to survive the vast emptiness of space.',
				'poster_url' => 'https://placehold.co/400x600/d35400/ffffff?text=The+Last+Horizon',
				'status' => 'now_showing',
				'release_date' => now()->subDays(5),
			]),
			Movie::create([
				'title' => 'Shadow of the Dragon',
				'duration_minutes' => 128,
				'genre' => 'Action',
				'age_rating' => 'R',
				'synopsis' => 'A retired martial artist is pulled back into the underground fighting world when a powerful crime syndicate threatens his family. Armed with ancient techniques and modern resolve, he must face his deadliest opponent yet.',
				'poster_url' => 'https://placehold.co/400x600/c0392b/ffffff?text=Shadow+of+the+Dragon',
				'status' => 'now_showing',
				'release_date' => now()->subDays(12),
			]),
			Movie::create([
				'title' => 'Whispers in the Rain',
				'duration_minutes' => 115,
				'genre' => 'Romance',
				'age_rating' => 'PG',
				'synopsis' => 'Two strangers share an umbrella during a sudden downpour in Jakarta, sparking a connection that transcends their different worlds. As the monsoon season unfolds, so does their unconventional love story.',
				'poster_url' => 'https://placehold.co/400x600/2980b9/ffffff?text=Whispers+in+the+Rain',
				'status' => 'now_showing',
				'release_date' => now()->subDays(3),
			]),
			Movie::create([
				'title' => 'Code Zero',
				'duration_minutes' => 135,
				'genre' => 'Thriller',
				'age_rating' => 'PG-13',
				'synopsis' => 'A cybersecurity expert discovers a critical vulnerability in the world\'s financial systems. With only 48 hours before hackers exploit it, she races against time in a pulse-pounding digital thriller.',
				'poster_url' => 'https://placehold.co/400x600/8e44ad/ffffff?text=Code+Zero',
				'status' => 'now_showing',
				'release_date' => now()->subDays(1),
			]),
			Movie::create([
				'title' => 'The Enchanted Forest',
				'duration_minutes' => 98,
				'genre' => 'Animation',
				'age_rating' => 'G',
				'synopsis' => 'A young fox cub ventures into the magical Enchanted Forest to find a cure for her ailing grandmother. Along the way, she befriends a cast of whimsical creatures who teach her the true meaning of courage.',
				'poster_url' => 'https://placehold.co/400x600/27ae60/ffffff?text=The+Enchanted+Forest',
				'status' => 'now_showing',
				'release_date' => now()->subDays(7),
			]),
			Movie::create([
				'title' => 'Nusantara Rising',
				'duration_minutes' => 150,
				'genre' => 'Adventure',
				'age_rating' => 'PG-13',
				'synopsis' => 'An archaeological expedition uncovers an ancient temple deep in the Indonesian archipelago, awakening a mythical guardian that could reshape the balance of power in the modern world.',
				'poster_url' => 'https://placehold.co/400x600/e67e22/ffffff?text=Nusantara+Rising',
				'status' => 'coming_soon',
				'release_date' => now()->addDays(14),
			]),
			Movie::create([
				'title' => 'Galactic Requiem',
				'duration_minutes' => 165,
				'genre' => 'Sci-Fi',
				'age_rating' => 'PG-13',
				'synopsis' => 'The sequel to the groundbreaking space opera follows the survivors as they encounter an alien civilization that challenges everything humanity believes about the universe.',
				'poster_url' => 'https://placehold.co/400x600/1abc9c/ffffff?text=Galactic+Requiem',
				'status' => 'coming_soon',
				'release_date' => now()->addDays(30),
			]),
			Movie::create([
				'title' => 'Midnight Serenade',
				'duration_minutes' => 112,
				'genre' => 'Horror',
				'age_rating' => 'R',
				'synopsis' => 'A jazz musician inherits a mysterious nightclub that only operates between midnight and dawn. As she performs each night, she discovers the venue harbors dark secrets from the 1940s.',
				'poster_url' => 'https://placehold.co/400x600/2c3e50/ffffff?text=Midnight+Serenade',
				'status' => 'coming_soon',
				'release_date' => now()->addDays(21),
			]),
		];

		// ── Schedules ──
		$baseDate = Carbon::today();
		$showtimes = ['10:00', '13:00', '16:00', '19:00', '21:30'];

		foreach ($movies as $movie) {
			if ($movie->status !== 'now_showing') {
				continue;
			}

			// Create schedules for next 7 days
			for ($day = 0; $day < 7; $day++) {
				$date = $baseDate->copy()->addDays($day);

				// 2-3 showtimes per day, rotating studios
				$dayShowtimes = array_slice($showtimes, 0, rand(2, 3));
				foreach ($dayShowtimes as $i => $time) {
					$studio = $studios[$i % count($studios)];
					$startTime = $date->copy()->setTimeFromTimeString($time);
					$endTime = $startTime->copy()->addMinutes($movie->duration_minutes);

					$prices = [35000, 40000, 45000, 50000, 55000];
					Schedule::create([
						'movie_id' => $movie->id,
						'studio_id' => $studio->id,
						'start_time' => $startTime,
						'end_time' => $endTime,
						'ticket_price' => $prices[array_rand($prices)],
					]);
				}
			}
		}
	}
}
