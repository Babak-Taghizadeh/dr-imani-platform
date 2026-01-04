import SectionHeader from "../../shared/section-header";

export function BookingHero() {
  return (
    <section
      className="bg-background relative overflow-hidden px-4 py-8 md:py-12"
      aria-label="رزرو نوبت"
    >
      <SectionHeader
        title="رزرو نوبت اینترنتی"
        description="به راحتی و در چند مرحله ساده، نوبت خود را رزرو کنید."
        theme="light"
      />

      {/* Bottom accent line */}
      <div className="via-primary/30 absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent to-transparent" />
    </section>
  );
}
