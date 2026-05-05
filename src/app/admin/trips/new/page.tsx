import { AdminTripForm } from "@/components/admin-trip-form";

export const metadata = { title: "New trip" };

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="font-display text-3xl text-cream">New trip</h1>
      <p className="mt-2 text-muted">Details appear on the public site once published.</p>
      {sp.error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminTripForm />
      </div>
    </div>
  );
}
