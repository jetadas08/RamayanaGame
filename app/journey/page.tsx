"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Circle, RotateCcw, Star } from "lucide-react";
import { journeyNodes } from "@/data/journey";
import { achievements, areas, characters, relationships } from "@/data/discoveries";
import { useProgress } from "@/components/progress-provider";
import { Badge } from "@/components/ui/badge";
import styles from "@/components/journey.module.scss";
import { correctAnswerCount, nodeMastery } from "@/lib/progress";
import {relationshipAchievementDefinitions} from "@/data/relationships";
import {encounterActivities,explorationAchievementDefinitions,sacredObjects} from "@/data/encounter-activities";

export default function JourneyPage(){
 const {progress,error,user,resetProgress}=useProgress();
 const [confirmReset,setConfirmReset]=useState(false);
 const masteryStars=correctAnswerCount(progress);
 const discoveryTotal=encounterActivities.reduce((total,activity)=>total+(activity.type==="sceneDiscovery"?activity.hotspots.length:0),0);
 const achievementTotal=new Set([...achievements.map(item=>item.name),...relationshipAchievementDefinitions.map(item=>item.name),...explorationAchievementDefinitions.map(item=>item.name)]).size;
 return <main className="page-shell"><div className="mx-auto max-w-5xl">
  <Badge>Journey record</Badge>
  <h1 className="page-title">The path you have walked</h1>
  <p className="page-intro">Return to completed encounters, see what lies ahead, and grow your mastery. Stars record correct answers; access follows participation.</p>
  <div className={styles.grid}>{[
   [`${progress.completedNodes.length}/15`,"Encounters"],
   [`${masteryStars}/45`,"Mastery stars"],
   [`${progress.unlockedCharacters.length}/${characters.length}`,"Characters"],
   [`${progress.unlockedRelationships.length}/${relationships.length}`,"Connections"],
   [`${progress.sceneDiscoveries.length}/${discoveryTotal}`,"Scene discoveries"],
   [`${progress.discoveredObjects.length}/${sacredObjects.length}`,"Sacred objects"],
   [`${progress.achievements.length}/${achievementTotal}`,"Achievements"],
  ].map(([value,label])=><div className={styles.metric} key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
  <p className="mt-6 text-sm text-[var(--muted)]" role="status">{error||(user?"Progress linked to your account.":"Guest journey · Saved on this browser.")}</p>
  <div className="mt-4 flex flex-wrap items-center gap-3">{confirmReset?<><button className="cta-primary" onClick={()=>{resetProgress();setConfirmReset(false);}}><RotateCcw size={16}/>Confirm reset</button><button className="text-sm text-[var(--muted)]" onClick={()=>setConfirmReset(false)}>Cancel</button><span className="text-sm text-[var(--muted)]">This clears journey stars, discoveries, connection answers, and achievements.</span></>:<button className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--cream)]" onClick={()=>setConfirmReset(true)}><RotateCcw size={15}/>Reset journey progress</button>}</div>
  <section className={styles.panel}><h2>Discoveries & achievements</h2><div className={styles.grid}>{achievements.map(item=><p key={item.name}>{progress.achievements.includes(item.name)?"✦":"○"} {item.name} · HJ-{String(item.node).padStart(2,"0")}</p>)}{relationshipAchievementDefinitions.map(item=><p key={item.name}>{progress.achievements.includes(item.name)?"✦":"○"} {item.name} · Connections</p>)}</div></section>
  <section className={styles.panel}><h2>Exploration record</h2><div className={styles.grid}>{explorationAchievementDefinitions.filter(item=>!relationshipAchievementDefinitions.some(existing=>existing.name===item.name)).map(item=><p key={item.name}>{progress.achievements.includes(item.name)?"✦":"○"} {item.name} · Discovery</p>)}{sacredObjects.map(object=><p key={object.id}>{progress.discoveredObjects.includes(object.id)?"✦":"○"} {progress.discoveredObjects.includes(object.id)?object.name:"Undiscovered sacred object"} · {object.discoveryNode}</p>)}</div></section>
  <section className={styles.panel}><h2>Map regions</h2><div className={styles.grid}>{areas.map(area=><p key={area.id}>{progress.completedNodes.length+1>=area.from?"✦":"○"} {area.name}</p>)}</div></section>
  {progress.completedNodes.length===15&&<section className={styles.panel}><h2>The message has come home</h2><p>All fifteen encounters are complete. Open any encounter to review your answers, educational feedback, and mastery stars.</p></section>}
  <div className="relative mt-14 space-y-3 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-white/10">{journeyNodes.map((node,index)=>{
   const complete=progress.completedNodes.includes(node.id);
   const available=index<=journeyNodes.findIndex(item=>item.id===progress.currentNode);
   const stars=nodeMastery(progress,node);
   return <Link aria-disabled={!available} href={available?`/journey/hanuman/${node.slug}`:"#"} key={node.id} className={`relative flex items-center gap-5 rounded-2xl border p-4 transition ${available?"border-white/10 bg-white/[.035] hover:border-[var(--gold)]/25":"pointer-events-none border-white/5 opacity-35"}`}>
    <span className={`z-10 grid size-12 shrink-0 place-items-center rounded-full border ${complete?"border-[var(--saffron)] bg-[var(--saffron)] text-[#211309]":"border-white/15 bg-[#281b13] text-[var(--muted)]"}`}>{complete?<Check size={18}/>:<Circle size={14}/>}</span>
    <div className="min-w-0 flex-1"><span className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">{node.id} · {node.place}</span><h2 className="font-display mt-1 text-2xl text-[var(--cream)]">{node.title}</h2><span className="mt-2 flex gap-1 text-[var(--gold)]" aria-label={`${stars.filter(Boolean).length} of 3 correct`}>{stars.map((filled,star)=><Star key={star} size={13} fill={filled?"currentColor":"none"}/>)}</span></div>
    {available&&<ArrowRight className="text-[var(--muted)]" size={18}/>}
   </Link>;
  })}</div>
 </div></main>;
}
