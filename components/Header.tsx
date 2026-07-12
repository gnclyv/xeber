import Link from "next/link";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";

export default async function Header({ activeSlug }: { activeSlug?: string }) {
  const categories = await db.select().from(schema.categories);
  const latest = await db
    .select()
    .from(schema.articles)
    .orderBy(desc(schema.articles.publishedAt))
    .limit(5);

  const today = new Date().toLocaleDateString("az-Latn-AZ", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="ticker">
        <div className="ticker__inner">
          {[...latest, ...latest].map((a, i) => (
            <span key={i}>
              <span className="ticker__tag">SON</span>
              {a.title}
            </span>
          ))}
        </div>
      </div>

      <header className="site-header">
        <div className="wrap site-header__row">
          <div>
            <Link href="/" className="logo">
              AKTUAL<span>.</span>
            </Link>
            <div className="tagline">Doğru xəbər, vaxtında</div>
          </div>

          <form className="search-form" action="/search" method="get">
            <input type="text" name="q" placeholder="Xəbər axtar…" aria-label="Xəbər axtar" />
            <button type="submit" aria-label="Axtar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <div className="date-strip">{today}</div>
        </div>

        <nav className="nav">
          <div className="wrap nav__row">
            <Link href="/" className={`nav__link ${!activeSlug ? "is-active" : ""}`}>
              Əsas səhifə
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`nav__link ${activeSlug === c.slug ? "is-active" : ""}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
