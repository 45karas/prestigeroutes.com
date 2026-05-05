<?php

namespace App\Http\Controllers;

use App\Models\Trip;

class TripController extends Controller
{
    public function index()
    {
        $trips = Trip::query()
            ->where('published', true)
            ->whereDate('start_date', '>=', now()->toDateString())
            ->orderBy('start_date')
            ->get();

        return view('trips.index', ['trips' => $trips]);
    }

    public function show(string $slug)
    {
        $trip = Trip::query()
            ->where('published', true)
            ->where('slug', $slug)
            ->firstOrFail();

        $available = max(0, $trip->spots_total - $trip->spots_booked);

        return view('trips.show', [
            'trip' => $trip,
            'available' => $available,
        ]);
    }
}

