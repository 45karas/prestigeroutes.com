@extends('admin.layout')

@section('admin')
  @php($editing = (bool) $trip)
  <h1 class="text-3xl font-serif">{{ $editing ? 'Edit trip' : 'New trip' }}</h1>
  <p class="mt-2 text-gray-300">{{ $editing ? $trip->title : 'Details appear on the public site once published.' }}</p>

  <form method="post" action="{{ $editing ? route('admin.trips.update', $trip) : route('admin.trips.store') }}" class="mt-8 space-y-6 max-w-2xl">
    @csrf

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Title</label>
      <input name="title" required value="{{ old('title', $trip->title ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Destination</label>
      <input name="destination" required value="{{ old('destination', $trip->destination ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Description</label>
      <textarea name="description" required rows="8" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3">{{ old('description', $trip->description ?? '') }}</textarea>
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Image URL</label>
      <input name="image_url" type="url" required value="{{ old('image_url', $trip->image_url ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" placeholder="https://..." />
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Start date</label>
        <input name="start_date" type="date" required value="{{ old('start_date', isset($trip) ? $trip->start_date->format('Y-m-d') : '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">End date</label>
        <input name="end_date" type="date" required value="{{ old('end_date', isset($trip) ? $trip->end_date->format('Y-m-d') : '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Price (USD per person)</label>
        <input name="price_usd" type="number" min="1" step="0.01" required value="{{ old('price_usd', isset($trip) ? $trip->price_cents/100 : '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Total spots</label>
        <input name="spots_total" type="number" min="1" required value="{{ old('spots_total', $trip->spots_total ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
    </div>

    <div class="flex flex-wrap gap-6 text-sm">
      <label class="flex items-center gap-2">
        <input type="checkbox" name="featured" @checked(old('featured', $trip->featured ?? false)) />
        Featured on homepage
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" name="published" @checked(old('published', $trip->published ?? true)) />
        Published
      </label>
    </div>

    <div class="flex gap-3 flex-wrap">
      <button type="submit" class="px-6 py-3 rounded-full btn-primary font-medium">{{ $editing ? 'Save changes' : 'Create trip' }}</button>
      <a href="{{ route('admin.trips.index') }}" class="px-6 py-3 rounded-full border border-yellow-200/30 hover:border-yellow-200">Cancel</a>
    </div>
  </form>

  @if($editing)
    <form method="post" action="{{ route('admin.trips.delete', $trip) }}" class="mt-10 pt-8 border-t border-yellow-200/10 max-w-2xl">
      @csrf
      <p class="text-sm text-gray-300">Delete this trip and its booking records.</p>
      <button type="submit" class="mt-3 px-5 py-2 rounded-full border border-red-500/40 text-red-200 hover:bg-red-500/10">Delete trip</button>
    </form>
  @endif
@endsection

