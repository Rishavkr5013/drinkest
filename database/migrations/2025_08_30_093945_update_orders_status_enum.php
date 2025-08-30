<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For PostgreSQL, we need to use raw SQL to alter the enum
        DB::statement("ALTER TABLE orders DROP CONSTRAINT orders_status_check");
        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'assigned', 'dispatched', 'delivered', 'cancelled'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the 'assigned' status from the enum
        DB::statement("ALTER TABLE orders DROP CONSTRAINT orders_status_check");
        DB::statement("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'))");
    }
};
