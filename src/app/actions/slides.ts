"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const slideSchema = z.object({
  title: z.string().min(2).max(120),
  subtitle: z.string().max(240).optional(),
  imageUrl: z.string().url(),
  ctaText: z.string().max(50).optional(),
  ctaHref: z.string().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).max(1000).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createSlide(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = slideSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect("/admin/slides/new?error=" + encodeURIComponent("Check all fields are valid."));
  }
  const d = parsed.data;
  await prisma.heroSlide.create({
    data: {
      title: d.title.trim(),
      subtitle: d.subtitle?.trim() || null,
      imageUrl: d.imageUrl.trim(),
      ctaText: d.ctaText?.trim() || null,
      ctaHref: d.ctaHref?.trim() || null,
      sortOrder: d.sortOrder ?? 0,
      published: formData.has("published"),
    },
  });
  redirect("/admin/slides");
}

export async function updateSlide(slideId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = slideSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(`/admin/slides/${slideId}/edit?error=` + encodeURIComponent("Check all fields are valid."));
  }
  const d = parsed.data;
  await prisma.heroSlide.update({
    where: { id: slideId },
    data: {
      title: d.title.trim(),
      subtitle: d.subtitle?.trim() || null,
      imageUrl: d.imageUrl.trim(),
      ctaText: d.ctaText?.trim() || null,
      ctaHref: d.ctaHref?.trim() || null,
      sortOrder: d.sortOrder ?? 0,
      published: formData.has("published"),
    },
  });
  redirect("/admin/slides");
}

export async function deleteSlide(slideId: string): Promise<void> {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id: slideId } });
  redirect("/admin/slides");
}

