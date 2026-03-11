<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    protected $fillable = ['districtId', 'adm4'];
    public function districts(){
        return $this->belongsTo(District::class, 'districtId');
    }
}
