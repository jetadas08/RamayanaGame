"use client";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft,Check,ChevronRight,LockKeyhole,Route,Star} from "lucide-react";
import {SearchBoard} from "@/components/search-experience";
import {useProgress} from "@/components/progress-provider";
import {journeyNodes} from "@/data/journey";
import {searchChapterNodes} from "@/data/search";
import {canEnterNode,nodeMastery} from "@/lib/progress";
import styles from "@/components/search-map.module.scss";

export function SearchMap({onBack}:{onBack:()=>void}){
 const {progress}=useProgress(),nodes=searchChapterNodes(journeyNodes),complete=new Set([...progress.searchCompletedNodes,...progress.completedNodes]);
 const current=nodes.find(node=>canEnterNode(progress,node)&&!complete.has(node.id))??nodes[nodes.length-1];
 return <main className={styles.page}><header><button type="button" onClick={onBack}><ArrowLeft/>Campaign map</button><div><p className="eyebrow">Chapter II · Kiṣkindhā Kāṇḍa</p><h1>The Search</h1><span>Evidence becomes direction. Direction becomes responsibility.</span></div><strong>{nodes.filter(node=>complete.has(node.id)).length} / {nodes.length}</strong></header>
  <div className={styles.layout}><section className={styles.route} aria-label="Chapter II encounter route"><Image src="/images/campaign-map-atlas-v1.png" alt="Painted southern-search route from Kiṣkindhā toward the ocean" fill priority sizes="(max-width: 760px) 100vw, 65vw"/><div className={styles.shade}/><ol>{nodes.map((node,index)=>{const done=complete.has(node.id),available=canEnterNode(progress,node),stars=nodeMastery(progress,node).filter(Boolean).length;return <li key={node.id} data-state={done?"complete":available?"available":"locked"}><span className={styles.line}/>{available?<Link href={`/journey/hanuman/${node.slug}`} aria-label={`${done?"Review":"Enter"} ${node.title}`}><i>{done?<Check/>:index+1}</i><b>{node.title}</b><small>{done?"Complete":node.id===current.id?"Current encounter":"Available"} · {[0,1,2].map(i=><Star key={i} fill={i<stars?"currentColor":"none"}/>)}</small><ChevronRight/></Link>:<div><i><LockKeyhole/></i><b>{node.title}</b><small>Complete the previous encounter</small></div>}</li>})}</ol></section><SearchBoard nodeId={current.id}/></div>
  <footer><Route/><p><strong>Chapter logic:</strong> classify the mission → understand the ring → frame the barrier → evaluate testimony → match capability and launch.</p></footer>
 </main>;
}
