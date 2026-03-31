<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
Use Illuminate\Support\Facades\File;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ambil file JSON
        $json = file_get_contents(database_path('data/provinces.json'));

        // ubah JSON jadi array
        $data = json_decode($json, true);

        // insert ke tabel provinces
        DB::table('provinces')->insert($data);
        
    }
}
