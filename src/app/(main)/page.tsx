import ClinicSupervised from "@/components/sections/home/clinic-supervised";
import Faq from "@/components/sections/home/faq";
import Hero from "@/components/sections/home/hero";
import SeminarVideo from "@/components/sections/home/seminar-video";
import ServicesSummary from "@/components/sections/home/services-summary";
import WhyChooseUs from "@/components/sections/home/why-choose-us";

const Home = () => {
  return (
    <>
      <Hero />
      <ClinicSupervised />
      <ServicesSummary />
      <WhyChooseUs />
      <SeminarVideo />
      <Faq />
    </>
  );
};

export default Home;
