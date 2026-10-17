"use client";

import { motion, type Variants } from "framer-motion";

type Props = {
  phoneLabel: string;
  phoneValue: string;
  emailLabel: string;
  emailValue: string;
  addressLabel: string;
  addressValue: string;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function ContactsInfo({
  phoneLabel,
  phoneValue,
  emailLabel,
  emailValue,
  addressLabel,
  addressValue,
}: Props) {
  return (
    <dl className="mt-10 space-y-6 text-left">
      {[0, 1, 2].map((_, i) => {
        const labels = [phoneLabel, emailLabel, addressLabel];
        const values = [phoneValue, emailValue, addressValue];
        const icons = [
          <svg key="1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
          <svg key="2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
          <svg key="3" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        ];
        const label = labels[i];
        const value = values[i];
        const icon = icons[i];

        if (!value) return null;

        return (
          <motion.div
            key={label}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="flex gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
              {icon}
            </div>
            <div>
              <dt className="font-serif text-base text-foreground">{label}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {i < 2 ? (
                  <a href={`${i === 0 ? 'tel:' : 'mailto:'}${value.replace(/\s/g, "")}`} className="hover:text-foreground">
                    {value}
                  </a>
                ) : (
                  <span>{value}</span>
                )}
              </dd>
            </div>
          </motion.div>
        );
      })}
    </dl>
  );
}
