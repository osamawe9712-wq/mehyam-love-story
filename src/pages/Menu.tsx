import { useMemo, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { useProducts } from "@/hooks/useProducts";
import hotImg from "@/assets/menu-hot.jpg";
import coldImg from "@/assets/menu-cold.jpg";
import dessertImg from "@/assets/menu-dessert.jpg";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const FALLBACK_IMAGES: Record<string, string> = {
  "ساخنة": hotImg,
  "باردة": coldImg,
  "حلويات": dessertImg,
  "وجبات خفيفة": dessertImg,
};

const Menu = () => {
  const { products, loading } = useProducts();
  const categories = useMemo(() => {
    const set = Array.from(new Set(products.map((p) => p.category)));
    return set.length ? set : ["ساخنة", "باردة", "حلويات"];
  }, [products]);

  const [active, setActive] = useState<string>("");
  const current = active || categories[0] || "ساخنة";
  const items = products.filter((p) => p.category === current);
  const heroImage = items.find((i) => i.image_url)?.image_url || FALLBACK_IMAGES[current] || hotImg;

  return (
    <Layout>
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

      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid place-items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className={cn(
                      "px-6 py-3 rounded-full font-semibold transition-all duration-500",
                      current === c
                        ? "bg-gradient-gold text-espresso shadow-gold scale-105"
                        : "bg-secondary text-primary hover:bg-secondary/80"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div key={current} className="grid gap-8 lg:grid-cols-[1fr_2fr] animate-fade-in">
                <div className="rounded-2xl overflow-hidden shadow-elegant lg:sticky lg:top-28 self-start">
                  <div className="aspect-[4/5]">
                    <img
                      src={heroImage}
                      alt={current}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {items.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground py-12">
                      لا توجد منتجات في هذه الفئة بعد.
                    </p>
                  )}
                  {items.map((item, i) => (
                    <article
                      key={item.id}
                      className="bg-card rounded-xl p-6 shadow-soft hover-lift border border-border/50 animate-fade-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h3 className="font-display text-xl text-primary">
                          {item.name}
                          {item.is_featured && <span className="text-accent mr-1">⭐</span>}
                        </h3>
                        <span className="text-accent font-bold whitespace-nowrap">
                          {item.price} <span className="text-xs text-muted-foreground">ر.س</span>
                        </span>
                      </div>
                      {item.description && (
                        <>
                          <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent my-3" />
                          <p className="text-sm text-muted-foreground leading-loose">{item.description}</p>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Menu;
