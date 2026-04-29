import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TimesheetsClient } from "@/components/features/timesheets/TimesheetsClient";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <TimesheetsClient />

      <SiteFooter />
    </div>
  );
}
