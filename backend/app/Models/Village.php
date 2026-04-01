<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    protected $fillable = ['districtId', 'adm4'];
    public function district(){
        return $this->belongsTo(District::class, 'districtId');
    }
}
