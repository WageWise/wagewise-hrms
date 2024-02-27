import { AuthForm } from "@/components/auth/authForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-100 min-h-screen flex items-center justify-center px-4 py-2">
      <div className="flex justify-center flex-col gap-3">
        <h1 className="text-lg font-bold">
          Welcome to Wagewise, your all-in-one HRMS solution
        </h1>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
