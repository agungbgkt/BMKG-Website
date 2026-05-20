<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('flood_sensor_data', function (Blueprint $table) {
            $table->id();

            $table->string('sensor_id');
            $table->string('location')->nullable();

            $table->float('float_state')->nullable(); // ketinggian air
            $table->string('flood_status')->nullable();

            $table->float('rain_analog')->nullable();
            $table->boolean('rain_digital')->default(false);
            $table->string('rain_status')->nullable();

            $table->boolean('is_raining')->default(false);
            $table->string('status')->default('active');

            $table->timestamp('reading_time')->nullable();

            $table->string('sensor_ip')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flood_sensor_data');
    }
};