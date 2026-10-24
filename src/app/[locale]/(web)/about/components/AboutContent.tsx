"use client";

import { Container } from "@/src/components/ui/Container";
import { MotionViewport } from "@/src/components/ui/MotionViewport";

export function AboutContent({ children }: { children: React.ReactNode }) {
  return (
    <Container className="mt-12 md:mt-16">
      <MotionViewport className="rounded-card border border-border bg-card p-6 shadow-card md:p-10">
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          {children}
        </p>
      </MotionViewport>
    </Container>
  );
}
