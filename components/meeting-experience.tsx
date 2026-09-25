"use client";

import Image from "next/image";
import Link from "next/link";
import {Check,ChevronRight,Eye,Link2,RotateCcw,Sparkles,Star} from "lucide-react";
import {useProgress} from "@/components/progress-provider";
import {discoveryKey} from "@/data/encounter-activities";
import {meetingMemories,meetingMemoryNames} from "@/data/meeting";
import type {EncounterCompletionReward} from "@/data/encounter-completion";
import type {JourneyNode,SceneDiscoveryActivity} from "@/lib/types";
import styles from "@/components/meeting-experience.module.scss";

const hotspotPositions:Record<string,[number,number][]>= {
 "HFM-01":[[18,34],[79,76],[43,66]],
 "HFM-02":[[39,58],[49,49],[64,63]],
 "HFM-03":[[65,48],[30,62],[86,55]],
 "HFM-04":[[63,49],[39,53],[51,56]],
 "HFM-05":[[52,53],[65,53],[36,50]],
};

const clues:Record<string,string>={
 "HFM-01":"Look at distance, weapons, and body language. Caution does not yet require violence.",
 "HFM-02":"Notice who speaks, who listens, and how restraint changes the meeting.",
 "HFM-03":"Look for the absent person whose need gives the conversation its purpose.",
 "HFM-04":"Ask what each side needs and who makes mutual understanding possible.",
 "HFM-05":"The bundle is meaningful because of where it came from, not because it is valuable.",
};

export function MeetingExplore({node,activity}:{node:JourneyNode;activity:SceneDiscoveryActivity}){
 const {progress,discoverScene}=useProgress();
 const positions=hotspotPositions[node.id];
 const found=activity.hotspots.filter(hotspot=>progress.sceneDiscoveries.includes(discoveryKey(activity.id,hotspot.id)));
 return <div className={styles.explore}>
  <figure className={styles.scene}>
   <Image src={node.scene.imageLocked} alt={node.scene.altLocked} fill priority sizes="(max-width: 760px) 100vw, 850px"/>
   <div className={styles.shade}/>
   {activity.hotspots.map((hotspot,index)=>{const revealed=found.includes(hotspot),position=positions[index];return <button key={hotspot.id} type="button" style={{left:`${position[0]}%`,top:`${position[1]}%`}} aria-label={revealed?`Observed: ${hotspot.label}`:(hotspot.inspectLabel??`Inspect visual clue ${index+1}`)} aria-pressed={revealed} onClick={()=>discoverScene(activity.id,hotspot.id)}><span>{revealed?<Check/>:index+1}</span><b>{revealed?hotspot.label:"Inspect"}</b></button>;})}
   <figcaption>{activity.prompt}</figcaption>
  </figure>
  <section className={styles.evidence} aria-label="Observed evidence">
   <header className={styles.evidenceHeader}>
    <div className={styles.evidenceHeading}>
     <p className="eyebrow">Observe before interpreting</p>
     <div className={styles.evidenceTitleRow}><Eye aria-hidden="true"/><h3>{activity.title}</h3></div>
    </div>
    <strong className={styles.evidenceProgress} aria-label={`${found.length} of ${activity.hotspots.length} observations made`}>{found.length}/{activity.hotspots.length}</strong>
   </header>
   <ol>{activity.hotspots.map((hotspot,index)=>{const revealed=found.includes(hotspot);return <li key={hotspot.id} data-revealed={revealed}><span>{revealed?<Check/>:index+1}</span><div><b>{revealed?hotspot.label:`Visual clue ${index+1}`}</b><p>{revealed?hotspot.detail:"Inspect the numbered point in the scene."}</p>{revealed&&hotspot.unlockRelationship&&<small role="status"><Link2/> Connection resolved at this moment.</small>}</div></li>;})}</ol>
   <details><summary>Need an observation clue?</summary><p>{clues[node.id]}</p></details>
  </section>
 </div>;
}

export function MeetingCompletion({node,stars,rewards,nextSlug,onReplay}:{node:JourneyNode;stars:number;rewards:EncounterCompletionReward[];nextSlug?:string;onReplay:()=>void}){
 const memory=meetingMemories[node.number-1],memoryName=meetingMemoryNames[node.number-1],chapterComplete=node.id==="HFM-05";
 const primary=rewards.find(reward=>reward.type==="relationship")??rewards[0];
 const secondary=primary?rewards.filter(reward=>reward.id!==primary.id):rewards;
 return <section className={styles.complete} aria-labelledby="meeting-complete-title">
  <figure className={styles.revealedScene}><Image src={node.scene.imageRevealed} alt={node.scene.altRevealed} fill priority sizes="(max-width: 760px) 100vw, 1100px"/><figcaption><span>Story moment revealed</span>{node.scene.captionRevealed}</figcaption></figure>
  <div className={styles.completionBody}>
   <div className={styles.completionCopy}>
    <span className={styles.seal}><Check/></span><p className="eyebrow">{chapterComplete?"Chapter I complete":"Encounter complete"}</p><h2 id="meeting-complete-title">{chapterComplete?"The meeting becomes a mission.":node.title}</h2>
    <div className={styles.stars} role="img" aria-label={`${stars} of 3 mastery stars earned`}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</div>
    <p className={styles.takeaway}>{node.completionTakeaway}</p>
    {primary&&<Link className={styles.primaryUnlock} href={primary.href??"/progress"}><span>{primary.type==="relationship"?<Link2/>:<Sparkles/>}</span><div><small>{primary.label}</small><strong>{primary.detail}</strong></div><ChevronRight/></Link>}
    <div className={styles.actions}>{chapterComplete?<Link className="cta-primary" href="/journey/hanuman/southern-search-begins">Begin Chapter II — The Search <ChevronRight/></Link>:nextSlug?<Link className="cta-primary" href={`/journey/hanuman/${nextSlug}`}>Continue the chapter <ChevronRight/></Link>:null}<button type="button" onClick={onReplay}><RotateCcw/> {stars<3?"Improve mastery":"Replay mastery"}</button></div>
    <aside className={styles.memory} data-unlocked={stars===3}><Sparkles/><div><small>{stars===3?"Three-star memory revealed":"Memory still to discover"}</small><strong>{stars===3?memoryName:"Replay mastery to reveal this memory"}</strong><p>{stars===3?memory:"The story continues without perfect mastery; your best score is preserved."}</p>{stars===3&&<Link href="/characters/hanuman">View Hanumān’s memories →</Link>}</div></aside>
   </div>
   {chapterComplete&&<aside className={styles.chapterRecap}><p className="eyebrow">Chapter I · The Meeting</p><h3>Five moments become one mission</h3><ol><li><b>Observe</b><span>Hanumān approaches uncertainty with care.</span></li><li><b>Speak</b><span>Rāma recognizes learning and restraint.</span></li><li><b>Understand</b><span>Sītā’s absence gives the meeting purpose.</span></li><li><b>Connect</b><span>Rāma and Sugrīva form an alliance.</span></li><li><b>Remember</b><span>Sītā’s signs make the search concrete.</span></li></ol><footer><small>Coming next</small><strong>Chapter II — The Search</strong><p>The meeting gives way to responsibility.</p></footer></aside>}
  </div>
  {secondary.length>0&&<details className={styles.added}><summary>{secondary.every(reward=>reward.label==="In your record")?"In your record":"Journey record"} · {secondary.length}</summary><ul>{secondary.map(reward=><li key={reward.id}><small>{reward.label}</small><strong>{reward.detail}</strong></li>)}</ul></details>}
 </section>;
}
