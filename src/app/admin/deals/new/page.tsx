import { AdminDealForm } from "@/components/admin-deal-form";

export const metadata = { title: "New travel deal" };

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div>
      <h1 className="font-display text-3xl text-cream">New travel deal</h1>
      <p className="mt-2 text-muted">Create a public offer for the homepage Travel deals section.</p>
      {sp.error && (
        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminDealForm />
      </div>
    </div>
  );
}
