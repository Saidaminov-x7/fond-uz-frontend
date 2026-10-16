"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";

type Collection = "news" | "faqs" | "doctors" | "prices" | "services" | "funds";
type Item = { id: string; [key: string]: unknown };

const schema: Record<Collection, string[]> = {
  news: ["slug", "title", "titleEn", "titleUz", "subtitle", "subtitleEn", "subtitleUz", "date", "image", "content", "contentEn", "contentUz"],
  faqs: ["question", "questionEn", "questionUz", "answer", "answerEn", "answerUz"],
  doctors: ["name", "nameEn", "nameUz", "specialty", "specialtyEn", "specialtyUz", "bio", "bioEn", "bioUz", "email", "phone", "image"],
  prices: ["title", "titleEn", "titleUz", "price", "priceEn", "priceUz", "includes", "includesEn", "includesUz"],
  services: ["slug", "name", "nameEn", "nameUz", "description", "descriptionEn", "descriptionUz", "fundsCount"],
  funds: ["professionSlug", "name", "nameEn", "nameUz", "phone", "website", "description", "descriptionEn", "descriptionUz"],
};
const multiline = new Set(["content", "contentEn", "contentUz", "includes", "includesEn", "includesUz", "bio", "bioEn", "bioUz", "answer", "answerEn", "answerUz", "description", "descriptionEn", "descriptionUz"]);
const lists = new Set(["content", "contentEn", "contentUz", "includes", "includesEn", "includesUz"]);
const required: Record<Collection, string[]> = {
  news: ["slug", "title"], faqs: ["question", "answer"], doctors: ["name", "specialty"],
  prices: ["title", "price"], services: ["slug", "name", "description"], funds: ["professionSlug", "name", "website"],
};

const labels: Record<string, Record<string, string>> = {
  en: { news: "News", faqs: "FAQs", doctors: "Specialists", prices: "Service pricing", services: "Care areas", funds: "Partner organizations", search: "Search records", add: "Add record", edit: "Edit", delete: "Delete", save: "Save changes", cancel: "Cancel", loading: "Loading records…", empty: "No records found.", loadError: "Could not load records.", saveError: "Could not save this record.", deleteError: "Could not delete this record.", confirm: "Delete this record? This cannot be undone.", saved: "Changes saved.", deleted: "Record deleted.", records: "Records", content: "Content", actions: "Actions", title: "Title or name", summary: "Description", list: "One item per line", select: "Select a record to edit" },
  ru: { news: "Новости", faqs: "Вопросы и ответы", doctors: "Специалисты", prices: "Стоимость услуг", services: "Направления помощи", funds: "Партнёрские организации", search: "Поиск записей", add: "Добавить запись", edit: "Изменить", delete: "Удалить", save: "Сохранить", cancel: "Отмена", loading: "Загружаем записи…", empty: "Записей не найдено.", loadError: "Не удалось загрузить записи.", saveError: "Не удалось сохранить запись.", deleteError: "Не удалось удалить запись.", confirm: "Удалить эту запись? Действие нельзя отменить.", saved: "Изменения сохранены.", deleted: "Запись удалена.", records: "Записей", content: "Содержимое", actions: "Действия", title: "Название или имя", summary: "Описание", list: "По одному значению в строке", select: "Выберите запись для изменения" },
  uz: { news: "Yangiliklar", faqs: "Savol-javoblar", doctors: "Mutaxassislar", prices: "Xizmat narxlari", services: "Yordam yo‘nalishlari", funds: "Hamkor tashkilotlar", search: "Yozuvlarni qidirish", add: "Yozuv qo‘shish", edit: "Tahrirlash", delete: "O‘chirish", save: "Saqlash", cancel: "Bekor qilish", loading: "Yozuvlar yuklanmoqda…", empty: "Yozuvlar topilmadi.", loadError: "Yozuvlarni yuklab bo‘lmadi.", saveError: "Yozuvni saqlab bo‘lmadi.", deleteError: "Yozuvni o‘chirib bo‘lmadi.", confirm: "Bu yozuv o‘chirilsinmi? Amalni bekor qilib bo‘lmaydi.", saved: "O‘zgarishlar saqlandi.", deleted: "Yozuv o‘chirildi.", records: "Yozuvlar", content: "Kontent", actions: "Amallar", title: "Nomi yoki ism", summary: "Tavsif", list: "Har qatorda bittadan", select: "Tahrirlash uchun yozuvni tanlang" },
};
const humanize = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
const fieldNames: Record<string, Record<string, string>> = {
  ru: { slug: "Короткая ссылка", title: "Заголовок", subtitle: "Подзаголовок", date: "Дата", image: "Ссылка на изображение", content: "Текст", question: "Вопрос", answer: "Ответ", name: "Название или имя", specialty: "Специализация", bio: "Биография", email: "Электронная почта", phone: "Телефон", price: "Цена", includes: "Что включено", description: "Описание", fundsCount: "Число организаций", professionSlug: "Короткая ссылка направления", website: "Веб-сайт" },
  uz: { slug: "Qisqa havola", title: "Sarlavha", subtitle: "Taglavha", date: "Sana", image: "Rasm havolasi", content: "Matn", question: "Savol", answer: "Javob", name: "Nomi yoki ism", specialty: "Mutaxassislik", bio: "Tarjimai hol", email: "Elektron pochta", phone: "Telefon", price: "Narx", includes: "Nimalar kiradi", description: "Tavsif", fundsCount: "Tashkilotlar soni", professionSlug: "Yo‘nalish havolasi", website: "Veb-sayt" },
};
function fieldLabel(locale: string, key: string) {
  const base = key.replace(/(En|Uz)$/, "");
  const suffix = key.endsWith("En") ? (locale === "ru" ? " (англ.)" : " (English)") : key.endsWith("Uz") ? (locale === "ru" ? " (узб.)" : " (O‘zbekcha)") : "";
  return `${fieldNames[locale]?.[base] ?? humanize(base)}${suffix}`;
}
const recordLabel = (item: Item, fallback: string) => String(item.title ?? item.name ?? item.question ?? item.slug ?? fallback);
const recordSummary = (item: Item) => String(item.subtitle ?? item.specialty ?? item.answer ?? item.description ?? item.price ?? "");

