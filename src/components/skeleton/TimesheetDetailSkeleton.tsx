"use client";

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ring-1 ring-border/40 ${className}`}
    />
  );
}

function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
      <div className="min-w-0 flex-1">
        <SkeletonBlock className="h-5 w-64" />
      </div>

      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-12" />
        <SkeletonBlock className="h-6 w-24 rounded-full" />
      </div>

      <SkeletonBlock className="h-8 w-8 rounded-md" />
    </div>
  );
}

function DaySectionSkeleton() {
  return (
    <section className="grid gap-3 px-4 py-4 sm:grid-cols-[96px_1fr]">
      <SkeletonBlock className="h-5 w-14" />

      <div className="space-y-2">
        <TaskRowSkeleton />
        <TaskRowSkeleton />

        <div className="w-full rounded-lg border border-dashed px-3 py-3">
          <SkeletonBlock className="h-5 w-32" />
        </div>
      </div>
    </section>
  );
}

export function TimesheetDetailSkeleton() {
  return (
    <div className="divide-y">
      <DaySectionSkeleton />
      <DaySectionSkeleton />
      <DaySectionSkeleton />
    </div>
  );
}
