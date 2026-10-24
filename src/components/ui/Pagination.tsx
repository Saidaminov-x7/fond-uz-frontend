import { Link } from "@/src/i18n/routing";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      {Array.from({ length: totalPages }).map((_, idx) => {
        const page = idx + 1;
        const isActive = page === safePage;
        return (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-control border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:bg-muted hover:border-border"
            }`}
          >

            {page}
          </Link>
        );
      })}
    </nav>
  );
}
