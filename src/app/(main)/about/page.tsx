import PicList from "@/components/shared/pic-list";
import Avatar from "../../../../public/dr-imani.jpg";
import AboutCycle from "@/components/sections/about/about-cycle";

const AboutMe = () => {
  return (
    <PicList
      InfoElement={<AboutCycle />}
      pic={Avatar}
      theme="dark"
      alt="عکس دکتر ویدا ایمانی"
      orientation="portrait"
    />
  );
};

export default AboutMe;
