import { notFound } from "next/navigation";
import { AdminGalleryPhotoForm } from "@/components/admin-gallery-photo-form";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  return { title: photo ? "Edit gallery photo" : "Edit gallery photo" };
}

export default async function EditGalleryPhotoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!photo) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Edit gallery photo</h1>
      <p className="mt-2 text-muted">Replace the image or adjust its order and visibility.</p>
      {sp.error && (
        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminGalleryPhotoForm photo={photo} />
      </div>
    </div>
  );
}
