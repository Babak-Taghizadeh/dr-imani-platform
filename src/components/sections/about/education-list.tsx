import { Badge } from "@/components/ui/badge";
import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";

const EducationList = () => {
  return (
    <ul className="mt-10 grid h-full content-center gap-4 sm:grid-cols-2 md:gap-8 lg:mt-0 lg:grid-cols-1 xl:grid-cols-2 xl:grid-rows-[100px_100px]">
      {ABOUT_ME_ITEMS.education.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, type: "spring" }}
          className="border-primary/20 relative h-fit border-l-2 pb-6 pl-8"
        >
          <div className="bg-primary border-background absolute top-0 -left-[9px] h-4 w-4 rounded-full border-4" />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div>
              <h3 className="font-semibold md:text-lg">{item.degree}</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                {item.institution}
              </p>
            </div>
            <Badge variant="secondary" className="h-fit w-fit">
              {item.years}
            </Badge>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

export default EducationList;
