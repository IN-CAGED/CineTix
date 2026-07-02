<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('seats', function (Blueprint $table) {
			$table->id();
			$table->foreignId('studio_id')->constrained()->cascadeOnDelete();
			$table->string('seat_number', 10);
			$table->string('row_label', 5);
			$table->integer('column_number');
			$table->timestamps();

			$table->unique(['studio_id', 'seat_number']);
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('seats');
	}
};
