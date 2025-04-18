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
          <div
            className="absolute top-0 left-0 right-0 z-20 h-16 font-semibold
             pointer-events-none select-none
             flex items-center justify-between p-3
             *:pointer-events-auto max-md:hidden"
          >
            <SidebarTrigger />
            <MainHeader />
          </div>
          <AppContentWrapper>{children}</AppContentWrapper>
        </main>
      </SidebarProvider>
    </div>
  );
}
