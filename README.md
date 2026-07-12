# AKTUAL — Next.js + Neon (Real Xəbər Saytı)

Bu layihə **Next.js 14 (App Router)** və **Neon (serverless PostgreSQL)** üzərində qurulub, **Drizzle ORM** ilə əlaqələndirilib. Admin paneldən əlavə etdiyin hər xəbər birbaşa verilənlər bazasına yazılır.

## 1) Neon-da verilənlər bazası yarat

1. https://console.neon.tech ünvanına daxil ol (hesabın artıq var).
2. **New Project** düyməsinə bas, layihəyə ad ver (məs. `aktual`), region seç (Avropaya yaxın olsun ki, sürətli olsun, məs. `AWS eu-central-1`).
3. Layihə yaradıldıqdan sonra **Connection string**-i kopyala. Neon iki variant göstərir:
   - **Pooled connection** (`-pooler` sözü olan) — bunu istifadə et, serverless mühit üçün ideal olandır.
4. Kopyaladığın string bu formada olacaq:
   ```
   postgresql://user:password@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

## 2) Layihəni lokal quraşdır

```bash
cd aktual-next
npm install
cp .env.example .env.local
```

`.env.local` faylını aç və iki dəyəri doldur:

```
DATABASE_URL="Neon-dan kopyaladığın connection string"
ADMIN_PASSWORD="admin panel üçün öz şifrən"
```

## 3) Cədvəlləri yarat və nümunə xəbərləri əlavə et

```bash
npm run db:push     # schema.ts-dəki cədvəlləri Neon-da yaradır
npm run db:seed      # 6 kateqoriya + 8 nümunə xəbər əlavə edir
```

## 4) Lokal işə sal

```bash
npm run dev
```

`http://localhost:3000` ünvanında sayt açılacaq. Admin panel: `http://localhost:3000/admin` (şifrə — `.env.local`-da təyin etdiyin `ADMIN_PASSWORD`).

## 5) Vercel-ə deploy et

1. Layihəni GitHub-a push et.
2. https://vercel.com üzərində **New Project** → GitHub repo-nu seç.
3. Vercel-in **Neon inteqrasiyasından** istifadə et (Storage → Neon → Connect) — bu, `DATABASE_URL`-i avtomatik environment variable kimi əlavə edir. Əks halda, Project Settings → Environment Variables bölməsindən özün `DATABASE_URL` və `ADMIN_PASSWORD`-u əl ilə əlavə et.
4. Deploy et. Vercel avtomatik `npm run build` işlədəcək.
5. İlk deploydan sonra, öz kompüterindən (yerli `.env.local` ilə) bir dəfə `npm run db:push && npm run db:seed` işlət ki, production DB-də cədvəllər və nümunə xəbərlər olsun (əlbəttə eyni Neon DB-yə qoşulmalısan).

## Struktur

```
aktual-next/
├── app/
│   ├── layout.tsx            → Header/Footer chrome
│   ├── page.tsx                → Əsas səhifə
│   ├── category/[slug]/          → Kateqoriya səhifəsi
│   ├── article/[id]/               → Xəbər detalı + baxış sayğacı
│   ├── search/                       → Axtarış (Postgres ILIKE)
│   ├── about/, contact/                → Statik səhifələr
│   ├── admin/                            → Login + CRUD (server actions)
│   └── globals.css                         → Dizayn sistemi (rənglər, tipoqrafiya)
├── components/                → Header, Footer, NewsCard və s.
├── db/
│   ├── schema.ts                → Drizzle cədvəl tərifləri (categories, articles)
│   ├── index.ts                   → Neon connection (drizzle-orm/neon-http)
│   └── seed.ts                      → Nümunə məlumatların yazılması
├── lib/auth.ts                → Admin panel üçün sadə cookie-based sessiya
└── drizzle.config.ts          → `db:push` / `db:generate` konfiqurasiyası
```

## Admin panel necə işləyir

- `/admin` səhifəsi şifrə tələb edir (`ADMIN_PASSWORD`).
- Uğurlu girişdən sonra `httpOnly` cookie qoyulur (7 gün etibarlıdır).
- Xəbər əlavə etmə/silmə **Next.js Server Actions** vasitəsilə birbaşa Neon-a yazılır — ayrıca API route yazmağa ehtiyac yoxdur.

⚠️ **Qeyd:** bu autentifikasiya sadə demo səviyyəsindədir (tək şifrə, sessiya cədvəli yoxdur). Real production üçün NextAuth.js kimi tam autentifikasiya kitabxanası əlavə etməyi tövsiyə edirəm.

## Növbəti addımlar (istəyə görə)

- **Şəkil yükləmə**: Vercel Blob və ya Cloudinary qoşularaq real xəbər şəkilləri yükləyə bilərsən.
- **SEO**: hər səhifə üçün `generateMetadata()` ilə dinamik meta teqlər əlavə et.
- **Şərh sistemi**: yeni `comments` cədvəli və müvafiq server action.
- **Çoxsaylı admin/rol sistemi**: `users` cədvəli + NextAuth.js.
