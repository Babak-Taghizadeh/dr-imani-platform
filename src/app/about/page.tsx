import PicList from "@/components/shared/pic-list";
import Avatar from "../../../public/dr.jpg";
import { ABOUT_ME_ITEMS } from "@/lib/constants";

const AboutMe = () => {
  return <PicList items={ABOUT_ME_ITEMS} pic={Avatar} theme="dark" />;
};

export default AboutMe;
