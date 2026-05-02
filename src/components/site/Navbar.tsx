import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/menu", label: "القائمة" },
  { to: "/about", label: "عن مهيام" },
  { to: "/reserve", label: "احجز طاولة" },
  { to: "/contact", label: "تواصل معنا" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/85 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" aria-label="مهيام – الرئيسية">
          <img src={logo} alt="شعار مهيام" width={48} height={48} className="h-12 w-12 object-contain" />
          <span className={cn(
            "font-display text-2xl font-bold transition-colors",
            scrolled ? "text-primary" : "text-cream"
          )}>
            مهيام
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative text-sm font-medium tracking-wide transition-colors after:content-[''] after:absolute after:right-0 after:-bottom-1 after:h-px after:bg-accent after:transition-all after:duration-500",
                  scrolled ? "text-primary/80 hover:text-primary" : "text-cream/90 hover:text-cream",
                  isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/reserve"
          className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-gold text-espresso font-semibold text-sm shadow-gold hover:shadow-elegant transition-all duration-500 hover:scale-105"
        >
          احجز طاولة
        </Link>

        <button
          className={cn("md:hidden p-2", scrolled ? "text-primary" : "text-cream")}
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500 bg-background/95 backdrop-blur-md",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="container flex flex-col py-4 gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "py-3 px-2 rounded-md text-primary/85 transition-colors",
                  isActive ? "bg-secondary text-primary font-bold" : "hover:bg-secondary/60"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="https://wa.me/966500000000"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex justify-center items-center px-5 py-3 rounded-full bg-gradient-gold text-espresso font-semibold"
          >
            اطلب الآن عبر واتساب
          </a>
        </nav>
      </div>
    </header>
  );
};
