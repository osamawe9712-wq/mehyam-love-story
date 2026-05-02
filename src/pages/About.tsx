import { Layout } from "@/components/site/Layout";
import { SectionTitle } from "@/components/site/SectionTitle";
import aboutImg from "@/assets/about-coffee.jpg";
import heroImg from "@/assets/hero-coffee.jpg";

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="pt-40 pb-16 bg-gradient-cream">
      <div className="container text-center animate-fade-in">
        <span className="divider-gold text-xs tracking-[0.3em] uppercase">عن مهيام</span>
        <h1 className="font-display text-5xl md:text-6xl text-primary mt-4">
          قصةٌ تُروى <span className="text-gradient-gold italic">برائحة القهوة</span>
        </h1>
      </div>
    </section>

    {/* Meaning */}
    <section className="py-20">
      <div className="container grid gap-14 lg:grid-cols-2 items-center">
        <div className="reveal">
          <span className="divider-gold text-xs tracking-[0.3em] uppercase">معنى الاسم</span>
          <h2 className="font-display text-4xl md:text-5xl text-primary mt-4 leading-tight">
            ما معنى <span className="text-gradient-gold italic">«مهيام»؟</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-loose text-lg">
            في معاجم اللغة العربية، «المُهَيَّم» هو الذي استبدّ به الحب فأذهب عقله شغفًا.
            اخترنا هذا الاسم لأنّ علاقتنا بالقهوة ليست عادةً عابرة، بل عشقٌ يتجدّد كل صباح.
          </p>
          <p className="mt-4 text-muted-foreground leading-loose">
            في مهيام، نؤمن أنّ القهوة ليست مجرد مشروب… بل لحظة تأمّل، لقاء صديق،
            ورسالة دفء تُهدى من فنجانٍ إلى قلب.
          </p>
        </div>
        <div className="reveal">
          <div className="relative">
            <div className="absolute -inset-6 bg-gold/20 blur-3xl rounded-full" />
            <img
              src={aboutImg}
              alt="دلة قهوة عربية وفنجان وتمر"
              width={1280}
              height={1280}
              loading="lazy"
              className="relative rounded-2xl shadow-elegant w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Story timeline */}
    <section className="py-20 bg-gradient-dark text-cream">
      <div className="container">
        <SectionTitle eyebrow="رحلتنا" title="من فكرةٍ إلى عشقٍ يُشاركه الناس" />
        <div className="mt-16 max-w-3xl mx-auto space-y-10">
          {[
            { y: "٢٠٢١", t: "البذرة الأولى", d: "بدأت الحكاية بفنجان مشترك بين أصدقاء، وحلمٍ بإحياء طقس القهوة العربية بثوبٍ معاصر." },
            { y: "٢٠٢٢", t: "البحث عن الكمال", d: "زرنا مزارع البنّ في إثيوبيا واليمن، واخترنا الحبوب التي تشبه قصصنا." },
            { y: "٢٠٢٣", t: "أبواب مهيام تُفتح", d: "افتتحنا أول فروعنا في الرياض، وكان أول فنجان كأول قُبلة… لا يُنسى." },
            { y: "اليوم", t: "نكتب الفصل القادم", d: "نوسّع عائلتنا، ونُشارك العالم لغةً جديدة للقهوة اسمها… مهيام." },
          ].map((e, i) => (
            <div key={i} className="reveal flex gap-6 items-start">
              <div className="shrink-0 w-20 text-center">
                <span className="font-display text-2xl text-gradient-gold block">{e.y}</span>
                <div className="h-px w-full bg-gold/40 mt-2" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-cream mb-2">{e.t}</h3>
                <p className="text-cream/75 leading-loose">{e.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-24">
      <div className="container">
        <SectionTitle eyebrow="ما نؤمن به" title="ثلاث كلمات… وفنجان واحد" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { t: "الأصالة", d: "نحفظ روح القهوة العربية ونُقدّمها بصدقٍ كما تستحق." },
            { t: "الشغف", d: "نُحضّر كل فنجان بقلبٍ نابض، لأن النكهة تبدأ من النيّة." },
            { t: "الجمال", d: "نؤمن أن الذوق يشمل العين كما يشمل اللسان." },
          ].map((v, i) => (
            <div
              key={v.t}
              className="reveal text-center p-8 rounded-2xl bg-gradient-cream border border-border/60"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <h3 className="font-display text-3xl text-gradient-gold mb-3">{v.t}</h3>
              <p className="text-muted-foreground leading-loose">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Quote */}
    <section className="relative py-32 overflow-hidden">
      <img src={heroImg} alt="" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-espresso/80" />
      <div className="container relative z-10 text-center text-cream reveal">
        <p className="font-display italic text-3xl md:text-5xl leading-relaxed max-w-3xl mx-auto">
          «في كل فنجانٍ من مهيام… حكايةُ عاشقٍ لم يكتمل لقاؤه إلا بالقهوة.»
        </p>
        <span className="block mt-6 text-gold-soft tracking-widest text-sm">— فريق مهيام</span>
      </div>
    </section>
  </Layout>
);

export default About;
