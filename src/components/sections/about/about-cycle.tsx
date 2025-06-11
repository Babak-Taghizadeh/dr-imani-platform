"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { useState, useCallback } from "react";

import { TabType } from "./types";
import { ABOUT_TABS } from "@/lib/constants";

const AboutCycle = () => {
  const [activeTab, setActiveTab] = useState<TabType>("تحصیلات");

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as TabType);
  }, []);

  return (
    <div className="overflow-hidden px-2 lg:w-1/2">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="h-full"
      >
        <TabsList className="bg-background/90 border-border/50 mb-6 w-full rounded-xl border shadow-lg backdrop-blur-sm">
          {ABOUT_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent/50 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:shadow-sm"
            >
              <span className="hidden sm:inline">{tab.icon}</span>
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-[400px]"
        >
          {ABOUT_TABS.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
            >
              {tab.component}
            </TabsContent>
          ))}
        </motion.div>
      </Tabs>
    </div>
  );
};

export default AboutCycle;
