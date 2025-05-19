"use client";

import MapWrapper from "@/components/sections/map-wrapper";
import { CONTACT_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";

const Contact = () => {
  return (
    <section className="bg-foreground text-background flex min-h-[575px] flex-col gap-12 px-8 py-12 md:justify-center md:gap-16 lg:flex-row">
      <div className="relative z-50 h-[40dvh] w-full self-center md:w-[80%] lg:min-h-[50dvh]">
        <MapWrapper />
      </div>
      <ul className="flex flex-col md:flex-1/2 md:gap-4">
        {CONTACT_ITEMS.map((item, index) =>
          index === 0 ? (
            <li key={item.title}>
              <motion.h4
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mb-4 text-3xl font-bold"
              >
                {item.title}
              </motion.h4>
            </li>
          ) : (
            <li
              className="flex items-center gap-4 py-2 lg:p-5"
              key={item.title}
            >
              <motion.div
                className="bg-primary rounded-md p-4"
                whileHover={{ rotate: 45 }}
              >
                {item.icon}
              </motion.div>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.3 }}
              >
                <h5 className="text-background text-xl font-semibold">
                  {item.title}
                </h5>
                <p className="text-secondary/70 mt-2 font-light">{item.desc}</p>
              </motion.div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

export default Contact;
