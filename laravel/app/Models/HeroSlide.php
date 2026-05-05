<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'image_url',
        'cta_text',
        'cta_href',
        'sort_order',
        'published',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];
}

