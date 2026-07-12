import Link from "next/link";
import { db, schema } from "@/db";

export default async function Footer() {
  const categories = await db.select().from(schema.categories).limit(4);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <h4>AKTUAL</h4>
            <p>Yerli və beynəlxalq xəbərləri operativ və dəqiq şəkildə oxucularına çatdıran müstəqil xəbər platforması.</p>
          </div>
          <div>
            <h4>Kateqoriyalar</h4>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Sayt</h4>
            <ul>
              <li><Link href="/about">Haqqımızda</Link></li>
              <li><Link href="/contact">Əlaqə</Link></li>
              <li><Link href="/admin">Admin panel</Link></li>
            </ul>
          </div>
          <div>
            <h4>Əlaqə</h4>
            <ul>
              <li>info@aktual.az</li>
              <li>+994 12 000 00 00</li>
              <li>Bakı, Azərbaycan</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AKTUAL — Bütün hüquqlar qorunur.</span>
          <span>Next.js + Neon Postgres</span>
        </div>
      </div>
    </footer>
  );
}
