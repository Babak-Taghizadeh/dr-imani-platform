import PicList from "@/components/shared/pic-list";
import Avatar from "../../../../public/dr-imani.jpeg";
import AboutCycle from "@/components/sections/about/about-cycle";

const AboutMe = () => {
  return <PicList InfoElement={<AboutCycle />} pic={Avatar} theme="dark" />;
};

export default AboutMe;
