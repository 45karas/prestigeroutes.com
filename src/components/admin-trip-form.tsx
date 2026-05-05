import Link from "next/link";
import { createTrip, deleteTrip, updateTrip } from "@/app/actions/trips";
import type { Trip } from "@prisma/client";

type Props = {
  trip?: Trip;
};

export function AdminTripForm({ trip }: Props) {
  const editing = Boolean(trip);
  const priceUsd = trip ? trip.priceCents / 100 : "";

  return (
    <div className="max-w-2xl">
      <form action={editing ? updateTrip.bind(null, trip!.id) : createTrip} className="space-y-6">
        <div>
          <label className="label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={trip?.title}
            className="input"
            placeholder="e.g. Amalfi Coast & Capri"
          />
        </div>
        <div>
          <label className="label" htmlFor="destination">
            Destination
          </label>
          <input
            id="destination"
            name="destination"
            required
            defaultValue={trip?.destination}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={8}
            defaultValue={trip?.description}
            className="input min-h-[180px] resize-y"
          />
        </div>
        <div>
          <label className="label" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            defaultValue={trip?.imageUrl}
            className="input"
            placeholder="https://images.unsplash.com/..."
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="startDate">
              Start date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              defaultValue={trip ? trip.startDate.toISOString().slice(0, 10) : ""}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="endDate">
              End date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              required
              defaultValue={trip ? trip.endDate.toISOString().slice(0, 10) : ""}
              className="input"
            />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="priceUsd">
              Price (USD per person)
            </label>
            <input
              id="priceUsd"
              name="priceUsd"
              type="number"
              min={1}
              step={0.01}
              required
              defaultValue={priceUsd === "" ? "" : priceUsd}
              className="input"
            />
          </div>
          <div>
            <label className="label" htmlFor="spotsTotal">
              Total spots
            </label>
            <input
              id="spotsTotal"
              name="spotsTotal"
              type="number"
              min={1}
              required
              defaultValue={trip?.spotsTotal}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="featuredOrder">
            Homepage order
          </label>
          <input
            id="featuredOrder"
            name="featuredOrder"
            type="number"
            min={0}
            defaultValue={trip?.featuredOrder ?? 0}
            className="input"
          />
          <p className="mt-2 text-xs text-muted">
            Featured trips appear on the homepage. Only the first 4 live upcoming trips are shown.
          </p>
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={trip?.featured}
              className="size-4 rounded border-border accent-gold"
            />
            Featured on homepage
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              name="published"
              defaultChecked={trip?.published ?? true}
              className="size-4 rounded border-border accent-gold"
            />
            Published (visible on site)
          </label>
        </div>
        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary">
            {editing ? "Save changes" : "Create trip"}
          </button>
          <Link href="/admin/trips" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      {trip && (
        <form action={deleteTrip.bind(null, trip.id)} className="mt-12 border-t border-border pt-10">
          <p className="text-sm text-muted">Delete this trip and its booking records.</p>
          <button
            type="submit"
            className="mt-3 rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Delete trip
          </button>
        </form>
      )}
    </div>
  );
}
