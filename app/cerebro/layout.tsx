import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/layout/AppSidebar";
import MainHeader from "./components/layout/MainHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-neutral-800 flex flex-row h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <div className="bg-neutral-700 flex justify-between items-center flex-row m-2.5 h-10 grow">
            <SidebarTrigger />
            <MainHeader />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
