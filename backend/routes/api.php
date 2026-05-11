<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\WeatherController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\SensorController;
// use Illuminate\Routing\Route;

// Location API /Endpoint untuk data wilayah Indonesia

Route::prefix('location')->group(function(){
    // Ambil semua provinsi
    Route::get('/provinces', [LocationController::class, 'provinces']);
    // Ambil Kabupaten berdasarkan provinsi
    Route::get('/regencies/{provinceId}', [LocationController::class, 'regencies']);
    // Ambil Kecamatan berdasarkan kabupaten
    Route::get('/districts/{regencyId}', [LocationController::class, 'districts']);
    // Ambil Desa berdasarkan kecamatan
    Route::get('/villages/{districtId}', [LocationController::class, 'villages']);
    // Search wilayah(provinsi/kabupaten/kecamatan/desa)
    Route::get('/search', [LocationController::class, 'search']);
    // Default wilayah banyuwangi
    Route::get('/default', [LocationController::class, 'default']);
});
// Endpoint Api cuaca
Route::prefix('weather')->group(function(){
    Route::get('/fetch/{adm4}', [WeatherController::class, 'fetchByAdm4']);
    Route::get('/{adm4}', [WeatherController::class, 'getWeather']);
});
// Endpoint Api login/register
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [LoginController::class, 'register']);

// endpoint untuk menerima data esp32
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sensor/data', [SensorController::class, 'getData']);
    Route::get('/sensor/latest', [SensorController::class, 'getLatest']);
    Route::get('/sensor/hourly', [SensorController::class, 'getHourlyData']);
    Route::get('/sensor/by-sensor/{sensorId}', [SensorController::class, 'getBySensor']);
});

Route::post('/sensor/receive', [SensorController::class, 'receiveData']);
?>