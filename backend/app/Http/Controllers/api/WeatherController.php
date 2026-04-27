<?php
    namespace App\Http\Controllers\api;
    
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Http;
    use App\Models\Weather;
    use Carbon\Carbon;
class WeatherController extends Controller{
    public function fetchByAdm4($adm4){
        $url = "https://api.bmkg.go.id/present-weather?adm4={$adm4}";
        $response = Http::retry(3, 1000)->timeout(10)->withHeaders([
            'X-API-KEY' => config('services.bmkg.key'),
            'Accept' => 'application/json',
            ])->get($url);
        if(!$response->successful()){
            return response()->json(['error' => 'Gagal ambil data BMKG'], 500);
        }

        $json = $response->json();
        if(!isset($json['data'])){
            return response()->json(['error' => 'Data Kosong'], 404);
        }

        $lokasi = $json['data']['lokasi'];
        $cuaca = $json['data']['cuaca'];

        $waktu = Carbon::parse($cuaca['local_datetime']);

        $weather = Weather::updateOrCreate(
            [
                'adm4' => $lokasi['adm4'],
                'waktu'=> $waktu
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
            ]
        );
        return response()->json([
            'status' => $response->status(),
            'body' => $response->json()
        ]);
    }

    // ambil data dari database
    public function getByAdm4($adm4){
        $data = Weather::where('adm4', $adm4)
            ->orderBy('waktu', 'desc')
            ->first();
        if(!$data){
            return response()->json(['error' => 'Data tidak ditemukan'], 404);
        }
        return response()->json($data);
    }
}
?>