export function AdminCollectionManager({ collection }: { collection: Collection }) {
  const locale = useLocale();
  const copy = labels[locale] ?? labels.en;
  const [items, setItems] = useState<Item[]>([]);
  const [edit, setEdit] = useState<Item | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch(`/api/admin/${collection}?limit=100&offset=0`, { cache: "no-store" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || copy.loadError);
    setItems(Array.isArray(body.items) ? body.items : []);
  }, [collection, copy.loadError]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/admin/${collection}?limit=100&offset=0`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || copy.loadError);
        if (active) { setItems(Array.isArray(body.items) ? body.items : []); setError(""); }
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : copy.loadError); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [collection, copy.loadError]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!edit) return;
    setSaving(true); setError(""); setNotice("");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(schema[collection].map((key) => {
      const raw = String(data.get(key) ?? "");
      const value = lists.has(key) ? raw.split("\n").map((line) => line.trim()).filter(Boolean) : key === "fundsCount" ? Math.max(0, Math.min(10_000, Number(raw) || 0)) : raw.trim();
      return [key, value];
    }));
    try {
      const id = edit.id ? `/${encodeURIComponent(edit.id)}` : "";
      const response = await fetch(`/api/admin/${collection}${id}`, { method: edit.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || copy.saveError);
      setEdit(null); await refresh(); setNotice(copy.saved);
    } catch (reason) { setError(reason instanceof Error ? reason.message : copy.saveError); }
    finally { setSaving(false); }
  }

  async function remove(item: Item) {
    if (!window.confirm(copy.confirm)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/${collection}/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error(copy.deleteError);
      await refresh(); setNotice(copy.deleted);
    } catch (reason) { setError(reason instanceof Error ? reason.message : copy.deleteError); }
    finally { setSaving(false); }
  }

  const visible = useMemo(() => items.filter((item) => JSON.stringify(item).toLocaleLowerCase().includes(query.toLocaleLowerCase())), [items, query]);

  return <section className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold text-primary">{copy.content}</p><h1 className="mt-1 text-3xl font-bold text-foreground">{copy[collection]}</h1><p className="mt-2 text-sm text-muted-foreground">{copy.records}: {items.length}</p></div>
      <div className="flex gap-2"><input aria-label={copy.search} placeholder={`${copy.search}…`} className="control-input min-w-0" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" onClick={() => { setEdit({ id: "" }); setError(""); setNotice(""); }} className="shrink-0 rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground">{copy.add}</button></div>
    </header>
    {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {edit && <form onSubmit={save} className="grid gap-4 rounded-lg border border-border bg-card p-5 sm:grid-cols-2">
      <h2 className="text-lg font-bold sm:col-span-2">{edit.id ? `${copy.edit}: ${recordLabel(edit, copy[collection])}` : copy.add}</h2>
      {schema[collection].map((key) => <label className="space-y-1 text-sm" key={key}><span className="font-medium text-foreground">{fieldLabel(locale, key)}{required[collection].includes(key) ? " *" : ""}</span>
        {multiline.has(key) ? <textarea rows={key.startsWith("content") || key.startsWith("includes") ? 6 : 4} name={key} required={required[collection].includes(key)} maxLength={8_000} defaultValue={Array.isArray(edit[key]) ? (edit[key] as string[]).join("\n") : String(edit[key] ?? "")} className="control-input min-h-24 w-full resize-y" placeholder={lists.has(key) ? copy.list : undefined} /> : <input name={key} type={key === "date" ? "date" : key === "fundsCount" ? "number" : key === "email" ? "email" : key === "website" ? "url" : "text"} min={key === "fundsCount" ? 0 : undefined} max={key === "fundsCount" ? 10_000 : undefined} required={required[collection].includes(key)} maxLength={2_000} defaultValue={String(edit[key] ?? "")} className="control-input w-full" />}
      </label>)}
      <div className="flex gap-2 sm:col-span-2"><button disabled={saving} className="rounded-md bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-50">{saving ? copy.loading : copy.save}</button><button type="button" onClick={() => setEdit(null)} className="rounded-md border border-border px-5 py-2">{copy.cancel}</button></div>
    </form>}
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid"><span>{copy.content}</span><span>{copy.actions}</span></div>
      {loading ? <p className="p-6 text-sm text-muted-foreground">{copy.loading}</p> : visible.length ? visible.map((item) => <article key={item.id} className="flex flex-col gap-4 border-b border-border p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="min-w-0"><h2 className="break-words font-semibold text-foreground">{recordLabel(item, copy[collection])}</h2><p className="mt-1 break-words text-sm text-muted-foreground">{recordSummary(item)}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => setEdit(item)} className="rounded-md border border-border px-3 py-2 text-sm">{copy.edit}</button><button type="button" disabled={saving} onClick={() => void remove(item)} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 disabled:opacity-50">{copy.delete}</button></div></article>) : <p className="p-6 text-sm text-muted-foreground">{copy.empty}</p>}
    </div>
  </section>;
}
