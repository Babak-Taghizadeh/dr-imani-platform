"use client";

import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";
import { GraduationCap, Building2, Calendar } from "lucide-react";
import { EducationItem } from "@/lib/types";

const EducationList = () => {
  const educationItems: EducationItem[] = ABOUT_ME_ITEMS.education;

  return (
    <div className="flex h-full flex-col gap-16 py-4 lg:mt-6">
      {educationItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="group relative"
        >
          <div className="bg-primary/30 absolute top-1 left-0 h-[calc(100%-8px)] w-0.5" />

          <div className="bg-primary absolute top-1 -left-[3px] h-2 w-2 rounded-full" />

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <GraduationCap className="text-primary h-4 w-4" />
              <h3 className="text-lg font-semibold">{item.degree}</h3>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                <span>{item.institution}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.years}</span>
              </div>
            </div>

            {item.description && (
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            )}

            {/* {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/90 hover:text-primary mt-2 inline-flex items-center text-sm font-medium transition-colors group-hover:underline"
              >
                View credentials
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            )} */}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EducationList;
