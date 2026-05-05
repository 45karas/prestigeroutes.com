"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uniqueTripSlug } from "@/lib/slug";

const tripSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(20000),
  destination: z.string().min(1).max(200),
  imageUrl: z.string().url(),
  startDate: z.string(),
  endDate: z.string(),
  priceUsd: z.coerce.number().positive().max(1_000_000),
  spotsTotal: z.coerce.number().int().min(1).max(500),
  featuredOrder: z.coerce.number().int().min(0).max(1000).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createTrip(formData: FormData): Promise<void> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const featured = formData.has("featured");
  const published = formData.has("published");
  const parsed = tripSchema.safeParse(raw);
  if (!parsed.success) {
    redirect("/admin/trips/new?error=" + encodeURIComponent("Check all fields are valid."));
  }
  const d = parsed.data;
  const start = new Date(d.startDate);
  const end = new Date(d.endDate);
  if (end <= start) {
    redirect("/admin/trips/new?error=" + encodeURIComponent("End date must be after start date."));
  }
  const priceCents = Math.round(d.priceUsd * 100);
  if (priceCents < 100) {
    redirect("/admin/trips/new?error=" + encodeURIComponent("Price must be at least $1."));
  }
  const slug = await uniqueTripSlug(d.title);
  await prisma.trip.create({
    data: {
      title: d.title.trim(),
      slug,
      description: d.description.trim(),
      destination: d.destination.trim(),
      imageUrl: d.imageUrl.trim(),
      startDate: start,
      endDate: end,
      priceCents,
      spotsTotal: d.spotsTotal,
      featured,
      featuredOrder: d.featuredOrder ?? 0,
      published,
    },
  });
  revalidatePath("/");
  revalidatePath("/trips");
  revalidatePath("/admin/trips");
  redirect("/admin/trips");
}

export async function updateTrip(tripId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const featured = formData.has("featured");
  const published = formData.has("published");
  const parsed = tripSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(`/admin/trips/${tripId}/edit?error=` + encodeURIComponent("Check all fields are valid."));
  }
  const existing = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!existing) {
    redirect("/admin/trips?error=" + encodeURIComponent("Trip not found."));
  }
  const d = parsed.data;
  const start = new Date(d.startDate);
  const end = new Date(d.endDate);
  if (end <= start) {
    redirect(`/admin/trips/${tripId}/edit?error=` + encodeURIComponent("End date must be after start date."));
  }
  const priceCents = Math.round(d.priceUsd * 100);
  if (priceCents < 100) {
    redirect(`/admin/trips/${tripId}/edit?error=` + encodeURIComponent("Price must be at least $1."));
  }
  const minSpots = existing.spotsBooked;
  if (d.spotsTotal < minSpots) {
    redirect(
      `/admin/trips/${tripId}/edit?error=` +
        encodeURIComponent(`Spots total cannot be less than already booked (${minSpots}).`),
    );
  }
  const newSlug =
    d.title.trim() !== existing.title
      ? await uniqueTripSlug(d.title, tripId)
      : existing.slug;

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      title: d.title.trim(),
      slug: newSlug,
      description: d.description.trim(),
      destination: d.destination.trim(),
      imageUrl: d.imageUrl.trim(),
      startDate: start,
      endDate: end,
      priceCents,
      spotsTotal: d.spotsTotal,
      featured,
      featuredOrder: d.featuredOrder ?? 0,
      published,
    },
  });
  revalidatePath("/");
  revalidatePath("/trips");
  revalidatePath(`/trips/${newSlug}`);
  revalidatePath("/admin/trips");
  redirect("/admin/trips");
}

export async function deleteTrip(tripId: string): Promise<void> {
  await requireAdmin();
  await prisma.booking.deleteMany({ where: { tripId } });
  await prisma.trip.delete({ where: { id: tripId } });
  revalidatePath("/");
  revalidatePath("/trips");
  revalidatePath("/admin/trips");
  redirect("/admin/trips");
}
