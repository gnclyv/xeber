"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { expectedSessionToken, isAuthed, COOKIE_NAME } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

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

  let imagePath: string | null = null;

  // === ŞƏKİL YÜKLƏMƏ ===
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Qovluq yoxdursa yarat
    const { mkdir } = await import("fs/promises");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    imagePath = `/uploads/${filename}`;
  } 
  // Əgər URL daxil edilibsə
  else if (formData.get("imageUrl")) {
    imagePath = formData.get("imageUrl") as string;
  }

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
    image: imagePath,           // ← ƏSAS ƏLAVƏ
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteArticleAction(formData: FormData) {
  if (!isAuthed()) throw new Error("Yetkiniz yoxdur");
  const id = parseInt(formData.get("id") as string, 10);
  await db.delete(schema.articles).where(eq(schema.articles.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
}
