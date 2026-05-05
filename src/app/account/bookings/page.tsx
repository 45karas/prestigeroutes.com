import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { formatUsd } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "My bookings" };

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/bookings");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { trip: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-cream">My bookings</h1>
      <p className="mt-2 text-muted">Trips you have reserved or completed.</p>

      <ul className="mt-10 space-y-4">
        {bookings.length === 0 ? (
          <li className="rounded-2xl border border-border glass px-6 py-10 text-center text-muted">
            No bookings yet.{" "}
            <Link href="/trips" className="text-gold hover:underline">
              Browse trips
            </Link>
          </li>
        ) : (
          bookings.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-3 rounded-2xl border border-border glass px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Link
                  href={`/trips/${b.trip.slug}`}
                  className="font-medium text-cream hover:text-gold"
                >
                  {b.trip.title}
                </Link>
                <p className="text-sm text-muted">
                  {b.guests} guest{b.guests === 1 ? "" : "s"} · {formatUsd(b.totalCents)}
                </p>
                <p className="text-xs text-muted">
                  Booked {b.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
                </p>
              </div>
              <span
                className={
                  b.status === "PAID"
                    ? "rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent"
                    : b.status === "PENDING"
                      ? "rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold"
                      : "rounded-full bg-muted/20 px-3 py-1 text-xs font-medium text-muted"
                }
              >
                {b.status === "PAID"
                  ? "Confirmed"
                  : b.status === "PENDING"
                    ? "Payment pending"
                    : "Cancelled"}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
