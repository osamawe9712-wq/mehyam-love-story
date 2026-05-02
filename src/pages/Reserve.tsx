import { useMemo, useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  CalendarIcon, Clock, Phone, User, MessageSquare,
  Plus, Minus, ShoppingBag, Store, Bike, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import hotImg from "@/assets/menu-hot.jpg";
import coldImg from "@/assets/menu-cold.jpg";
import dessertImg from "@/assets/menu-dessert.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// المنتجات القابلة للطلب المسبق (مأخوذة من القائمة)
type Product = { id: string; name: string; price: number; cat: string; img: string };
const PRODUCTS: Product[] = [
  { id: "esp",   name: "إسبريسو الشغف",        price: 12, cat: "ساخنة", img: hotImg },
  { id: "cap",   name: "كابتشينو الحنين",       price: 18, cat: "ساخنة", img: hotImg },
  { id: "lat",   name: "لاتيه الفانيلا",        price: 20, cat: "ساخنة", img: hotImg },
  { id: "moc",   name: "موكا مهيام",            price: 22, cat: "ساخنة", img: hotImg },
  { id: "ice",   name: "آيس لاتيه",             price: 20, cat: "باردة", img: coldImg },
  { id: "car",   name: "كراميل ماكياتو بارد",   price: 24, cat: "باردة", img: coldImg },
  { id: "spa",   name: "آيس سبانش لاتيه",       price: 25, cat: "باردة", img: coldImg },
  { id: "kun",   name: "كنافة بالفستق",         price: 28, cat: "حلويات", img: dessertImg },
  { id: "tir",   name: "تيراميسو مهيام",        price: 30, cat: "حلويات", img: dessertImg },
];

const TIME_SLOTS = [
  "ASAP (في أقرب وقت)",
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00",
];

type CartItem = { id: string; qty: number };

// مخطط التحقق
const orderSchema = z.object({
  name: z.string().trim().min(2, { message: "الاسم قصير جدًا" }).max(60),
  phone: z.string().trim().regex(/^[+0-9\s-]{8,20}$/, { message: "رقم الجوال غير صحيح" }),
  method: z.enum(["pickup", "delivery"], { required_error: "اختر طريقة الاستلام" }),
  date: z.date({ required_error: "اختر التاريخ" }),
  time: z.string().min(1, { message: "اختر الوقت" }),
  address: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(300).optional(),
}).refine((d) => d.method === "pickup" || (d.address && d.address.length >= 8), {
  path: ["address"],
  message: "العنوان مطلوب لطلبات التوصيل",
});

const PreOrder = () => {
  const { settings } = useSiteSettings();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "", phone: "", method: "pickup" as "pickup" | "delivery",
    date: undefined as Date | undefined, time: "", address: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = useMemo(
    () => cart.reduce((s, c) => s + (PRODUCTS.find((p) => p.id === c.id)?.price ?? 0) * c.qty, 0),
    [cart]
  );

  const setQty = (id: string, qty: number) => {
    setCart((c) => {
      const next = c.filter((i) => i.id !== id);
      if (qty > 0) next.push({ id, qty });
      return next;
    });
  };
  const inc = (id: string) => setQty(id, (cart.find((c) => c.id === id)?.qty ?? 0) + 1);
  const dec = (id: string) => setQty(id, Math.max(0, (cart.find((c) => c.id === id)?.qty ?? 0) - 1));
  const update = (k: keyof typeof form, v: any) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("أضف مشروبًا واحدًا على الأقل لإكمال الطلب");
      return;
    }

    const parsed = orderSchema.safeParse({
      name: form.name,
      phone: form.phone,
      method: form.method,
      date: form.date,
      time: form.time,
      address: form.address || undefined,
      notes: form.notes || undefined,
    });

    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!fe[k]) fe[k] = i.message;
      });
      setErrors(fe);
      toast.error("يرجى مراجعة الحقول المطلوبة");
      return;
    }

    const d = parsed.data;
    const dateLabel = format(d.date, "EEEE d MMMM yyyy", { locale: ar });
    const itemsList = cart
      .map((c) => {
        const p = PRODUCTS.find((x) => x.id === c.id)!;
        return `• ${p.name} × ${c.qty} = ${p.price * c.qty} ر.س`;
      })
      .join("\n");

    const msg =
      `🤎 *طلب مسبق من مهيام*\n\n` +
      `👤 ${d.name}\n` +
      `📱 ${d.phone}\n\n` +
      `🛍️ *الطلب:*\n${itemsList}\n` +
      `💰 *الإجمالي:* ${total} ر.س\n\n` +
      `${d.method === "pickup" ? "🏪 استلام من الفرع" : "🛵 توصيل"}\n` +
      `📅 ${dateLabel}\n` +
      `🕐 ${d.time}\n` +
      (d.address ? `📍 ${d.address}\n` : "") +
      (d.notes ? `📝 ${d.notes}\n` : "") +
      `\nأرجو تأكيد الطلب، شكرًا لكم.`;

    const url = `https://wa.me/${settings.whatsapp_number || "966577549712"}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("تم تجهيز طلبك عبر واتساب 🤎");
  };

  const disablePast = (date: Date) => {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  };

  return (
    <Layout>
      <section className="pt-40 pb-12 bg-gradient-cream">
        <div className="container text-center animate-fade-in">
          <span className="divider-gold text-xs tracking-[0.3em] uppercase">طلب مسبق</span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mt-4">
            اطلب مشروبك <span className="text-gradient-gold italic">قبل وصولك</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-loose">
            اختر مشروبك، حدّد وقت الاستلام، وسنُحضّره بشغف ليكون جاهزًا لحظة وصولك.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* المنتجات */}
          <div className="reveal">
            <h2 className="font-display text-2xl text-primary mb-6">اختر مشروباتك</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRODUCTS.map((p) => {
                const qty = cart.find((c) => c.id === p.id)?.qty ?? 0;
                return (
                  <article
                    key={p.id}
                    className={cn(
                      "flex gap-4 p-4 rounded-xl bg-card border transition-all duration-500",
                      qty > 0 ? "border-accent shadow-gold" : "border-border/50 shadow-soft hover-lift"
                    )}
                  >
                    <img
                      src={p.img} alt={p.name} loading="lazy"
                      className="h-20 w-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] tracking-widest text-accent uppercase">{p.cat}</span>
                      <h3 className="font-display text-lg text-primary leading-tight truncate">{p.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-accent font-bold">{p.price} ر.س</span>
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => inc(p.id)}
                            className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-espresso transition-colors"
                          >
                            <Plus className="inline h-3 w-3 ml-1" /> أضف
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => dec(p.id)} className="h-7 w-7 grid place-items-center rounded-full bg-secondary hover:bg-secondary/70">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-bold w-5 text-center">{qty}</span>
                            <button type="button" onClick={() => inc(p.id)} className="h-7 w-7 grid place-items-center rounded-full bg-gradient-gold text-espresso">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* السلة + النموذج */}
          <form onSubmit={onSubmit} noValidate className="reveal lg:sticky lg:top-28 self-start space-y-4">
            <div className="bg-card rounded-2xl p-6 shadow-elegant border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl text-primary flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-accent" /> سلتك
                </h2>
                <span className="text-sm text-muted-foreground">{cart.length} منتج</span>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  لم تُضف أي مشروب بعد
                </p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {cart.map((c) => {
                    const p = PRODUCTS.find((x) => x.id === c.id)!;
                    return (
                      <li key={c.id} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                        <span className="truncate">{p.name} <span className="text-muted-foreground">×{c.qty}</span></span>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-semibold text-primary">{p.price * c.qty} ر.س</span>
                          <button type="button" onClick={() => setQty(c.id, 0)} className="text-destructive/70 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="font-display text-lg text-primary">الإجمالي</span>
                <span className="font-display text-2xl text-gradient-gold">{total} ر.س</span>
              </div>
            </div>

            {/* بيانات العميل */}
            <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 space-y-4">
              {/* طريقة الاستلام */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">طريقة الاستلام</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { v: "pickup", I: Store, t: "استلام من الفرع" },
                    { v: "delivery", I: Bike, t: "توصيل" },
                  ].map(({ v, I, t }) => (
                    <button
                      key={v} type="button"
                      onClick={() => update("method", v)}
                      className={cn(
                        "flex flex-col items-center gap-1 py-3 rounded-lg border transition-all",
                        form.method === v
                          ? "border-accent bg-gradient-gold text-espresso shadow-gold"
                          : "border-input bg-background hover:border-accent/50"
                      )}
                    >
                      <I className="h-5 w-5" />
                      <span className="text-xs font-semibold">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Field label="الاسم" icon={User} error={errors.name}>
                <input value={form.name} onChange={(e) => update("name", e.target.value)}
                  maxLength={60} placeholder="اسمك الكريم" className={inputCls(errors.name)} />
              </Field>

              <Field label="رقم الجوال" icon={Phone} error={errors.phone}>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  maxLength={20} inputMode="tel" dir="ltr" placeholder="+966 5X XXX XXXX"
                  className={inputCls(errors.phone) + " text-right"} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="التاريخ" icon={CalendarIcon} error={errors.date}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className={cn(inputCls(errors.date), "text-right text-sm", !form.date && "text-muted-foreground")}>
                        {form.date ? format(form.date, "d MMM", { locale: ar }) : "اختر اليوم"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={form.date}
                        onSelect={(d) => update("date", d as Date)}
                        disabled={disablePast} initialFocus
                        className={cn("p-3 pointer-events-auto")} />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field label="الوقت" icon={Clock} error={errors.time}>
                  <Select value={form.time} onValueChange={(v) => update("time", v)}>
                    <SelectTrigger className={cn("bg-background", errors.time && "border-destructive")}>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {TIME_SLOTS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {form.method === "delivery" && (
                <Field label="عنوان التوصيل" icon={Store} error={errors.address}>
                  <input value={form.address} onChange={(e) => update("address", e.target.value)}
                    maxLength={200} placeholder="الحي، الشارع، رقم المبنى…"
                    className={inputCls(errors.address)} />
                </Field>
              )}

              <Field label="ملاحظات (اختياري)" icon={MessageSquare} error={errors.notes}>
                <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)}
                  maxLength={300} rows={2} placeholder="بدون سكر؟ حليب لوز؟ أخبرنا…"
                  className={cn(inputCls(errors.notes), "resize-none")} />
              </Field>

              <button type="submit"
                className="w-full px-6 py-4 rounded-full bg-gradient-gold text-espresso font-bold shadow-gold hover:scale-[1.01] transition-transform duration-500">
                إرسال الطلب عبر واتساب
              </button>
              <p className="text-[11px] text-center text-muted-foreground">
                سيفتح واتساب برسالة طلبك جاهزة للإرسال.
              </p>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

const inputCls = (err?: string) =>
  cn("w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-accent/30",
    err ? "border-destructive" : "border-input focus:border-accent");

const Field = ({ label, icon: Icon, error, children }: {
  label: string; icon: React.ComponentType<{ className?: string }>; error?: string; children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
      <Icon className="h-4 w-4 text-accent" />{label}
    </label>
    {children}
    {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
  </div>
);

export default PreOrder;
