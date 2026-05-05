@extends('admin.layout')

@section('admin')
  @php($editing = (bool) $slide)
  <h1 class="text-3xl font-serif">{{ $editing ? 'Edit slide' : 'New slide' }}</h1>
  <p class="mt-2 text-gray-300">{{ $editing ? $slide->title : 'This will animate on the homepage.' }}</p>

  <form method="post" action="{{ $editing ? route('admin.slides.update', $slide) : route('admin.slides.store') }}" class="mt-8 space-y-6 max-w-2xl">
    @csrf

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Title</label>
      <input name="title" required value="{{ old('title', $slide->title ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Subtitle (optional)</label>
      <input name="subtitle" value="{{ old('subtitle', $slide->subtitle ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
    </div>

    <div>
      <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Image URL</label>
      <input name="image_url" type="url" required value="{{ old('image_url', $slide->image_url ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" placeholder="https://..." />
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Button text (optional)</label>
        <input name="cta_text" value="{{ old('cta_text', $slide->cta_text ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Button link (optional)</label>
        <input name="cta_href" value="{{ old('cta_href', $slide->cta_href ?? '') }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
    </div>

    <div class="grid gap-6 sm:grid-cols-2">
      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Sort order</label>
        <input name="sort_order" type="number" min="0" value="{{ old('sort_order', $slide->sort_order ?? 0) }}" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>
      <label class="flex items-center gap-2 text-sm mt-7">
        <input type="checkbox" name="published" @checked(old('published', $slide->published ?? true)) />
        Published
      </label>
    </div>

    <div class="flex gap-3 flex-wrap">
      <button type="submit" class="px-6 py-3 rounded-full btn-primary font-medium">{{ $editing ? 'Save slide' : 'Create slide' }}</button>
      <a href="{{ route('admin.slides.index') }}" class="px-6 py-3 rounded-full border border-yellow-200/30 hover:border-yellow-200">Cancel</a>
    </div>
  </form>

  @if($editing)
    <form method="post" action="{{ route('admin.slides.delete', $slide) }}" class="mt-10 pt-8 border-t border-yellow-200/10 max-w-2xl">
      @csrf
      <p class="text-sm text-gray-300">Delete this slide.</p>
      <button type="submit" class="mt-3 px-5 py-2 rounded-full border border-red-500/40 text-red-200 hover:bg-red-500/10">Delete slide</button>
    </form>
  @endif
@endsection

