<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Province;
use App\Models\Regency;
use App\Models\District;
use App\Models\Village;

class LocationController extends Controller {
    // Provinsi
    public function provinces(){
        $provinces = Province::select('id','name')
        ->orderBy('name')
        ->get();
        return response()->json($provinces);
    }

    // Kabupaten/Kota
    public function regencies($provinceId){
        $regencies = Regency::where('provinceId', $provinceId)
            ->orderBy('name')
            ->get();
        return response()->json($regencies);
    }

    // Kecamatan
    public function districts($regencyId){
        $districts = District::where('regencyId', $regencyId)
            ->orderBy('name')
            ->get();
        return response()->json($districts);
    }

    // Desa
    public function villages($districtId){
        $villages = Village::select('id','districtId', 'name')
            ->where('districtId', $districtId)
            ->orderBy('name')
            ->get();
        return response()->json($villages);
    }

public function search(Request $request)
{
    $keyword = $request->query('q');

    if (!$keyword) {
        return response()->json([]);
    }

    // pisahkan keyword (contoh: "sarimulyo cluring")
    $keywords = preg_split('/[\s,]+/', $keyword);

    // Village

    $villages = Village::selectRaw("
            villages.id,
            villages.name as title,
            CONCAT(districts.name, ', ', regencies.name, ', ', provinces.name) as subtitle
        ")
        ->leftJoin('districts', 'villages.districtId', '=', 'districts.id')
        ->leftJoin('regencies', 'districts.regencyId', '=', 'regencies.id')
        ->leftJoin('provinces', 'regencies.provinceId', '=', 'provinces.id')
        ->where(function ($query) use ($keywords) {
            foreach ($keywords as $word) {
                $query->where(function ($q) use ($word) {
                    $q->where('villages.name', 'ILIKE', "%{$word}%")
                      ->orWhere('districts.name', 'ILIKE', "%{$word}%")
                      ->orWhere('regencies.name', 'ILIKE', "%{$word}%")
                      ->orWhere('provinces.name', 'ILIKE', "%{$word}%");
                });
            }
        })
        ->limit(5)
        ->get();

    // District

    $districts = District::selectRaw("
            districts.id,
            districts.name as title,
            CONCAT(regencies.name, ', ', provinces.name) as subtitle
        ")
        ->leftJoin('regencies', 'districts.regencyId', '=', 'regencies.id')
        ->leftJoin('provinces', 'regencies.provinceId', '=', 'provinces.id')
        ->where(function ($query) use ($keywords) {
            foreach ($keywords as $word) {
                $query->where(function ($q) use ($word) {
                    $q->where('districts.name', 'ILIKE', "%{$word}%")
                      ->orWhere('regencies.name', 'ILIKE', "%{$word}%")
                      ->orWhere('provinces.name', 'ILIKE', "%{$word}%");
                });
            }
        })
        ->limit(5)
        ->get();

    // Regencies

    $regencies = Regency::selectRaw("
            regencies.id,
            regencies.name as title,
            provinces.name as subtitle
        ")
        ->leftJoin('provinces', 'regencies.provinceId', '=', 'provinces.id')
        ->where(function ($query) use ($keywords) {
            foreach ($keywords as $word) {
                $query->where(function ($q) use ($word) {
                    $q->where('regencies.name', 'ILIKE', "%{$word}%")
                      ->orWhere('provinces.name', 'ILIKE', "%{$word}%");
                });
            }
        })
        ->limit(5)
        ->get();

    // Privinces

    $provinces = Province::selectRaw("
            id,
            name as title,
            '' as subtitle
        ")
        ->where(function ($query) use ($keywords) {
            foreach ($keywords as $word) {
                $query->where('name', 'ILIKE', "%{$word}%");
            }
        })
        ->limit(5)
        ->get();

    /*
    ======================
    MERGE RESULT
    ======================
    */

    return response()->json(
        $villages
            ->merge($districts)
            ->merge($regencies)
            ->merge($provinces)
            ->values()
    );
}
}
?>