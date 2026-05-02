import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/whatsapp";

export const WhatsAppFab = () => (
  <a
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noreferrer"
    aria-label="تواصل عبر واتساب"
    className="fixed bottom-6 left-6 z-40 h-14 w-14 grid place-items-center rounded-full bg-gradient-gold text-espresso shadow-gold hover:scale-110 transition-transform duration-500 animate-fade-in"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);
