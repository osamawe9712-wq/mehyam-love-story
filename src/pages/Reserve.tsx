import { useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon, Users, Clock, Phone, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/site/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// رقم واتساب المقهى — بصيغة دولية بدون + أو مسافات
const WHATSAPP_NUMBER = "966500000000";

// الأوقات المتاحة للحجز
const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00", "23:00",
];

// مخطط التحقق من المدخلات (zod)
const reservationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" })
    .max(60, { message: "الاسم طويل جدًا" }),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{8,20}$/, { message: "رقم الجوال غير صحيح" }),
  guests: z
    .number()
    .int()
    .min(1, { message: "اختر عدد الأشخاص" })
    .max(20, { message: "للحجوزات الكبيرة، تواصل معنا مباشرة" }),
  date: z.date({ required_error: "اختر تاريخ الحجز" }),
  time: z.string().min(1, { message: "اختر وقت الحجز" }),
  notes: z.string().trim().max(300, { message: "الملاحظات طويلة جدًا" }).optional(),
});

type FormState = {
  name: string;
  phone: string;
  guests: string;
  date?: Date;
  time: string;
  notes: string;
};

const Reserve = () => {
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", guests: "2", time: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // تحقق client-side عبر zod
    const parsed = reservationSchema.safeParse({
      name: form.name,
      phone: form.phone,
      guests: Number(form.guests),
      date: form.date,
      time: form.time,
      notes: form.notes || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        const key = iss.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = iss.message;
      });
      setErrors(fieldErrors);
      toast.error("يرجى مراجعة الحقول المطلوبة");
      return;
    }

    const d = parsed.data;
    const dateLabel = format(d.date, "EEEE d MMMM yyyy", { locale: ar });

    // بناء رسالة واتساب — مع ترميز آمن
    const message =
      `🤎 *طلب حجز طاولة في مهيام*\n\n` +
      `👤 الاسم: ${d.name}\n` +
      `📱 الجوال: ${d.phone}\n` +
      `👥 عدد الأشخاص: ${d.guests}\n` +
      `📅 التاريخ: ${dateLabel}\n` +
      `🕐 الوقت: ${d.time}\n` +
      (d.notes ? `📝 ملاحظات: ${d.notes}\n` : "") +
      `\nأرجو تأكيد الحجز، شكرًا لكم.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    toast.success("تم تجهيز رسالة التأكيد عبر واتساب 🤎");
  };

  // منع اختيار التواريخ السابقة
  const disablePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-40 pb-16 bg-gradient-cream">
        <div className="container text-center animate-fade-in">
          <span className="divider-gold text-xs tracking-[0.3em] uppercase">احجز طاولتك</span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mt-4">
            طاولةٌ تنتظر <span className="text-gradient-gold italic">حضورك</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-loose">
            اختر وقتك المُفضّل، ودَع البقية علينا. سيصلك التأكيد فورًا عبر واتساب.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-card rounded-2xl p-6 md:p-10 shadow-elegant border border-border/50 space-y-6 reveal"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* الاسم */}
              <Field label="الاسم" icon={User} error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  maxLength={60}
                  placeholder="اسمك الكريم"
                  className={inputCls(errors.name)}
                />
              </Field>

              {/* الجوال */}
              <Field label="رقم الجوال" icon={Phone} error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  maxLength={20}
                  inputMode="tel"
                  placeholder="+966 5X XXX XXXX"
                  dir="ltr"
                  className={inputCls(errors.phone) + " text-right"}
                />
              </Field>

              {/* عدد الأشخاص */}
              <Field label="عدد الأشخاص" icon={Users} error={errors.guests}>
                <Select value={form.guests} onValueChange={(v) => update("guests", v)}>
                  <SelectTrigger className={selectCls(errors.guests)}>
                    <SelectValue placeholder="اختر العدد" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1} {i === 0 ? "شخص" : "أشخاص"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* التاريخ */}
              <Field label="التاريخ" icon={CalendarIcon} error={errors.date}>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        inputCls(errors.date),
                        "flex items-center justify-between text-right",
                        !form.date && "text-muted-foreground"
                      )}
                    >
                      {form.date
                        ? format(form.date, "EEEE d MMMM yyyy", { locale: ar })
                        : "اختر اليوم"}
                      <CalendarIcon className="h-4 w-4 opacity-60" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(d) => update("date", d as Date)}
                      disabled={disablePast}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              {/* الوقت */}
              <Field label="الوقت" icon={Clock} error={errors.time}>
                <Select value={form.time} onValueChange={(v) => update("time", v)}>
                  <SelectTrigger className={selectCls(errors.time)}>
                    <SelectValue placeholder="اختر الساعة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* ملاحظات */}
              <div className="md:col-span-2">
                <Field label="ملاحظات (اختياري)" icon={MessageSquare} error={errors.notes}>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    maxLength={300}
                    rows={3}
                    placeholder="مناسبة خاصة؟ تفضيل بمكان معين؟ أخبرنا…"
                    className={cn(inputCls(errors.notes), "resize-none")}
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 rounded-full bg-gradient-gold text-espresso font-bold shadow-gold hover:scale-[1.01] transition-transform duration-500"
            >
              إرسال التأكيد عبر واتساب
            </button>

            <p className="text-xs text-center text-muted-foreground leading-loose">
              بإرسال الطلب ستفتح محادثة واتساب مع المقهى لتأكيد حجزك خلال دقائق.
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

// ====== Helpers ======

const inputCls = (err?: string) =>
  cn(
    "w-full rounded-lg border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-accent/30",
    err ? "border-destructive focus:border-destructive" : "border-input focus:border-accent"
  );

const selectCls = (err?: string) =>
  cn(
    "w-full px-4 py-6 rounded-lg bg-background",
    err ? "border-destructive" : "border-input"
  );

const Field = ({
  label, icon: Icon, error, children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
      <Icon className="h-4 w-4 text-accent" />
      {label}
    </label>
    {children}
    {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
  </div>
);

export default Reserve;
