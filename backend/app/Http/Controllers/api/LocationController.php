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
        return response()->json(
            Province::orderBy('name')->get()
        );
    }

    // Kabupaten/Kota
    public function regencies($provinceId){
        return response()->json(
            Regency::where('provinceid', $provinceId)
                ->orderBy('name')
                ->get()
        );
    }

    // Kecamatan
    public function districts($regencyId){
        return response()->json(
            District::where('regencyId', $regencyId)
                ->orderBy('name')
                ->get()
        );
    }

    // Desa
    public function villages($districtId){
        return response()->json(
            Village::where('districtId', $districtId)
                ->orderBy('name')
                ->get()
        );
    }

    // Cari Semuanya Provinsi -> Desa
    public function search(Request $request){
        $keyword = $request->query('q');
        if(!$keyword){
            return response()->json([]);
        }

        $provinces = Province::where('name', 'like', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'province',
                    'id'   => $item->id,
                    'name' => $item->name
                ];
            });
        $regencies = Regency::where('name', 'like', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'regency',
                    'id'   => $item->id,
                    'name' => $item->name
                ];
            });
        $districts = District::where('name', 'like', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'district',
                    'id'   => $item->id,
                    'name' => $item->name
                ];
            });
        $villages = Village::where('name', 'like', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'village',
                    'id'   => $item->id,
                    'adm4' => $item->adm4,
                    'name' => $item->name
                ];
            });
        return response()->json(
            $provinces
                ->merge($regencies)
                ->merge($districts)
                ->merge($villages)
                ->values()
        );
    }

    // Default Banyuwangi
    public function default(){
        $defaultRegencyId = env('DEFAULT_REGENCY_ID', 3510);
        $regency = Regency::find($defaultRegencyId);
        $villages = Village::where('regencyId', $defaultRegencyId)
            ->orderBy('name')
            ->get();
        return response()->json([
            'regency'  => $regency,
            'villages' => $villages
        ]);
    }
}
?>