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
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  PenBox,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Table,
  Trash2,
  Users,
  Users2,
} from "lucide-react";
import { trpc } from "@/lib/trpc/client/client";

interface DashboardProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

const Dashboard = ({
  defaultLayout = [265, 1095],
  defaultCollapsed = false,
  navCollapsedSize,
}: DashboardProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const { data, error, isLoading } = trpc.getUserProfile.useQuery();

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
                icon: Inbox,
                variant: "default",
              },
              {
                title: "Payroll",
                label: "",
                icon: Table,
                variant: "ghost",
              },
              {
                title: "Members",
                label: "12",
                icon: Users,
                variant: "ghost",
              },
              {
                title: "Profile",
                label: "",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Settings",
                icon: Settings,
                variant: "ghost",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex items-center px-4 py-2 h-[52px] justify-between">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <UserNav email={data?.email} />
          </div>
          <Separator />
          <div className="px-4 py-2">
            <h2 className="text-lg font-bold">
              {data?.company_profiles?.name}
            </h2>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Dashboard;
