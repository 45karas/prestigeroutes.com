@extends('admin.layout')

@section('admin')
  <div class="flex items-center justify-between gap-6">
    <div>
      <h1 class="text-3xl font-serif">Trips</h1>
      <p class="mt-1 text-gray-300">Create, publish, and manage departures.</p>
    </div>
    <a href="{{ route('admin.trips.create') }}" class="px-6 py-3 rounded-full btn-primary font-medium">New trip</a>
  </div>

  <div class="mt-8 overflow-x-auto rounded-2xl glass">
    <table class="w-full min-w-[780px] text-sm">
      <thead class="text-xs uppercase tracking-wider text-gray-400 border-b border-yellow-200/10">
        <tr>
          <th class="px-4 py-3 text-left font-medium">Trip</th>
          <th class="px-4 py-3 text-left font-medium">Dates</th>
          <th class="px-4 py-3 text-left font-medium">Price</th>
          <th class="px-4 py-3 text-left font-medium">Spots</th>
          <th class="px-4 py-3 text-left font-medium">Status</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        @foreach($trips as $t)
          <tr class="border-b border-yellow-200/10">
            <td class="px-4 py-3">
              <div class="font-medium">{{ $t->title }}</div>
              <div class="text-xs text-gray-400">{{ $t->destination }}</div>
            </td>
            <td class="px-4 py-3 text-gray-300">{{ $t->start_date->format('M j, Y') }} — {{ $t->end_date->format('M j, Y') }}</td>
            <td class="px-4 py-3">${{ number_format($t->price_cents/100, 0) }}</td>
            <td class="px-4 py-3 text-gray-300">{{ $t->spots_booked }}/{{ $t->spots_total }}</td>
            <td class="px-4 py-3">
              @if($t->published) <span class="text-emerald-300">Live</span> @else <span class="text-gray-300">Draft</span> @endif
            </td>
            <td class="px-4 py-3 text-right">
              <a class="text-yellow-200 hover:underline" href="{{ route('admin.trips.edit', $t) }}">Edit</a>
            </td>
          </tr>
        @endforeach
      </tbody>
    </table>
    @if($trips->count()===0)
      <p class="px-4 py-10 text-center text-gray-300">No trips yet. Create your first one.</p>
    @endif
  </div>
@endsection

