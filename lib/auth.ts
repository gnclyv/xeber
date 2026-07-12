import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export function expectedSessionToken() {
  return crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD || "").digest("hex");
}

export function isAuthed() {
  const cookie = cookies().get(COOKIE_NAME);
  return !!cookie && cookie.value === expectedSessionToken();
}

export { COOKIE_NAME };
