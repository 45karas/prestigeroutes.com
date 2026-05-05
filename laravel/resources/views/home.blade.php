@extends('layout')

@section('content')
  <section class="relative overflow-hidden rounded-2xl glass p-8 sm:p-12">
    <div class="absolute inset-0">
      @php($first = $slides->first())
      <img id="heroImg" src="{{ $first?->image_url ?? '' }}" class="absolute inset-0 w-full h-full object-cover opacity-40" alt="">
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"></div>
    </div>
    <div class="relative">
      <p class="text-sm font-medium uppercase tracking-[0.2em]" style="color: var(--gold)">prestigeroutes.com</p>
      <h1 class="mt-4 text-4xl sm:text-5xl font-serif">Journeys designed for travelers who expect more than a tour.</h1>
      <p class="mt-4 max-w-xl text-gray-300">Small groups, refined itineraries, and effortless booking — from first glance to final toast.</p>
      <div class="mt-8 flex gap-3 flex-wrap">
        <a href="{{ route('trips.index') }}" class="px-6 py-3 rounded-full btn-primary font-medium">View upcoming trips</a>
        <a href="{{ route('register') }}" class="px-6 py-3 rounded-full border border-yellow-200/30 hover:border-yellow-200">Create your account</a>
      </div>
    </div>
  </section>

  @if($featured->count())
    <section class="mt-14">
      <div class="flex items-end justify-between gap-6">
        <div>
          <h2 class="text-3xl font-serif">Featured departures</h2>
          <p class="mt-2 text-gray-300">Hand-picked routes with limited availability.</p>
        </div>
        <a href="{{ route('trips.index') }}" class="px-4 py-2 rounded-full border border-yellow-200/30 hover:border-yellow-200 text-sm">All trips</a>
      </div>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        @foreach($featured as $t)
          <a href="{{ route('trips.show', $t->slug) }}" class="rounded-2xl overflow-hidden border border-yellow-200/10 hover:border-yellow-200/30 transition block">
            <div class="aspect-[16/10] relative">
              <img src="{{ $t->image_url }}" class="absolute inset-0 w-full h-full object-cover opacity-90" alt="">
            </div>
            <div class="p-5">
              <p class="text-xs text-yellow-200/90">{{ $t->destination }}</p>
              <h3 class="mt-1 text-xl font-medium">{{ $t->title }}</h3>
              <p class="mt-2 text-sm text-gray-300">{{ $t->start_date->format('M j, Y') }} – {{ $t->end_date->format('M j, Y') }}</p>
              <div class="mt-4 flex items-center justify-between border-t border-yellow-200/10 pt-4">
                <span class="text-lg font-semibold">${{ number_format($t->price_cents/100, 0) }}</span>
                <span class="text-xs text-gray-300">{{ max(0, $t->spots_total - $t->spots_booked) }} spots</span>
              </div>
            </div>
          </a>
        @endforeach
      </div>
    </section>
  @endif

  @if($slides->count() > 1)
    <script>
      (function () {
        const slides = @json($slides->values()->map(fn($s) => ['image' => $s->image_url])->all());
        let i = 0;
        const img = document.getElementById('heroImg');
        setInterval(() => {
          i = (i + 1) % slides.length;
          img.style.transition = 'opacity 700ms ease';
          img.style.opacity = '0';
          setTimeout(() => {
            img.src = slides[i].image;
            img.style.opacity = '0.4';
          }, 400);
        }, 5000);
      })();
    </script>
  @endif
@endsection

