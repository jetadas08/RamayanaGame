import {randomUUID} from "crypto";
import {NextResponse} from "next/server";
import {getCurrentUser} from "@/lib/auth";
import {ensureSchema,getDb,queryRows} from "@/lib/db";
import {mergeProgress,normalizeProgress} from "@/lib/progress";
import {progressColumns,progressFromRow,progressValues,type ProgressRow} from "@/lib/progress-storage";

const select=`SELECT ${progressColumns} FROM journey_progress WHERE user_id = ? LIMIT 1`;
const insert=`INSERT IGNORE INTO journey_progress (user_id, ${progressColumns}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const update=`UPDATE journey_progress SET current_node=?, completed_nodes=?, unlocked_characters=?, unlocked_relationships=?, answered_challenges=?, relationship_challenges=?, encounter_progress=?, achievements=?, difficulty=? WHERE user_id=?`;

export async function GET(){
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const rows=await queryRows<ProgressRow[]>(select,[user.id]);
 return NextResponse.json({progress:progressFromRow(rows[0]),resetEpoch:rows[0]?.reset_epoch??""});
}

// The row lock serializes writes from tabs and devices. Each writer merges with
// the latest committed record, so a stale snapshot cannot erase earned progress.
export async function PUT(request:Request){
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await request.json();
 const incoming=normalizeProgress(body?.progress??body);
 const clientEpoch=typeof body?.resetEpoch==="string"?body.resetEpoch:"";
 await ensureSchema();
 const connection=await getDb().getConnection();
 try{
  await connection.beginTransaction();
  await connection.execute(insert,[user.id,...progressValues(normalizeProgress(null)),""]);
  const [rows]=await connection.execute<ProgressRow[]>(`${select} FOR UPDATE`,[user.id]);
  const row=rows[0];
  if(clientEpoch!==row.reset_epoch){
   await connection.rollback();
   return NextResponse.json({error:"This journey was reset in another session.",progress:progressFromRow(row),resetEpoch:row.reset_epoch},{status:409});
  }
  const progress=mergeProgress(progressFromRow(row),incoming);
  await connection.execute(update,[...progressValues(progress).slice(0,9),user.id]);
  await connection.commit();
  return NextResponse.json({progress,resetEpoch:row.reset_epoch});
 }catch(error){await connection.rollback();throw error;}finally{connection.release();}
}

export async function DELETE(){
 const user=await getCurrentUser();
 if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 await ensureSchema();
 const connection=await getDb().getConnection();
 try{
  await connection.beginTransaction();
  const progress=normalizeProgress(null),resetEpoch=randomUUID();
  await connection.execute(insert,[user.id,...progressValues(progress),""]);
  const [rows]=await connection.execute<ProgressRow[]>(`${select} FOR UPDATE`,[user.id]);
  if(!rows[0])throw new Error("Progress record unavailable");
  await connection.execute(update.replace(" WHERE user_id=?",", reset_epoch=? WHERE user_id=?"),[...progressValues(progress).slice(0,9),resetEpoch,user.id]);
  await connection.commit();
  return NextResponse.json({progress,resetEpoch});
 }catch(error){await connection.rollback();throw error;}finally{connection.release();}
}
