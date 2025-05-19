import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";

interface CardProps {
  title: string;
  desc: string;
}

const ServiceCard = ({ title, desc }: CardProps) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className="h-full w-full"
  >
    <Card className="bg-foreground w-[250px] shadow-lg sm:w-[350px]">
      <CardContent className="text-background flex h-full flex-col gap-2 md:gap-4">
        <CardTitle className="text-center text-sm font-bold md:text-lg">
          {title}
        </CardTitle>
        <CardDescription className="text-background/80 text-center text-[12px] md:text-sm">
          {desc}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

export default ServiceCard;
