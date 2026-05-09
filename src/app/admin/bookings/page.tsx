import { formatUsd } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin bookings" };

function statusClass(status: string) {
  if (status === "PAID") return "bg-accent/15 text-accent";
  if (status === "PENDING") return "bg-gold/15 text-gold";
  return "bg-red-500/15 text-red-200";
}

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      trip: {
        select: {
          destination: true,
          startDate: true,
          title: true,
        },
      },
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return (
    <div>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Reservations</p>
        <h1 className="mt-3 font-display text-4xl text-cream">Bookings</h1>
        <p className="mt-2 max-w-2xl text-muted">
          See who booked, what they booked, payment status, guests, and booking value.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-border bg-surface/35">
        {bookings.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">Customer</th>
                  <th className="px-5 py-4 font-medium">Trip</th>
                  <th className="px-5 py-4 font-medium">Guests</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Total</th>
                  <th className="px-5 py-4 font-medium">Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-cream">{booking.user.name || "Customer"}</p>
                      <p className="mt-1 text-xs text-muted">{booking.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-cream">{booking.trip.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {booking.trip.destination} / {booking.trip.startDate.toLocaleDateString("en-US")}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-muted">{booking.guests}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-cream">{formatUsd(booking.totalCents)}</td>
                    <td className="px-5 py-4 text-muted">
                      {booking.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
