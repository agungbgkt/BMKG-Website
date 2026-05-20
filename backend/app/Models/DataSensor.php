<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FloodSensorData extends Model
{
    use HasFactory;

    protected $table = 'flood_sensor_data';

    protected $fillable = [
        'sensor_id',
        'location',
        'float_state',
        'flood_status',
        'rain_analog',
        'rain_digital',
        'rain_status',
        'is_raining',
        'status',
        'reading_time',
        'sensor_ip',
    ];

    protected $casts = [
        'float_state' => 'float',
        'rain_analog' => 'float',
        'rain_digital' => 'boolean',
        'is_raining' => 'boolean',
        'reading_time' => 'datetime',
    ];

    // ===== STATUS BANJIR =====
    public function getFloodLevelAttribute()
    {
        if ($this->float_state === null) return 'Tidak Terdeteksi';
        if ($this->float_state < 50) return 'Aman';
        if ($this->float_state < 100) return 'Siaga';
        if ($this->float_state < 150) return 'Waspada';
        return 'Bahaya';
    }

    // ===== STATUS HUJAN =====
    public function getRainLevelAttribute()
    {
        if ($this->rain_analog === null) return 'Tidak Terdeteksi';
        if ($this->rain_analog < 5) return 'Ringan';
        if ($this->rain_analog < 20) return 'Sedang';
        if ($this->rain_analog < 50) return 'Lebat';
        return 'Ekstrem';
    }
}