import { Badge } from "@/components/ui/badge";
import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";
import { GraduationCap, Calendar, Building2 } from "lucide-react";
import { EducationItem } from "./types";

const EducationList = () => {
  const educationItems: EducationItem[] = ABOUT_ME_ITEMS.education;

  return (
    <>
      <div className="grid gap-4 md:mt-12 md:grid-cols-2 lg:mt-0 lg:grid-cols-1 xl:mt-20 xl:grid-cols-2">
        {educationItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.2 },
            }}
            className="group"
          >
            <div className="border-primary/80 hover:border-primary/50 relative border-l-2 pb-4 pl-6 transition-colors duration-200">
              <div className="bg-primary border-background absolute top-0 left-[-5px] h-3 w-3 rounded-full border-2 shadow-sm" />

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary flex-shrink-0 rounded-md p-1.5">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="">
                    <h3 className="text-background group-hover:text-primary text-base font-semibold transition-colors duration-200">
                      {item.degree}
                    </h3>
                  </div>
                </div>

                <div className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <p className="text-sm">{item.institution}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 text-xs transition-colors duration-200"
                  >
                    {item.years}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default EducationList;
