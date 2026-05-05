import Link from "next/link";
import Stripe from "stripe";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: Promise<{ session_id?: string }> };

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const metadata = { title: "Booking confirmed" };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await auth();
  let tripTitle: string | null = null;

  const stripe = getStripe();
  if (stripe && sp.session_id && session?.user?.id) {
    try {
      const cs = await stripe.checkout.sessions.retrieve(sp.session_id);
      const bookingId = cs.metadata?.bookingId;
      if (bookingId && cs.payment_status === "paid") {
        const booking = await prisma.booking.findFirst({
          where: { id: bookingId, userId: session.user.id },
          include: { trip: true },
        });
        tripTitle = booking?.trip.title ?? null;
      }
    } catch {
      tripTitle = null;
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl text-accent">
        ✓
      </div>
      <h1 className="mt-8 font-display text-3xl text-cream">Thank you</h1>
      <p className="mt-4 text-muted">
        {tripTitle
          ? `Your booking for “${tripTitle}” is confirmed.`
          : "Your payment was received. Your booking will appear under My bookings once processing completes."}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/account/bookings" className="btn-primary">
          View my bookings
        </Link>
        <Link href="/trips" className="btn-outline">
          More trips
        </Link>
      </div>
    </div>
  );
}
