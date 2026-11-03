import type { Metadata } from "next";
import AppSidebar from "@/components/app/AppSidebar";
import AppMobileHeader from "@/components/app/AppMobileHeader";
import MobileTabBar from "@/components/app/MobileTabBar";

export const metadata: Metadata = {
  title: "VastuNord",
  robots: { index: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex min-h-svh bg-shell">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppMobileHeader />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-0 py-6 pb-28 sm:px-6 md:py-8 lg:px-10">
          {children}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
