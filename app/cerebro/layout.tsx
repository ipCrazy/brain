import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/layout/AppSidebar";
import MainHeader from "./components/layout/MainHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 flex flex-row h-screen relative overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full relative">
          <div className="flex justify-between items-center w-full overflow-hidden absolute bg-transparent">
            <SidebarTrigger />
            <MainHeader />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
