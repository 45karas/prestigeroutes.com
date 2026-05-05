<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $secret = config('services.stripe.webhook_secret');
        if (!$secret) {
            return response()->json(['error' => 'Webhook not configured'], 503);
        }

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Throwable) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $bookingId = $session->metadata->bookingId ?? null;
            if ($bookingId && ($session->payment_status ?? null) === 'paid') {
                DB::transaction(function () use ($bookingId, $session) {
                    /** @var Booking|null $booking */
                    $booking = Booking::query()->lockForUpdate()->find((int) $bookingId);
                    if (!$booking || $booking->status === 'PAID') return;

                    /** @var Trip $trip */
                    $trip = Trip::query()->lockForUpdate()->findOrFail($booking->trip_id);
                    $available = $trip->spots_total - $trip->spots_booked;
                    if ($booking->guests > $available) {
                        $booking->update(['status' => 'CANCELLED']);
                        return;
                    }

                    $booking->update([
                        'status' => 'PAID',
                        'stripe_payment_intent_id' => is_string($session->payment_intent ?? null)
                            ? $session->payment_intent
                            : null,
                    ]);

                    $trip->update(['spots_booked' => $trip->spots_booked + $booking->guests]);
                });
            }
        }

        return response()->json(['received' => true]);
    }
}

