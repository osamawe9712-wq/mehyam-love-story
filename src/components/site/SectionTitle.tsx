interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "right";
}

export const SectionTitle = ({ eyebrow, title, subtitle, align = "center" }: Props) => (
  <div className={`reveal max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-right"}`}>
    {eyebrow && (
      <span className="divider-gold text-xs tracking-[0.3em] uppercase font-medium mb-4">
        {eyebrow}
      </span>
    )}
    <h2 className="font-display text-4xl md:text-5xl text-primary mt-3 leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-muted-foreground text-base md:text-lg leading-loose">
        {subtitle}
      </p>
    )}
  </div>
);
