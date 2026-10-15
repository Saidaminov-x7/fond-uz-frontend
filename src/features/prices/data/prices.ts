import type { PriceItem } from "@/src/types/domain";

export const prices: PriceItem[] = [
  { id: "consultation", title: "Консультация специалиста", price: "Уточняйте у медицинской организации", includes: ["Первичная консультация", "Перечень документов по запросу"] },
  { id: "diagnostics", title: "Диагностическая программа", price: "Уточняйте у медицинской организации", includes: ["Состав обследования определяется врачом", "Стоимость подтверждается клиникой"] },
];
