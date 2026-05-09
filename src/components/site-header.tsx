import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { signOutAction } from "@/app/actions/auth";

const destinationColumns = [
  {
    title: "Regions",
    links: ["All Europe tours", "All Africa tours", "All Asia tours", "All Oceania tours", "Private custom tours"],
  },
  {
    title: "Europe",
    links: ["Italy", "Greece", "United Kingdom", "Ireland", "Spain", "France", "Portugal"],
  },
  {
    title: "The Americas",
    links: ["United States", "Canada", "Costa Rica", "Ecuador", "Peru", "Brazil", "Chile"],
  },
  {
    title: "Africa",
    links: ["Egypt", "Kenya", "South Africa", "Morocco", "Ghana", "Botswana", "Tanzania"],
  },
  {
    title: "Asia & Oceania",
    links: ["Thailand", "Japan", "South Korea", "India", "Bhutan", "Australia", "New Zealand"],
  },
];

const publicTripsHref = "/login?callbackUrl=/trips";

export async function SiteHeader() {
  const session = await auth();
  const pathname = (await headers()).get("x-pathname") || "/";
  const isAdminArea = pathname.startsWith("/admin");
  const tripsHref = session?.user ? "/trips" : publicTripsHref;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/88 backdrop-blur-xl">
      <div className="border-b border-border/50 bg-cream/5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2 text-xs text-muted sm:justify-end sm:px-6">
          {isAdminArea ? (
            <Link href="/" className="hover:text-cream">
              View public site
            </Link>
          ) : (
            <Link href="/register" className="hover:text-cream">
              Plan a private trip
            </Link>
          )}
          {!session?.user && !isAdminArea && (
            <Link href="/login" className="hover:text-cream">
              Log in / Register
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto flex min-h-20 max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg border border-gold/40 bg-cream/10 font-display text-2xl text-gold">
            PR
          </span>
          <span className="leading-none">
            <span className="block font-display text-2xl text-cream">Prestige</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-gold">Routes</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-2 text-sm lg:justify-center">
          {isAdminArea ? (
            <>
              <Link href="/admin" className="rounded-lg px-3 py-2 text-cream transition hover:bg-cream/10">
                Dashboard
              </Link>
              <Link href="/admin/bookings" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Bookings
              </Link>
              <Link href="/admin/users" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Users
              </Link>
              <Link href="/admin/trips" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Trips
              </Link>
              <Link href="/admin/deals" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Deals
              </Link>
            </>
          ) : (
            <>
              <div className="group">
                <button className="rounded-lg px-3 py-2 text-cream transition hover:bg-cream/10" type="button">
                  Destinations
                </button>
                <div className="invisible absolute left-0 right-0 top-full border-t border-border bg-bg/98 opacity-0 shadow-2xl shadow-black/30 backdrop-blur-xl transition group-hover:visible group-hover:opacity-100">
                  <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-5">
                    {destinationColumns.map((column) => (
                      <div key={column.title}>
                        <p className="font-semibold text-cream">{column.title}</p>
                        <ul className="mt-5 space-y-4">
                          {column.links.map((label) => (
                            <li key={label}>
                              <Link href={tripsHref} className="text-muted transition hover:text-gold">
                                {label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mx-auto flex max-w-6xl justify-center border-t border-border px-4 py-5 sm:px-6">
                    <Link href={tripsHref} className="btn-primary">
                      See all trips
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/register" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Private planning
              </Link>
              <Link href="/#travel-deals" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Travel deals
              </Link>
              <Link href="/" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                About us
              </Link>
            </>
          )}
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {!isAdminArea && (
            <form action={tripsHref} className="flex min-w-[220px] items-center rounded-lg border border-border bg-cream/5 px-4 py-2">
              <input
                name="q"
                className="min-w-0 flex-1 bg-transparent text-sm text-cream outline-none placeholder:text-muted"
                placeholder="Where to?"
              />
              <button className="ml-2 text-sm font-medium text-gold" type="submit">
                Search
              </button>
            </form>
          )}

          {session?.user ? (
            <div className="flex flex-wrap items-center gap-2">
              {!isAdminArea && (
                <Link href="/account/bookings" className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-cream">
                  My bookings
                </Link>
              )}
              {session.user.role === "ADMIN" && !isAdminArea && (
                <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-gold transition hover:text-cream">
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button type="submit" className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-cream">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="btn-outline text-xs sm:text-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
