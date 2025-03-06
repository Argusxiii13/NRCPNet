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
        Schema::create('suggestion', function (Blueprint $table) {
            $table->id(); // Creates bigint(20) unsigned auto_increment primary key
            $table->string('content'); // Creates a VARCHAR field for suggestion content
            $table->string('division'); // Creates a VARCHAR field for division
            $table->string('section')->nullable(); // Creates a nullable VARCHAR field for section
            $table->string('status')->default('new'); // Default value set to 'new'
            $table->string('assignee')->nullable()->default(null); // Default value set to null
            $table->string('adminnote')->nullable()->default(null); // Nullable field for admin notes
            $table->timestamps(); // Creates created_at and updated_at timestamp fields
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suggestion');
    }
};