"use client";
import Image from "next/image";
import {ArrowRight,Check,Gem,LockKeyhole} from "lucide-react";
import type {SacredObject} from "@/lib/types";
import styles from "@/components/sacred-object-card.module.scss";
import {useProgress} from "@/components/progress-provider";

export type SacredObjectCardMode="mini"|"standard"|"detail";

export function SacredObjectCard({object,discovered,mode="standard",lockedLabel,lockedDescription,showSources=false}:{object:SacredObject;discovered:boolean;mode?:SacredObjectCardMode;lockedLabel?:string;lockedDescription?:string;showSources?:boolean}){
 const {progress}=useProgress();
 if(object.id==="ramas-ring"&&progress.completedNodes.includes("HJ-11"))object={...object,transmissionChain:["Rāma","Hanumān","Sītā"],description:"The signet ring authenticates Hanumān as Rāma’s messenger and gives Sītā a recognizable sign of trust."};
 const image=mode==="detail"?(object.previewImage??object.thumbnailImage):mode==="mini"?object.iconImage:object.thumbnailImage;
 return <div className={styles.card} data-mode={mode} data-state={discovered?"discovered":"locked"} aria-label={discovered?`${object.name}, sacred object discovered`:"Undiscovered sacred object"}>
  <div className={styles.visual}><Image src={image} alt={discovered?object.altText:""} fill sizes={mode==="detail"?"(max-width: 760px) 100vw, 420px":mode==="mini"?"64px":"160px"}/><span>{discovered?<Check/>:<LockKeyhole/>}</span></div>
  <div className={styles.content}><small className={styles.kicker}><Gem/>{discovered?(object.significanceLabel??"Sacred object"):"Undiscovered sacred object"}</small><strong className={styles.name}>{discovered?object.name:(lockedLabel??"Sacred object veiled")}</strong>{discovered&&mode!=="mini"&&<span className={styles.sanskrit}>{object.sanskritName}</span>}<p>{discovered?(mode==="mini"?object.caption:object.description):(lockedDescription??`Continue to ${object.discoveryNode} to reveal this story artifact.`)}</p>{discovered&&<div className={styles.chain} aria-label={`Transmission chain: ${object.transmissionChain.join(" to ")}`}>{object.transmissionChain.map((name,index)=><span key={name}>{name}{index<object.transmissionChain.length-1&&<ArrowRight/>}</span>)}</div>}{discovered&&mode==="detail"&&<p className={styles.meaning}>{object.meaning}</p>}{discovered&&showSources&&<div className={styles.sources}>{object.sources.map(source=><span key={source.source}>{source.source}</span>)}</div>}{mode!=="mini"&&<small className={styles.meta}>{discovered?`${object.discoveryNode} · ${object.objectType.replaceAll("-"," ")}`:object.discoveryNode}</small>}</div>
 </div>;
}
