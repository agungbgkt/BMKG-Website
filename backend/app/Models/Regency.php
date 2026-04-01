<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Regency extends Model
{
    protected $fillable = ['provinceId', 'name'];
    public function province(){
        return $this->belongsTo(Province::class, 'provinceId');
    }
    public function district(){
        return $this->hasMany(District::class);
    }
}
