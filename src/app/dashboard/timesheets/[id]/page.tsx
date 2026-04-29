import { TimesheetDetailClient } from "@/components/features/timesheets/detail/TimesheetDetailClient";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default async function TimesheetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <TimesheetDetailClient timesheetId={id} />

      <SiteFooter />
    </div>
  );
}
