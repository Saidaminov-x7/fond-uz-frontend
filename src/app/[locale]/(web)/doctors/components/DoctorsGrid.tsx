"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { Container } from "@/src/components/ui/Container";
import { motion, type Variants } from "framer-motion";
import { MotionViewport } from "@/src/components/ui/MotionViewport";

type Doctor = {
  id: string;
  name: string;
  profession: string;
  image: string;
};

type Props = {
  doctors: Doctor[];
  openText: string;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function DoctorsGrid({ doctors, openText }: Props) {
  return (
    <Container className="mt-10 md:mt-14">
      <MotionViewport className="grid grid-cols-1 gap-15 sm:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doc, i) => (
          <motion.article
            key={doc.id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-border"
          >
            <div className="relative h-[250px] md:h-[250px] w-full overflow-hidden">
              <Image
                src={doc.image}
                alt={doc.name}
                fill
                unoptimized={doc.image.startsWith("https://")}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-col p-5 gap-3 items-start">
              <h3 className="font-serif text-2xl text-foreground">{doc.name}</h3>
              <p className="mt-1 text-lg text-muted-foreground">{doc.profession}</p>
              <Link
                href={`/doctors/${doc.id}`}
                className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                {openText}
              </Link>
            </div>
          </motion.article>
        ))}
      </MotionViewport>
    </Container>
  );
}
