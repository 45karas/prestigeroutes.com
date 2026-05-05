@extends('layout')

@section('content')
  <h1 class="text-4xl font-serif">Upcoming trips</h1>
  <p class="mt-3 text-gray-300 max-w-2xl">Browse departures, open any itinerary for full details, and book in minutes with secure checkout.</p>

  <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    @forelse($trips as $t)
      <a href="{{ route('trips.show', $t->slug) }}" class="rounded-2xl overflow-hidden border border-yellow-200/10 hover:border-yellow-200/30 transition block">
        <div class="aspect-[16/10] relative">
          <img src="{{ $t->image_url }}" class="absolute inset-0 w-full h-full object-cover opacity-90" alt="">
          <span class="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs text-yellow-200">{{ $t->destination }}</span>
        </div>
        <div class="p-5">
          <h3 class="text-xl font-medium">{{ $t->title }}</h3>
          <p class="mt-2 text-sm text-gray-300">{{ $t->start_date->format('M j, Y') }} – {{ $t->end_date->format('M j, Y') }}</p>
          <div class="mt-4 flex items-center justify-between border-t border-yellow-200/10 pt-4">
            <span class="text-lg font-semibold">${{ number_format($t->price_cents/100, 0) }}</span>
            <span class="text-xs text-gray-300">{{ max(0, $t->spots_total - $t->spots_booked) }} spots</span>
          </div>
        </div>
      </a>
    @empty
      <p class="text-gray-300">No upcoming trips yet.</p>
    @endforelse
  </div>
@endsection

