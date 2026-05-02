import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";
import { useReveal } from "@/hooks/useReveal";
import { usePageTracking } from "@/hooks/usePageTracking";

export const Layout = ({ children }: { children: ReactNode }) => {
  useReveal();
  usePageTracking();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
};
