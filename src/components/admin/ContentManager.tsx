import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Upload } from "lucide-react";

type Content = {
  id: string;
  section: string;
  key: string;
  value: string | null;
  content_type: string;
  description: string | null;
};

const SECTIONS: Record<string, string> = {
  home: "الصفحة الرئيسية",
  about: "صفحة عن مهيام",
  footer: "التذييل (Footer)",
};

export const ContentManager = () => {
  const [items, setItems] = useState<Content[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("section")
      .order("key");
    if (error) toast.error("تعذر التحميل");
    setItems(data ?? []);
    const d: Record<string, string> = {};
    (data ?? []).forEach((c) => (d[c.id] = c.value ?? ""));
    setDraft(d);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveOne = async (item: Content) => {
    setSavingId(item.id);
    const { error } = await supabase
      .from("site_content")
      .update({ value: draft[item.id] ?? "" })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else toast.success("تم الحفظ");
    setSavingId(null);
    load();
  };

  const uploadImage = async (item: Content, file: File) => {
    setUploadingId(item.id);
    try {
      const ext = file.name.split(".").pop();
      const path = `${item.section}-${item.key}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      setDraft({ ...draft, [item.id]: data.publicUrl });
      // auto-save
      await supabase.from("site_content").update({ value: data.publicUrl }).eq("id", item.id);
      toast.success("تم رفع الصورة ✨");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <Loader2 className="animate-spin mx-auto my-12" />;

  const grouped: Record<string, Content[]> = {};
  items.forEach((c) => {
    grouped[c.section] = grouped[c.section] ?? [];
    grouped[c.section].push(c);
  });

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([section, list]) => (
        <Card key={section} className="p-6 space-y-4">
          <h2 className="text-2xl font-display text-primary border-b pb-2">
            {SECTIONS[section] ?? section}
          </h2>
          {list.map((item) => (
            <div key={item.id} className="space-y-2">
              <Label>{item.description ?? item.key}</Label>
              {item.content_type === "image" ? (
                <div className="space-y-2">
                  {draft[item.id] && (
                    <img src={draft[item.id]} alt="" className="w-full max-w-md h-40 object-cover rounded-lg" />
                  )}
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted max-w-md">
                    {uploadingId === item.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    <span className="text-sm">رفع/تغيير الصورة</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadImage(item, e.target.files[0])}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex gap-2">
                  {item.key.includes("description") || (draft[item.id]?.length ?? 0) > 60 ? (
                    <Textarea
                      value={draft[item.id] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [item.id]: e.target.value })}
                      rows={3}
                      className="flex-1"
                    />
                  ) : (
                    <Input
                      value={draft[item.id] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [item.id]: e.target.value })}
                      className="flex-1"
                    />
                  )}
                  <Button
                    size="icon"
                    onClick={() => saveOne(item)}
                    disabled={savingId === item.id || draft[item.id] === item.value}
                  >
                    {savingId === item.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};
