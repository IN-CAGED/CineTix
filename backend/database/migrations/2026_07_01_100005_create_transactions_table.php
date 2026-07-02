<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('transactions', function (Blueprint $table) {
			$table->id();
			$table->foreignId('user_id')->constrained()->cascadeOnDelete();
			$table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
			$table->decimal('total_amount', 12, 2);
			$table->enum('payment_status', ['Pending', 'Paid', 'Expired', 'Failed'])->default('Pending');
			$table->string('payment_method', 50)->nullable();
			$table->string('payment_ref_id', 255)->nullable();
			$table->dateTime('expires_at')->nullable();
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('transactions');
	}
};
