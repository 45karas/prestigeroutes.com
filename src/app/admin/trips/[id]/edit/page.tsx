import { notFound } from "next/navigation";
import { AdminTripForm } from "@/components/admin-trip-form";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  return { title: trip ? `Edit: ${trip.title}` : "Edit trip" };
}

export default async function EditTripPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Edit trip</h1>
      <p className="mt-2 text-muted">{trip.title}</p>
      {sp.error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminTripForm trip={trip} />
      </div>
    </div>
  );
}
