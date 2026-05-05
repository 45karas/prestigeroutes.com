<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ $title ?? 'Prestige Routes' }}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root { --bg:#0c1117; --bg2:#141c26; --gold:#d4af7a; --cream:#f4efe6; --muted:#9aa4b2; }
    body { background: radial-gradient(ellipse 120% 80% at 50% -20%, rgba(212,175,122,.12), transparent), var(--bg); color: var(--cream); }
    .glass { background: linear-gradient(135deg, rgba(26,36,51,.85), rgba(12,17,23,.75)); border: 1px solid rgba(212,175,122,.22); backdrop-filter: blur(12px); }
    .btn-primary { background: linear-gradient(135deg, #d4af7a, #b8925e); color: #0c1117; }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <header class="sticky top-0 z-50 glass">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="{{ route('home') }}" class="text-xl font-semibold" style="color: var(--gold)">Prestige Routes</a>
      <nav class="flex items-center gap-3 text-sm">
        <a class="text-gray-300 hover:text-white" href="{{ route('trips.index') }}">Trips</a>
        @auth
          <a class="text-gray-300 hover:text-white" href="{{ route('account.bookings') }}">My bookings</a>
          @if(auth()->user()->role === 'ADMIN')
            <a class="text-yellow-200 hover:text-white" href="{{ route('admin.index') }}">Admin</a>
          @endif
          <form method="post" action="{{ route('logout') }}">
            @csrf
            <button class="text-gray-300 hover:text-white" type="submit">Sign out</button>
          </form>
        @else
          <a class="px-4 py-2 rounded-full border border-yellow-200/30 hover:border-yellow-200" href="{{ route('login') }}">Sign in</a>
          <a class="px-4 py-2 rounded-full btn-primary" href="{{ route('register') }}">Create account</a>
        @endauth
      </nav>
    </div>
  </header>

  <main class="flex-1">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-6">
      @if(session('error'))
        <div class="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {{ session('error') }}
        </div>
      @endif
      @yield('content')
    </div>
  </main>

  <footer class="mt-auto border-t border-yellow-200/10 bg-black/10">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between gap-8">
      <div>
        <p class="text-lg font-semibold" style="color: var(--gold)">Prestige Routes</p>
        <p class="mt-2 text-sm text-gray-300">Curated journeys for discerning travelers.</p>
      </div>
      <div>
        <p class="font-medium">Contact</p>
        <p class="mt-2 text-sm text-gray-300">{{ env('SUPPORT_EMAIL', 'support@prestigeroutes.com') }}</p>
      </div>
    </div>
    <div class="border-t border-yellow-200/10 py-4 text-center text-xs text-gray-400">
      © {{ date('Y') }} Prestige Routes. All rights reserved.
    </div>
  </footer>
</body>
</html>

