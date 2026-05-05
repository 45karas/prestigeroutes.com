import Link from "next/link";
import { formatUsd } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Manage trips" };

function formatDateRange(start: Date, end: Date) {
  return `${start.toLocaleDateString("en-US")} - ${end.toLocaleDateString("en-US")}`;
}

export default async function AdminTripsPage() {
  const trips = await prisma.trip.findMany({
    orderBy: { startDate: "asc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Inventory</p>
          <h1 className="mt-3 font-display text-4xl text-cream">Trips</h1>
          <p className="mt-2 text-muted">Create, publish, and manage departures.</p>
        </div>
        <Link href="/admin/trips/new" className="btn-primary self-start sm:self-auto">
          New trip
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto rounded-lg border border-border bg-surface/35">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/80 bg-bg/35 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Trip</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Seats</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => {
              const remaining = Math.max(0, trip.spotsTotal - trip.spotsBooked);
              return (
                <tr key={trip.id} className="border-b border-border/40 last:border-0 hover:bg-bg/25">
                  <td className="px-4 py-4">
                    <span className="font-medium text-cream">{trip.title}</span>
                    <p className="mt-1 text-xs text-muted">{trip.destination}</p>
                  </td>
                  <td className="px-4 py-4 text-muted">{formatDateRange(trip.startDate, trip.endDate)}</td>
                  <td className="px-4 py-4 text-cream">{formatUsd(trip.priceCents)}</td>
                  <td className="px-4 py-4 text-muted">
                    <span className="text-cream">{remaining}</span> open / {trip.spotsTotal}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={[
                        "rounded-lg px-2.5 py-1 text-xs font-medium",
                        trip.published ? "bg-accent/15 text-accent" : "bg-bg/70 text-muted",
                      ].join(" ")}
                    >
                      {trip.published ? "Live" : "Draft"}
                    </span>
                    {trip.featured && (
                      <span className="ml-2 rounded-lg bg-gold/15 px-2.5 py-1 text-xs font-medium text-gold">
                        Home #{trip.featuredOrder}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/admin/trips/${trip.id}/edit`} className="text-gold hover:text-cream">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {trips.length === 0 && (
          <p className="px-4 py-10 text-center text-muted">No trips yet. Create your first one.</p>
        )}
      </div>
    </div>
  );
}
