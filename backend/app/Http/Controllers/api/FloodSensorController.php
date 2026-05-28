<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FloodSensorData;

class FloodSensorController extends Controller
{
    // =========================
    // TERIMA DATA DARI ESP32
    // =========================
    public function receive(Request $request)
{
    $request->validate([
        'sensor_id' => 'required',
        'float_state' => 'nullable|numeric',
        'rain_analog' => 'nullable|numeric',
    ]);

    $data = FloodSensorData::create([
        'sensor_id'     => $request->sensor_id,
        'location'      => $request->location,
        'float_state'   => $request->float_state,
        'flood_status'  => $request->flood_status,
        'rain_analog'   => $request->rain_analog,
        'rain_digital'  => $request->rain_digital,
        'rain_status'   => $request->rain_status,
        'is_raining'    => $request->rain_digital == 1,
        'status'        => 'active',
        'reading_time'  => now(),
        'sensor_ip'     => $request->ip(),
    ]);

    return response()->json([
        'message' => 'Data received successfully',
        'data' => $data
    ]);
}

    // =========================
    // AMBIL SEMUA DATA
    // =========================
    public function index()
    {
        return FloodSensorData::latest()->get();
    }

    // =========================
    // DATA TERBARU
    // =========================
    public function latest()
    {
        return FloodSensorData::latest()->first();
    }

    // =========================
    // PER SENSOR
    // =========================
    public function bySensor($sensorId)
    {
        return FloodSensorData::where('sensor_id', $sensorId)
            ->latest()
            ->get();
    }
}