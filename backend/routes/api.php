<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LocationController;
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
?>