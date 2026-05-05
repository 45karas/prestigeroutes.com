import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-elevated/55">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg text-gradient">Prestige Routes</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Curated journeys for discerning travelers. Small groups, exceptional stays, and seamless
            booking at prestigeroutes.com.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div>
            <p className="font-medium text-cream">Explore</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li>
                <Link href="/trips" className="hover:text-gold">
                  Upcoming trips
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-gold">
                  Join
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-cream">Service</p>
            <p className="mt-3 text-muted">Private trips and curated departures</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted">
        Copyright {new Date().getFullYear()} Prestige Routes. All rights reserved.
      </div>
    </footer>
  );
}
