<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('tickets', function (Blueprint $table) {
			$table->id();
			$table->foreignId('transaction_id')->constrained()->cascadeOnDelete();
			$table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
			$table->foreignId('seat_id')->constrained()->cascadeOnDelete();
			$table->enum('status', ['Locked', 'Booked', 'Cancelled'])->default('Locked');
			$table->dateTime('locked_until')->nullable();
			$table->string('qr_token', 255)->nullable()->unique();
			$table->timestamps();

			$table->unique(['schedule_id', 'seat_id', 'status']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('tickets');
	}
};
