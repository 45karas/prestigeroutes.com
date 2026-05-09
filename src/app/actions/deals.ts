"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const dealSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(700),
  imageUrl: z.string().url(),
  ctaText: z.string().max(50).optional(),
  ctaHref: z.string().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).max(1000).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createDeal(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = dealSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect("/admin/deals/new?error=" + encodeURIComponent("Check all fields are valid."));
  }

  const d = parsed.data;
  await prisma.travelDeal.create({
    data: {
      title: d.title.trim(),
      description: d.description.trim(),
      imageUrl: d.imageUrl.trim(),
      ctaText: d.ctaText?.trim() || null,
      ctaHref: d.ctaHref?.trim() || null,
      sortOrder: d.sortOrder ?? 0,
      published: formData.has("published"),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}

export async function updateDeal(dealId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = dealSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(`/admin/deals/${dealId}/edit?error=` + encodeURIComponent("Check all fields are valid."));
  }

  const d = parsed.data;
  await prisma.travelDeal.update({
    where: { id: dealId },
    data: {
      title: d.title.trim(),
      description: d.description.trim(),
      imageUrl: d.imageUrl.trim(),
      ctaText: d.ctaText?.trim() || null,
      ctaHref: d.ctaHref?.trim() || null,
      sortOrder: d.sortOrder ?? 0,
      published: formData.has("published"),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}

export async function deleteDeal(dealId: string): Promise<void> {
  await requireAdmin();
  await prisma.travelDeal.delete({ where: { id: dealId } });
  revalidatePath("/");
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}
