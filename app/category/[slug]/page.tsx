import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { NewsCard, CatTag } from "@/components/NewsCard";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [category] = await db.select().from(schema.categories).where(eq(schema.categories.slug, params.slug));
  if (!category) return notFound();

  const items = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.categorySlug, params.slug))
    .orderBy(desc(schema.articles.publishedAt));

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <CatTag category={category} />
        <h1 className="section-title" style={{ marginTop: 14, border: "none" }}>
          {category.name} bölməsi{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>
            ({items.length} xəbər)
          </span>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Bu bölmədə hələ xəbər yoxdur</h3>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((a) => (
            <NewsCard key={a.id} article={a} category={category} />
          ))}
        </div>
      )}
    </>
  );
}
