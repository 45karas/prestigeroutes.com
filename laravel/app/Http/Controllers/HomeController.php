<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use App\Models\Trip;

class HomeController extends Controller
{
    public function index()
    {
        $slides = HeroSlide::query()
            ->where('published', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->limit(6)
            ->get();

        $featured = Trip::query()
            ->where('published', true)
            ->where('featured', true)
            ->whereDate('start_date', '>=', now()->toDateString())
            ->orderBy('start_date')
            ->limit(3)
            ->get();

        return view('home', [
            'slides' => $slides,
            'featured' => $featured,
        ]);
    }
}

