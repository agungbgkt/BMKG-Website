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
        Schema::create('weather', function (Blueprint $table) {
            $table->id();
            $table->string('adm4');
            $table->string('provinsi');
            $table->string('kotkab');
            $table->string('kecamatan');
            $table->string('desa');
            $table->double('latitude');
            $table->double('longitude');
            $table->integer('suhu');
            $table->integer('kelembaban');
            $table->string('cuaca');
            $table->double('kecepatan_angin');
            $table->timestamp('waktu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather');
    }
};
