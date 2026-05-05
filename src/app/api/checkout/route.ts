import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const checkoutSchema = z.object({
  tripId: z.string().min(1),
  guests: z.coerce.number().int().min(1).max(20),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to book a trip." }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured. Add STRIPE_SECRET_KEY to your environment." },
      { status: 503 },
    );
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { tripId, guests } = parsed.data;

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, published: true },
  });
  if (!trip) {
    return NextResponse.json({ error: "Trip not found." }, { status: 404 });
  }

  const available = trip.spotsTotal - trip.spotsBooked;
  if (guests > available) {
    return NextResponse.json(
      { error: `Only ${available} spot(s) left on this departure.` },
      { status: 400 },
    );
  }

  if (trip.startDate < new Date()) {
    return NextResponse.json({ error: "This trip has already started." }, { status: 400 });
  }

  const totalCents = trip.priceCents * guests;

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      tripId: trip.id,
      guests,
      totalCents,
      status: "PENDING",
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: totalCents,
          product_data: {
            name: `${trip.title} — ${guests} guest(s)`,
            description: `${trip.destination} · ${trip.startDate.toLocaleDateString()}`,
            images: trip.imageUrl ? [trip.imageUrl] : undefined,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/trips/${trip.slug}?cancelled=1`,
    metadata: {
      bookingId: booking.id,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  if (!checkoutSession.url) {
    return NextResponse.json({ error: "Could not create checkout session." }, { status: 500 });
  }

  return NextResponse.json({ url: checkoutSession.url });
}
