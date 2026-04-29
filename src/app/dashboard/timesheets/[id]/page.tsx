import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TimesheetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Timesheet</h1>
          <p className="text-sm text-muted-foreground">{id}</p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border-2 bg-background p-4 text-sm text-muted-foreground">
        View page stub. Hook this up to real data when ready.
      </div>
    </div>
  );
}
