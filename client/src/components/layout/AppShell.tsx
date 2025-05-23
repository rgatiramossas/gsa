import React from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomNavigation } from "./BottomNavigation";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <TopAppBar />
      <main className="flex-1 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
