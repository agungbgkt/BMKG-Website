<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    use HasFactory;

    protected $table = 'sensor_data';

    protected $fillable = [
        'sensor_id',
        'location',
        'water_level',
        'rain_intensity',
        'is_raining',
        'temperature',
        'humidity',
        'status',
        'reading_time',
        'battery_level',
        'signal_strength',
        'sensor_ip',
    ];

    protected $casts = [
        'water_level' => 'float',
        'rain_intensity' => 'float',
        'is_raining' => 'boolean',
        'temperature' => 'float',
        'humidity' => 'float',
        'reading_time' => 'datetime',
    ];
    // use HasFactory;

    // // Nama tabel (opsional, karena Laravel otomatis pakai plural = sensor_data)
    // protected $table = 'sensor_data';

    // // Field yang boleh diisi (mass assignable)
    // protected $fillable = [
    //     'sensor_id',
    //     'location',
    //     'water_level',
    //     'rain_intensity',
    //     'is_raining',
    //     'temperature',
    //     'humidity',
    //     'status',
    //     'reading_time',
    // ];

    // // Field yang harus di-cast ke tipe data tertentu
    // protected $casts = [
    //     'water_level' => 'float',
    //     'rain_intensity' => 'float',
    //     'is_raining' => 'boolean',
    //     'temperature' => 'float',
    //     'humidity' => 'float',
    //     'status' => 'string',
    //     'reading_time' => 'datetime',
    //     'created_at' => 'datetime',
    //     'updated_at' => 'datetime',
    // ];

    // // Field yang disembunyikan saat di-response JSON (opsional)
    // protected $hidden = [
    //     // 'created_at',
    //     // 'updated_at',
    // ];

    // // Default values (opsional)
    // protected $attributes = [
    //     'status' => 'active',
    //     'is_raining' => false,
    // ];

    // // ========== SCOPES untuk filtering ==========
    
    // // Scope untuk filter sensor aktif
    // public function scopeActive($query)
    // {
    //     return $query->where('status', 'active');
    // }

    // // Scope untuk filter berdasarkan sensor_id
    // public function scopeBySensor($query, $sensorId)
    // {
    //     return $query->where('sensor_id', $sensorId);
    // }

    // // Scope untuk filter berdasarkan tanggal
    // public function scopeDateRange($query, $from, $to)
    // {
    //     return $query->whereBetween('reading_time', [$from, $to]);
    // }

    // // Scope untuk data terbaru
    // public function scopeLatestReading($query)
    // {
    //     return $query->orderBy('reading_time', 'desc');
    // }

    // // ========== ACCESSORS (format data saat diambil) ==========
    
    // // Format water level dengan satuan cm
    // public function getWaterLevelFormattedAttribute()
    // {
    //     return $this->water_level ? $this->water_level . ' cm' : '-';
    // }

    // // Format rain intensity dengan satuan mm/jam
    // public function getRainIntensityFormattedAttribute()
    // {
    //     return $this->rain_intensity ? $this->rain_intensity . ' mm/jam' : '-';
    // }

    // // Status ketinggian air (Aman/Siaga/Waspada/Bahaya)
    // public function getFloodStatusAttribute()
    // {
    //     if ($this->water_level === null) return 'Tidak Terdeteksi';
    //     if ($this->water_level < 50) return 'Aman';
    //     if ($this->water_level < 100) return 'Siaga';
    //     if ($this->water_level < 150) return 'Waspada';
    //     return 'Bahaya';
    // }

    // // Status intensitas hujan
    // public function getRainStatusAttribute()
    // {
    //     if ($this->rain_intensity === null) return 'Tidak Terdeteksi';
    //     if ($this->rain_intensity < 5) return 'Ringan';
    //     if ($this->rain_intensity < 20) return 'Sedang';
    //     if ($this->rain_intensity < 50) return 'Lebat';
    //     return 'Ekstrem';
    // }

    // // Status hujan dalam teks
    // public function getRainingStatusAttribute()
    // {
    //     return $this->is_raining ? '🌧️ Hujan' : '☀️ Cerah';
    // }

    // // ========== MUTATORS (format data sebelum disimpan) ==========
    
    // // Pastikan water_level tidak negatif
    // public function setWaterLevelAttribute($value)
    // {
    //     $this->attributes['water_level'] = max(0, (float)$value);
    // }

    // // Pastikan rain_intensity tidak negatif
    // public function setRainIntensityAttribute($value)
    // {
    //     $this->attributes['rain_intensity'] = max(0, (float)$value);
    // }

    // // ========== RELATIONS (jika ada relasi ke tabel lain) ==========
    
    // // Contoh: relasi ke tabel users (jika sensor punya petugas)
    // // public function user()
    // // {
    // //     return $this->belongsTo(User::class, 'user_id');
    // // }

    // // Contoh: relasi ke tabel lokasi
    // // public function locationDetail()
    // // {
    // //     return $this->belongsTo(Location::class, 'location_id');
    // // }
}