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
        Schema::table('suggestion', function (Blueprint $table) {
            $table->string('status')->default('new'); // Default value set to 'new'
            $table->string('assignee')->nullable()->default(null); // Default value set to null
            $table->string('adminnote')->nullable()->default(null);; // No default value, but can be null
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suggestion', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('assignee');
            $table->dropColumn('adminnote');
        });
    }
};