import PicList from "@/components/shared/pic-list";
import Sleep from "../../../../public/sleep-service.png";
import ServiceCarousel from "./service-carousel";

const ServicesSummary = () => {
  return (
    <PicList
      InfoElement={<ServiceCarousel />}
      pic={Sleep}
      theme="light"
      alt="تحلیل خواب"
      orientation="landscape"
    />
  );
};

export default ServicesSummary;
