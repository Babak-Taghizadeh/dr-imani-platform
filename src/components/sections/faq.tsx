import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/constants";

const Faq = () => {
  return (
    <section className="bg-foreground text-background p-10 md:p-14">
      <h4 className="mb-8 text-xl font-bold text-background md:text-3xl lg:mb-12">
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
            >
              <AccordionTrigger className="text-right font-semibold">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm font-light text-gray-300">
                {item.desc}
              </AccordionContent>
            </AccordionItem>
          ),
        )}
      </Accordion>
    </section>
  );
};

export default Faq;
