import { TripCard } from "@/components/trip-card";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upcoming trips",
};

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/trips");
  }

  const trips = await prisma.trip.findMany({
    where: { published: true, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
  });
  const destinations = new Set(trips.map((trip) => trip.destination)).size;
  const totalSeats = trips.reduce((sum, trip) => sum + Math.max(0, trip.spotsTotal - trip.spotsBooked), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Departures</p>
          <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">Upcoming trips</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Browse limited-seat departures, open any itinerary for full details, and reserve with
            secure checkout when the route feels right.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-surface/35 p-4 text-center">
          <div>
            <dt className="font-display text-2xl text-cream">{trips.length}</dt>
            <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted">Trips</dd>
          </div>
          <div>
            <dt className="font-display text-2xl text-cream">{destinations}</dt>
            <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted">Regions</dd>
          </div>
          <div>
            <dt className="font-display text-2xl text-cream">{totalSeats}</dt>
            <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted">Seats</dd>
          </div>
        </dl>
      </div>
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {trips.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface/40 p-8 text-muted sm:col-span-2 lg:col-span-3">
            No upcoming trips yet. Check back soon for new departures.
          </div>
        ) : (
          trips.map((trip, i) => <TripCard key={trip.id} trip={trip} priority={i < 3} />)
        )}
      </div>
    </div>
  );
}
