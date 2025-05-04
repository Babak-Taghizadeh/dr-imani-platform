import Sleep from "../../../public/sleep.jpeg";
import { SERVICES_ITEMS } from "@/lib/constants";
import PicList from "../shared/pic-list";

const ServicesSummary = () => {
  return <PicList items={SERVICES_ITEMS} pic={Sleep} theme="light" />;
};

export default ServicesSummary;
