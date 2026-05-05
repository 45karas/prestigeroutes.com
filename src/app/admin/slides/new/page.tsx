import { AdminSlideForm } from "@/components/admin-slide-form";

export const metadata = { title: "New slide" };

export default async function NewSlidePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="font-display text-3xl text-cream">New slide</h1>
      <p className="mt-2 text-muted">This will animate on the homepage.</p>
      {sp.error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminSlideForm />
      </div>
    </div>
  );
}

