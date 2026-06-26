"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/lib/constants";
import styles from "./FAQAccordion.module.css";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.accordion}>
      {FAQS.map((faq, index) => (
        <div key={index} className={styles.item}>
          <button
            className={`${styles.question} ${openIndex === index ? styles.active : ""}`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span>{faq.question}</span>
            <motion.span
              className={styles.icon}
              animate={{ rotate: openIndex === index ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              +
            </motion.span>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                className={styles.answer}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p>{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
