<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nip')->unique()->nullable()->after('email');
            $table->string('unit_kerja')->nullable()->after('nip');
            $table->boolean('is_bmkg')->default(false)->after('unit_kerja');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nip','unit_kerja', 'is_bmkg']);
        });
    }
};
