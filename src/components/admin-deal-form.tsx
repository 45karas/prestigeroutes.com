import Link from "next/link";
import type { TravelDeal } from "@prisma/client";
import { createDeal, deleteDeal, updateDeal } from "@/app/actions/deals";

export function AdminDealForm({ deal }: { deal?: TravelDeal }) {
  const editing = Boolean(deal);

  return (
    <div className="max-w-2xl">
      <form action={editing ? updateDeal.bind(null, deal!.id) : createDeal} className="space-y-6">
        <div>
          <label className="label" htmlFor="title">
            Deal title
          </label>
          <input id="title" name="title" required defaultValue={deal?.title} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={deal?.description}
            className="input resize-y"
            placeholder="Describe what makes this offer valuable, who it is for, and what is included."
          />
        </div>
        <div>
          <label className="label" htmlFor="imageUrl">
            Photo URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            required
            defaultValue={deal?.imageUrl}
            className="input"
            placeholder="https://..."
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="ctaText">
              Button text (optional)
            </label>
            <input id="ctaText" name="ctaText" defaultValue={deal?.ctaText ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="ctaHref">
              Button link (optional)
            </label>
            <input id="ctaHref" name="ctaHref" defaultValue={deal?.ctaHref ?? ""} className="input" />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="sortOrder">
              Sort order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={deal?.sortOrder ?? 0}
              className="input"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              name="published"
              defaultChecked={deal?.published ?? true}
              className="size-4 rounded border-border accent-gold"
            />
            Published
          </label>
        </div>
        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary">
            {editing ? "Save deal" : "Create deal"}
          </button>
          <Link href="/admin/deals" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      {deal && (
        <form action={deleteDeal.bind(null, deal.id)} className="mt-12 border-t border-border pt-10">
          <p className="text-sm text-muted">Delete this travel deal.</p>
          <button
            type="submit"
            className="mt-3 rounded-lg border border-red-500/40 px-5 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Delete deal
          </button>
        </form>
      )}
    </div>
  );
}
