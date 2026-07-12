import Image from 'next/image';
import Link from "next/link";
import type { Article, Category } from "@/db/schema";

export function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("az-Latn-AZ", { 
    day: "2-digit", 
    month: "long", 
    year: "numeric" 
  });
}

export function CatTag({ category }: { category: Category }) {
  return (
    <span className="cat-tag" style={{ "--cat-color": category.color } as any}>
      {category.name}
    </span>
  );
}

export function PlaceholderMedia({ category }: { category: Category }) {
  return (
    <div className="ph" style={{ "--cat-color": category.color } as any}>
      <span>{category.name} · AKTUAL</span>
    </div>
  );
}

// ====================== ƏSAS DƏYİŞİKLİK ======================
export function NewsCard({ article, category }: { article: Article; category: Category }) {
  return (
    <article className="news-card">
      <div className="news-card__fold" style={{ "--cat-color": category.color } as any} />
      
      <Link href={`/article/${article.id}`}>
        <div className="news-card__media" style={{ position: "relative", aspectRatio: "16 / 9" }}>
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={80}
            />
          ) : (
            <PlaceholderMedia category={category} />
          )}
        </div>

        <div className="news-card__body">
          <CatTag category={category} />
          <h3 className="news-card__title">{article.title}</h3>
          <p className="news-card__excerpt">{article.excerpt}</p>
          <div className="meta">
            <span>{article.author}</span>
            <span>·</span>
            <span>{fmtDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function SideItem({ article, category }: { article: Article; category: Category }) {
  return (
    <Link className="side-item" href={`/article/${article.id}`}>
      <div className="side-item__media" style={{ position: "relative", aspectRatio: "16 / 9" }}>
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 120px"
            quality={75}
          />
        ) : (
          <PlaceholderMedia category={category} />
        )}
      </div>

      <div>
        <CatTag category={category} />
        <h4 className="side-item__title">{article.title}</h4>
        <div className="meta">{fmtDate(article.publishedAt)}</div>
      </div>
    </Link>
  );
}
