import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ticktock</p>

        <div className="flex items-center gap-1">
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="link" size="sm" className="px-0">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
