<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weather', function (Blueprint $table) {
            // arah angin
            $table->float('arah_angin_derajat')->nullable()->after('kecepatan_angin');
            $table->string('arah_angin')->nullable()->after('arah_angin_derajat');

            // visibilitas
            $table->integer('visibilitas')->nullable()->after('arah_angin');
            $table->string('visibilitas_text')->nullable()->after('visibilitas');

            // cloud cover
            $table->integer('cloud_cover')->nullable()->after('visibilitas_text');
        });if (!Schema::hasColumn('weather', 'arah_angin_derajat')) {
        Schema::table('weather', function (Blueprint $table) {
            $table->float('arah_angin_derajat')->nullable();
        });
    }

    if (!Schema::hasColumn('weather', 'arah_angin')) {
        Schema::table('weather', function (Blueprint $table) {
            $table->string('arah_angin')->nullable();
        });
    }

    if (!Schema::hasColumn('weather', 'visibilitas')) {
        Schema::table('weather', function (Blueprint $table) {
            $table->integer('visibilitas')->nullable();
        });
    }

    if (!Schema::hasColumn('weather', 'visibilitas_text')) {
        Schema::table('weather', function (Blueprint $table) {
            $table->string('visibilitas_text')->nullable();
        });
    }

    if (!Schema::hasColumn('weather', 'cloud_cover')) {
        Schema::table('weather', function (Blueprint $table) {
            $table->integer('cloud_cover')->nullable();
        });
    }
    }

    public function down(): void
    {
        Schema::table('weather', function (Blueprint $table) {
            $table->dropColumn([
                'arah_angin_derajat',
                'arah_angin',
                'visibilitas',
                'visibilitas_text',
                'cloud_cover'
            ]);
        });
    }
};
