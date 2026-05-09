import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin-login?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:gap-12">
      <aside className="h-fit rounded-lg border border-border bg-surface/35 p-4 lg:sticky lg:top-24">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Admin</p>
        <p className="mt-2 truncate text-sm text-cream">{session.user.email}</p>
        <nav className="mt-6 grid grid-cols-2 gap-2 text-sm lg:grid-cols-1">
          {[
            ["Overview", "/admin"],
            ["Bookings", "/admin/bookings"],
            ["Users", "/admin/users"],
            ["Trips", "/admin/trips"],
            ["Gallery", "/admin/gallery"],
            ["Homepage slides", "/admin/slides"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-muted transition hover:bg-bg/60 hover:text-cream"
            >
              {label}
            </Link>
          ))}
          <Link className="rounded-lg px-3 py-2 text-gold transition hover:bg-bg/60 hover:text-cream" href="/">
            Back to site
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
