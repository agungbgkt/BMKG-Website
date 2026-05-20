<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorData;

class SensorController extends Controller
{
     public function receiveData(Request $request)
    {
        try {

            $sensorData = SensorData::create([

                // ID perangkat ESP32
                'sensor_id' => $request->device_id ?? 'ESP32_UNKNOWN',

                // Lokasi sensor
                'location' => 'Sungai Banyuwangi',

                // Data ketinggian air
                'water_level' => $request->water_level ?? 0,

                // Intensitas hujan dari analog sensor
                'rain_intensity' => $request->rain_analog ?? 0,

                // LOW = hujan
                'is_raining' => ($request->rain_digital == 0),

                // Belum digunakan
                'temperature' => null,
                'humidity' => null,

                // Status sensor
                'status' => 'active',

                // Waktu pembacaan
                'reading_time' => now(),

                // Tambahan
                'battery_level' => null,
                'signal_strength' => null,
                'sensor_ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data sensor berhasil diterima',
                'data' => $sensorData
            ], 201);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ambil data terbaru realtime
     */
    public function getLatest()
    {
        $latest = SensorData::latest('reading_time')
            ->take(20)
            ->get();

        return response()->json([
            'latest_data' => $latest
        ]);
    }

    /**
     * Semua data sensor
     */
    public function getData()
    {
        return response()->json(
            SensorData::latest('reading_time')->paginate(50)
        );
    }
    // Endpoint untuk menerima data dari ESP32 (JSN-SR04T + sensor hujan)
    // public function receiveData(Request $request)
    // {
    //     // Validasi data dari ESP32
    //     $validated = $request->validate([
    //         'sensor_id' => 'required|string',
    //         'location' => 'nullable|string',
    //         'water_level' => 'nullable|numeric|min:0',      // Ketinggian air dari JSN-SR04T
    //         'rain_intensity' => 'nullable|numeric|min:0',  // Intensitas hujan (mm/jam)
    //         'is_raining' => 'nullable|boolean',             // Status hujan
    //         'temperature' => 'nullable|numeric',            // Suhu (opsional)
    //         'humidity' => 'nullable|numeric|min:0|max:100', // Kelembaban (opsional)
    //     ]);

    //     // Simpan ke database
    //     $sensorData = SensorData::create([
    //         'sensor_id' => $validated['sensor_id'],
    //         'location' => $validated['location'] ?? null,
    //         'water_level' => $validated['water_level'] ?? null,
    //         'rain_intensity' => $validated['rain_intensity'] ?? null,
    //         'is_raining' => $validated['is_raining'] ?? false,
    //         'temperature' => $validated['temperature'] ?? null,
    //         'humidity' => $validated['humidity'] ?? null,
    //         'reading_time' => now(),  // Waktu pembacaan sensor
    //     ]);

    //     // Hitung status banjir dan hujan untuk response
    //     $floodStatus = $this->getFloodStatus($validated['water_level'] ?? 0);
    //     $rainStatus = $this->getRainStatus($validated['rain_intensity'] ?? 0);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Data received',
    //         'data' => $sensorData,
    //         'analysis' => [
    //             'flood_status' => $floodStatus,
    //             'rain_status' => $rainStatus,
    //             'is_raining' => $validated['is_raining'] ?? false
    //         ]
    //     ], 201);
    // }

    // Endpoint untuk mengambil semua data sensor (buat dashboard admin)
    // public function getData(Request $request)
    // {
    //     $data = SensorData::latest('reading_time')  // Urutkan berdasarkan waktu baca
    //         ->when($request->sensor_id, function($query, $sensorId) {
    //             return $query->where('sensor_id', $sensorId);
    //         })
    //         ->when($request->location, function($query, $location) {
    //             return $query->where('location', 'like', "%{$location}%");
    //         })
    //         ->when($request->from_date, function($query, $date) {
    //             return $query->whereDate('reading_time', '>=', $date);
    //         })
    //         ->when($request->to_date, function($query, $date) {
    //             return $query->whereDate('reading_time', '<=', $date);
    //         })
    //         ->paginate(50);

    //     return response()->json($data);
    // }

    // Endpoint untuk data terbaru (real-time) - dipakai dashboard
    // public function getLatest()
    // {
    //     $latest = SensorData::latest('reading_time')
    //         ->take(10)
    //         ->get();

    //     // Statistik untuk dashboard
    //     $stats = [
    //         'total_sensors' => SensorData::distinct('sensor_id')->count('sensor_id'),
    //         'active_sensors' => SensorData::where('status', 'active')->distinct('sensor_id')->count('sensor_id'),
    //         'latest_water_level' => $latest->first()->water_level ?? 0,
    //         'latest_rain_intensity' => $latest->first()->rain_intensity ?? 0,
    //         'is_raining' => $latest->first()->is_raining ?? false,
    //         'flood_status' => $this->getFloodStatus($latest->first()->water_level ?? 0),
    //         'rain_status' => $this->getRainStatus($latest->first()->rain_intensity ?? 0),
    //         'average_temperature' => SensorData::avg('temperature') ?? 0,
    //         'average_humidity' => SensorData::avg('humidity') ?? 0,
    //     ];

    //     return response()->json([
    //         'latest_data' => $latest,
    //         'statistics' => $stats
    //     ]);
    // }

    // // Endpoint untuk data per jam (grafik)
    // public function getHourlyData(Request $request)
    // {
    //     $hours = $request->hours ?? 24; // Default 24 jam
        
    //     $data = SensorData::where('reading_time', '>=', now()->subHours($hours))
    //         ->selectRaw('
    //             DATE_FORMAT(reading_time, "%Y-%m-%d %H:00:00") as hour,
    //             AVG(water_level) as avg_water_level,
    //             AVG(rain_intensity) as avg_rain_intensity,
    //             MAX(is_raining) as is_raining
    //         ')
    //         ->groupBy('hour')
    //         ->orderBy('hour', 'asc')
    //         ->get();

    //     return response()->json($data);
    // }

    // Endpoint untuk data per sensor tertentu
    public function getBySensor($sensorId)
    {
        $data = SensorData::where('sensor_id', $sensorId)
            ->latest('reading_time')
            ->paginate(30);

        $sensorInfo = [
            'sensor_id' => $sensorId,
            'location' => $data->first()->location ?? 'Unknown',
            'total_readings' => $data->total(),
            'last_active' => $data->first()->reading_time ?? null,
        ];

        return response()->json([
            'sensor_info' => $sensorInfo,
            'data' => $data
        ]);
    }

    // Helper function: status banjir berdasarkan water level
    private function getFloodStatus($waterLevel)
    {
        if ($waterLevel < 50) return 'Aman';
        if ($waterLevel < 100) return 'Siaga';
        if ($waterLevel < 150) return 'Waspada';
        return 'Bahaya';
    }

    // Helper function: status hujan berdasarkan intensitas
    private function getRainStatus($rainIntensity)
    {
        if ($rainIntensity < 5) return 'Ringan';
        if ($rainIntensity < 20) return 'Sedang';
        if ($rainIntensity < 50) return 'Lebat';
        return 'Ekstrem';
    }
}