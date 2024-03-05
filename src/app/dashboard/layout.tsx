import React from "react";
import Dashboard from "./components/dashboard";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RouterOutput, trpcServer } from "@/lib/trpc/server";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/");
  }

  const layout = cookieStore.get("react-resizable-panels:layout");
  const collapsed = cookieStore.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  const res =
    (await trpcServer.getUserProfile()) as RouterOutput["getUserProfile"];

  return (
    <>
      <Dashboard
        defaultLayout={defaultLayout}
        defaultCollapsed={!!defaultCollapsed}
        navCollapsedSize={4}
        userProfile={res}
      >
        <main className="px-4 py-2">{children}</main>
      </Dashboard>
    </>
  );
};

export default DashboardLayout;
