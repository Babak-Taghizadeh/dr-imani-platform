import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";

const ExperienceList = () => {
  return (
    <ul className="mt-10 space-y-4 lg:mt-0">
      {ABOUT_ME_ITEMS.experience.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, type: "spring" }}
          className="group"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="bg-primary mt-1 h-3 w-3 flex-shrink-0 rounded-full" />
                <div>
                  <h3 className="text-lg font-semibold">{item.position}</h3>
                  <p className="text-muted-foreground">{item.hospital}</p>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="group-hover:bg-primary/10 text-white transition-colors"
            >
              {item.years}
            </Badge>
          </div>
          {index < ABOUT_ME_ITEMS.experience.length - 1 && (
            <Separator className="my-4 ml-7 w-[calc(100%-28px)]" />
          )}
        </motion.li>
      ))}
    </ul>
  );
};

export default ExperienceList;
