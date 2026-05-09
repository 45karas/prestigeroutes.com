import { formatUsd } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Admin users" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bookings: {
        select: {
          status: true,
          totalCents: true,
        },
      },
    },
  });

  return (
    <div>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Accounts</p>
        <h1 className="mt-3 font-display text-4xl text-cream">Users</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Review registered customers, admin accounts, booking counts, and paid booking value.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-border bg-surface/35">
        {users.length === 0 ? (
          <p className="px-5 py-10 text-center text-muted">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Bookings</th>
                  <th className="px-5 py-4 font-medium">Paid value</th>
                  <th className="px-5 py-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user) => {
                  const paidTotal = user.bookings
                    .filter((booking) => booking.status === "PAID")
                    .reduce((sum, booking) => sum + booking.totalCents, 0);

                  return (
                    <tr key={user.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-cream">{user.name || "Unnamed user"}</p>
                        <p className="mt-1 text-xs text-muted">{user.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={[
                            "rounded-lg px-2.5 py-1 text-xs font-medium",
                            user.role === "ADMIN" ? "bg-gold/15 text-gold" : "bg-accent/15 text-accent",
                          ].join(" ")}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted">{user.bookings.length}</td>
                      <td className="px-5 py-4 font-medium text-cream">{formatUsd(paidTotal)}</td>
                      <td className="px-5 py-4 text-muted">
                        {user.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
