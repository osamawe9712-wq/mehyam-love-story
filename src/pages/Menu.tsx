import { useState } from "react";
import { Layout } from "@/components/site/Layout";
import { SectionTitle } from "@/components/site/SectionTitle";
import hotImg from "@/assets/menu-hot.jpg";
import coldImg from "@/assets/menu-cold.jpg";
import dessertImg from "@/assets/menu-dessert.jpg";
import { cn } from "@/lib/utils";

type Item = { name: string; desc: string; price: string };
type Category = { id: string; label: string; img: string; items: Item[] };

const categories: Category[] = [
  {
    id: "hot",
    label: "قهوة ساخنة",
    img: hotImg,
    items: [
      { name: "إسبريسو الشغف", desc: "جرعة مكثّفة بنكهة الكاكاو والمكسرات.", price: "12" },
      { name: "كابتشينو الحنين", desc: "حليب مخمليّ مع فنّ لاتيه ساحر.", price: "18" },
      { name: "لاتيه الفانيلا", desc: "دفء الحليب بلمسة فانيلا فاخرة.", price: "20" },
      { name: "موكا مهيام", desc: "زواج رومانسي بين الشوكولاتة والإسبريسو.", price: "22" },
      { name: "قهوة عربية بالهيل", desc: "أصالة عربية مع تمر مجدول.", price: "16" },
      { name: "فلات وايت", desc: "توازن مثالي بين الإسبريسو والحليب.", price: "19" },
    ],
  },
  {
    id: "cold",
    label: "مشروبات باردة",
    img: coldImg,
    items: [
      { name: "آيس لاتيه", desc: "إسبريسو منعش فوق ثلج وحليب باردين.", price: "20" },
      { name: "كراميل ماكياتو بارد", desc: "حلاوة الكراميل تتراقص بانسجام.", price: "24" },
      { name: "كولد برو", desc: "تخمير بطيء لـ 16 ساعة، نقاء وعمق.", price: "22" },
      { name: "موهيتو القهوة", desc: "نعناع وليمون مع جرعة إسبريسو.", price: "26" },
      { name: "آيس سبانش لاتيه", desc: "حلاوة الحليب المكثف الإسباني.", price: "25" },
      { name: "ماتشا لاتيه بارد", desc: "ماتشا يابانية فاخرة مع حليب اللوز.", price: "24" },
    ],
  },
  {
    id: "dessert",
    label: "حلويات",
    img: dessertImg,
    items: [
      { name: "كنافة بالفستق", desc: "طبقات ذهبية، فستق حلبي، وقطر دافئ.", price: "28" },
      { name: "تشيز كيك التوت", desc: "ناعمة كقُبلة، بنكهة التوت البري.", price: "26" },
      { name: "تيراميسو مهيام", desc: "بسكويت مغمور بإسبريسو وكريمة مسكربون.", price: "30" },
      { name: "براوني بالشوكولاتة", desc: "قلب ذائب من الشوكولاتة البلجيكية.", price: "24" },
      { name: "بسبوسة بالقشطة", desc: "وصفة الجدّات بلمسة عصرية.", price: "20" },
      { name: "كرواسون اللوز", desc: "هشّ من الخارج، ذائب من الداخل.", price: "18" },
    ],
  },
];

const Menu = () => {
  const [active, setActive] = useState<string>(categories[0].id);
  const cat = categories.find((c) => c.id === active)!;

  return (
    <Layout>
      {/* Header */}
      <section className="pt-40 pb-16 bg-gradient-cream">
        <div className="container text-center animate-fade-in">
          <span className="divider-gold text-xs tracking-[0.3em] uppercase">قائمتنا</span>
          <h1 className="font-display text-5xl md:text-6xl text-primary mt-4">
            نكهات <span className="text-gradient-gold italic">تُحفظ في الذاكرة</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-loose">
            اختر فصلك من حكايتنا… بين دفء القهوة، انتعاش البارد، وحلاوة اللحظات.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "px-6 py-3 rounded-full font-semibold transition-all duration-500",
                  active === c.id
                    ? "bg-gradient-gold text-espresso shadow-gold scale-105"
                    : "bg-secondary text-primary hover:bg-secondary/80"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div key={active} className="grid gap-8 lg:grid-cols-[1fr_2fr] animate-fade-in">
            <div className="rounded-2xl overflow-hidden shadow-elegant lg:sticky lg:top-28 self-start">
              <div className="aspect-[4/5]">
                <img
                  src={cat.img}
                  alt={cat.label}
                  width={900}
                  height={1125}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {cat.items.map((item, i) => (
                <article
                  key={item.name}
                  className="bg-card rounded-xl p-6 shadow-soft hover-lift border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="font-display text-xl text-primary">{item.name}</h3>
                    <span className="text-accent font-bold whitespace-nowrap">
                      {item.price} <span className="text-xs text-muted-foreground">ر.س</span>
                    </span>
                  </div>
                  <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent my-3" />
                  <p className="text-sm text-muted-foreground leading-loose">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Menu;
