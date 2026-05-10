import Image from "next/image";
import LinkNext from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.role === "USER") {
    redirect("/trips");
  }

  const now = new Date();
  const [slides, featured, galleryPhotos, travelDeals] = await Promise.all([
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
    prisma.travelDeal.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
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

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 pb-28 pt-16 sm:px-6 sm:pb-36">
          <div className="flex flex-1 flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">Prestige Routes</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              Private travel, polished routes, and memorable places without the planning drag.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Book a curated departure or let Prestige Routes build a personal itinerary around your
              dates, interests, reservations, tickets, payments, and transfers.
            </p>
          </div>

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

      <section id="destinations" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-20 sm:px-6">
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

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {galleryPhotos.length === 0 ? (
            <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-cream/5 md:col-span-3">
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
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-cream/5 shadow-lg shadow-black/10"
              >
                <Image
                  src={photo.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  priority={index < 3}
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

      <section id="travel-deals" className="mx-auto max-w-6xl scroll-mt-32 px-4 py-20 sm:px-6">
        <div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Travel deals</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">Featured trips and offers</h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {travelDeals.map((deal, index) => (
              <article
                key={deal.id}
                className="group overflow-hidden rounded-lg border border-border bg-cream/5 transition hover:-translate-y-0.5 hover:border-gold/50 hover:bg-cream/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
                  <Image
                    src={deal.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl text-cream">{deal.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{deal.description}</p>
                  {deal.ctaText && deal.ctaHref && (
                    <LinkNext href={deal.ctaHref} className="mt-5 inline-flex text-sm font-medium text-gold hover:text-cream">
                      {deal.ctaText}
                    </LinkNext>
                  )}
                </div>
              </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Bookable journeys</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">Signature journeys</h2>
            <p className="mt-2 max-w-2xl text-muted">
              Carefully arranged travel experiences for guests who want clear planning, reliable
              coordination, and memorable destinations handled with care. Choose an available
              departure or ask our team to design a private route around your dates, group, and
              preferred places.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {featured.length === 0 ? (
            <div className="rounded-lg border border-border bg-cream/5 p-8 text-muted sm:col-span-2 xl:col-span-4">
              <h3 className="font-display text-2xl text-cream">Private planning is open.</h3>
              <p className="mt-3 max-w-2xl leading-7">
                Public departures are being selected with care. In the meantime, Prestige Routes can
                arrange a private itinerary with reservations, transfers, activities, and travel
                timing shaped around your plans.
              </p>
            </div>
          ) : (
            featured.map((trip, i) => <TripCard key={trip.id} trip={trip} priority={i < 2} />)
          )}
        </div>
      </section>

      <section id="about-us" className="scroll-mt-32 border-y border-border bg-bg-elevated/45 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">About Prestige Routes</p>
            <h2 className="mt-3 font-display text-3xl text-cream sm:text-4xl">
              Best tours, private routes, and trusted travel planning.
            </h2>
            <p className="mt-4 text-muted">
              Prestige Routes helps travelers book memorable tours and private trips with the
              important details handled clearly: destination planning, reservations, transfers,
              payments, timing, and support before travel.
            </p>
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
