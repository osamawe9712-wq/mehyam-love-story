import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let cache: Record<string, string> | null = null;
const subscribers = new Set<(s: Record<string, string>) => void>();

const keyOf = (section: string, key: string) => `${section}.${key}`;

const fetchAll = async () => {
  const { data } = await supabase.from("site_content").select("section, key, value");
  const map: Record<string, string> = {};
  (data ?? []).forEach((c) => {
    map[keyOf(c.section, c.key)] = c.value ?? "";
  });
  cache = map;
  subscribers.forEach((cb) => cb(map));
  return map;
};

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, string>>(cache ?? {});

  useEffect(() => {
    if (!cache) fetchAll().then(setContent);
    else setContent(cache);
    subscribers.add(setContent);
    return () => { subscribers.delete(setContent); };
  }, []);

  const get = (section: string, key: string, fallback = "") =>
    content[keyOf(section, key)] || fallback;

  return { get, content };
};
