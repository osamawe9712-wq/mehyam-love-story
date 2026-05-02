import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { trackEvent } from "@/lib/analytics";

export const WhatsAppFab = () => {
  const { whatsappLink } = useSiteSettings();
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      onClick={() => trackEvent("whatsapp_click", { source: "fab" })}
      className="fixed bottom-6 left-6 z-40 h-14 w-14 grid place-items-center rounded-full bg-gradient-gold text-espresso shadow-gold hover:scale-110 transition-transform duration-500 animate-fade-in"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};
