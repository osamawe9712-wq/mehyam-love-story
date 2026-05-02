import { useState } from "react";
import { Layout } from "@/components/site/Layout";
import { SectionTitle } from "@/components/site/SectionTitle";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const Contact = () => {
  const { settings, whatsappLink } = useSiteSettings();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("contact_form_submit", { name: form.name, email: form.email });
    toast.success("شكرًا لتواصلك مع مهيام، سنردّ عليك قريبًا 🤎");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="pt-40 pb-16 bg-gradient-cream">
        <div className="container text-center animate-fade-in">
          <span className="divider-gold text-xs tracking-[0.3em] uppercase">تواصل معنا</span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mt-4">
            نُحبّ أن <span className="text-gradient-gold italic">نسمعك</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-loose">
            راسلنا، اتصل بنا، أو زرنا… فالباب مفتوح، والقهوة جاهزة.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-6 reveal">
            {[
              { Icon: MapPin, t: "العنوان", v: settings.address },
              { Icon: Phone, t: "اتصل بنا", v: settings.phone },
              { Icon: Mail, t: "البريد الإلكتروني", v: settings.email },
              { Icon: Clock, t: "ساعات العمل", v: settings.working_hours },
            ].map(({ Icon, t, v }) => (
              <div key={t} className="flex items-start gap-4 p-5 rounded-xl bg-card shadow-soft hover-lift">
                <div className="h-12 w-12 grid place-items-center rounded-full bg-gradient-gold shrink-0 shadow-gold">
                  <Icon className="h-5 w-5 text-espresso" />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-1">{t}</h3>
                  <p className="text-muted-foreground">{v}</p>
                </div>
              </div>
            ))}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-full bg-gradient-gold text-espresso font-bold shadow-gold hover:scale-[1.02] transition-transform duration-500"
            >
              <MessageCircle className="h-5 w-5" />
              تواصل عبر واتساب
            </a>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="reveal bg-card rounded-2xl p-8 shadow-elegant border border-border/50 space-y-5"
          >
            <h2 className="font-display text-3xl text-primary">أرسل لنا رسالة</h2>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">الاسم</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition"
                placeholder="اسمك الكريم"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition"
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">رسالتك</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition resize-none"
                placeholder="اكتب لنا ما يدور في خاطرك…"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-espresso transition-colors duration-500"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="container">
          <div className="reveal rounded-2xl overflow-hidden shadow-elegant border border-border/50">
            <iframe
              title="موقع مهيام على الخريطة"
              src="https://www.openstreetmap.org/export/embed.html?bbox=46.6%2C24.69%2C46.7%2C24.75&layer=mapnik"
              className="w-full h-[420px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
