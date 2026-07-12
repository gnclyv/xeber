import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { isAuthed } from "@/lib/auth";
import { login, logout, createArticle, deleteArticleAction } from "./actions";
import { CatTag } from "@/components/NewsCard";

export const revalidate = 0;

export default async function AdminPage() {
  if (!isAuthed()) {
    return (
      <div className="login-box">
        <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Admin girişi</h2>
        <form action={login}>
          <div className="field">
            <label htmlFor="password">Şifrə</label>
            <input id="password" name="password" type="password" required autoFocus />
          </div>
          <button className="btn" type="submit">
            Daxil ol
          </button>
        </form>
      </div>
    );
  }

  const categories = await db.select().from(schema.categories);
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const items = await db.select().from(schema.articles).orderBy(desc(schema.articles.publishedAt));

  return (
    <div className="admin-wrap" style={{ padding: "0 0 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div />
        <form action={logout}>
          <button className="btn btn-outline" type="submit">
            Çıxış
          </button>
        </form>
      </div>

      <div className="admin-grid">
        <div className="form-block">
          <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Yeni xəbər əlavə et</h2>
          <form action={createArticle} encType="multipart/form-data">
            <div className="field">
              <label htmlFor="title">Başlıq</label>
              <input id="title" name="title" required />
            </div>
            <div className="field">
              <label htmlFor="excerpt">Qısa məzmun</label>
              <textarea id="excerpt" name="excerpt" required style={{ minHeight: 70 }} />
            </div>
            <div className="field">
              <label htmlFor="content">Tam mətn</label>
              <textarea id="content" name="content" required placeholder="Paraqrafları boş sətirlə ayırın" />
            </div>
            <div className="field">
              <label htmlFor="category">Kateqoriya</label>
              <select id="category" name="category" required>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="image">Şəkil yüklə (kompüterdən)</label>
              <input id="image" name="image" type="file" accept="image/*" />
            </div>
            <div className="field">
              <label htmlFor="imageUrl">— və ya hazır şəkil linki (URL)</label>
              <input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
            </div>
            <div className="field">
              <label htmlFor="author">Müəllif</label>
              <input id="author" name="author" defaultValue="Redaksiya" />
            </div>
            <div className="field">
              <label htmlFor="tags">Teqlər (vergüllə ayırın)</label>
              <input id="tags" name="tags" placeholder="məs: idman, final" />
            </div>
            <button className="btn" type="submit">
              Dərc et
            </button>
          </form>
        </div>

        <div>
          <h2 style={{ fontFamily: "var(--font-display)", marginTop: 0 }}>Bütün xəbərlər ({items.length})</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlıq</th>
                <th>Kateqoriya</th>
                <th>Tarix</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>
                    <a href={`/article/${a.id}`} target="_blank" rel="noreferrer">
                      {a.title}
                    </a>
                  </td>
                  <td>
                    <CatTag category={catMap[a.categorySlug]} />
                  </td>
                  <td>{new Date(a.publishedAt).toLocaleDateString("az-Latn-AZ")}</td>
                  <td>
                    <form action={deleteArticleAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="btn btn-danger" style={{ padding: "5px 10px", fontSize: 11 }} type="submit">
                        Sil
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}