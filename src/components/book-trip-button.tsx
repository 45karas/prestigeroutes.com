"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  tripId: string;
  slug: string;
  maxGuests: number;
  priceCents: number;
};

export function BookTripButton({ tripId, slug, maxGuests, priceCents }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (maxGuests <= 0) {
    return (
      <p className="rounded-xl border border-border bg-bg-elevated px-4 py-3 text-sm text-muted">
        This departure is fully booked. Join our list for future dates.
      </p>
    );
  }

  async function handlePay() {
    setError(null);
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/trips/${slug}`)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, guests }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Checkout failed.");
        return;
      }
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      setError("No checkout URL returned.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const total = ((priceCents * guests) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <p className="text-sm text-muted">Guests</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <select
          className="input max-w-[140px]"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          aria-label="Number of guests"
        >
          {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted">
          Total <span className="font-semibold text-cream">{total}</span>
        </span>
      </div>
      {error && <p className="mt-3 text-sm text-red-400/90">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="btn-primary mt-5 w-full disabled:opacity-60"
      >
        {loading ? "Redirecting…" : session ? "Pay securely with Stripe" : "Sign in to book"}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Secure payment · You will be redirected to Stripe Checkout
      </p>
    </div>
  );
}
