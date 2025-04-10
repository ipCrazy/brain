import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./components/layout/AppSidebar";
import MainHeader from "./components/layout/MainHeader";
import AppContentWrapper from "./components/layout/AppContentWrapper";

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
          <div className="flex justify-between items-center w-full overflow-hidden absolute bg-transparent z-50">
            <SidebarTrigger />
            <MainHeader />
          </div>
          <AppContentWrapper>{children}</AppContentWrapper>
        </main>
      </SidebarProvider>
    </div>
  );
}
