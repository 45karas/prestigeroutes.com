import { AdminGalleryPhotoForm } from "@/components/admin-gallery-photo-form";

export const metadata = { title: "New gallery photo" };

export default async function NewGalleryPhotoPage({
  searchParams,
}: {
      searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="font-display text-3xl text-cream">New gallery photo</h1>
      <p className="mt-2 text-muted">Upload a photo from your computer for the homepage gallery.</p>
      {sp.error && (
        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminGalleryPhotoForm />
      </div>
    </div>
  );
}
