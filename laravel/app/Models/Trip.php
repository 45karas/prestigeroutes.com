<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trip extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'destination',
        'image_url',
        'start_date',
        'end_date',
        'price_cents',
        'spots_total',
        'spots_booked',
        'featured',
        'published',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'featured' => 'boolean',
        'published' => 'boolean',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}

