"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PageToken = number | "ellipsis";

function getPageTokens({
  page,
  totalPages,
  siblingCount = 1,
}: {
  page: number;
  totalPages: number;
  siblingCount?: number;
}): PageToken[] {
  if (totalPages <= 1) return [1];

  const firstPage = 1;
  const lastPage = totalPages;

  const leftSibling = Math.max(page - siblingCount, firstPage);
  const rightSibling = Math.min(page + siblingCount, lastPage);

  const showLeftEllipsis = leftSibling > firstPage + 1;
  const showRightEllipsis = rightSibling < lastPage - 1;

  const tokens: PageToken[] = [firstPage];

  if (showLeftEllipsis) {
    tokens.push("ellipsis");
  } else {
    for (let p = 2; p < leftSibling; p++) tokens.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== firstPage && p !== lastPage) tokens.push(p);
  }

  if (showRightEllipsis) {
    tokens.push("ellipsis");
  } else {
    for (let p = rightSibling + 1; p < lastPage; p++) tokens.push(p);
  }

  if (lastPage !== firstPage) tokens.push(lastPage);

  return tokens;
}

export function TimesheetsPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const tokens = useMemo(
    () => getPageTokens({ page, totalPages, siblingCount: 1 }),
    [page, totalPages]
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(Math.max(1, page - 1))}
          />
        </PaginationItem>

        {tokens.map((token, index) =>
          token === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={token}>
              <PaginationLink
                type="button"
                isActive={token === page}
                onClick={() => onChange(token)}
              >
                {token}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(Math.min(totalPages, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function TimesheetsPageSize({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="justify-between">
          {value} per page
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {[5, 10, 20].map((size) => (
          <DropdownMenuItem key={size} onSelect={() => onChange(size)}>
            {size} per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
