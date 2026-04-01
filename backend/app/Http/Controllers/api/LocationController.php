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

    // Cari Semuanya Provinsi -> Desa
    // public function search(Request $request){
    //     $keyword = $request->query('q');
    //     if(!$keyword){
    //         return response()->json([]);
    //     }

    //     $provinces = Province::where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function ($item){
    //             return [
    //                 'type' => 'province',
    //                 'id'   => $item->id,
    //                 'name' => $item->name
    //             ];
    //         });
    //     $regencies = Regency::where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function ($item){
    //             return [
    //                 'type' => 'regency',
    //                 'id'   => $item->id,
    //                 'provinceId' => $item->provinceId,
    //                 'name' => $item->name
    //             ];
    //         });
    //     $districts = District::where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function ($item){
    //             return [
    //                 'type' => 'district',
    //                 'id'   => $item->id,
    //                 'regencyId' => $item->regencyId,
    //                 'name' => $item->name
    //             ];
    //         });
    //     $villages = Village::where('name','ILIKE', "%{$keyword}%")
    //         ->with('district.regency.province')
    //         ->limit(5)
    //         ->get()
    //         ->map(function ($item){
    //             return [
    //                 'type' => 'village',
    //                 'id'   => $item->id,
    //                 'province' => $item->district->regency->province->name,
    //                 'regency'  => $item->district->regency->name,
    //                 'district' => $item->district->name,
    //                 'village'  => $item->name
    //             ];
    //         });
    //     return response()->json(
    //         $provinces
    //             ->merge($regencies)
    //             ->merge($districts)
    //             ->merge($villages)
    //             ->values()
    //     );
    // }

    // public function search(Request $request){
    //     $keyword = $request->query('q');

    //     if(!$keyword){
    //         return response()->json([]);
    //     }

    //     $result = Village::select(
    //         'villages.id',
    //         'villages.name as village',
    //         'districts.name as district',
    //         'regencies.name as regency',
    //         'provinces.name as province'
    //     )
    //     ->join('districts', 'villages.districtId', '=', 'districts.id')
    //     ->join('regencies', 'districts.regencyId', '=', 'regencies.id')
    //     ->join('provinces', 'regencies.provinceId', '=', 'provinces.id')
    //     ->where('villages.name', 'ILIKE', $keyword . '%')
    //     ->limit(10)
    //     ->get();
    
    //     return response()->json($result);
    // }

    // public function search(Request $request){
    //     $keyword = $request->query('q');
    //     if(!$keyword){
    //         return response()->json([]);
    //     }

    //     // PROVINCE
    //     $provinces = Province::select('id','name')
    //         ->where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function($item){
    //             return [
    //                 'type' => 'province',
    //                 'id' => $item->id,
    //                 'province' => $item->name
    //             ];
    //         });
        
    //     // REGENCY
    //     $regencies = Regency::select('id', 'provinceId', 'name')
    //         ->where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function($item){
    //             return [
    //                 'type' => 'regency',
    //                 'id' => $item->id,
    //                 'provinceId' => $item->provinceId,
    //                 'regency' => $item->name
    //             ];
    //         });

    //     // DISTRICT
    //     $districts = District::select('id', 'regencyId', 'name')
    //         ->where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function($item){
    //             return [
    //                 'type' => 'district',
    //                 'id' => $item->id,
    //                 'regencyId' => $item->regencyId,
    //                 'district' => $item->name
    //             ];
    //         });

    //     // VILLAGE
    //     $villages = Village::with('district.regency.province')
    //         ->where('name', 'ILIKE', "%{$keyword}%")
    //         ->limit(5)
    //         ->get()
    //         ->map(function($item){
    //             return [
    //                 'type' => 'village',
    //                 'id' => $item->id,
    //                 'province' => optional($item->district->regency->province)->name,
    //                 'regency' => optional($item->district->regency)->name,
    //                 'district' => optional($item->district)->name,
    //                 'village' => $item->name
    //             ];
    //         });

    //     return response()->json(
    //         $provinces
    //             ->merge($regencies)
    //             ->merge($districts)
    //             ->merge($villages)
    //             ->values()
    //     );
    // }

    // Default Banyuwangi
    // public function default(){
    //     // id kabupaten Banyuwangi
    //     $defaultRegencyId = env('DEFAULT_REGENCY_ID', 3510);
    //     $regency = Regency::find($defaultRegencyId);
    //     if(!$regency){
    //         return response()->json([
    //             'message' => 'Default region not found'
    //         ], 404);
    //     }

    //     // 
    //     $districts = District::where('regencyId', $defaultRegencyId)
    //         ->with('villages')
    //         ->orderBy('name')
    //         ->get();

    //     return response()->json([
    //         'regency' => $regency,
    //         'districts' => $districts
    //     ]);
        
    // }

//     public function search(Request $request)
// {
//     $keyword = $request->query('q');

//     if(!$keyword){
//         return response()->json([]);
//     }

//     $villages = Village::select(
//             'villages.id',
//             'villages.name as village',
//             'districts.name as district',
//             'regencies.name as regency',
//             'provinces.name as province'
//         )
//         ->join('districts', 'villages.districtId', '=', 'districts.id')
//         ->join('regencies', 'districts.regencyId', '=', 'regencies.id')
//         ->join('provinces', 'regencies.provinceId', '=', 'provinces.id')
//         ->where('villages.name', 'ILIKE', "%{$keyword}%")
//         ->limit(10)
//         ->get()
//         ->map(function($item){
//             return [
//                 'type' => 'village',
//                 'id' => $item->id,
//                 'province' => $item->province,
//                 'regency' => $item->regency,
//                 'district' => $item->district,
//                 'village' => $item->village
//             ];
//         });

//     $districts = District::select(
//             'districts.id',
//             'districts.name as district',
//             'regencies.name as regency',
//             'provinces.name as province'
//         )
//         ->join('regencies', 'districts.regencyId', '=', 'regencies.id')
//         ->join('provinces', 'regencies.provinceId', '=', 'provinces.id')
//         ->where('districts.name', 'ILIKE', "%{$keyword}%")
//         ->limit(5)
//         ->get()
//         ->map(function($item){
//             return [
//                 'type' => 'district',
//                 'id' => $item->id,
//                 'province' => $item->province,
//                 'regency' => $item->regency,
//                 'district' => $item->district
//             ];
//         });

//     $regencies = Regency::select(
//             'regencies.id',
//             'regencies.name as regency',
//             'provinces.name as province'
//         )
//         ->join('provinces', 'regencies.provinceId', '=', 'provinces.id')
//         ->where('regencies.name', 'ILIKE', "%{$keyword}%")
//         ->limit(5)
//         ->get()
//         ->map(function($item){
//             return [
//                 'type' => 'regency',
//                 'id' => $item->id,
//                 'province' => $item->province,
//                 'regency' => $item->regency
//             ];
//         });

//     return response()->json(
//         $regencies
//             ->merge($districts)
//             ->merge($villages)
//             ->values()
//     );
// }

public function search(Request $request)
{
    $keyword = $request->query('q');

    if (!$keyword) {
        return response()->json([]);
    }

    // pisahkan keyword (contoh: "sarimulyo cluring")
    $keywords = preg_split('/[\s,]+/', $keyword);

    /*
    ======================
    VILLAGES
    ======================
    */

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

    /*
    ======================
    DISTRICTS
    ======================
    */

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

    /*
    ======================
    REGENCIES
    ======================
    */

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

    /*
    ======================
    PROVINCES
    ======================
    */

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