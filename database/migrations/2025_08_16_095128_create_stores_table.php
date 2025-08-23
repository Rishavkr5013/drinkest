<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        // Enable PostGIS extension (if not already)
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');

        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();

            // We'll add geography column via DB::statement
            $table->integer('delivery_radius')->default(5000);
            $table->timestamps();
        });

        // Add PostGIS geography column
        DB::statement('ALTER TABLE stores ADD COLUMN location geography(Point, 4326)');

        // Add GiST index for fast spatial queries
        DB::statement('CREATE INDEX stores_location_gist ON stores USING GIST (location)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
