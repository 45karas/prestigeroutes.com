@extends('admin.layout')

@section('admin')
  <h1 class="text-3xl font-serif">Overview</h1>
  <p class="mt-2 text-gray-300">Prestige Routes admin</p>

  <div class="mt-8 grid gap-4 sm:grid-cols-3">
    <div class="rounded-2xl glass px-5 py-4">
      <p class="text-xs uppercase tracking-wider text-gray-400">Trips</p>
      <p class="mt-2 text-3xl font-serif">{{ $tripCount }}</p>
    </div>
    <div class="rounded-2xl glass px-5 py-4">
      <p class="text-xs uppercase tracking-wider text-gray-400">Paid bookings</p>
      <p class="mt-2 text-3xl font-serif">{{ $paidCount }}</p>
    </div>
    <div class="rounded-2xl glass px-5 py-4">
      <p class="text-xs uppercase tracking-wider text-gray-400">Recorded revenue</p>
      <p class="mt-2 text-3xl font-serif">${{ number_format($revenueCents/100, 0) }}</p>
    </div>
  </div>
@endsection

