<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
Use Illuminate\Support\Facades\File;

class VillageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $json = file_get_contents(database_path('data/villages.json'));
        $data = json_decode($json, true);
        
        foreach(array_chunk($data, 500) as $chunk){
            DB::table('villages')->insert($chunk);
        }
    }
}
