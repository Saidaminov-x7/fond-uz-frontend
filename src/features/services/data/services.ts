import type { FundItem, ServiceProfession } from "@/src/types/domain";

export const professions: ServiceProfession[] = [
  { slug: "kardiologiya", name: "Кардиология", fundsCount: 0 },
  { slug: "neyroxirurgiya", name: "Нейрохирургия", fundsCount: 0 },
  { slug: "onkologiya", name: "Онкология", fundsCount: 0 },
  { slug: "reabilitatsiya", name: "Реабилитация", fundsCount: 0 },
];

// Partner listings are real records and must be entered through the admin panel.
export const funds: FundItem[] = [];
