@extends('layout')

@section('content')
  <div class="flex flex-col sm:flex-row gap-10">
    <aside class="sm:w-56 shrink-0">
      <p class="text-xs uppercase tracking-wider text-gray-400">Admin</p>
      <nav class="mt-4 flex flex-row sm:flex-col gap-3 text-sm">
        <a class="px-2 py-1.5 rounded-lg hover:bg-white/5" href="{{ route('admin.index') }}">Overview</a>
        <a class="px-2 py-1.5 rounded-lg hover:bg-white/5" href="{{ route('admin.trips.index') }}">Trips</a>
        <a class="px-2 py-1.5 rounded-lg hover:bg-white/5" href="{{ route('admin.slides.index') }}">Homepage slides</a>
        <a class="px-2 py-1.5 rounded-lg text-yellow-200 hover:text-white" href="{{ route('home') }}">← Site</a>
      </nav>
    </aside>
    <div class="min-w-0 flex-1">
      @yield('admin')
    </div>
  </div>
@endsection

