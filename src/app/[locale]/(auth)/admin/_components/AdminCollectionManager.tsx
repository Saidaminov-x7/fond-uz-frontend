"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";

type Collection = "news" | "faqs" | "doctors" | "prices" | "services" | "funds";
type Item = { id: string; [key: string]: unknown };
const fields: Record<Collection, string[]> = {
  news: ["slug", "title", "titleEn", "titleUz", "subtitle", "subtitleEn", "subtitleUz", "date", "image", "content", "contentEn", "contentUz"],
  faqs: ["question", "questionEn", "questionUz", "answer", "answerEn", "answerUz"],
  doctors: ["name", "nameEn", "nameUz", "specialty", "specialtyEn", "specialtyUz", "bio", "bioEn", "bioUz", "email", "phone", "image"],
  prices: ["title", "titleEn", "titleUz", "price", "priceEn", "priceUz", "includes", "includesEn", "includesUz"],
  services: ["slug", "name", "nameEn", "nameUz", "description", "descriptionEn", "descriptionUz", "fundsCount"],
  funds: ["professionSlug", "name", "nameEn", "nameUz", "phone", "website", "description", "descriptionEn", "descriptionUz"],
};
const required: Record<Collection, string[]> = { news: ["slug", "title"], faqs: ["question", "answer"], doctors: ["name", "specialty"], prices: ["title", "price"], services: ["slug", "name", "description"], funds: ["professionSlug", "name", "website"] };
const multiline = new Set(["content", "contentEn", "contentUz", "includes", "includesEn", "includesUz", "bio", "bioEn", "bioUz", "answer", "answerEn", "answerUz", "description", "descriptionEn", "descriptionUz"]);
const listFields = new Set(["content", "contentEn", "contentUz", "includes", "includesEn", "includesUz"]);

const copy: Record<string, Record<string, string>> = {
  en: { news: "News", faqs: "FAQs", doctors: "Specialists", prices: "Service prices", services: "Care areas", funds: "Partner organizations", search: "Search records", add: "Add record", edit: "Edit", delete: "Delete", save: "Save changes", cancel: "Cancel", loading: "Loading…", empty: "No records found.", loadError: "Could not load records.", saveError: "Could not save this record.", deleteError: "Could not delete this record.", confirm: "Delete this record? This cannot be undone.", saved: "Changes saved.", deleted: "Record deleted.", records: "records", content: "Content", title: "Title or name", list: "One item per line", contentType: "CONTENT", slug: "URL slug", subtitle: "Subtitle", date: "Date", image: "Image URL", question: "Question", answer: "Answer", name: "Name", specialty: "Specialty", bio: "Biography", email: "Email", phone: "Phone", price: "Price", includes: "Includes", description: "Description", fundsCount: "Organization count", professionSlug: "Care area slug", website: "Website", english: "English", uzbek: "Uzbek" },
  ru: { news: "Новости", faqs: "Вопросы и ответы", doctors: "Специалисты", prices: "Стоимость услуг", services: "Направления помощи", funds: "Партнёрские организации", search: "Поиск записей", add: "Добавить запись", edit: "Изменить", delete: "Удалить", save: "Сохранить изменения", cancel: "Отмена", loading: "Загрузка…", empty: "Записи не найдены.", loadError: "Не удалось загрузить записи.", saveError: "Не удалось сохранить запись.", deleteError: "Не удалось удалить запись.", confirm: "Удалить эту запись? Действие нельзя отменить.", saved: "Изменения сохранены.", deleted: "Запись удалена.", records: "записей", content: "Содержимое", title: "Заголовок", list: "По одному значению в строке", contentType: "КОНТЕНТ", slug: "Короткая ссылка", subtitle: "Подзаголовок", date: "Дата", image: "Ссылка на изображение", question: "Вопрос", answer: "Ответ", name: "Название или имя", specialty: "Специализация", bio: "Биография", email: "Электронная почта", phone: "Телефон", price: "Цена", includes: "Что включено", description: "Описание", fundsCount: "Число организаций", professionSlug: "Ссылка на направление", website: "Веб-сайт", english: "Английский", uzbek: "Узбекский" },
  uz: { news: "Yangiliklar", faqs: "Savol-javoblar", doctors: "Mutaxassislar", prices: "Xizmat narxlari", services: "Yordam yo‘nalishlari", funds: "Hamkor tashkilotlar", search: "Yozuvlarni qidirish", add: "Yozuv qo‘shish", edit: "Tahrirlash", delete: "O‘chirish", save: "O‘zgarishlarni saqlash", cancel: "Bekor qilish", loading: "Yuklanmoqda…", empty: "Yozuvlar topilmadi.", loadError: "Yozuvlarni yuklab bo‘lmadi.", saveError: "Yozuvni saqlab bo‘lmadi.", deleteError: "Yozuvni o‘chirib bo‘lmadi.", confirm: "Bu yozuv o‘chirilsinmi? Amalni bekor qilib bo‘lmaydi.", saved: "O‘zgarishlar saqlandi.", deleted: "Yozuv o‘chirildi.", records: "yozuv", content: "Kontent", title: "Sarlavha", list: "Har qatorda bittadan", contentType: "KONTENT", slug: "Qisqa havola", subtitle: "Taglavha", date: "Sana", image: "Rasm havolasi", question: "Savol", answer: "Javob", name: "Nomi yoki ism", specialty: "Mutaxassislik", bio: "Tarjimai hol", email: "Elektron pochta", phone: "Telefon", price: "Narx", includes: "Nimalar kiradi", description: "Tavsif", fundsCount: "Tashkilotlar soni", professionSlug: "Yo‘nalish havolasi", website: "Veb-sayt", english: "Inglizcha", uzbek: "O‘zbekcha" },
};

