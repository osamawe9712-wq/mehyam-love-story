import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

export const usePageTracking = () => {
  const location = useLocation();
  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith("/admin")) return;
    trackPageView(location.pathname);
  }, [location.pathname]);
};
