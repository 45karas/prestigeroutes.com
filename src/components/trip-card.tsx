import Image from "next/image";
import Link from "next/link";
import { formatUsd } from "@/lib/money";

export type TripCardTrip = {
  id: string;
  title: string;
  slug: string;
  destination: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
  priceCents: number;
  spotsTotal: number;
  spotsBooked: number;
};

function formatRange(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
}

export function TripCard({ trip, priority }: { trip: TripCardTrip; priority?: boolean }) {
  const left = trip.spotsTotal - trip.spotsBooked;
  const soldOut = left <= 0;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface/50 transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-xl hover:shadow-black/20">
      <Link href={`/trips/${trip.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
          <Image
            src={trip.imageUrl}
            alt={trip.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-90" />
          <span className="absolute left-4 top-4 rounded-lg bg-bg/85 px-3 py-1 text-xs font-medium text-gold backdrop-blur">
            {trip.destination}
          </span>
          {soldOut && (
            <span className="absolute right-4 top-4 rounded-lg bg-cream px-3 py-1 text-xs font-semibold text-bg">
              Sold out
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl leading-snug text-cream group-hover:text-gold">
            {trip.title}
          </h3>
          <p className="mt-2 text-sm text-muted">{formatRange(trip.startDate, trip.endDate)}</p>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border/60 pt-4">
            <span className="text-lg font-semibold text-cream">{formatUsd(trip.priceCents)}</span>
            <span className="text-right text-xs text-muted">
              {left <= 3 && left > 0 ? (
                <span className="font-medium text-accent">Only {left} left</span>
              ) : soldOut ? (
                <span className="text-red-300/90">Waitlist only</span>
              ) : (
                `${left} spots`
              )}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
