import { Container } from "@/src/components/ui/Container";

type Fund = {
  id: string;
  name: string;
  phone: string;
  website: string;
  description?: string;
  professionSlug: string;
};

type Props = {
  funds: Fund[];
  phoneLabel: string;
  websiteLabel: string;
  extraInfoLabel: string;
  partnerTitle: string;
  emptyText: string;
};

export function FundList({
  funds,
  phoneLabel,
  websiteLabel,
  extraInfoLabel,
  partnerTitle,
  emptyText,
}: Props) {
  const safeWebsite = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
    } catch { return null; }
  };
  return (
    <Container className="mt-10 md:mt-12">
      <div className="space-y-6">
        {funds.map((fund) => (
          <div
            key={fund.id}
            className="rounded-lg border border-border bg-card p-6 md:p-8 transition-colors hover:border-primary/40"
          >
            <h2 className="font-serif text-2xl text-foreground mb-6">{fund.name}</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <dt className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{phoneLabel}</dt>
                <dd>
                  <a
                    href={`tel:${fund.phone.replace(/\s/g, "")}`}
                    className="text-lg font-serif text-primary hover:underline transition-colors"
                  >
                    {fund.phone}
                  </a>
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{websiteLabel}</dt>
                <dd>
                  {safeWebsite(fund.website) ? <a
                    href={safeWebsite(fund.website)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-serif text-primary hover:underline transition-colors"
                  >
                    {fund.website}
                  </a> : <span className="text-muted-foreground">{fund.website}</span>}
                </dd>
              </div>
              {fund.description ? (
                <div className="md:col-span-2 space-y-2 mt-2 border-t border-border/50 pt-4">
                  <dt className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{extraInfoLabel}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/30 italic">
                    {fund.description}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        ))}
        {funds.length > 0 ? (
          <div className="rounded-lg border border-border bg-muted p-5 text-center text-sm text-muted-foreground">{partnerTitle}</div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
      </div>
    </Container>
  );
}
