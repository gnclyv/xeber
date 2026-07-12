import { db, schema } from "@/db";
import { or, ilike, desc } from "drizzle-orm";
import { NewsCard } from "@/components/NewsCard";

export const revalidate = 0;

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim();
  const categories = await db.select().from(schema.categories);
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const results = q
    ? await db
        .select()
        .from(schema.articles)
        .where(or(ilike(schema.articles.title, `%${q}%`), ilike(schema.articles.excerpt, `%${q}%`)))
        .orderBy(desc(schema.articles.publishedAt))
    : [];

  return (
    <>
      <form action="/search" method="get" style={{ marginBottom: 8 }}>
        <div className="field" style={{ maxWidth: 420 }}>
          <label htmlFor="q">Xəbər axtar</label>
          <input id="q" name="q" type="text" defaultValue={q} placeholder="Açar söz daxil edin…" />
        </div>
        <button className="btn" type="submit">
          Axtar
        </button>
      </form>

      <h2 className="section-title" style={{ marginTop: 28 }}>
        {q ? `"${q}" üçün nəticələr` : "Axtarış üçün açar söz daxil edin"}
      </h2>

      {q && results.length === 0 && (
        <div className="empty-state">
          <h3>Heç bir nəticə tapılmadı</h3>
          <p>&quot;{q}&quot; sorğusu üzrə xəbər tapılmadı. Başqa açar söz sınayın.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="card-grid">
          {results.map((a) => (
            <NewsCard key={a.id} article={a} category={catMap[a.categorySlug]} />
          ))}
        </div>
      )}
    </>
  );
}
