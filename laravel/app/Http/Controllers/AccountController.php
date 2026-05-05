<?php

namespace App\Http\Controllers;

use App\Models\Booking;

class AccountController extends Controller
{
    public function bookings()
    {
        $bookings = Booking::query()
            ->with('trip')
            ->where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get();

        return view('account.bookings', ['bookings' => $bookings]);
    }
}

