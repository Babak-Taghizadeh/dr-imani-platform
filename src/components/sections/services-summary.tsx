import Sleep from "../../../public/sleep-service.png";
import PicList from "../shared/pic-list";
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
