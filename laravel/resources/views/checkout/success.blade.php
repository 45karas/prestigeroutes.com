@extends('layout')

@section('content')
  <div class="max-w-lg mx-auto text-center py-16">
    <div class="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 text-emerald-300 flex items-center justify-center text-2xl">✓</div>
    <h1 class="mt-8 text-3xl font-serif">Thank you</h1>
    <p class="mt-4 text-gray-300">
      @if($tripTitle)
        Your booking for “{{ $tripTitle }}” is confirmed.
      @else
        Your payment was received. Your booking will appear under My bookings once processing completes.
      @endif
    </p>
    <div class="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
      <a href="{{ route('account.bookings') }}" class="px-6 py-3 rounded-full btn-primary font-medium">View my bookings</a>
      <a href="{{ route('trips.index') }}" class="px-6 py-3 rounded-full border border-yellow-200/30 hover:border-yellow-200">More trips</a>
    </div>
  </div>
@endsection

