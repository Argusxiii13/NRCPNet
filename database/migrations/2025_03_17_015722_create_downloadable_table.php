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
        Schema::create('downloadable', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Column for the title
            $table->string('content'); // Column for the image path
            $table->string('author'); // Column for the author
            $table->string('status'); // New column for status
            $table->timestamps(); // This will create the created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('downloadable');
    }
};