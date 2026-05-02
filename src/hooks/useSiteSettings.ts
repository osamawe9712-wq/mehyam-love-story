import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULTS: Record<string, string> = {
  whatsapp_number: "966577549712",
  phone: "+966 50 000 0000",
  email: "hello@mohayam.coffee",
  address: "حي العليا، الرياض، المملكة العربية السعودية",
  working_hours: "يوميًا من ٧ صباحًا حتى ١٢ منتصف الليل",
  instagram_url: "#",
  twitter_url: "#",
  whatsapp_welcome:
    "مرحبًا مهيام ☕\nأرغب بالاستفسار عن قائمتكم وخدماتكم.",
};

let cache: Record<string, string> | null = null;
const subscribers = new Set<(s: Record<string, string>) => void>();

const fetchAll = async () => {
  const { data } = await supabase.from("site_settings").select("key, value");
  const map: Record<string, string> = { ...DEFAULTS };
  (data ?? []).forEach((s) => {
    if (s.value !== null) map[s.key] = s.value;
  });
  cache = map;
  subscribers.forEach((cb) => cb(map));
  return map;
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>(cache ?? DEFAULTS);

  useEffect(() => {
    if (!cache) fetchAll().then(setSettings);
    else setSettings(cache);
    subscribers.add(setSettings);
    return () => { subscribers.delete(setSettings); };
  }, []);

  const whatsappLink = (() => {
    const number = settings.whatsapp_number || DEFAULTS.whatsapp_number;
    const msg = settings.whatsapp_welcome || DEFAULTS.whatsapp_welcome;
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  })();

  return { settings, whatsappLink };
};
