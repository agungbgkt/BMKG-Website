<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id();
            $table->string('sensor_id'); // ID sensor (contoh: ESP32_001)
            $table->string('location')->nullable(); // Lokasi pemasangan sensor
            $table->float('water_level')->nullable(); // Ketinggian air (cm) dari JSN-SR04T
            $table->float('rain_intensity')->nullable(); // Intensitas hujan (mm/jam)
            $table->boolean('is_raining')->default(false); // Status hujan (true/false)
            $table->float('temperature')->nullable(); // Suhu (jika ada sensor tambahan)
            $table->float('humidity')->nullable(); // Kelembaban (jika ada sensor tambahan)
            $table->enum('status', ['active', 'inactive'])->default('active'); // Status sensor
            $table->timestamp('reading_time'); // Waktu pembacaan sensor
            $table->timestamps();
            
            // Index untuk pencarian cepat
            $table->index('sensor_id');
            $table->index('reading_time');

            $table->string('battery_level')->nullable(); // Level baterai (%)
            $table->string('signal_strength')->nullable(); // Kekuatan sinyal WiFi
            $table->ipAddress('sensor_ip')->nullable(); // IP address sensor
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensor_data');
    }
};