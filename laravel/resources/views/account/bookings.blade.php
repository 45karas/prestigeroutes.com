@extends('layout')

@section('content')
  <h1 class="text-4xl font-serif">My bookings</h1>
  <p class="mt-2 text-gray-300">Trips you have reserved or completed.</p>

  <div class="mt-8 space-y-4 max-w-3xl">
    @forelse($bookings as $b)
      <div class="rounded-2xl glass px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <a class="font-medium hover:text-yellow-200" href="{{ route('trips.show', $b->trip->slug) }}">{{ $b->trip->title }}</a>
          <p class="text-sm text-gray-300">{{ $b->guests }} guest{{ $b->guests === 1 ? '' : 's' }} · ${{ number_format($b->total_cents/100, 0) }}</p>
          <p class="text-xs text-gray-400">Booked {{ $b->created_at->format('M j, Y') }}</p>
        </div>
        <span class="text-xs px-3 py-1 rounded-full
          @if($b->status==='PAID') bg-emerald-500/15 text-emerald-300
          @elseif($b->status==='PENDING') bg-yellow-200/10 text-yellow-200
          @else bg-white/10 text-gray-300
          @endif
        ">
          @if($b->status==='PAID') Confirmed
          @elseif($b->status==='PENDING') Payment pending
          @else Cancelled
          @endif
        </span>
      </div>
    @empty
      <div class="rounded-2xl glass px-6 py-10 text-center text-gray-300">
        No bookings yet. <a class="text-yellow-200 hover:underline" href="{{ route('trips.index') }}">Browse trips</a>
      </div>
    @endforelse
  </div>
@endsection

