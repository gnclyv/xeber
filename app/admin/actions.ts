"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { expectedSessionToken, isAuthed, COOKIE_NAME } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary"; // ← Cloudinary əlavə olundu

// Cloudinary Konfiqurasiyası
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

  // === ŞƏKİL YÜKLƏMƏ (CLOUDINARY İLƏ) ===
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Şəkli Render serverinə yox, birbaşa Cloudinary buluduna göndəririk
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "bozzshop" }, // Buludda açılacaq qovluq adı
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // ƏN ƏSAS DƏYİŞİKLİK:
    // Artıq bazaya lokal yol yox, buluddan gələn daimi "https://..." linki yazılır!
    imagePath = uploadResult.secure_url;
  } 
  // Əgər kənardan birbaşa URL daxil edilibsə
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
    image: imagePath,
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
