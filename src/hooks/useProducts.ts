import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DBProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

export const useProducts = (opts: { activeOnly?: boolean } = {}) => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from("products").select("*").order("sort_order", { ascending: true });
    if (opts.activeOnly !== false) q = q.eq("is_active", true);
    q.then(({ data }) => {
      setProducts((data as DBProduct[]) ?? []);
      setLoading(false);
    });
  }, [opts.activeOnly]);

  return { products, loading };
};
