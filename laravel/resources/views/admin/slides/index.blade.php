@extends('admin.layout')

@section('admin')
  <div class="flex items-center justify-between gap-6">
    <div>
      <h1 class="text-3xl font-serif">Homepage slides</h1>
      <p class="mt-1 text-gray-300">Animated images on the public homepage hero.</p>
    </div>
    <a href="{{ route('admin.slides.create') }}" class="px-6 py-3 rounded-full btn-primary font-medium">New slide</a>
  </div>

  <div class="mt-8 overflow-x-auto rounded-2xl glass">
    <table class="w-full min-w-[640px] text-sm">
      <thead class="text-xs uppercase tracking-wider text-gray-400 border-b border-yellow-200/10">
        <tr>
          <th class="px-4 py-3 text-left font-medium">Title</th>
          <th class="px-4 py-3 text-left font-medium">Order</th>
          <th class="px-4 py-3 text-left font-medium">Status</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        @foreach($slides as $s)
          <tr class="border-b border-yellow-200/10">
            <td class="px-4 py-3">
              <div class="font-medium">{{ $s->title }}</div>
              @if($s->subtitle) <div class="text-xs text-gray-400">{{ $s->subtitle }}</div> @endif
            </td>
            <td class="px-4 py-3 text-gray-300">{{ $s->sort_order }}</td>
            <td class="px-4 py-3">
              @if($s->published) <span class="text-emerald-300">Live</span> @else <span class="text-gray-300">Draft</span> @endif
            </td>
            <td class="px-4 py-3 text-right">
              <a class="text-yellow-200 hover:underline" href="{{ route('admin.slides.edit', $s) }}">Edit</a>
            </td>
          </tr>
        @endforeach
      </tbody>
    </table>
    @if($slides->count()===0)
      <p class="px-4 py-10 text-center text-gray-300">No slides yet. Create your first one.</p>
    @endif
  </div>
@endsection

