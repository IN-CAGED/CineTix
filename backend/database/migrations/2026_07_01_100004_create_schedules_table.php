<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('schedules', function (Blueprint $table) {
			$table->id();
			$table->foreignId('movie_id')->constrained()->cascadeOnDelete();
			$table->foreignId('studio_id')->constrained()->cascadeOnDelete();
			$table->dateTime('start_time');
			$table->dateTime('end_time');
			$table->decimal('ticket_price', 12, 2);
			$table->timestamps();
			$table->softDeletes();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('schedules');
	}
};
