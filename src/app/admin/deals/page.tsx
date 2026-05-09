import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Travel deals" };

export default async function AdminDealsPage() {
  const deals = await prisma.travelDeal.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-gold">Homepage offers</p>
          <h1 className="mt-3 font-display text-4xl text-cream">Travel deals</h1>
          <p className="mt-2 text-muted">Manage the deal cards shown in the public Travel deals section.</p>
        </div>
        <Link href="/admin/deals/new" className="btn-primary self-start sm:self-auto">
          New deal
        </Link>
      </div>

      <div className="mt-10 grid gap-4">
        {deals.length === 0 ? (
          <p className="rounded-lg border border-border bg-surface/35 px-4 py-10 text-center text-muted">
            No travel deals yet. Create your first one.
          </p>
        ) : (
          deals.map((deal) => (
            <article
              key={deal.id}
              className="grid gap-4 rounded-lg border border-border bg-surface/35 p-4 sm:grid-cols-[180px_1fr_auto] sm:items-center"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-bg-elevated">
                <Image src={deal.imageUrl} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium text-cream">{deal.title}</h2>
                  <span
                    className={[
                      "rounded-lg px-2.5 py-1 text-xs font-medium",
                      deal.published ? "bg-accent/15 text-accent" : "bg-bg/70 text-muted",
                    ].join(" ")}
                  >
                    {deal.published ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{deal.description}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-muted">Order {deal.sortOrder}</p>
              </div>
              <Link href={`/admin/deals/${deal.id}/edit`} className="btn-outline justify-self-start sm:justify-self-end">
                Edit
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
