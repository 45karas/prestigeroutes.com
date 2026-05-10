import Link from "next/link";
import { headers } from "next/headers";
import { signOutAction } from "@/app/actions/auth";
import { auth } from "@/auth";

const supportEmail = "prestigeroutes@chrietzbergphoto.com";
const supportHref = `mailto:${supportEmail}?subject=${encodeURIComponent(
  "Private trip planning",
)}&body=${encodeURIComponent("Hello Prestige Routes,\n\nI would like help planning a private trip to ")}`;

export async function SiteHeader() {
  const session = await auth();
  const pathname = (await headers()).get("x-pathname") || "/";
  const isAdminArea = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/88 backdrop-blur-xl">
      <div className="border-b border-border/50 bg-cream/5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2 text-xs text-muted sm:justify-end sm:px-6">
          {isAdminArea ? (
            <Link href="/" className="hover:text-cream">
              View public site
            </Link>
          ) : (
            <a href={supportHref} className="hover:text-cream">
              Plan a private trip
            </a>
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
              <Link href="/#destinations" className="rounded-lg px-3 py-2 text-cream transition hover:bg-cream/10">
                Destinations
              </Link>
              <a href={supportHref} className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Private planning
              </a>
              <Link href="/#travel-deals" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                Travel deals
              </Link>
              <Link href="/#about-us" className="rounded-lg px-3 py-2 text-muted transition hover:bg-cream/10 hover:text-cream">
                About us
              </Link>
            </>
          )}
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
