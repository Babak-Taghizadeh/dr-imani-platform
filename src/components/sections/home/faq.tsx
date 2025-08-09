import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/constants";

const Faq = () => {
  return (
    <section
      className="bg-foreground text-background p-10 md:p-14"
      aria-labelledby="faq-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h4
        id="faq-heading"
        itemProp="mainEntity"
        className="text-background mb-8 text-xl font-bold md:text-3xl lg:mb-12"
      >
        {FAQ_ITEMS[0].title}
      </h4>
      <Accordion
        type="single"
        collapsible
        className="flex w-full flex-col items-center justify-center"
      >
        {FAQ_ITEMS.map((item, index) =>
          index === 0 ? null : (
            <AccordionItem
              className="w-full md:w-1/2"
              value={item.title}
              key={item.title}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <AccordionTrigger
                className="text-right font-semibold"
                aria-controls={`answer-${index}`}
                id={`question-${index}`}
                itemProp="name"
              >
                {item.title}
              </AccordionTrigger>
              <AccordionContent
                className="text-background/80 text-sm font-light"
                id={`answer-${index}`}
                aria-labelledby={`question-${index}`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                {item.desc}
              </AccordionContent>
            </AccordionItem>
          ),
        )}
      </Accordion>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.slice(1).map((item) => ({
            "@type": "Question",
            name: item.title,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.desc,
            },
          })),
        })}
      </script>
    </section>
  );
};

export default Faq;
