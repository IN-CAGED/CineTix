<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('movies', function (Blueprint $table) {
			$table->id();
			$table->string('title');
			$table->integer('duration_minutes');
			$table->string('genre', 100);
			$table->string('age_rating', 10);
			$table->text('synopsis')->nullable();
			$table->string('poster_url', 500)->nullable();
			$table->enum('status', ['now_showing', 'coming_soon'])->default('now_showing');
			$table->date('release_date')->nullable();
			$table->timestamps();
			$table->softDeletes();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('movies');
	}
};
