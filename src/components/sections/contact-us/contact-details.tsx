import { CONTACT_ITEMS } from "@/lib/constants";
import Link from "next/link";
import SectionHeader from "../../shared/section-header";
import { AnimatedSection } from "@/components/shared/animated-section";

const ContactDetails = () => {
  return (
    <section className="my-auto">
      <SectionHeader
        title="در تماس باشید"
        description="برای دریافت اطلاعات و یا ارتباط با کلینیک خواب، از طریق اطلاعات تماس زیر اقدام کنید."
        theme="dark"
      />
      <ul className="flex flex-col">
        {CONTACT_ITEMS.map((item, index) => (
          <li
            className="border-primary/60 flex items-center gap-4 border-b py-5 last:border-0"
            key={item.title}
          >
            <AnimatedSection className="text-background/80 hover:text-primary transition-transform hover:scale-110">
              {item.icon}
            </AnimatedSection>
            <AnimatedSection
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
              }}
            >
              {item.value ? (
                <Link
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background text-lg font-medium hover:underline md:text-xl"
                >
                  {item.title}
                </Link>
              ) : (
                <div className="text-background text-lg font-medium md:text-xl">
                  {item.title}
                </div>
              )}
              <p className="text-secondary/70 mt-1 text-sm md:text-lg!">
                {item.desc}
              </p>
            </AnimatedSection>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContactDetails;
