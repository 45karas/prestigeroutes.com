import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !whSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });
    if (!booking || booking.status === "PAID") {
      return NextResponse.json({ received: true });
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      const fresh = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true },
      });
      if (!fresh || fresh.status === "PAID") return;

      const available = fresh.trip.spotsTotal - fresh.trip.spotsBooked;
      if (fresh.guests > available) {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
        });
        return;
      }

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "PAID",
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        },
      });
      await tx.trip.update({
        where: { id: fresh.tripId },
        data: { spotsBooked: { increment: fresh.guests } },
      });
    });
  }

  return NextResponse.json({ received: true });
}
