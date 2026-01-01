import { cn } from "@/lib/utils";
import { AnimatedSection } from "./animated-section";

const SectionHeader = ({
  title,
  description,
  className = "",
  theme = "light",
}: {
  title: string;
  description?: string;
  className?: string;
  theme?: "light" | "dark";
}) => {
  return (
    <section className={cn("text-center", className)}>
      <AnimatedSection
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h3
          className={cn(
            "bg-gradient-to-r bg-clip-text p-3 text-3xl font-bold tracking-tight text-transparent md:text-4xl",
            theme === "dark"
              ? "from-background via-primary to-background brightness-125"
              : "from-foreground via-primary to-foreground",
          )}
        >
          {title}
        </h3>
      </AnimatedSection>
      {description && (
        <AnimatedSection
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p
            className={cn(
              "text-muted-foreground mx-auto max-w-2xl text-sm leading-7 tracking-tight md:text-xl",
              theme === "dark" ? "text-muted-foreground" : "text-foreground/75",
            )}
          >
            {description}
          </p>
        </AnimatedSection>
      )}
    </section>
  );
};

export default SectionHeader;
