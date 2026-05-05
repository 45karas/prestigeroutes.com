<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TripAdminController extends Controller
{
    public function index()
    {
        $trips = Trip::orderBy('start_date')->get();
        return view('admin.trips.index', ['trips' => $trips]);
    }

    public function create()
    {
        return view('admin.trips.form', ['trip' => null]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $slug = $this->uniqueSlug($data['title']);

        Trip::create([
            ...$data,
            'slug' => $slug,
            'price_cents' => (int) round($data['price_usd'] * 100),
            'image_url' => $data['image_url'],
            'spots_booked' => 0,
            'featured' => $request->boolean('featured'),
            'published' => $request->boolean('published'),
        ]);

        return redirect()->route('admin.trips.index');
    }

    public function edit(Trip $trip)
    {
        return view('admin.trips.form', ['trip' => $trip]);
    }

    public function update(Request $request, Trip $trip)
    {
        $data = $this->validated($request);

        $newSlug = $trip->title !== $data['title']
            ? $this->uniqueSlug($data['title'], $trip->id)
            : $trip->slug;

        if ((int) $data['spots_total'] < (int) $trip->spots_booked) {
            return back()->with('error', 'Spots total cannot be less than already booked.')->withInput();
        }

        $trip->update([
            ...$data,
            'slug' => $newSlug,
            'price_cents' => (int) round($data['price_usd'] * 100),
            'image_url' => $data['image_url'],
            'featured' => $request->boolean('featured'),
            'published' => $request->boolean('published'),
        ]);

        return redirect()->route('admin.trips.index');
    }

    public function destroy(Trip $trip)
    {
        $trip->bookings()->delete();
        $trip->delete();
        return redirect()->route('admin.trips.index');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'min:2', 'max:200'],
            'destination' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'min:10'],
            'image_url' => ['required', 'url'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'price_usd' => ['required', 'numeric', 'min:1'],
            'spots_total' => ['required', 'integer', 'min:1', 'max:500'],
        ]);
        $data['published'] = $request->boolean('published');
        $data['featured'] = $request->boolean('featured');
        return $data;
    }

    private function uniqueSlug(string $title, ?int $excludeId = null): string
    {
        $base = Str::slug($title) ?: 'trip';
        $candidate = $base;
        $n = 0;
        while (true) {
            $q = Trip::where('slug', $candidate);
            if ($excludeId) $q->where('id', '!=', $excludeId);
            if (!$q->exists()) return $candidate;
            $n++;
            $candidate = $base.'-'.$n;
        }
    }
}

