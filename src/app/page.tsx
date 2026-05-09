import Image from "next/image";
import LinkNext from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { TripCard } from "@/components/trip-card";
import { prisma } from "@/lib/prisma";

const planningSteps = [
  {
    title: "Shape the route",
    body: "Share the cities, landmarks, events, restaurants, or quiet corners you want included.",
  },
  {
    title: "Confirm the details",
    body: "We coordinate routing, stays, tickets, payments, reservations, transfers, and timing.",
  },
  {
    title: "Move with support",
    body: "Arrive with the plan settled and a real team ready when travel needs attention.",
  },
];

const travelStyles = [
  "Private escapes",
  "Culture-first routes",
  "Family visits",
  "Group departures",
  "Event travel",
  "Milestone trips",
];

const trustStats = [
  { value: "24/7", label: "Trip support" },
  { value: "4", label: "Featured departures" },
  { value: "End-to-end", label: "Planning service" },
];

function galleryGridClass(count: number) {
  if (count <= 1) return "mt-12 grid gap-5";
  if (count === 2) return "mt-12 grid gap-5 md:grid-cols-2";
  if (count === 3) return "mt-12 grid gap-5 md:grid-cols-3";
  return "mt-12 grid auto-rows-[220px] gap-5 md:grid-cols-6 lg:grid-cols-12";
}

function galleryItemClass(index: number, count: number) {
  const base = "group relative overflow-hidden rounded-lg border border-border bg-cream/5 shadow-lg shadow-black/10";
  if (count <= 1) return `${base} min-h-[320px] md:min-h-[520px]`;
  if (count <= 3) return `${base} min-h-[280px] md:min-h-[420px]`;
  if (index === 0) return `${base} md:col-span-4 md:row-span-2 lg:col-span-5`;
  if (index === 1) return `${base} md:col-span-2 lg:col-span-4`;
  if (index === 2) return `${base} md:col-span-2 lg:col-span-3`;
  if (index === 3) return `${base} md:col-span-3 lg:col-span-4`;
  if (index === 4) return `${base} md:col-span-3 lg:col-span-4`;
  return `${base} md:col-span-2 lg:col-span-4`;
}

function galleryImageSizes(index: number, count: number) {
  if (count <= 1) return "100vw";
  if (count <= 3) return "(max-width: 768px) 100vw, 33vw";
  if (index === 0) return "(max-width: 768px) 100vw, 42vw";
  return "(max-width: 768px) 100vw, 28vw";
}

