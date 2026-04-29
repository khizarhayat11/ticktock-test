"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/types/navigation";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Timesheets", href: "/dashboard" },
] satisfies ReadonlyArray<NavItem>;

export function SiteHeader() {
  const { data: session } = useSession();
  const userLabel = session?.user?.name ?? session?.user?.email ?? "Account";

  const handleLogout = async () => {
    // Best-effort: clear any non-HttpOnly cookies accessible from JS.
    // (HttpOnly NextAuth cookies are cleared by the signOut request.)
    try {
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0]?.trim();
        if (!name) continue;
        document.cookie = `${name}=; Max-Age=0; path=/`;
      }
    } catch {
      // ignore
    }

    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            prefetch={false}
            className="text-xl font-semibold tracking-tight"
          >
            ticktock
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                size="lg"
                className="text-foreground hover:text-foreground"
              >
                <Link href={item.href} prefetch={false}>
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1 text-foreground cursor-pointer hover:text-foreground"
              aria-label="Account"
            >
              <span className="max-w-40 truncate">{userLabel}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled className="cursor-not-allowed opacity-70">
              {userLabel}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </header>
  );
}
