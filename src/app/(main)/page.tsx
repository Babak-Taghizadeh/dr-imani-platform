import ClinicSupervised from "@/components/sections/home/clinic-supervised";
import Faq from "@/components/sections/home/faq";
import Hero from "@/components/sections/home/hero";
import ServicesSummary from "@/components/sections/home/services-summary";
import WhyChooseUs from "@/components/sections/home/why-choose-us";

const Home = () => {
  return (
    <>
      <Hero />
      <ClinicSupervised />
      <ServicesSummary />
      <Faq />
      <WhyChooseUs />
    </>
  );
};

export default Home;
