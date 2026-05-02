import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Product = {
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

const CATEGORIES = ["ساخنة", "باردة", "حلويات", "وجبات خفيفة"];

const empty: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: "ساخنة",
  image_url: null,
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

export const ProductsManager = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(empty);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error("تعذر تحميل المنتجات");
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty, sort_order: items.length + 1 });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const { id, ...rest } = p;
    setForm(rest);
    setOpen(true);
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast.success("تم رفع الصورة ✨");
    } catch (e: any) {
      toast.error(e.message ?? "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("الاسم مطلوب");
    if (form.price < 0) return toast.error("سعر غير صالح");
    setBusy(true);
    try {
      if (editing) {
        const { error } = await supabase.from("products").update(form).eq("id", editing.id);
        if (error) throw error;
        toast.success("تم التحديث ✅");
      } else {
        const { error } = await supabase.from("products").insert(form);
        if (error) throw error;
        toast.success("تمت الإضافة ✨");
      }
      setOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("متأكد من الحذف؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم الحذف");
    load();
  };

  const toggleActive = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  };

  if (loading) return <div className="grid place-items-center py-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-primary">المنتجات ({items.length})</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 ml-2" />إضافة منتج</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Card key={p.id} className={`p-4 space-y-3 ${!p.is_active ? "opacity-50" : ""}`}>
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-full h-32 object-cover rounded-lg" />
            ) : (
              <div className="w-full h-32 bg-muted rounded-lg grid place-items-center text-xs text-muted-foreground">
                لا توجد صورة
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-primary">{p.name}</h3>
                {p.is_featured && <Star className="h-4 w-4 fill-accent text-accent" />}
              </div>
              <p className="text-xs text-muted-foreground">{p.category}</p>
              <p className="text-lg font-bold text-accent mt-1">{p.price} ر.س</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} />
                <span className="text-xs">{p.is_active ? "ظاهر" : "مخفي"}</span>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                {isAdmin && (
                  <Button size="icon" variant="ghost" onClick={() => del(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل منتج" : "منتج جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>الاسم</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>السعر (ر.س)</Label>
                <Input type="number" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div>
                <Label>الفئة</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>الترتيب</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <Label>الصورة</Label>
              {form.image_url && (
                <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />
              )}
              <label className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted">
                {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
                <span className="text-sm">{form.image_url ? "تغيير الصورة" : "رفع صورة"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                />
              </label>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                <span className="text-sm">ظاهر للزوار</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                <span className="text-sm">مميّز ⭐</span>
              </label>
            </div>
            <Button onClick={save} disabled={busy} className="w-full">
              {busy && <Loader2 className="animate-spin h-4 w-4 ml-2" />}
              حفظ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
