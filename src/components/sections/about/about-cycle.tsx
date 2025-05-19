"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import EducationList from "./education-list";
import ExperienceList from "./experience-list";
import HonorsList from "./honors-list";

const AboutCycle = () => {
  const [activeTab, setActiveTab] = useState("تحصیلات");
  return (
    <div className="overflow-hidden px-2 lg:w-1/2">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full items-center"
      >
        <TabsList className="bg-secondary/80 shadow-primary/60 shadow-lg">
          <TabsTrigger value="تحصیلات">تحصیلات</TabsTrigger>
          <TabsTrigger value="سوابق کاری">سوابق کاری</TabsTrigger>
          <TabsTrigger value="افتخارات">افتخارات</TabsTrigger>
        </TabsList>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-full flex-col items-center justify-center"
          >
            <TabsContent value="تحصیلات">
              <EducationList />
            </TabsContent>
            <TabsContent
              className="flex flex-col justify-center"
              value="سوابق کاری"
            >
              <ExperienceList />
            </TabsContent>
            <TabsContent value="افتخارات">
              <HonorsList />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default AboutCycle;
