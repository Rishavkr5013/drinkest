<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');

        Schema::create('user_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('address');
            $table->timestamps();
        });

        DB::statement("ALTER TABLE user_locations ADD COLUMN location geography(Point, 4326)");
        DB::statement("CREATE INDEX user_locations_location_gist ON user_locations USING GIST (location)");
    }

    public function down(): void
    {
        Schema::dropIfExists('user_locations');
    }
};
