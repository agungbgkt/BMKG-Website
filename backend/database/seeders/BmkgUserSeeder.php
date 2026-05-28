<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class BmkgUserSeeder extends Seeder
{
    public function run(): void
    {
        // ================= ADMIN =================

        User::create([
            'name' => 'Admin',
            'email' => 'admin@bmkg.go.id',
            'password' => Hash::make('admin123'),
            'nip' => '199001012020011001',
            'unit_kerja' => 'Administrator',
            'is_bmkg' => true,
        ]);

        // ================= PETUGAS =================

        User::create([
            'name' => 'Petugas BMKG',
            'email' => 'petugas@bmkg.go.id',
            'password' => Hash::make('password123'),
            'nip' => '198001012010011001',
            'unit_kerja' => 'Bidang Data dan Informasi',
            'is_bmkg' => true,
        ]);

        // ================= KEPALA =================

        User::create([
            'name' => 'Kepala Stasiun',
            'email' => 'kepala@bmkg.go.id',
            'password' => Hash::make('password456'),
            'nip' => '197505152005012002',
            'unit_kerja' => 'Stasiun Meteorologi',
            'is_bmkg' => true,
        ]);
    }
}