import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { NewsCard, SideItem, CatTag, PlaceholderMedia, fmtDate } from "@/components/NewsCard";
import Link from "next/link";

export const revalidate = 60; // 60 saniyədən bir yenidən yaradılır (ISR)

export default async function HomePage() {
  const categories = await db.select().from(schema.categories);
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const all = await db.select().from(schema.articles).orderBy(desc(schema.articles.publishedAt));
  const popular = [...all].sort((a, b) => b.views - a.views).slice(0, 4);

  if (all.length === 0) {
    return (
      <div className="empty-state">
        <h3>Hələ xəbər yoxdur</h3>
        <p>
          Verilənlər bazasını doldurmaq üçün <code>npm run db:seed</code> əmrini işlədin, və ya{" "}
          <Link href="/admin">admin paneldən</Link> əlavə edin.
        </p>
      </div>
    );
  }

  const [lead, ...rest] = all;
  const sideItems = rest.slice(0, 4);
  const gridItems = rest.slice(4, 10);

  return (
    <>
      <div className="lead-grid">
        <div className="lead-story">
          <Link href={`/article/${lead.id}`}>
            <div className="lead-story__media">
              <PlaceholderMedia category={catMap[lead.categorySlug]} />
              <div className="cat-tag" style={{ ["--cat-color" as any]: catMap[lead.categorySlug].color }}>
                {catMap[lead.categorySlug].name}
              </div>
            </div>
            <div className="lead-story__body">
              <h1 className="lead-story__title">{lead.title}</h1>
              <p className="lead-story__excerpt">{lead.excerpt}</p>
              <div className="meta">
                <span>{lead.author}</span>
                <span>·</span>
                <span>{fmtDate(lead.publishedAt)}</span>
                <span>·</span>
                <span>{lead.views.toLocaleString()} baxış</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="side-list">
          {sideItems.map((a) => (
            <SideItem key={a.id} article={a} category={catMap[a.categorySlug]} />
          ))}
        </div>
      </div>

      {gridItems.length > 0 && (
        <>
          <h2 className="section-title">Son xəbərlər</h2>
          <div className="card-grid">
            {gridItems.map((a) => (
              <NewsCard key={a.id} article={a} category={catMap[a.categorySlug]} />
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">Ən çox oxunan</h2>
      <div className="card-grid">
        {popular.map((a) => (
          <NewsCard key={a.id} article={a} category={catMap[a.categorySlug]} />
        ))}
      </div>
    </>
  );
}
