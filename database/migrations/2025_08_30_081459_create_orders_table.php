<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_location_id')->constrained('user_locations')->cascadeOnDelete();
            $table->enum('status', ['pending', 'confirmed', 'assigned', 'dispatched', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->timestamps();

            $table->foreignId('delivery_partner_id')->nullable()->constrained('delivery_partners')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
