import { LoginForm } from "./ui";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl text-cream">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to book trips and view confirmations.</p>
      {sp.registered === "1" && (
        <p className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-cream">
          Account created. You can sign in now.
        </p>
      )}
      <LoginForm callbackUrl={sp.callbackUrl ?? "/"} />
    </div>
  );
}
