import { Link } from "react-router-dom";
import { Instagram, Twitter, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Footer = () => {
  const { settings, whatsappLink } = useSiteSettings();
  const { get } = useSiteContent();

  const tagline = get("footer", "tagline", "حيث القهوة قصة عشق");
  const description = get(
    "footer",
    "description",
    "مقهى يجمع بين دفء التراث وأناقة الحاضر. كل فنجان قصة، وكل رشفة لقاء."
  );

  const socials = [
    { Icon: Instagram, href: settings.instagram_url || "#", label: "انستغرام" },
    { Icon: Twitter, href: settings.twitter_url || "#", label: "تويتر" },
    { Icon: MessageCircle, href: whatsappLink, label: "واتساب" },
  ];

  return (
    <footer className="bg-gradient-dark text-cream/80 mt-24">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="مهيام" width={48} height={48} className="h-12 w-12" />
            <span className="font-display text-3xl text-cream">مهيام</span>
          </div>
          <p className="font-display italic text-gold-soft text-lg mb-2">{tagline}</p>
          <p className="leading-loose text-cream/70 max-w-md">{description}</p>
        </div>

        <div>
          <h4 className="text-cream mb-4 font-bold">روابط</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-gold transition-colors">الرئيسية</Link></li>
            <li><Link to="/menu" className="hover:text-gold transition-colors">القائمة</Link></li>
            <li><Link to="/about" className="hover:text-gold transition-colors">عن مهيام</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream mb-4 font-bold">تابعنا</h4>
          <div className="flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="h-10 w-10 grid place-items-center rounded-full border border-cream/20 hover:bg-gold hover:text-espresso hover:border-gold transition-all duration-500"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs mt-6 text-cream/50">{settings.address}</p>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container py-5 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} مهيام. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};
