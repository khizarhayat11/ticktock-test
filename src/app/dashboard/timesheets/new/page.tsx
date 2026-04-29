import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TimesheetCreatePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { week } = await searchParams;
  const weekLabel = Array.isArray(week) ? week[0] : week;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Create Timesheet</h1>
          {weekLabel ? (
            <p className="text-sm text-muted-foreground">Week {weekLabel}</p>
          ) : null}
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border-2 bg-background p-4 text-sm text-muted-foreground">
        Create page stub. Add a form here later.
      </div>
    </div>
  );
}
