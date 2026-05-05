import Link from "next/link";
import type { GalleryPhoto } from "@prisma/client";
import { createGalleryPhoto, deleteGalleryPhoto, updateGalleryPhoto } from "@/app/actions/gallery";

export function AdminGalleryPhotoForm({ photo }: { photo?: GalleryPhoto }) {
  const editing = Boolean(photo);

  return (
    <div className="max-w-2xl">
      <form action={editing ? updateGalleryPhoto.bind(null, photo!.id) : createGalleryPhoto} className="space-y-6">
        <div>
          <label className="label" htmlFor="imageFile">
            Photo from your computer
          </label>
          <input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required={!editing}
            className="input"
          />
          <p className="mt-2 text-xs text-muted">
            Upload JPG, PNG, WEBP, or GIF. {editing ? "Choose a new file only if you want to replace the current photo." : "Maximum size: 8 MB."}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="sortOrder">
              Gallery order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={photo?.sortOrder ?? 0}
              className="input"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 self-end text-sm text-cream">
            <input
              type="checkbox"
              name="published"
              defaultChecked={photo?.published ?? true}
              className="size-4 rounded border-border accent-gold"
            />
            Published on homepage
          </label>
        </div>
        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary">
            {editing ? "Save photo" : "Add photo"}
          </button>
          <Link href="/admin/gallery" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      {photo && (
        <form action={deleteGalleryPhoto.bind(null, photo.id)} className="mt-12 border-t border-border pt-10">
          <p className="text-sm text-muted">Delete this gallery photo.</p>
          <button
            type="submit"
            className="mt-3 rounded-lg border border-red-500/40 px-5 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Delete photo
          </button>
        </form>
      )}
    </div>
  );
}
