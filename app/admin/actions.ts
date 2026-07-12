"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { expectedSessionToken, isAuthed, COOKIE_NAME } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  if (password && password === process.env.ADMIN_PASSWORD) {
    cookies().set(COOKIE_NAME, expectedSessionToken(), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  }
  redirect("/admin");
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect("/admin");
}

export async function createArticle(formData: FormData) {
  if (!isAuthed()) throw new Error("Yetkiniz yoxdur");

  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await db.insert(schema.articles).values({
    title: (formData.get("title") as string).trim(),
    excerpt: (formData.get("excerpt") as string).trim(),
    content: (formData.get("content") as string).trim(),
    categorySlug: formData.get("category") as string,
    author: (formData.get("author") as string).trim() || "Redaksiya",
    tags,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteArticleAction(formData: FormData) {
  if (!isAuthed()) throw new Error("Yetkiniz yoxdur");
  const id = parseInt(formData.get("id") as string, 10);
  await db.delete(schema.articles).where(eq(schema.articles.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}
