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
        Schema::create('order_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('delivery_partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade'); // Admin who assigned
            $table->enum('status', ['assigned', 'picked_up', 'delivered', 'cancelled'])->default('assigned');
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('notes')->nullable(); // Optional notes from delivery partner
            $table->timestamps();

            // Ensure one assignment per order at a time
            $table->unique(['order_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_assignments');
    }
};
