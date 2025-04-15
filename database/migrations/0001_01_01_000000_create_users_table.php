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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name')->default('Johnny');
            $table->string('middle_name')->nullable()->default('Bean');
            $table->string('surname')->nullable()->default('English');
            $table->string('email')->nullable()->unique(); // Make email unique and nullable
            $table->string('position')->nullable()->default('None'); // Default position
            $table->string('section')->nullable()->default('None'); // Default section
            $table->string('division')->nullable()->default('None'); // Default division
            $table->string('status')->nullable()->default('Active'); // Default status
            $table->timestamp('last_login')->nullable();
            $table->text('user_activity')->nullable();
            $table->string('role')->nullable()->default('Contributor'); // Default role
            $table->string('password')->default('qweasdzxc'); // Default status
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};