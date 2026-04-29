import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-2">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm">Signed in as {session.user?.email}</div>
      </div>
    </div>
  );
}
