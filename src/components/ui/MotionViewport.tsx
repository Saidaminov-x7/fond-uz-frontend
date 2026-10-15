"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface Props extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  staggerChildren?: number;
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function MotionViewport({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  staggerChildren,
  ...props
}: Props) {
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const variants: Variants = {
    initial: {
      opacity: 0,
      x: direction === "left" ? distance : direction === "right" ? -distance : 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
        delay,
        staggerChildren,
      },
    },
  };

  return (
    <motion.div
      initial={reduceMotion ? false : "initial"}
      whileInView={reduceMotion ? undefined : "animate"}
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
