import Image from 'next/image';
import { db, schema } from "@/db";
import { eq, ne, and, desc, sql } from "drizzle-orm";
import { NewsCard, CatTag, PlaceholderMedia, fmtDate } from "@/components/NewsCard";
import { notFound } from "next/navigation";
import ShareRow from "./ShareRow";

export const revalidate = 0;

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) return notFound();

  const [article] = await db.select().from(schema.articles).where(eq(schema.articles.id, id));
  if (!article) return notFound();

  // Baxış sayını artır
  db.update(schema.articles)
    .set({ views: sql`${schema.articles.views} + 1` })
    .where(eq(schema.articles.id, id))
    .then()
    .catch(console.error);

  const [category] = await db.select().from(schema.categories).where(eq(schema.categories.slug, article.categorySlug));

  const related = await db
    .select()
    .from(schema.articles)
    .where(and(eq(schema.articles.categorySlug, article.categorySlug), ne(schema.articles.id, article.id)))
    .orderBy(desc(schema.articles.publishedAt))
    .limit(3);

  return (
    <>
      <div className="article-head">
        <CatTag category={category} />
        <h1 className="article-title">{article.title}</h1>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="meta">
          <span>{article.author}</span>
          <span>·</span>
          <span>{fmtDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{(article.views + 1).toLocaleString()} baxış</span>
        </div>
      </div>

      <div className="article-media">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            width={1200}
            height={630}
            className="w-full h-auto object-cover rounded-lg"
            priority
            quality={85}
          />
        ) : (
          <PlaceholderMedia category={category} />
        )}
      </div>

      <div className="article-body">
        {article.content.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map((t) => (
              <span key={t} className="tag-pill">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <ShareRow title={article.title} />

      <div className="related" style={{ marginTop: 48 }}>
        <h2 className="section-title">Əlaqəli xəbərlər</h2>
        {related.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>Əlaqəli xəbər tapılmadı.</p>
        ) : (
          <div className="card-grid">
            {related.map((a) => (
              <NewsCard key={a.id} article={a} category={category} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
