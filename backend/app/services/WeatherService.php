<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Weather;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    public function fetchAndStore($adm4)
    {
        $url = "https://api.bmkg.go.id/present-weather?adm4={$adm4}";
        $response = Http::withHeaders([
            'X-API-KEY' => config('services.bmkg.key')
        ])->timeout(10)->get($url);

        // $response = Http::timeout(10)->get($url);

        // Log::info("BMKG STATUS",[
        //     'status' => $response->status()
        // ]);

        // Log::info("BMKG BODY", [
        //     'body' => $response->body()
        // ]);

        if (!$response->successful()) {
            Log::error('BMKG API gagal', [
                'adm4' => $adm4,
                'response' => $response->body()
            ]);
            return null;
        }

        $json = $response->json();

if (!isset($json['data'])) {
    Log::warning('Data BMKG kosong', ['adm4' => $adm4]);
    return null;
}

$lokasi = $json['data']['lokasi'] ?? null;
$cuaca  = $json['data']['cuaca'] ?? null;

if (!$lokasi || !$cuaca) {
    Log::warning('Struktur data tidak lengkap', ['response' => $json]);
    return null;
}

        $waktu = Carbon::parse($cuaca['local_datetime']);

        return Weather::updateOrCreate(
            [
                'adm4' => $lokasi['adm4'],
                'waktu' => $waktu
            ],
            [
                'provinsi' => $lokasi['provinsi'],
                'kotkab' => $lokasi['kotkab'],
                'kecamatan' => $lokasi['kecamatan'],
                'desa' => $lokasi['desa'],
                'latitude' => $lokasi['lat'],
                'longitude' => $lokasi['lon'],
                
                'suhu' => $cuaca['t'],
                'kelembaban' => $cuaca['hu'],
                'cuaca' => $cuaca['weather_desc'],
                
                'kecepatan_angin' => $cuaca['ws'],
                'arah_angin_derajat' => $cuaca['wd_deg'],
                'arah_angin' => $cuaca['wd'],

                'visibilitas' => $cuaca['vs'],
                'visibilitas_text' => $cuaca['vs_text'],

                'cloud_cover' => $cuaca['tcc'],
            ]
        );
    }

    public function getLatestFromDB($adm4)
    {
        return Weather::where('adm4', $adm4)
            ->orderBy('waktu', 'desc')
            ->first();
    }
}