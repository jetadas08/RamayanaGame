import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { ensureSchema, getDb, queryRows } from "@/lib/db";
import { normalizeProgress } from "@/lib/progress";

const schema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100),
  guestProgress: z.unknown().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check your account details." }, { status: 400 });

  try {
    type ExistingRow = RowDataPacket & { id: string };
    const existing = await queryRows<ExistingRow[]>("SELECT id FROM user_profiles WHERE email = ? LIMIT 1", [parsed.data.email]);
    if (existing.length) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });

    const progress = normalizeProgress(parsed.data.guestProgress as never);
    const userId = randomUUID();
    await ensureSchema();
    const connection = await getDb().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute("INSERT INTO user_profiles (id, name, email, password_hash) VALUES (?, ?, ?, ?)", [userId, parsed.data.name, parsed.data.email, await hash(parsed.data.password, 12)]);
      await connection.execute("INSERT INTO journey_progress (user_id, current_node, completed_nodes, unlocked_characters, unlocked_relationships, answered_challenges, relationship_challenges, encounter_progress, achievements, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [userId, progress.currentNode, JSON.stringify(progress.completedNodes), JSON.stringify(progress.unlockedCharacters), JSON.stringify(progress.unlockedRelationships), JSON.stringify(progress.answeredChallenges), JSON.stringify(progress.relationshipChallengeAnswers), JSON.stringify({characterChallengeAnswers:progress.characterChallengeAnswers,sceneDiscoveries:progress.sceneDiscoveries,hiddenDiscoveries:progress.hiddenDiscoveries,discoveredObjects:progress.discoveredObjects,predictionChoices:progress.predictionChoices,storyMemoryAnswers:progress.storyMemoryAnswers,nodeAttempts:progress.nodeAttempts}), JSON.stringify(progress.achievements), progress.difficulty]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    await createSession(userId);
    return NextResponse.json({ user: { id: userId, name: parsed.data.name, email: parsed.data.email } });
  } catch (error) {
    console.error("Registration failed", error);
    return NextResponse.json({ error: "Account storage is temporarily unavailable. Guest progress is still safe on this device." }, { status: 503 });
  }
}
