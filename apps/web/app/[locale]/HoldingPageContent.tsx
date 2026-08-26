"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export function HoldingPageContent({
  lead,
  contactLabel,
}: {
  lead: string;
  contactLabel: string;
}) {
  const reduce = useReducedMotion();

  return (
    <main className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[linear-gradient(180deg,#C8C2F4_0%,#CBBDEC_45%,#D6B9E7_100%)] bg-[length:100%_220%] px-lg py-huge motion-safe:animate-[gradient-drift_14s_ease-in-out_infinite]">
      <motion.div
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "show"}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col"
      >
        <motion.p
          variants={reduce ? undefined : item}
          className="text-2xl font-normal text-ink md:text-3xl"
        >
          {lead}
        </motion.p>
        <h1 className="text-6xl font-black uppercase leading-[0.95] tracking-tight text-ink md:text-8xl">
          <motion.span variants={reduce ? undefined : item} className="block">
            Somos
          </motion.span>
          <motion.span variants={reduce ? undefined : item} className="ml-[0.35em] block">
            United
          </motion.span>
        </h1>
        <motion.a
          variants={reduce ? undefined : item}
          href="mailto:tech@somosunited.ch"
          whileHover={reduce ? undefined : { x: 6 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="mt-md inline-block text-xl text-ink underline decoration-1 underline-offset-4 md:text-2xl"
        >
          {contactLabel} →
        </motion.a>
      </motion.div>
    </main>
  );
}
