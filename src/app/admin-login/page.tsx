import { LoginForm } from "@/app/login/ui";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Admin</p>
      <h1 className="mt-3 font-display text-4xl text-cream">Admin sign in</h1>
      <p className="mt-2 text-muted">Use an admin account to manage trips, gallery photos, and homepage slides.</p>
      <LoginForm callbackUrl={sp.callbackUrl ?? "/admin"} mode="admin" />
    </div>
  );
}
