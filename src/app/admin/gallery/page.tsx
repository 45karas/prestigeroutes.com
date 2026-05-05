import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Homepage gallery" };

export default async function AdminGalleryPage() {
  const photos = await prisma.galleryPhoto.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Homepage gallery</p>
          <h1 className="mt-3 font-display text-4xl text-cream">Gallery photos</h1>
          <p className="mt-2 text-muted">Add the destination photos featured on the main page.</p>
        </div>
        <Link href="/admin/gallery/new" className="btn-primary self-start sm:self-auto">
          Add photo
        </Link>
      </div>

      <div className="mt-10 grid gap-4">
        {photos.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface/35 px-4 py-10 text-center text-muted">
            No gallery photos yet. Add your first one.
          </p>
        ) : (
          photos.map((photo) => (
            <article
              key={photo.id}
              className="grid gap-4 rounded-lg border border-border bg-surface/35 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-bg-elevated">
                <Image src={photo.imageUrl} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium text-cream">Gallery photo</h2>
                  <span
                    className={[
                      "rounded-lg px-2.5 py-1 text-xs font-medium",
                      photo.published ? "bg-accent/15 text-accent" : "bg-bg/70 text-muted",
                    ].join(" ")}
                  >
                    {photo.published ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="mt-2 break-all text-xs text-muted">{photo.imageUrl}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted">Order {photo.sortOrder}</p>
              </div>
              <Link href={`/admin/gallery/${photo.id}/edit`} className="btn-outline justify-self-start sm:justify-self-end">
                Edit
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