function labelFor(field: string, t: Record<string, string>) {
  const base = field.replace(/(En|Uz)$/, "");
  const suffix = field.endsWith("En") ? ` (${t.english})` : field.endsWith("Uz") ? ` (${t.uzbek})` : "";
  return `${t[base] ?? base.replace(/([A-Z])/g, " $1")}${suffix}`;
}
const titleOf = (item: Item, fallback: string) => String(item.title ?? item.name ?? item.question ?? item.slug ?? fallback);
const summaryOf = (item: Item) => String(item.subtitle ?? item.specialty ?? item.answer ?? item.description ?? item.price ?? "");

export function AdminCollectionManager({ collection }: { collection: Collection }) {
  const locale = useLocale();
  const t = copy[locale] ?? copy.en;
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
    if (!response.ok) throw new Error(body.error || t.loadError);
    setItems(Array.isArray(body.items) ? body.items : []);
  }, [collection, t.loadError]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/admin/${collection}?limit=100&offset=0`, { cache: "no-store" }).then(async (response) => {
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || t.loadError);
      if (active) { setItems(Array.isArray(body.items) ? body.items : []); setError(""); }
    }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : t.loadError); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [collection, t.loadError]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!edit) return;
    setSaving(true); setError(""); setNotice("");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(fields[collection].map((key) => {
      const raw = String(data.get(key) ?? "");
      const value = listFields.has(key) ? raw.split("\n").map((line) => line.trim()).filter(Boolean) : key === "fundsCount" ? Math.max(0, Math.min(10_000, Number(raw) || 0)) : raw.trim();
      return [key, value];
    }));
    try {
      const id = edit.id ? `/${encodeURIComponent(edit.id)}` : "";
      const response = await fetch(`/api/admin/${collection}${id}`, { method: edit.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || t.saveError);
      setEdit(null); await refresh(); setNotice(t.saved);
    } catch (reason) { setError(reason instanceof Error ? reason.message : t.saveError); }
    finally { setSaving(false); }
  }

  async function remove(item: Item) {
    if (!window.confirm(t.confirm)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/${collection}/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error(t.deleteError);
      await refresh(); setNotice(t.deleted);
    } catch (reason) { setError(reason instanceof Error ? reason.message : t.deleteError); }
    finally { setSaving(false); }
  }

  const visible = useMemo(() => items.filter((item) => JSON.stringify(item).toLocaleLowerCase().includes(query.toLocaleLowerCase())), [items, query]);
  const beginAdd = () => { setEdit({ id: "" }); setError(""); setNotice(""); };

  return <section>
    <header className="admin-collection-toolbar">
      <div><p className="admin-eyebrow">{t.contentType}</p><h1 className="admin-page-title">{t[collection]}</h1><p className="admin-collection-meta">{items.length} {t.records}</p></div>
      <div className="admin-collection-actions"><input aria-label={t.search} placeholder={t.search} className="admin-control" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" onClick={beginAdd} className="admin-button admin-button-primary">+ {t.add}</button></div>
    </header>
    {error && <p role="alert" className="admin-message admin-message-error">{error}</p>}
    {notice && <p role="status" className="admin-message">{notice}</p>}
    {edit && <form onSubmit={save} className="admin-editor">
      <h2 className="admin-editor-heading">{edit.id ? `${t.edit}: ${titleOf(edit, t[collection])}` : t.add}</h2>
      <div className="admin-editor-fields">{fields[collection].map((key) => <label className={`admin-field${multiline.has(key) ? " admin-field-wide" : ""}`} key={key}><span>{labelFor(key, t)}{required[collection].includes(key) ? " *" : ""}</span>
        {multiline.has(key) ? <textarea rows={key.startsWith("content") || key.startsWith("includes") ? 6 : 4} name={key} required={required[collection].includes(key)} maxLength={8_000} defaultValue={Array.isArray(edit[key]) ? (edit[key] as string[]).join("\n") : String(edit[key] ?? "")} className="admin-control" placeholder={listFields.has(key) ? t.list : undefined} /> : <input name={key} type={key === "date" ? "date" : key === "fundsCount" ? "number" : key === "email" ? "email" : key === "website" ? "url" : "text"} min={key === "fundsCount" ? 0 : undefined} max={key === "fundsCount" ? 10_000 : undefined} required={required[collection].includes(key)} maxLength={2_000} defaultValue={String(edit[key] ?? "")} className="admin-control" />}
      </label>)}</div>
      <div className="admin-editor-actions"><button disabled={saving} className="admin-button admin-button-primary">{saving ? t.loading : t.save}</button><button type="button" onClick={() => setEdit(null)} className="admin-button">{t.cancel}</button></div>
    </form>}
    <div className="admin-record-list" aria-live="polite">
      {loading ? <p className="admin-empty">{t.loading}</p> : visible.length ? visible.map((item) => <article key={item.id} className="admin-record"><div><h2 className="admin-record-title">{titleOf(item, t[collection])}</h2>{summaryOf(item) && <p className="admin-record-summary">{summaryOf(item)}</p>}</div><div className="admin-record-actions"><button type="button" onClick={() => { setEdit(item); setError(""); setNotice(""); }} className="admin-button">{t.edit}</button><button type="button" disabled={saving} onClick={() => void remove(item)} className="admin-button admin-button-danger">{t.delete}</button></div></article>) : <p className="admin-empty">{t.empty}</p>}
    </div>
  </section>;
}
