import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">  

      <div className="w-full max-w-sm space-y-4"> 
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Welcome to the App</h1>
          <p className="text-sm text-muted-foreground">
            Please log in to access your dashboard.
          </p>
        </div>

        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </div>
  );
}
