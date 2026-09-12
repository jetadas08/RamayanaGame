import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { getCurrentUser } from "@/lib/auth";
import { execute, queryRows } from "@/lib/db";
import { normalizeProgress } from "@/lib/progress";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  type ProgressRow = RowDataPacket & { current_node: string; completed_nodes: string; unlocked_characters: string; unlocked_relationships: string; answered_challenges: string; relationship_challenges: string|null; encounter_progress:string|null; achievements: string; difficulty: "explorer" | "seeker" | "scholar" };
  const rows = await queryRows<ProgressRow[]>("SELECT current_node, completed_nodes, unlocked_characters, unlocked_relationships, answered_challenges, relationship_challenges, encounter_progress, achievements, difficulty FROM journey_progress WHERE user_id = ? LIMIT 1", [user.id]);
  const stored = rows[0];
  const encounter=stored?.encounter_progress?JSON.parse(stored.encounter_progress):{};
  const progress = normalizeProgress(stored ? {
    currentNode: stored.current_node,
    completedNodes: JSON.parse(stored.completed_nodes),
    unlockedCharacters: JSON.parse(stored.unlocked_characters),
    unlockedRelationships: JSON.parse(stored.unlocked_relationships),
    answeredChallenges: JSON.parse(stored.answered_challenges),
    relationshipChallengeAnswers: JSON.parse(stored.relationship_challenges??"{}"),
    ...encounter,
    achievements: JSON.parse(stored.achievements),
    difficulty: stored.difficulty,
  } : null);
  return NextResponse.json({ progress });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = normalizeProgress(await request.json());
  await execute(`INSERT INTO journey_progress
    (user_id, current_node, completed_nodes, unlocked_characters, unlocked_relationships, answered_challenges, relationship_challenges, encounter_progress, achievements, difficulty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE current_node=VALUES(current_node), completed_nodes=VALUES(completed_nodes), unlocked_characters=VALUES(unlocked_characters), unlocked_relationships=VALUES(unlocked_relationships), answered_challenges=VALUES(answered_challenges), relationship_challenges=VALUES(relationship_challenges), encounter_progress=VALUES(encounter_progress), achievements=VALUES(achievements), difficulty=VALUES(difficulty)`,
    [user.id, progress.currentNode, JSON.stringify(progress.completedNodes), JSON.stringify(progress.unlockedCharacters), JSON.stringify(progress.unlockedRelationships), JSON.stringify(progress.answeredChallenges), JSON.stringify(progress.relationshipChallengeAnswers), JSON.stringify({sceneDiscoveries:progress.sceneDiscoveries,hiddenDiscoveries:progress.hiddenDiscoveries,discoveredObjects:progress.discoveredObjects,predictionChoices:progress.predictionChoices,storyMemoryAnswers:progress.storyMemoryAnswers,nodeAttempts:progress.nodeAttempts}), JSON.stringify(progress.achievements), progress.difficulty]);
  return NextResponse.json({ progress });
}