export default async function HomePage() {
  const now = new Date();
  const [slides, featured, galleryPhotos] = await Promise.all([
    prisma.heroSlide.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.trip.findMany({
      where: { published: true, featured: true, startDate: { gte: now } },
      orderBy: [{ featuredOrder: "asc" }, { startDate: "asc" }],
      take: 4,
    }),
    prisma.galleryPhoto.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 9,
    }),
  ]);

  return (
    <>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <HeroCarousel
          slides={slides.map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            imageUrl: s.imageUrl,
            ctaText: s.ctaText,
            ctaHref: s.ctaHref,
          }))}
        />
        {slides.length === 0 && (
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80"
              alt=""
              fill
              className="object-cover opacity-45"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/75 to-bg/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
          </div>
        )}

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 pb-28 pt-16 sm:px-6 sm:pb-36">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">Prestige Routes</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
            Private travel, polished routes, and memorable places without the planning drag.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Book a curated departure or let Prestige Routes build a personal itinerary around your
            dates, interests, reservations, tickets, payments, and transfers.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <LinkNext href="/login?callbackUrl=/trips" className="btn-primary">
              Explore signature trips
            </LinkNext>
            <LinkNext href="/register" className="btn-ghost">
              Start private planning
            </LinkNext>
          </div>

          <dl className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {trustStats.map((stat) => (
              <div key={stat.label} className="border-l border-cream/25 pl-4">
                <dt className="font-display text-2xl text-cream">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>

          {featured.length > 0 && (
            <div className="mt-8 max-w-4xl rounded-lg border border-border bg-bg/60 px-4 py-4 backdrop-blur">
              <p className="text-sm font-medium text-cream">
                {featured.length} featured {featured.length === 1 ? "trip" : "trips"} open now
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((trip) => (
                  <LinkNext
                    key={trip.id}
                    href={`/trips/${trip.slug}`}
                    className="rounded-lg border border-border/70 bg-cream/5 px-3 py-3 text-sm transition hover:border-gold hover:bg-cream/10"
                  >
                    <span className="block font-medium text-cream">{trip.title}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {trip.startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: now.getFullYear() === trip.startDate.getFullYear() ? undefined : "numeric",
                      })}
                    </span>
                  </LinkNext>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-border bg-bg-elevated/45 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-muted">
            Full-service tourism for travelers who want the experience handled properly:
            reservations, entry tickets, payments, transfers, and hosted planning.
          </p>
          <div className="flex flex-wrap gap-2">
            {travelStyles.map((style) => (
              <span key={style} className="rounded-lg border border-border bg-cream/5 px-3 py-2 text-xs text-cream">
                {style}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Start with inspiration</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
              A modern travel desk built around real places.
            </h2>
            <p className="mt-3 text-muted">
              Destination photography, clear booking paths, and account access give visitors an
              immediate sense of where Prestige Routes can take them.
            </p>
          </div>
          <p className="text-base leading-8 text-muted">
            The gallery gives the brand more texture without burying the calls to action. Trips,
            private planning, and account sign-in stay close at hand across the page.
          </p>
        </div>

        <div className={galleryGridClass(galleryPhotos.length)}>
          {galleryPhotos.length === 0 ? (
            <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-cream/5">
              <Image
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
            </div>
          ) : (
            galleryPhotos.map((photo, index) => (
              <figure
                key={photo.id}
                className={galleryItemClass(index, galleryPhotos.length)}
              >
                <Image
                  src={photo.imageUrl}
                  alt=""
                  fill
                  sizes={galleryImageSizes(index, galleryPhotos.length)}
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/45 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              </figure>
            ))
          )}
        </div>
      </section>

      <section className="border-y border-border bg-bg-elevated/45 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Personal travel service</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
              Your own route, professionally arranged.
            </h2>
            <p className="mt-4 text-muted">
              For travelers who already know where they want to go, Prestige Routes can plan around
              specific places of interest and manage the details from end to end.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {planningSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-border bg-cream/5 p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-gold">
                  Step {index + 1}
                </span>
                <h3 className="mt-3 font-display text-xl text-cream">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Bookable journeys</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">Signature trips</h2>
            <p className="mt-2 max-w-xl text-muted">
              Curated journeys available on the main page. Sign in to browse every departure,
              reserve seats, and manage confirmations from your account.
            </p>
          </div>
          <LinkNext href="/login?callbackUrl=/trips" className="btn-outline self-start sm:self-auto">
            See more after sign in
          </LinkNext>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {featured.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface/40 p-8 text-muted sm:col-span-2 xl:col-span-4">
              Signature trips are being prepared.
            </div>
          ) : (
            featured.map((trip, i) => <TripCard key={trip.id} trip={trip} priority={i < 2} />)
          )}
        </div>
      </section>

      <section className="border-y border-border bg-bg-elevated/45 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Why travelers book</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
              Planned for the parts of travel that usually get complicated.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Personal planning",
                body: "Routes can be built around your preferred places, travel dates, interests, and pace.",
              },
              {
                title: "Handled logistics",
                body: "Ticketing, payments, reservations, transfers, and timing are coordinated before you go.",
              },
              {
                title: "Account access",
                body: "Sign in to view departures, book trips, and track confirmations.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-cream/5 p-5">
                <h3 className="font-display text-xl text-gold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
