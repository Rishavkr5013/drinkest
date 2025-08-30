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
        Schema::create('delivery_partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->unique();
            $table->string('email')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->string('license_number')->nullable();
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->boolean('is_online')->default(false); // available for assignment
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('firebase_uid')->nullable(); // Firebase user ID for authentication
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_partners');
    }
};
