import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-amber-300 text-3xl">hello world</div>
      <Button>
        Shadcn Button
      </Button>
    </div>
  );
}
