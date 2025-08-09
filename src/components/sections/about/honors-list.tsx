"use client";

import { Badge } from "@/components/ui/badge";
import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { AwardIcon } from "lucide-react";
import { motion } from "framer-motion";

const HonorsList = () => {
  return (
    <div className="grid h-full gap-4 py-4 sm:grid-cols-2 sm:gap-6">
      {ABOUT_ME_ITEMS.honors.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 rounded-lg p-3 transition-colors sm:gap-4 sm:p-4"
        >
          <div className="bg-primary/10 text-primary rounded-full p-1.5 sm:p-2">
            <AwardIcon className="h-4 w-4 text-red-400 sm:h-5 sm:w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold sm:text-base">
                {item.title}
              </h3>
              <Badge className="h-fit text-xs sm:text-sm" variant="secondary">
                {item.year}
              </Badge>
            </div>
            {item.description && (
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                {item.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HonorsList;
