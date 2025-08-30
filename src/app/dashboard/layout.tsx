import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { redirect } from "next/navigation";

// This is a mock authentication check. In a real app, you'd use a proper auth system.
const isAuthenticated = true; // Replace with your actual auth logic

export default function DashboardLayout({ children }: { children: ReactNode }) {
  if (!isAuthenticated) {
    redirect('/login');
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
