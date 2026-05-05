<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Trip;

class AdminController extends Controller
{
    public function index()
    {
        $tripCount = Trip::count();
        $paidCount = Booking::where('status', 'PAID')->count();
        $revenue = (int) Booking::where('status', 'PAID')->sum('total_cents');

        return view('admin.index', [
            'tripCount' => $tripCount,
            'paidCount' => $paidCount,
            'revenueCents' => $revenue,
        ]);
    }
}

