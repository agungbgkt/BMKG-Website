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
        Schema::create('flood_sensor_data', function (Blueprint $table) {
            $table->id();

    $table->string('sensor_id');

    $table->string('location')->nullable();

    $table->integer('float_state')->nullable();

    $table->string('flood_status')->nullable();

    $table->integer('rain_analog')->nullable();

    $table->integer('rain_digital')->nullable();

    $table->string('rain_status')->nullable();

    $table->boolean('is_raining')->default(false);

    $table->string('status')->default('active');

    $table->timestamp('reading_time')->nullable();

    $table->string('sensor_ip')->nullable();

    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flood_sensor_data');
    }
};
