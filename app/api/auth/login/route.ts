import { compare } from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { queryRows } from "@/lib/db";

const schema = z.object({ email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  try {
    type UserRow = RowDataPacket & { id: string; name: string; email: string; password_hash: string };
    const users = await queryRows<UserRow[]>("SELECT id, name, email, password_hash FROM user_profiles WHERE email = ? LIMIT 1", [parsed.data.email]);
    const user = users[0];
    if (!user || !(await compare(parsed.data.password, user.password_hash))) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Account storage is temporarily unavailable. Guest progress is still available." }, { status: 503 });
  }
}
