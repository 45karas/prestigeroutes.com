import Image from "next/image";
import { notFound } from "next/navigation";
import { BookTripButton } from "@/components/book-trip-button";
import { formatUsd } from "@/lib/money";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const trip = await prisma.trip.findFirst({ where: { slug, published: true } });
  if (!trip) return { title: "Trip" };
  return {
    title: trip.title,
    description: trip.description.slice(0, 160),
  };
}

export default async function TripDetailPage({ params }: Props) {
  const { slug } = await params;
  const trip = await prisma.trip.findFirst({
    where: { slug, published: true },
  });
  if (!trip) notFound();

  const available = trip.spotsTotal - trip.spotsBooked;
  const started = trip.startDate < new Date();

  return (
    <article>
      <div className="relative h-[min(58vh,560px)] w-full">
        <Image src={trip.imageUrl} alt="" fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <span className="rounded-lg bg-bg/70 px-3 py-1 text-xs font-medium text-gold backdrop-blur">
            {trip.destination}
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl text-cream sm:text-5xl md:text-6xl">
            {trip.title}
          </h1>
          <p className="mt-3 text-muted">
            {trip.startDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {trip.endDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:grid-cols-[1fr_340px] sm:px-6 lg:gap-16">
        <div>
          <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted">{trip.description}</p>
          {started && (
            <p className="mt-8 rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm text-muted">
              This departure has already begun. Explore other dates on the trips page.
            </p>
          )}
        </div>
        <aside className="h-fit space-y-6 sm:sticky sm:top-24">
          <div className="rounded-lg border border-border glass p-6">
            <p className="text-sm text-muted">From</p>
            <p className="mt-1 font-display text-3xl text-cream">{formatUsd(trip.priceCents)}</p>
            <p className="mt-2 text-xs text-muted">per person - taxes included where applicable</p>
            <hr className="my-5 border-border/60" />
            <p className="text-sm text-muted">
              {available <= 0 ? "Sold out" : `${available} spot${available === 1 ? "" : "s"} remaining`}
            </p>
          </div>
          {!started && (
            <BookTripButton
              tripId={trip.id}
              slug={trip.slug}
              maxGuests={Math.max(0, available)}
              priceCents={trip.priceCents}
            />
          )}
        </aside>
      </div>
    </article>
  );
}
