import { notFound } from "next/navigation";
import { AdminDealForm } from "@/components/admin-deal-form";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const deal = await prisma.travelDeal.findUnique({ where: { id } });
  return { title: deal ? `Edit deal: ${deal.title}` : "Edit deal" };
}

export default async function EditDealPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const deal = await prisma.travelDeal.findUnique({ where: { id } });
  if (!deal) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl text-cream">Edit travel deal</h1>
      <p className="mt-2 text-muted">{deal.title}</p>
      {sp.error && (
        <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {sp.error}
        </p>
      )}
      <div className="mt-10">
        <AdminDealForm deal={deal} />
      </div>
    </div>
  );
}
