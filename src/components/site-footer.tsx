import Link from "next/link";

const supportEmail = "prestigeroutes@chrietzbergphoto.com";
const supportHref = `mailto:${supportEmail}?subject=${encodeURIComponent(
  "Prestige Routes inquiry",
)}&body=${encodeURIComponent("Hello Prestige Routes,\n\nI would like help with ")}`;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg-elevated/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-lg text-gradient">Prestige Routes</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Curated journeys, private planning, secure booking, and practical support for travelers
            who want the route handled well.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium text-cream">Explore</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              <Link href="/trips" className="hover:text-gold">
                Upcoming trips
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-gold">
                Private planning
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium text-cream">Service</p>
          <p className="mt-3 text-muted">Custom routes, curated departures, reservations, transfers, and checkout.</p>
          <a className="mt-3 block text-gold hover:text-cream" href={supportHref}>
            {supportEmail}
          </a>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted">
        Copyright {new Date().getFullYear()} Prestige Routes. All rights reserved.
      </div>
    </footer>
  );
}
