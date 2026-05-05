<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Village;

class InjectAdm4GeoJson extends Command
{
    protected $signature = 'geojson:inject-adm4';
    protected $description = 'Inject ADM4 to Geojson Desa';

    public function handle()
    {
        $path = public_path('maps/jawatimur/banyuwangi/desa_banyuwangi.json');

        $geojson = json_decode(file_get_contents($path), true);

        foreach($geojson['features'] as &$feature){
            $namaDesa = strtolower(trim($feature['properties']['NAME_4'] ?? ''));

            $village = Village::whereRaw('LOWER(name) = ?', [$namaDesa])->first();
            if($village && $village->adm4){
                $feature['properties']['adm4'] = $village->adm4;
            } else {
                $feature['properties']['adm4'] = null;
                $this->warn("Tidak ketemu: " . $namaDesa);
            }
        }

        file_put_contents($path, json_encode($geojson));

        $this->info("Selesai inject ADM4!");
    }
}
