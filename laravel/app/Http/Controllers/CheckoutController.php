<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Trip;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    private function stripe(): StripeClient
    {
        $key = config('services.stripe.secret');
        if (!$key) {
            abort(503, 'Stripe not configured');
        }
        return new StripeClient($key);
    }

    public function create(Request $request, int $tripId)
    {
        $data = $request->validate([
            'guests' => ['required', 'integer', 'min:1', 'max:20'],
        ]);

        $trip = Trip::query()
            ->where('id', $tripId)
            ->where('published', true)
            ->firstOrFail();

        if ($trip->start_date->isPast()) {
            return back()->with('error', 'This trip has already started.');
        }

        $available = $trip->spots_total - $trip->spots_booked;
        if ($data['guests'] > $available) {
            return back()->with('error', "Only {$available} spot(s) left.");
        }

        $totalCents = $trip->price_cents * $data['guests'];

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'trip_id' => $trip->id,
            'status' => 'PENDING',
            'guests' => $data['guests'],
            'total_cents' => $totalCents,
        ]);

        $origin = rtrim(config('app.url'), '/');

        $session = $this->stripe()->checkout->sessions->create([
            'mode' => 'payment',
            'customer_email' => auth()->user()->email,
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => config('services.stripe.currency', 'usd'),
                    'unit_amount' => $totalCents,
                    'product_data' => [
                        'name' => $trip->title.' — '.$data['guests'].' guest(s)',
                        'description' => $trip->destination.' · '.$trip->start_date->format('M j, Y'),
                        'images' => [$trip->image_url],
                    ],
                ],
            ]],
            'success_url' => $origin.'/checkout/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => $origin.'/trips/'.$trip->slug.'?cancelled=1',
            'metadata' => [
                'bookingId' => (string) $booking->id,
            ],
        ]);

        $booking->update(['stripe_session_id' => $session->id]);

        return redirect()->away($session->url);
    }

    public function success(Request $request)
    {
        $sessionId = $request->query('session_id');
        $tripTitle = null;

        if ($sessionId && config('services.stripe.secret')) {
            try {
                $cs = $this->stripe()->checkout->sessions->retrieve($sessionId, []);
                $bookingId = $cs->metadata->bookingId ?? null;
                if ($bookingId && ($cs->payment_status ?? null) === 'paid') {
                    $booking = Booking::query()
                        ->with('trip')
                        ->where('id', (int) $bookingId)
                        ->where('user_id', auth()->id())
                        ->first();
                    $tripTitle = $booking?->trip?->title;
                }
            } catch (\Throwable) {
                $tripTitle = null;
            }
        }

        return view('checkout.success', ['tripTitle' => $tripTitle]);
    }
}

