import { notFound } from "next/navigation";
import { AdminSlideForm } from "@/components/admin-slide-form";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  return { title: slide ? `Edit slide: ${slide.title}` : "Edit slide" };
}

export default async function EditSlidePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Edit slide</h1>
      <p className="mt-2 text-muted">{slide.title}</p>
      {sp.error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminSlideForm slide={slide} />
      </div>
    </div>
  );
}

