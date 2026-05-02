import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "mehyam_session_id";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

export const trackEvent = async (
  eventName: string,
  eventData: Record<string, unknown> = {}
) => {
  try {
    await supabase.from("analytics_events").insert({
      event_name: eventName,
      event_data: eventData as never,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      session_id: getSessionId(),
    });
  } catch (e) {
    // silent fail - analytics shouldn't break UX
    console.warn("analytics error", e);
  }
};

export const trackPageView = (path?: string) => {
  trackEvent("page_view", { path: path ?? window.location.pathname });
};
