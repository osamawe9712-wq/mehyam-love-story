import { Link } from "react-router-dom";
import { ArrowLeft, Coffee, Heart, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { SectionTitle } from "@/components/site/SectionTitle";
import heroImg from "@/assets/hero-coffee.jpg";
import aboutImg from "@/assets/about-coffee.jpg";
import hotImg from "@/assets/menu-hot.jpg";
import coldImg from "@/assets/menu-cold.jpg";
import dessertImg from "@/assets/menu-dessert.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const Home = () => {
  const { get } = useSiteContent();
  const heroBg = get("home", "hero_image") || heroImg;
  const heroDesc = get(
    "home",
    "hero_description",
    "في كل فنجان حكاية، وفي كل رشفة شغف. مرحبًا بك في عالمٍ تُحاك فيه اللحظات بنكهة الحب."
  );
  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <img
          src={heroBg}
          alt="فنجان قهوة دافئ في أجواء رومانسية"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover scale-110 animate-fade-in-slow"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container relative z-10 text-center text-cream py-32">
          <span className="inline-block text-gold-soft tracking-[0.4em] text-xs md:text-sm mb-6 animate-fade-in">
            ✦ {get("home", "hero_title", "مهيام")} ✦
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 animate-fade-in-slow">
            حيث القهوة <br />
            <span className="text-gradient-gold italic">{get("home", "hero_subtitle", "قصة عشق").replace("حيث القهوة ", "")}</span>
          </h1>
          <p className="max-w-xl mx-auto text-cream/85 text-lg md:text-xl leading-loose mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {heroDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Link
              to="/menu"
              className="px-8 py-4 rounded-full bg-gradient-gold text-espresso font-bold shadow-gold hover:scale-105 transition-transform duration-500"
            >
              اكتشف القائمة
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-full border border-cream/40 text-cream hover:bg-cream hover:text-espresso transition-all duration-500"
            >
              قصتنا
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 inset-x-0 flex justify-center animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="h-12 w-px bg-cream/40 animate-pulse" />
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 bg-gradient-cream">
        <div className="container">
          <SectionTitle
            eyebrow="لماذا مهيام"
            title="تجربة تُحَب من أول رشفة"
            subtitle="نُحضّر القهوة بشغف الصُنّاع، ونُقدّمها بدفء الأحبّة."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { Icon: Coffee, title: "حبوب مختصة", text: "نختار أجود الحبوب من مزارع مختارة بعناية، ونحمصها على دفعات صغيرة لنحفظ روحها." },
              { Icon: Heart, title: "صناعة بشغف", text: "كل فنجان يُحضّره باريستا متمرّس بأيادٍ تعشق ما تفعل، فتُولد النكهة." },
              { Icon: Sparkles, title: "أجواء فاخرة", text: "مساحة هادئة بإضاءة دافئة ولمسات ذهبية، صُمّمت لتكون لقاءً لا يُنسى." },
            ].map(({ Icon, title, text }, i) => (
              <article
                key={title}
                className="reveal hover-lift bg-card rounded-2xl p-8 text-center shadow-soft"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto h-16 w-16 grid place-items-center rounded-full bg-gradient-gold mb-6 shadow-gold">
                  <Icon className="h-7 w-7 text-espresso" />
                </div>
                <h3 className="font-display text-2xl text-primary mb-3">{title}</h3>
                <p className="text-muted-foreground leading-loose">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MENU */}
      <section className="py-24">
        <div className="container">
          <SectionTitle
            eyebrow="من القائمة"
            title="مختاراتنا الأكثر عشقًا"
            subtitle="نكهات تُروى كقصائد، وتُقدَّم كهدايا."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              { img: hotImg, title: "كابتشينو الحنين", desc: "كثافة حريرية وفنّ لاتيه يُذيب القلوب." },
              { img: coldImg, title: "كراميل ماكياتو بارد", desc: "حلاوة الكراميل تتراقص فوق إسبريسو منعش." },
              { img: dessertImg, title: "كنافة بالفستق", desc: "طبقات ذهبية مع لمسة عسل وذهب صالح للأكل." },
            ].map(({ img, title, desc }, i) => (
              <article
                key={title}
                className="reveal group rounded-2xl overflow-hidden bg-card shadow-soft hover-lift"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    width={900}
                    height={1125}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1.2s]"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display text-2xl text-primary mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-loose">{desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors group"
            >
              عرض القائمة الكاملة
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* STORY STRIP */}
      <section className="py-24 bg-gradient-dark text-cream relative overflow-hidden">
        <div className="container grid gap-12 md:grid-cols-2 items-center">
          <div className="reveal">
            <span className="divider-gold text-xs tracking-[0.3em] uppercase mb-4">قصتنا</span>
            <h2 className="font-display text-4xl md:text-5xl mt-4 leading-tight">
              مَن يُحبّ القهوة، <br />
              <span className="text-gradient-gold italic">يفهم لغة مهيام</span>
            </h2>
            <p className="mt-6 text-cream/80 leading-loose">
              «مهيام» كلمة عربية أصيلة تعني المُولَع بالحبّ. ومن هذا المعنى وُلدت فكرتنا:
              مكان يحتفي بالقهوة كما يحتفي العاشق بمحبوبه، ويُقدّم كل فنجان كرسالة دافئة.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-full border border-gold text-gold hover:bg-gold hover:text-espresso transition-all duration-500"
            >
              اقرأ القصة كاملة
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="reveal">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-2xl rounded-full" />
              <img
                src={aboutImg}
                alt="دلّة قهوة عربية مع تمر"
                width={1280}
                height={1280}
                loading="lazy"
                className="relative rounded-2xl shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="reveal relative overflow-hidden rounded-3xl bg-gradient-gold p-12 md:p-20 text-center shadow-elegant">
            <h2 className="font-display text-4xl md:text-5xl text-espresso mb-4">
              تعالَ… الفنجان بانتظارك
            </h2>
            <p className="text-espresso/80 text-lg mb-8 max-w-xl mx-auto">
              احجز طاولتك أو اطلب توصيلًا، ودَع قهوتنا تُحدّثك.
            </p>
            <Link
              to="/reserve"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-espresso text-cream font-bold hover:scale-105 transition-transform duration-500"
            >
              اطلب مشروبك الآن
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
