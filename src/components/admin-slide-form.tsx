import Link from "next/link";
import type { HeroSlide } from "@prisma/client";
import { createSlide, deleteSlide, updateSlide } from "@/app/actions/slides";

export function AdminSlideForm({ slide }: { slide?: HeroSlide }) {
  const editing = Boolean(slide);

  return (
    <div className="max-w-2xl">
      <form action={editing ? updateSlide.bind(null, slide!.id) : createSlide} className="space-y-6">
        <div>
          <label className="label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" required defaultValue={slide?.title} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="subtitle">
            Subtitle (optional)
          </label>
          <input id="subtitle" name="subtitle" defaultValue={slide?.subtitle ?? ""} className="input" />
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
            defaultValue={slide?.imageUrl}
            className="input"
            placeholder="https://..."
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="ctaText">
              Button text (optional)
            </label>
            <input id="ctaText" name="ctaText" defaultValue={slide?.ctaText ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="ctaHref">
              Button link (optional)
            </label>
            <input id="ctaHref" name="ctaHref" defaultValue={slide?.ctaHref ?? ""} className="input" />
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
              defaultValue={slide?.sortOrder ?? 0}
              className="input"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              name="published"
              defaultChecked={slide?.published ?? true}
              className="size-4 rounded border-border accent-gold"
            />
            Published
          </label>
        </div>
        <div className="flex flex-wrap gap-4">
          <button type="submit" className="btn-primary">
            {editing ? "Save slide" : "Create slide"}
          </button>
          <Link href="/admin/slides" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      {slide && (
        <form action={deleteSlide.bind(null, slide.id)} className="mt-12 border-t border-border pt-10">
          <p className="text-sm text-muted">Delete this slide.</p>
          <button
            type="submit"
            className="mt-3 rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Delete slide
          </button>
        </form>
      )}
    </div>
  );
}

