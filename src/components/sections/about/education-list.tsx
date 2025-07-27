import { Badge } from "@/components/ui/badge";
import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";
import { GraduationCap, Calendar, Building2, ArrowRight } from "lucide-react";
import { EducationItem } from "@/lib/types";

const EducationList = () => {
  const educationItems: EducationItem[] = ABOUT_ME_ITEMS.education;

  return (
    <div className="mt-10 grid h-full auto-rows-min place-items-center gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {educationItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.4,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: { duration: 0.2 },
          }}
          className="relative rounded-lg border p-5 backdrop-blur-sm transition-all"
        >          <div className="mb-4 flex items-start gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{item.degree}</h3>
              {item.field && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {item.field}
                </p>
              )}
            </div>
          </div>

          {/* Institution */}
          <div className="mb-3 flex items-center gap-3">
            <Building2 className="text-muted-foreground h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{item.institution}</p>
          </div>

          {/* Years */}
          <div className="mb-4 flex items-center gap-3">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary"
            >
              {item.years}
            </Badge>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Optional link/action */}
          {item.link && (
            <div className="mt-auto pt-2">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium transition-colors"
              >
                View credentials <ArrowRight className="mr-1 h-4 w-4" />
              </a>
            </div>
          )}

          {/* Decorative timeline element (alternative to your dot) */}
          <div className="bg-primary/10 absolute top-0 left-0 h-full w-1 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
};

export default EducationList;
