<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weather extends Model
{
    protected $table = 'weather';
    protected $fillable = [
        'adm4',
        'provinsi',
        'kotkab',
        'kecamatan',
        'desa',
        'latitude',
        'longitude',
        'suhu',
        'kelembaban',
        'cuaca',
        'kecepatan_angin',
        'waktu'
    ];

    protected $casts = [
        'waktu' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
        'suhu' => 'integer',
        'kelembaban' => 'integer',
        'kecepatan_angin' => 'float',
    ];

    protected $guarded = ['id'];
}
