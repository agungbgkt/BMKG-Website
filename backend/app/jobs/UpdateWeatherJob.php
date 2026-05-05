<?php

namespace App\Jobs;

use App\Services\WeatherService;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdateWeatherJob implements ShouldQueue
{
    protected $adm4;

    public function __construct($adm4)
    {
        $this->adm4 = $adm4;
    }

    public function handle(WeatherService $service)
    {
        $service->fetchAndStore($this->adm4);
    }
}