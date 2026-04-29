"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-muted/60 ${className}`} />;
}

export function TimesheetsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-muted/20">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-40 px-6 py-4 uppercase tracking-wide">
              Week #
            </TableHead>
            <TableHead className="px-6 py-4 uppercase tracking-wide">Date</TableHead>
            <TableHead className="w-40 px-6 py-4 uppercase tracking-wide">Status</TableHead>
            <TableHead className="w-30 px-6 py-4 text-right uppercase tracking-wide">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRow key={index}>
              <TableCell className="px-6 py-4">
                <SkeletonBlock className="h-4 w-10" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <SkeletonBlock className="h-4 w-48" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <SkeletonBlock className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="ml-auto flex justify-end">
                  <SkeletonBlock className="h-4 w-12" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
