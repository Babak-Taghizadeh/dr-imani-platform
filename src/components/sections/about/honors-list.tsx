"use client"

import { Badge } from "@/components/ui/badge";
import { ABOUT_ME_ITEMS } from "@/lib/constants";
import { AwardIcon } from "lucide-react";
import { motion } from "motion/react";

const HonorsList = () => {
  return (
    <div className="grid h-full gap-6 sm:grid-cols-2 py-4">
      {ABOUT_ME_ITEMS.honors.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4 rounded-lg py-4 transition-colors"
        >
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <AwardIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-semibold">{item.title}</h3>
              <Badge className="mr-2 h-fit" variant="secondary">
                {item.year}
              </Badge>
            </div>
            {item.description && (
              <p className="text-muted-foreground mt-1 text-sm">
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
