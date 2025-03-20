<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnouncementTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id(); // Creates an auto-incrementing primary key
            $table->string('title'); // Column for the announcement title
            $table->string('type'); // Column for the type of announcement (image or HTML)
            $table->text('content'); // Column for the content (image path or HTML)
            $table->string('author'); // Column for the author's name
            $table->string('status'); // Column for the status of the announcement
            $table->timestamps(); // Creates created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('announcements'); // Drop the table on rollback
    }
}