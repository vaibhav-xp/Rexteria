import Sidebar from "@/components/spanel/Sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex gap-4 h-screen overflow-hidden w-full">
      <Sidebar />
      <section className="p-4 w-full overflow-y-scroll">{children}</section>
    </main>
  );
}
