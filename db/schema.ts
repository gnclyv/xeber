import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  categorySlug: text("category_slug")
    .notNull()
    .references(() => categories.slug),
  author: text("author").notNull().default("Redaksiya"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  views: integer("views").notNull().default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  
  // ← YENİ ƏLAVƏ
  image: text("image"),   // şəkil yolu üçün
});

export type Category = typeof categories.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;