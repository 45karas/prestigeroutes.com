@extends('layout')

@section('content')
  <div class="grid gap-10 lg:grid-cols-[1fr_360px]">
    <article>
      <div class="rounded-2xl overflow-hidden border border-yellow-200/10">
        <div class="aspect-[16/9] relative">
          <img src="{{ $trip->image_url }}" class="absolute inset-0 w-full h-full object-cover opacity-90" alt="">
        </div>
        <div class="p-6">
          <p class="text-xs text-yellow-200/90">{{ $trip->destination }}</p>
          <h1 class="mt-2 text-4xl font-serif">{{ $trip->title }}</h1>
          <p class="mt-2 text-gray-300">{{ $trip->start_date->format('F j, Y') }} — {{ $trip->end_date->format('F j, Y') }}</p>
        </div>
      </div>

      <div class="mt-8 text-gray-200 whitespace-pre-wrap leading-relaxed">{{ $trip->description }}</div>
    </article>

    <aside class="lg:sticky lg:top-24 h-fit space-y-6">
      <div class="rounded-2xl glass p-6">
        <p class="text-sm text-gray-300">From</p>
        <p class="mt-1 text-3xl font-serif">${{ number_format($trip->price_cents/100, 0) }}</p>
        <p class="mt-2 text-xs text-gray-300">per person</p>
        <hr class="my-5 border-yellow-200/10" />
        <p class="text-sm text-gray-300">
          @if($available <= 0)
            Sold out
          @else
            {{ $available }} spot{{ $available === 1 ? '' : 's' }} remaining
          @endif
        </p>
      </div>

      @auth
        <div class="rounded-2xl glass p-6">
          <form method="post" action="{{ route('checkout.create', $trip->id) }}" class="space-y-4">
            @csrf
            <div>
              <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Guests</label>
              <select name="guests" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" @if($available<=0) disabled @endif>
                @for($i=1;$i<=min(20,$available);$i++)
                  <option value="{{ $i }}">{{ $i }} {{ $i===1 ? 'guest' : 'guests' }}</option>
                @endfor
              </select>
            </div>
            <button type="submit" class="w-full px-6 py-3 rounded-full btn-primary font-medium" @if($available<=0) disabled @endif>
              Pay securely with Stripe
            </button>
            <p class="text-center text-xs text-gray-300">Secure payment · redirected to Stripe Checkout</p>
          </form>
        </div>
      @else
        <div class="rounded-2xl glass p-6">
          <p class="text-sm text-gray-300">Sign in to book this trip.</p>
          <a class="mt-4 inline-block px-6 py-3 rounded-full border border-yellow-200/30 hover:border-yellow-200" href="{{ route('login') }}">Sign in</a>
        </div>
      @endauth
    </aside>
  </div>
@endsection

