import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

type Setting = { key: string; value: string | null; description: string | null };

const LABELS: Record<string, { label: string; multiline?: boolean; dir?: "ltr" | "rtl" }> = {
  whatsapp_number: { label: "رقم الواتساب (مع رمز الدولة بدون +)", dir: "ltr" },
  phone: { label: "رقم الهاتف", dir: "ltr" },
  email: { label: "البريد الإلكتروني", dir: "ltr" },
  address: { label: "العنوان" },
  working_hours: { label: "ساعات العمل" },
  instagram_url: { label: "رابط إنستغرام", dir: "ltr" },
  twitter_url: { label: "رابط تويتر / X", dir: "ltr" },
  whatsapp_welcome: { label: "رسالة الترحيب على واتساب", multiline: true },
};

export const SettingsManager = () => {
  const [items, setItems] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const load = async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value, description");
    if (error) toast.error("تعذر التحميل");
    setItems(data ?? []);
    const d: Record<string, string> = {};
    (data ?? []).forEach((s) => (d[s.key] = s.value ?? ""));
    setDraft(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const item of items) {
        const newVal = draft[item.key];
        if (newVal !== (item.value ?? "")) {
          const { error } = await supabase
            .from("site_settings")
            .update({ value: newVal })
            .eq("key", item.key);
          if (error) throw error;
        }
      }
      toast.success("تم الحفظ ✨");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader2 className="animate-spin mx-auto my-12" />;

  return (
    <Card className="p-6 space-y-5">
      <h2 className="text-2xl font-display text-primary">الإعدادات العامة</h2>
      {items.map((s) => {
        const meta = LABELS[s.key] ?? { label: s.description ?? s.key };
        return (
          <div key={s.key}>
            <Label>{meta.label}</Label>
            {meta.multiline ? (
              <Textarea
                value={draft[s.key] ?? ""}
                onChange={(e) => setDraft({ ...draft, [s.key]: e.target.value })}
                rows={10}
                dir={meta.dir}
              />
            ) : (
              <Input
                value={draft[s.key] ?? ""}
                onChange={(e) => setDraft({ ...draft, [s.key]: e.target.value })}
                dir={meta.dir}
              />
            )}
          </div>
        );
      })}
      <Button onClick={saveAll} disabled={saving} className="w-full">
        {saving ? <Loader2 className="animate-spin h-4 w-4 ml-2" /> : <Save className="h-4 w-4 ml-2" />}
        حفظ الإعدادات
      </Button>
    </Card>
  );
};
