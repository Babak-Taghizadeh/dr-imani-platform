import ContactDetails from "@/components/sections/contact-us/contact-details";
import MapWrapper from "@/components/sections/contact-us/map-wrapper";

const Contact = () => {
  return (
    <section className="bg-foreground text-background flex min-h-[700px] flex-col gap-12 px-8 py-12 md:justify-center md:gap-16 lg:flex-row">
      <ContactDetails />
      <div className="relative z-50 h-[40dvh] w-full self-center md:w-[60%] lg:min-h-[50dvh]">
        <MapWrapper />
      </div>
    </section>
  );
};

export default Contact;
