import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  desc: string;
  className?: string;
}

const ServiceCard = ({ title, desc, className }: CardProps) => (
  <motion.div
    whileHover={{
      scale: 1.02,
      y: -4,
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
    }}
    className={cn("h-full w-full", className)}
  >
    <Card className="from-foreground to-primary shadow-primary/65 relative h-full overflow-hidden border-none bg-gradient-to-b p-[1px] shadow-lg transition-all duration-300 hover:shadow-xl sm:w-[350px]">
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 rounded-lg p-6">
        <CardTitle className="text-background text-center text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </CardTitle>
        <CardDescription className="text-background/85 text-center text-sm leading-relaxed md:text-base">
          {desc}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

export default ServiceCard;
