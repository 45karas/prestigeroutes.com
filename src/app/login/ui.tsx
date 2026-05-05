"use client";

import { getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  callbackUrl,
  mode = "customer",
}: {
  callbackUrl: string;
  mode?: "customer" | "admin";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    if (res?.error) {
      setLoading(false);
      setError("Invalid email or password.");
      return;
    }

    const session = await getSession();
    const isAdmin = session?.user?.role === "ADMIN";
    if (mode === "admin" && !isAdmin) {
      await signOut({ redirect: false });
      setLoading(false);
      setError("This login is for admins only.");
      return;
    }
    if (mode === "customer" && isAdmin) {
      await signOut({ redirect: false });
      setLoading(false);
      setError("Use the admin login for this account.");
      return;
    }

    setLoading(false);
    router.push(callbackUrl.startsWith("/") ? callbackUrl : mode === "admin" ? "/admin" : "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-400/90">{error}</p>}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Signing in..." : mode === "admin" ? "Sign in to admin" : "Sign in"}
      </button>
      {mode === "customer" ? (
        <p className="text-center text-sm text-muted">
          No account?{" "}
          <Link href="/register" className="text-gold hover:underline">
            Create one
          </Link>
        </p>
      ) : (
        <p className="text-center text-sm text-muted">
          Customer account?{" "}
          <Link href="/login" className="text-gold hover:underline">
            Use customer login
          </Link>
        </p>
      )}
    </form>
  );
}
