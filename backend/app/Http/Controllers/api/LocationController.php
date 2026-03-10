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
        $provinces = Province::orderBy('name')->get();
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
        $villages = Village::where('districtId', $districtId)
            ->orderBy('name')
            ->get();
        return response()->json($villages);
    }

    // Cari Semuanya Provinsi -> Desa
    public function search(Request $request){
        $keyword = $request->query('q');
        if(!$keyword){
            return response()->json([]);
        }

        $provinces = Province::where('name', 'LIKE', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'province',
                    'id'   => $item->id,
                    'name' => $item->name
                ];
            });
        $regencies = Regency::where('name', 'LIKE', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'regency',
                    'id'   => $item->id,
                    'provinceId' => $item->provinceId,
                    'name' => $item->name
                ];
            });
        $districts = District::where('name', 'LIKE', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'district',
                    'id'   => $item->id,
                    'regencyId' => $item->regencyId,
                    'name' => $item->name
                ];
            });
        $villages = Village::with('district.regency.province')
            ->where('name','LIKE', "%{$keyword}%")
            ->limit(5)
            ->get()
            ->map(function ($item){
                return [
                    'type' => 'village',
                    'id'   => $item->id,
                    'province' => $item->district->regency->province->name,
                    'regency'  => $item->district->regency->name,
                    'district' => $item->district->name,
                    'village'  => $item->name
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
        // id kabupaten Banyuwangi
        $defaultRegencyId = env('DEFAULT_REGENCY_ID', 3510);
        $regency = Regency::find($defaultRegencyId);
        if(!$regency){
            return response()->json([
                'message' => 'Default region not found'
            ], 404);
        }

        // 
        $districts = District::where('regencyId', $defaultRegencyId)
            ->with('villages')
            ->orderBy('name')
            ->get();

        return response()->json([
            'regency' => $regency,
            'districts' => $districts
        ]);
        
    }
}
?>