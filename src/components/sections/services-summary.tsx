import Sleep from "../../../public/sleep.jpeg";
import PicList from "../shared/pic-list";
import ServiceCarousel from "./service-carousel";

const ServicesSummary = () => {
  return (
    <PicList InfoElement={<ServiceCarousel />} pic={Sleep} theme="light" />
  );
};

export default ServicesSummary;
