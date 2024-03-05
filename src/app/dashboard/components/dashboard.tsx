"use client";

import React from "react";
import { UserNav } from "@/components/userNav";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Nav } from "./nav";
import { Inbox, Settings, Table, UserRoundCog, Users } from "lucide-react";
import { RouterOutput } from "@/lib/trpc/server";

interface DashboardProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  userProfile: RouterOutput["getUserProfile"];
  children: React.ReactNode;
}

const Dashboard = ({
  defaultLayout = [265, 1095],
  defaultCollapsed = false,
  navCollapsedSize,
  userProfile,
  children,
}: DashboardProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  if (!userProfile) return null;

  const { email, lastName } = userProfile;

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full min-h-screen max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-start",
              isCollapsed ? "h-[52px] justify-center" : "px-2"
            )}
          >
            <Link href="/dashboard" className="mx-2">
              <div className="font-bold text-lg">
                {isCollapsed ? "W" : "Wagewise"}
              </div>
            </Link>
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Dashboard",
                path: "/dashboard",
                icon: Inbox,
              },
              {
                title: "Payroll",
                label: "",
                icon: Table,
              },
              {
                title: "Members",
                label: "12",
                icon: Users,
              },
              {
                title: "Profile",
                label: "",
                path: "/dashboard/profile",
                icon: UserRoundCog,
              },
              {
                title: "Settings",
                icon: Settings,
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex items-center px-4 py-2 h-[52px] justify-between">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <UserNav email={email} lastName={lastName} />
          </div>
          <Separator />
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Dashboard;
