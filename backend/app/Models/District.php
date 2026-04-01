<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $fillable = ['regencyId', 'name'];
    public function regency(){
        return $this->belongsTo(Regency::class, 'regencyId');
    }
    public function villages(){
        return $this->hasMany(Village::class, 'districtId');
    }
}
