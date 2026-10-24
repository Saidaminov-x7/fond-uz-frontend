import { Container } from "@/src/components/ui/Container";
import { Button } from "@/src/components/ui/Button";
import { faqs } from "@/src/features/faqs/data/faqs";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MotionViewport } from "@/src/components/ui/MotionViewport";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function FAQDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tc = await getTranslations("common");

  // Since faqs data doesn't have IDs, we use index if it's a number, 
  // or just show not found if the user is asking for arbitrary IDs.
  const index = parseInt(slug) - 1;
  const faq = faqs[index];

  if (!faq) {
    notFound();
  }

  return (
    <div className="public-page-flow">
      <section className="public-page-hero border-b border-border py-12 md:py-16">
        <Container>
          <MotionViewport
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="max-w-3xl font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">
              {faq.question}
            </h1>
          </MotionViewport>
        </Container>
      </section>

      <Container className="mt-12 md:mt-16">
        <MotionViewport
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-card border border-border bg-card p-6 shadow-card md:p-10"
        >
          <p className="text-sm leading-8 text-muted-foreground md:text-lg">
            {faq.answer}
          </p>
          <div className="mt-10 border-t border-border pt-8">
            <Button href="/faqs" variant="secondary">
              {tc("backToList")}
            </Button>
          </div>
        </MotionViewport>
      </Container>
    </div>
  );
}
