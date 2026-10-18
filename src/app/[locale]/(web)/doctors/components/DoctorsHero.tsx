"use client";

import { Container } from "@/src/components/ui/Container";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle: string;
};

export function DoctorsHero({ title, subtitle }: Props) {
  return (
    <section className="public-page-hero border-b border-border py-12 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionHeader title={title} subtitle={subtitle} />
        </motion.div>
      </Container>
    </section>
  );
}
