"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {ArrowLeft,Check,LockKeyhole,Star} from "lucide-react";
import {meetingNodes} from "@/data/meeting";
import {useProgress} from "@/components/progress-provider";
import {canEnterNode,nodeMastery} from "@/lib/progress";
import {encounterHref} from "@/lib/journey-navigation";
import styles from "./meeting-map.module.scss";
import {MobileEncounterShortcut} from "@/components/mobile-encounter-shortcut";
export function MeetingMap({onBack}:{onBack:()=>void}){
 const {progress}=useProgress();const [selected,setSelected]=useState(Math.min(progress.meetingCompletedNodes.length,meetingNodes.length-1)),[accuracy,setAccuracy]=useState(false),node=meetingNodes[selected];
 const accuracyTriggerRef=useRef<HTMLButtonElement>(null),accuracyHeadingRef=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(accuracy)requestAnimationFrame(()=>accuracyHeadingRef.current?.focus());},[accuracy]);
 function closeAccuracy(){setAccuracy(false);requestAnimationFrame(()=>accuracyTriggerRef.current?.focus());}const stars=meetingNodes.reduce((sum,item)=>sum+nodeMastery(progress,item).filter(Boolean).length,0);
 return <main className={`page-shell ${styles.page}`}>
  <button onClick={onBack}><ArrowLeft size={16}/> Campaign Map</button>
  <header><p className="eyebrow">Chapter I · Kiṣkindhā Kāṇḍa</p><h1 className="page-title">The Meeting</h1><p>Recognition becomes service.</p><span>{progress.meetingCompletedNodes.length} / {meetingNodes.length} encounters · {stars} / {meetingNodes.length*3} stars</span></header>
  <MobileEncounterShortcut id={meetingNodes[Math.min(progress.meetingCompletedNodes.length,meetingNodes.length-1)].id} title={meetingNodes[Math.min(progress.meetingCompletedNodes.length,meetingNodes.length-1)].title} href={canEnterNode(progress,meetingNodes[Math.min(progress.meetingCompletedNodes.length,meetingNodes.length-1)])?encounterHref(meetingNodes[Math.min(progress.meetingCompletedNodes.length,meetingNodes.length-1)].slug,"chapter","HC-01"):undefined}/><section className={styles.atlas} aria-label="Chapter I regional story map"><Image src="/images/journey/hanuman/hfm-01-revealed-v1.png" alt="Forested mountain refuge of the meeting, shown as a narrative region" fill priority sizes="100vw"/><button className={styles.accuracy} ref={accuracyTriggerRef} aria-expanded={accuracy} onClick={()=>setAccuracy(value=>!value)}>Map accuracy</button><h2>Ṛṣyamūka · Kiṣkindhā</h2><svg viewBox="0 0 1000 600" aria-hidden="true"><path d="M150 372 L430 198 L490 384 L660 240 L840 204"/></svg>{meetingNodes.map((item,index)=>{const content=progress.meetingCompletedNodes.includes(item.id)?<Check/>:canEnterNode(progress,item)?index+1:<LockKeyhole/>,style={left:`${item.coordinates.x}%`,top:`${item.coordinates.y}%`};return canEnterNode(progress,item)?<Link className={styles.pin} style={style} key={item.id} href={encounterHref(item.slug,"chapter","HC-01")} aria-label={`Enter ${item.title}`}>{content}</Link>:<button className={styles.pin} style={style} key={item.id} aria-label={`${item.title} · Locked`} aria-pressed={selected===index} onClick={()=>setSelected(index)}>{content}</button>;})}{accuracy&&<aside><h3 ref={accuracyHeadingRef} tabIndex={-1}>Why here?</h3><p>{node.whyHere.textual}</p><p>{node.whyHere.modern}</p><p>Markers show story order within a broad region, not exact archaeological locations.</p><button onClick={closeAccuracy}>Close</button></aside>}</section>
  <nav className={styles.nodes} aria-label="Chapter I encounters">{meetingNodes.map((item,index)=><button key={item.id} aria-pressed={selected===index} onClick={()=>setSelected(index)}><small>{item.id}</small><strong>{item.title}</strong><span>{nodeMastery(progress,item).map((earned,star)=><Star key={star} size={15} fill={earned?"currentColor":"none"}/>)}</span></button>)}</nav>
  <article className={styles.info}><div><p className="eyebrow">{node.id}</p><h2>{node.title}</h2><p>{node.excerpt}</p></div>{canEnterNode(progress,node)?<Link className="cta-primary" href={encounterHref(node.slug,"chapter","HC-01")}>{progress.meetingCompletedNodes.includes(node.id)?"Review encounter":"Enter encounter"} →</Link>:<p>Complete the preceding encounter to continue.</p>}</article>
  {progress.meetingCompletedNodes.length===meetingNodes.length&&<aside className={styles.info}><div><p className="eyebrow">You completed Chapter I</p><h2>The meeting becomes a mission</h2><p>Chapter II — The Search is now unlocked.</p></div><Link className="cta-primary" href="/journey/hanuman/shore-of-decision">Enter Chapter II →</Link></aside>}
 </main>;
}
