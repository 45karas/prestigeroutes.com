<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use App\Models\Trip;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@prestigeroutes.com'],
            [
                'name' => 'Prestige Admin',
                'password' => Hash::make('PrestigeAdmin2026!'),
                'role' => 'ADMIN',
            ]
        );

        $trips = [
            [
                'title' => 'Amalfi Coast & Capri',
                'slug' => 'amalfi-coast-capri',
                'destination' => 'Italy',
                'description' => 'Wind along cliffside roads, sip limoncello in Positano, and cruise to Capri’s Blue Grotto. Small groups, hand-picked hotels, and sunset dinners overlooking the Tyrrhenian Sea.',
                'image_url' => 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=80',
                'start_date' => '2026-06-12',
                'end_date' => '2026-06-19',
                'price_cents' => 429900,
                'spots_total' => 16,
                'spots_booked' => 0,
                'featured' => true,
                'published' => true,
            ],
            [
                'title' => 'Kyoto Temples & Kaiseki',
                'slug' => 'kyoto-temples-kaiseki',
                'destination' => 'Japan',
                'description' => 'Private tea ceremonies, bamboo groves at dawn, and multi-course kaiseki in ryokan inns. Includes bullet train from Tokyo and expert cultural guides.',
                'image_url' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
                'start_date' => '2026-09-03',
                'end_date' => '2026-09-11',
                'price_cents' => 589900,
                'spots_total' => 12,
                'spots_booked' => 0,
                'featured' => true,
                'published' => true,
            ],
            [
                'title' => 'Patagonia Peaks & Glaciers',
                'slug' => 'patagonia-peaks-glaciers',
                'destination' => 'Chile & Argentina',
                'description' => 'Trek Torres del Paine, cruise to Perito Moreno, and stay in eco-lodges with panoramic Andean views. Moderate fitness; all transfers included.',
                'image_url' => 'https://images.unsplash.com/photo-1518182170307-2e1b7d27d3e5?auto=format&fit=crop&w=1600&q=80',
                'start_date' => '2026-11-08',
                'end_date' => '2026-11-18',
                'price_cents' => 649900,
                'spots_total' => 14,
                'spots_booked' => 0,
                'featured' => true,
                'published' => true,
            ],
        ];

        foreach ($trips as $t) {
            Trip::updateOrCreate(['slug' => $t['slug']], $t);
        }

        $slides = [
            [
                'sort_order' => 0,
                'title' => 'Luxury departures, limited seats',
                'subtitle' => 'Secure booking in minutes · curated routes · small groups',
                'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80',
                'cta_text' => 'View upcoming trips',
                'cta_href' => '/trips',
                'published' => true,
            ],
            [
                'sort_order' => 1,
                'title' => 'Your next story starts here',
                'subtitle' => 'Hand-picked hotels, expert guides, seamless planning',
                'image_url' => 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80',
                'cta_text' => 'Create account',
                'cta_href' => '/register',
                'published' => true,
            ],
        ];

        foreach ($slides as $s) {
            HeroSlide::updateOrCreate(['image_url' => $s['image_url']], $s);
        }
    }
}

