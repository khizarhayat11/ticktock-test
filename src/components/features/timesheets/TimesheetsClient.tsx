"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Timesheet, TimesheetsFiltersState } from "@/types/timesheet";
import { monthKey, parseTimesheetsJson } from "@/lib/utils";
import { TimesheetsFilters } from "./TimesheetsFilters";
import { TimesheetsTable } from "./TimesheetsTable";
import { TimesheetsPagination, TimesheetsPageSize } from "./TimesheetsPagination";

type PaginationState = {
  page: number;
  pageSize: number;
};    

// Main client component for displaying timesheets with filters, pagination, and error handling
export function TimesheetsClient() {
  const [allTimesheets, setAllTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);



// Api fetching with error handling and loading state
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/mock/timesheets.json", { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to load timesheets (${res.status})`);
        }

        const json: unknown = await res.json();
        const parsed = parseTimesheetsJson(json);
        setAllTimesheets(parsed);
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Failed to load timesheets";
        setError(message);
        setAllTimesheets([]);
      } finally {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      controller.abort();
    };
  }, [refreshToken]);


// Momoized values and callbacks for filters, pagination, and derived data
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    for (const item of allTimesheets) set.add(monthKey(item.startDate));
    return Array.from(set).sort();
  }, [allTimesheets]);

  
  // filtering logic based on status and month
  const [filters, setFilters] = useState<TimesheetsFiltersState>({
    status: "all",
    month: "all",
  });

  // pagination state and logic for calculating total pages and current page items
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 5 });

  // reset page to 1 when filters change
  const handleFiltersChange = useCallback((next: TimesheetsFiltersState) => {
    setFilters(next);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // reset page to 1 when page size changes
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // filter timesheets based on selected status and month
  const filtered = useMemo(() => {
    return allTimesheets.filter((item) => {
      const matchesStatus = filters.status === "all" ? true : item.status === filters.status;
      const matchesMonth = filters.month === "all" ? true : monthKey(item.startDate) === filters.month;
      return matchesStatus && matchesMonth;
    });
  }, [allTimesheets, filters.month, filters.status]);

  // calculate total pages and current page items based on filtered results and pagination state
  const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.pageSize));
  const page = Math.min(pagination.page, totalPages);
  const startIndex = (page - 1) * pagination.pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pagination.pageSize);


  // rendering the component with filters, table, and pagination controls
  return (
    <div className="w-full space-y-4">
      

      <div className="rounded-xl border-2 bg-background">
        <div className="p-4">
          <h1 className="text-xl font-semibold tracking-tight">Your Timesheets</h1>
        </div>

        {error && (
          <div className="px-4 pb-2 text-sm text-destructive" role="alert">
            {error}{" "}
            <button
              type="button"
              className="underline"
              onClick={() => setRefreshToken((t) => t + 1)}
            >
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className="px-4 pb-2 text-sm text-muted-foreground">Loading timesheets…</div>
        )}
        <div className="p-4">
          <TimesheetsFilters
            months={availableMonths}
            value={filters}
            onChange={handleFiltersChange}
          />
        </div>

        {!isLoading && <TimesheetsTable items={pageItems} />}

        <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
          <TimesheetsPageSize value={pagination.pageSize} onChange={handlePageSizeChange} />

          <TimesheetsPagination
            page={page}
            totalPages={totalPages}
            onChange={(nextPage) => setPagination((p) => ({ ...p, page: nextPage }))}
          />
        </div>
      </div>
    </div>
  );
}

// Exporting the client component as TimesheetsPage for use in the app
export { TimesheetsClient as TimesheetsPage };
