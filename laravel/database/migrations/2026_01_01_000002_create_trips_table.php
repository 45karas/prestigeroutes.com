<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->string('destination');
            $table->string('image_url');
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedInteger('price_cents');
            $table->unsignedInteger('spots_total');
            $table->unsignedInteger('spots_booked')->default(0);
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};

