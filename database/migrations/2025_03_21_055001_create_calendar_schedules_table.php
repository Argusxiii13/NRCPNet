<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCalendarSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_schedules', function (Blueprint $table) {
            $table->id(); // auto-incrementing ID
            $table->date('date'); // date of the event
            $table->string('type'); // type of the event
            $table->string('title'); // title of the event
            $table->string('time'); // time of the event
            $table->string('location'); // location of the event
            $table->string('division')->default('General'); //This line adds the new column
            $table->text('description'); // description of the event
            $table->timestamps(); // created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('calendar_schedules');
    }
}