"use client";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft,Check,ChevronRight,LockKeyhole,Star,Waves} from "lucide-react";
import {CrossingTrail} from "@/components/crossing-experience";
import {journeyNodes} from "@/data/journey";
import {crossingNodes} from "@/data/crossing";
import {useProgress} from "@/components/progress-provider";
import {canEnterNode,nodeMastery} from "@/lib/progress";
import {encounterHref} from "@/lib/journey-navigation";
import styles from "@/components/crossing-map.module.scss";
import {MobileEncounterShortcut} from "@/components/mobile-encounter-shortcut";

export function CrossingMap({onBack}:{onBack:()=>void}){
 const {progress}=useProgress(),nodes=crossingNodes(journeyNodes),current=nodes.find(node=>canEnterNode(progress,node)&&!progress.completedNodes.includes(node.id))??nodes[nodes.length-1];
 return <main className={styles.page}><header><button onClick={onBack}><ArrowLeft/>Campaign map</button><div><p className="eyebrow">Chapter III · Sundara Kāṇḍa</p><h1>Across the Ocean</h1><span>Read the obstacle before choosing the response.</span></div><strong>{nodes.filter(node=>progress.completedNodes.includes(node.id)).length} / 5</strong></header><MobileEncounterShortcut id={current.id} title={current.title} href={canEnterNode(progress,current)?encounterHref(current.slug,"chapter","HC-03"):undefined}/><div className={styles.layout}><section className={styles.route} aria-label="Chapter III crossing route"><Image src="/images/journey/hanuman/hj-04-cinematic-v1.png" alt="Hanumān crossing the ocean toward Laṅkā" fill priority sizes="(max-width: 800px) 100vw, 65vw"/><div className={styles.shade}/><svg viewBox="0 0 800 500" aria-hidden="true"><path d="M95 390 C210 260 330 320 420 210 S620 115 730 90"/></svg><ol>{nodes.map((node,index)=>{const done=progress.completedNodes.includes(node.id),available=canEnterNode(progress,node),stars=nodeMastery(progress,node).filter(Boolean).length;return <li key={node.id} data-state={done?"complete":available?"available":"locked"}>{available?<Link href={encounterHref(node.slug,"chapter","HC-03")}><i>{done?<Check/>:index+1}</i><span><b>{node.title}</b><small>{done?"Trail recorded":node.id===current.id?"Current obstacle":"Available"} · {[0,1,2].map(i=><Star key={i} fill={i<stars?"currentColor":"none"}/>)}</small></span><ChevronRight/></Link>:<div><i><LockKeyhole/></i><span><b>{node.title}</b><small>Complete the previous encounter</small></span></div>}</li>})}</ol></section><CrossingTrail nodeId={current.id}/></div><footer><Waves/><p><strong>Crossing logic:</strong> commit → assess → adapt → diagnose → interpret. The route is narrative and does not pass through the later Rāma Setu.</p></footer></main>;
}
