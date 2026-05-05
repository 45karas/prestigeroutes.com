import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("PrestigeAdmin2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@prestigeroutes.com" },
    update: {},
    create: {
      email: "admin@prestigeroutes.com",
      passwordHash,
      name: "Prestige Admin",
      role: "ADMIN",
    },
  });

  const trips = [
    {
      title: "Amalfi Coast & Capri",
      slug: "amalfi-coast-capri",
      destination: "Italy",
      description:
        "Wind along cliffside roads, sip limoncello in Positano, and cruise to Capri's Blue Grotto. Small groups, hand-picked hotels, and sunset dinners overlooking the Tyrrhenian Sea.",
      imageUrl:
        "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1600&q=80",
      startDate: new Date("2026-06-12"),
      endDate: new Date("2026-06-19"),
      priceCents: 429900,
      spotsTotal: 16,
      featured: true,
      featuredOrder: 1,
    },
    {
      title: "Kyoto Temples & Kaiseki",
      slug: "kyoto-temples-kaiseki",
      destination: "Japan",
      description:
        "Private tea ceremonies, bamboo groves at dawn, and multi-course kaiseki in ryokan inns. Includes bullet train from Tokyo and expert cultural guides.",
      imageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
      startDate: new Date("2026-09-03"),
      endDate: new Date("2026-09-11"),
      priceCents: 589900,
      spotsTotal: 12,
      featured: true,
      featuredOrder: 3,
    },
    {
      title: "Patagonia Peaks & Glaciers",
      slug: "patagonia-peaks-glaciers",
      destination: "Chile & Argentina",
      description:
        "Trek Torres del Paine, cruise to Perito Moreno, and stay in eco-lodges with panoramic Andean views. Moderate fitness; all transfers included.",
      imageUrl:
        "https://images.unsplash.com/photo-1518182170307-2e1b7d27d3e5?auto=format&fit=crop&w=1600&q=80",
      startDate: new Date("2026-11-08"),
      endDate: new Date("2026-11-18"),
      priceCents: 649900,
      spotsTotal: 14,
      featured: true,
      featuredOrder: 4,
    },
    {
      title: "Santorini & Aegean Sailing",
      slug: "santorini-aegean-sailing",
      destination: "Greece",
      description:
        "Whitewashed villages, caldera sunsets, and a private catamaran day with chef-prepared mezze. Boutique cave hotels in Oia and Fira.",
      imageUrl:
        "https://images.unsplash.com/photo-1613395877344-13d4c79e4d1f?auto=format&fit=crop&w=1600&q=80",
      startDate: new Date("2026-07-22"),
      endDate: new Date("2026-07-29"),
      priceCents: 379900,
      spotsTotal: 18,
      featured: true,
      featuredOrder: 2,
    },
  ];

  for (const trip of trips) {
    await prisma.trip.upsert({
      where: { slug: trip.slug },
      update: { ...trip, published: true },
      create: { ...trip, published: true, spotsBooked: 0 },
    });
  }

  const slides = [
    {
      sortOrder: 0,
      title: "Luxury departures, limited seats",
      subtitle: "Secure booking in minutes - curated routes - small groups",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
      ctaText: "View upcoming trips",
      ctaHref: "/trips",
      published: true,
    },
    {
      sortOrder: 1,
      title: "Your next story starts here",
      subtitle: "Hand-picked hotels, expert guides, seamless planning",
      imageUrl:
        "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80",
      ctaText: "Create account",
      ctaHref: "/register",
      published: true,
    },
    {
      sortOrder: 2,
      title: "Prestige Routes",
      subtitle: "Travel elevated - itineraries built for comfort and discovery",
      imageUrl:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80",
      ctaText: "Explore trips",
      ctaHref: "/trips",
      published: true,
    },
  ];

  for (const slide of slides) {
    await prisma.heroSlide.upsert({
      where: { imageUrl: slide.imageUrl },
      update: slide,
      create: slide,
    });
  }

  const galleryPhotos = [
    {
      title: "Cliffside arrival",
      location: "Amalfi Coast, Italy",
      imageUrl:
        "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 1,
      published: true,
    },
    {
      title: "Temple mornings",
      location: "Kyoto, Japan",
      imageUrl:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 2,
      published: true,
    },
    {
      title: "Caldera light",
      location: "Santorini, Greece",
      imageUrl:
        "https://images.unsplash.com/photo-1613395877344-13d4c79e4d1f?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 3,
      published: true,
    },
    {
      title: "Glacier country",
      location: "Patagonia",
      imageUrl:
        "https://images.unsplash.com/photo-1518182170307-2e1b7d27d3e5?auto=format&fit=crop&w=1400&q=80",
      sortOrder: 4,
      published: true,
    },
  ];

  for (const photo of galleryPhotos) {
    await prisma.galleryPhoto.upsert({
      where: { imageUrl: photo.imageUrl },
      update: photo,
      create: photo,
    });
  }

  console.log("Seed complete.");
  console.log("Admin login:", admin.email, "/ PrestigeAdmin2026!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
