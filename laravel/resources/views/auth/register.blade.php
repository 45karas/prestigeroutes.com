@extends('layout')

@section('content')
  <div class="max-w-md mx-auto">
    <h1 class="text-4xl font-serif">Create your account</h1>
    <p class="mt-2 text-gray-300">Book trips and access your confirmations anytime.</p>

    <form method="post" action="{{ route('register.post') }}" class="mt-8 space-y-5">
      @csrf

      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Name</label>
        <input name="name" value="{{ old('name') }}" required class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
        @error('name') <p class="mt-2 text-sm text-red-200">{{ $message }}</p> @enderror
      </div>

      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Email</label>
        <input type="email" name="email" value="{{ old('email') }}" required class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
        @error('email') <p class="mt-2 text-sm text-red-200">{{ $message }}</p> @enderror
      </div>

      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Password</label>
        <input type="password" name="password" required minlength="8" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
        @error('password') <p class="mt-2 text-sm text-red-200">{{ $message }}</p> @enderror
      </div>

      <div>
        <label class="block text-xs uppercase tracking-wider text-gray-300 mb-1">Confirm Password</label>
        <input type="password" name="password_confirmation" required minlength="8" class="w-full rounded-xl bg-black/30 border border-yellow-200/10 px-4 py-3" />
      </div>

      <button class="w-full px-6 py-3 rounded-full btn-primary font-medium" type="submit">Create account</button>

      <p class="text-center text-sm text-gray-300">
        Already have an account?
        <a class="text-yellow-200 hover:underline" href="{{ route('login') }}">Sign in</a>
      </p>
    </form>
  </div>
@endsection

