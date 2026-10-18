"use client";

import { Container } from "@/src/components/ui/Container";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle: string;
};

export function AboutHero({ title, subtitle }: Props) {
  return (
    <section className="public-page-hero border-b border-border py-12 md:py-16">
      <Container>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl font-serif text-3xl text-foreground md:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          {subtitle}
        </motion.p>
      </Container>
    </section>
  );
}
