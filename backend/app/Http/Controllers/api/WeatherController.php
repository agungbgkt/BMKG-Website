<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Services\WeatherService;
use App\Jobs\UpdateWeatherJob;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    protected $service;

    public function __construct(WeatherService $service)
    {
        $this->service = $service;
    }

    public function getWeather($adm4)
    {
    try {
        Log::info("REQUEST ADM4:", ['adm4' => $adm4]);

        $weather = $this->service->getLatestFromDB($adm4);

        if (!$weather || now()->diffInMinutes($weather->waktu) > 10) {
            $weather = $this->service->fetchAndStore($adm4);
            // return response()->json($weather);
        }
        if(!$weather){
            return response()->json(['error' => 'Data tidak tersedia'], 404);
        }

        return response()->json([
            'desa' => $weather->desa,
            'suhu' => $weather->suhu,
            'cuaca' => $weather->cuaca,
            'kelembapan' => $weather->kelembaban,

            'angin' => $weather->kecepatan_angin,
            'arah_angin' => $weather->arah_angin,
            'arah_derajat' => $weather->arah_angin_derajat,

            'visibilitas' => $weather->visibilitas,
            'visibilitas_text' => $weather->visibilitas_text,

            'cloud_cover' => $weather->cloud_cover,
        ]);

        // $this->service->fetchAndStore($adm4);

        // $newWeather = $this->service->getLatestFromDB($adm4);

        // if (!$newWeather) {
        //     return response()->json([
        //         'error' => 'Data tidak ditemukan'
        //     ], 404);
        // }

        // return response()->json($newWeather);

    } catch (\Exception $e) {
        Log::error("ERROR WEATHER:", [
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ]);

        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}
}