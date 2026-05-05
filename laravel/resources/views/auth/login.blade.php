@extends('layout')

@section('content')
  <div class="max-w-md mx-auto">
    <h1 class="text-4xl font-serif">Welcome back</h1>
    <p class="mt-2 text-gray-300">Sign in to book trips and view confirmations.</p>

    <form method="post" action="{{ route('login.post') }}" class="mt-8 space-y-5">
      @csrf

      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value="{{ old('email') }}"
          required
          class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3"
        />
        @error('email') <p class="mt-2 text-sm text-red-200">{{ $message }}</p> @enderror
      </div>

      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Password</label>
        <input
          type="password"
          name="password"
          required
          class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3"
        />
      </div>

      <button class="w-full px-6 py-3 rounded-full btn-primary font-medium" type="submit">Sign in</button>

      <p class="text-center text-sm text-gray-300">
        No account?
        <a class="text-yellow-200 hover:underline" href="{{ route('register') }}">Create one</a>
      </p>
    </form>
  </div>
@endsection

