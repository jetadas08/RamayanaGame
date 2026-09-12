import { createHash, randomBytes, randomUUID } from "crypto";
import { cookies } from "next/headers";
import type { RowDataPacket } from "mysql2";
import { execute, queryRows } from "@/lib/db";

const SESSION_COOKIE = "ramayana_session";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 30;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  await execute("INSERT INTO user_sessions (id, token_hash, user_id, expires_at) VALUES (?, ?, ?, ?)", [randomUUID(), hashToken(token), userId, new Date(Date.now() + SESSION_LIFETIME_MS)]);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_LIFETIME_MS / 1000,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  type SessionRow = RowDataPacket & { id: string; name: string; email: string; expires_at: Date };
  const sessions = await queryRows<SessionRow[]>("SELECT u.id, u.name, u.email, s.expires_at FROM user_sessions s JOIN user_profiles u ON u.id = s.user_id WHERE s.token_hash = ? LIMIT 1", [hashToken(token)]);
  const session = sessions[0];
  if (!session || new Date(session.expires_at) < new Date()) return null;
  return { id: session.id, name: session.name, email: session.email };
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await execute("DELETE FROM user_sessions WHERE token_hash = ?", [hashToken(token)]);
  cookieStore.delete(SESSION_COOKIE);
}
