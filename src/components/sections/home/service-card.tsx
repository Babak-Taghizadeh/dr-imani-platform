import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface CardProps {
  title: string;
  desc: string;
  icon?: React.ReactNode;
  details?: string[];
  className?: string;
}

const ServiceCard = ({ title, desc, icon, details, className }: CardProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={cn("h-full w-full", className)}
      role="article"
      aria-label={`Service: ${title}`}
      itemScope
      itemType="https://schema.org/MedicalProcedure"
    >
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: title,
          description: desc,
          medicalSpecialty: {
            "@type": "MedicalSpecialty",
            name: "SleepMedicine",
          },
        })}
      </script>

      <Card
        className="group relative h-full w-[280px] overflow-hidden border-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 sm:w-[320px] md:w-[380px] lg:w-[420px]"
        aria-labelledby={`service-title-${title.replace(/\s+/g, "-")}`}
        aria-describedby={`service-desc-${title.replace(/\s+/g, "-")}`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div
          className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-xl transition-all duration-500 group-hover:scale-150 sm:h-20 sm:w-20 md:h-24 md:w-24"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-tr from-pink-400/20 to-orange-500/20 blur-xl transition-all duration-500 group-hover:scale-150 sm:h-24 sm:w-24 md:h-32 md:w-32"
          aria-hidden="true"
        />

        <CardHeader className="relative z-10 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md sm:h-12 sm:w-12 sm:rounded-xl"
                aria-hidden="true"
              >
                {icon}
              </div>
              <div>
                <CardTitle
                  id={`service-title-${title.replace(/\s+/g, "-")}`}
                  className="text-base font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-700 sm:text-lg md:text-xl"
                  itemProp="name"
                >
                  {title}
                </CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          <CardDescription
            id={`service-desc-${title.replace(/\s+/g, "-")}`}
            className="mb-3 text-xs leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700 sm:mb-4 sm:text-sm md:text-base"
            itemProp="description"
          >
            {desc}
          </CardDescription>

          {details && (
            <div className="mb-3 space-y-1.5 sm:mb-4 sm:space-y-2" role="list">
              {details.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start gap-1.5 text-xs text-gray-600 sm:gap-2"
                  role="listitem"
                >
                  <CheckCircle2
                    className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 text-green-500 sm:h-3 sm:w-3"
                    aria-hidden="true"
                  />
                  <span className="text-xs leading-relaxed sm:text-xs">
                    {detail}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <div
          className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 group-hover:w-full"
          aria-hidden="true"
        />
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
