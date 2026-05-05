import { prisma } from "@/lib/prisma";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function uniqueTripSlug(base: string, excludeId?: string): Promise<string> {
  const slug = slugify(base) || "trip";
  let candidate = slug;
  let n = 0;
  while (true) {
    const existing = await prisma.trip.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    n += 1;
    candidate = `${slug}-${n}`;
  }
}
