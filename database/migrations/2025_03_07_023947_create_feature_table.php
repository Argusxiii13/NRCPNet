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
        Schema::create('feature', function (Blueprint $table) {
            $table->id(); // Creates bigint(20) unsigned auto_increment primary key
            $table->string('title'); // Creates a VARCHAR field for title
            $table->string('content'); // Changed to VARCHAR to store image path
            $table->string('author'); // Creates a VARCHAR field for author
            $table->string('status'); // New column for status
            $table->timestamps(); // Creates created_at and updated_at timestamp fields with default precision
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feature');
    }
};