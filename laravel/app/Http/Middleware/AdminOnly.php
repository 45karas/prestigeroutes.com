<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'ADMIN') {
            return redirect()->route('login')->with('error', 'Admin access required.');
        }
        return $next($request);
    }
}

