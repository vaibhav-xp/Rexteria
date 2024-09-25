import Header from "@/components/shared/Header";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
