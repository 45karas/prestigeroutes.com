import Link from "next/link";
import { formatUsd } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [
    tripCount,
    liveTripCount,
    userCount,
    customerCount,
    bookingCount,
    pendingBookingCount,
    revenue,
    upcomingTrips,
    recentBookings,
  ] = await Promise.all([
    prisma.trip.count(),
    prisma.trip.count({ where: { published: true, startDate: { gte: new Date() } } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.booking.count({ where: { status: "PAID" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.aggregate({
      where: { status: "PAID" },
      _sum: { totalCents: true },
    }),
    prisma.trip.findMany({
      where: { startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: 4,
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        trip: { select: { title: true, destination: true } },
        user: { select: { email: true, name: true } },
      },
    }),
  ]);

  const totalUsd = formatUsd(revenue._sum.totalCents ?? 0);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Control room</p>
          <h1 className="mt-3 font-display text-4xl text-cream">Overview</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Monitor departures, homepage content, and paid booking activity from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/trips/new" className="btn-primary">
            New trip
          </Link>
          <Link href="/admin/gallery/new" className="btn-outline">
            Add photo
          </Link>
        </div>
      </div>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ["Total trips", tripCount],
          ["Live upcoming", liveTripCount],
          ["Users", userCount],
          ["Customers", customerCount],
          ["Paid bookings", bookingCount],
          ["Pending", pendingBookingCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-surface/40 px-5 py-4">
            <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
            <dd className="mt-2 font-display text-3xl text-cream">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-border bg-surface/35">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <h2 className="font-display text-2xl text-cream">Next departures</h2>
            <Link href="/admin/trips" className="text-sm font-medium text-gold hover:text-cream">
              Manage trips
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {upcomingTrips.length === 0 ? (
              <p className="px-5 py-8 text-muted">No upcoming departures yet.</p>
            ) : (
              upcomingTrips.map((trip) => {
                const remaining = Math.max(0, trip.spotsTotal - trip.spotsBooked);
                return (
                  <div key={trip.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <p className="font-medium text-cream">{trip.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {trip.destination} / {trip.startDate.toLocaleDateString("en-US")}
                      </p>
                    </div>
                    <div className="text-sm text-muted sm:text-right">
                      <p className="text-cream">{formatUsd(trip.priceCents)}</p>
                      <p>{remaining} seats open</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface/35 p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Recorded revenue</p>
          <p className="mt-3 font-display text-4xl text-cream">{totalUsd}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Revenue is counted from paid bookings only. Pending checkout sessions stay out of this
            total until the Stripe webhook marks them paid.
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-surface/35">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h2 className="font-display text-2xl text-cream">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-sm font-medium text-gold hover:text-cream">
            View all bookings
          </Link>
        </div>
        <div className="divide-y divide-border/50">
          {recentBookings.length === 0 ? (
            <p className="px-5 py-8 text-muted">No bookings yet.</p>
          ) : (
            recentBookings.map((booking) => (
              <div key={booking.id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_180px_120px] lg:items-center">
                <div>
                  <p className="font-medium text-cream">{booking.trip.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {booking.user.name || booking.user.email} / {booking.trip.destination}
                  </p>
                </div>
                <p className="text-sm text-muted">
                  {booking.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <span
                    className={[
                      "rounded-lg px-2.5 py-1 text-xs font-medium",
                      booking.status === "PAID"
                        ? "bg-accent/15 text-accent"
                        : booking.status === "PENDING"
                          ? "bg-gold/15 text-gold"
                          : "bg-red-500/15 text-red-200",
                    ].join(" ")}
                  >
                    {booking.status}
                  </span>
                  <span className="text-sm font-medium text-cream">{formatUsd(booking.totalCents)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
