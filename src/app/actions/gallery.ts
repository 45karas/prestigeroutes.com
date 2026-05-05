"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const galleryPhotoSchema = z.object({
  sortOrder: z.coerce.number().int().min(0).max(1000).optional(),
});

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

async function saveGalleryUpload(file: File | null, required: boolean) {
  if (!file || file.size === 0) {
    if (required) redirect("/admin/gallery/new?error=" + encodeURIComponent("Choose a photo to upload."));
    return null;
  }
  const extension = allowedImageTypes.get(file.type);
  if (!extension) {
    redirect("/admin/gallery/new?error=" + encodeURIComponent("Upload a JPG, PNG, WEBP, or GIF image."));
  }
  if (file.size > 8 * 1024 * 1024) {
    redirect("/admin/gallery/new?error=" + encodeURIComponent("Photo must be 8 MB or smaller."));
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  await mkdir(uploadDir, { recursive: true });
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const filename = `${Date.now()}-${safeName || "gallery-photo"}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return {
    imageUrl: `/uploads/gallery/${filename}`,
    title: safeName ? safeName.replace(/-/g, " ") : "Gallery photo",
  };
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createGalleryPhoto(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = galleryPhotoSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect("/admin/gallery/new?error=" + encodeURIComponent("Check all fields are valid."));
  }
  const upload = await saveGalleryUpload(formData.get("imageFile") as File | null, true);
  const photo = parsed.data;
  await prisma.galleryPhoto.create({
    data: {
      title: upload!.title,
      location: null,
      imageUrl: upload!.imageUrl,
      sortOrder: photo.sortOrder ?? 0,
      published: formData.has("published"),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function updateGalleryPhoto(photoId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = galleryPhotoSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    redirect(`/admin/gallery/${photoId}/edit?error=` + encodeURIComponent("Check all fields are valid."));
  }
  const photo = parsed.data;
  const upload = await saveGalleryUpload(formData.get("imageFile") as File | null, false);
  await prisma.galleryPhoto.update({
    where: { id: photoId },
    data: {
      ...(upload ? { title: upload.title, imageUrl: upload.imageUrl } : {}),
      location: null,
      sortOrder: photo.sortOrder ?? 0,
      published: formData.has("published"),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryPhoto(photoId: string): Promise<void> {
  await requireAdmin();
  await prisma.galleryPhoto.delete({ where: { id: photoId } });
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}
