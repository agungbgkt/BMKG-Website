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
        // User 1
        User::create([
            'name' => 'Petugas BMKG',
            'email' => 'petugas@bmkg.go.id',
            'password' => Hash::make('password123'),
            'nip' => '198001012010011001',
            'unit_kerja' => 'Bidang Data dan Informasi',
            'is_bmkg' => true,
        ]);

        // User 2
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
