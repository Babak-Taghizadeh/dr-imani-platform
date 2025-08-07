"use client";

import { CONTACT_ITEMS } from "@/lib/constants";
import { motion } from "motion/react";
import Link from "next/link";
import SectionHeader from "../../shared/section-header";

const ContactDetails = () => {
  return (
    <section>
      <SectionHeader
        title="در تماس باشید"
        description="برای دریافت اطلاعات، رزرو نوبت یا ارتباط با کلینیک خواب، از طریق اطلاعات تماس زیر اقدام کنید."
        theme="dark"
      />
      <ul className="flex flex-col md:flex-1/2">
        {CONTACT_ITEMS.map((item, index) => (
          <li
            className="border-primary/60 flex items-center gap-4 border-b py-5 last:border-0"
            key={item.title}
          >
            <motion.div
              className="text-background/80"
              whileHover={{ scale: 1.1, color: "var(--primary)" }}
            >
              {item.icon}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.5,
              }}
            >
              {item.value ? (
                <Link
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background text-lg font-medium hover:underline md:text-xl"
                >
                  {item.title}
                </Link>
              ) : (
                <div className="text-background text-lg font-medium md:text-xl">
                  {item.title}
                </div>
              )}
              <p className="text-secondary/70 mt-1 text-sm md:text-lg!">
                {item.desc}
              </p>
            </motion.div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ContactDetails;
