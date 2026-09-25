"use client";
import Image from "next/image";
import Link from "next/link";
import {ArrowRight,Check,Gem,LockKeyhole} from "lucide-react";
import type {SacredObject} from "@/lib/types";
import styles from "@/components/sacred-object-card.module.scss";
import {useProgress} from "@/components/progress-provider";
import {encounterHref} from "@/lib/journey-navigation";
import {knownObjectJourneySteps} from "@/data/sacred-object-history";
import {orderedSourceRefs} from "@/lib/source-readiness";
import {ringBhaktiReflection} from "@/data/bhakti-pass-one";

export type SacredObjectCardMode="mini"|"standard"|"detail";

export function SacredObjectJourney({objectId}:{objectId:string}){
 const {progress}=useProgress();
 const steps=knownObjectJourneySteps(objectId,progress);
 if(!steps.length)return null;
 return <nav className={styles.journey} aria-label="Sacred Object history"><small>Sacred Object history</small><ol>{steps.map((step,index)=><li key={`${step.slug}-${index}`}><Link href={encounterHref(step.slug,"object",objectId)}><span>{index+1}</span><b>{step.title}</b><em>{step.detail}</em></Link></li>)}</ol></nav>;
}

export function SacredObjectCard({object,discovered,mode="standard",lockedLabel,lockedDescription,showSources=false}:{object:SacredObject;discovered:boolean;mode?:SacredObjectCardMode;lockedLabel?:string;lockedDescription?:string;showSources?:boolean}){
 const {progress}=useProgress();
 const ringDelivered=progress.revealedScenes.includes("HJ-11")||progress.completedNodes.includes("HJ-11");
 if(object.id==="ramas-ring")object=ringDelivered?{...object,transmissionChain:["Rāma","Hanumān","Sītā"],description:"Hanumān presents Rāma’s signet ring to Sītā, who recognizes it as a sign from him."}:{...object,description:"Rāma gives Hanumān his signet ring to carry as a sign of his identity."};
 const reflection=object.id==="ramas-ring"?ringBhaktiReflection(progress,discovered):null;
 const image=mode==="detail"?(object.previewImage??object.thumbnailImage):mode==="mini"?object.iconImage:object.thumbnailImage;
 return <div className={styles.card} data-mode={mode} data-state={discovered?"discovered":"locked"} aria-label={discovered?`${object.name}, sacred object discovered`:"Undiscovered sacred object"}>
  <div className={styles.visual}><Image src={image} alt={discovered?object.altText:""} fill sizes={mode==="detail"?"(max-width: 760px) 100vw, 420px":mode==="mini"?"64px":"160px"}/><span>{discovered?<Check/>:<LockKeyhole/>}</span></div>
  <div className={styles.content}><small className={styles.kicker}><Gem/>{discovered?(object.significanceLabel??"Sacred object"):"Undiscovered sacred object"}</small><strong className={styles.name}>{discovered?object.name:(lockedLabel??"Sacred object veiled")}</strong>{discovered&&mode!=="mini"&&<span className={styles.sanskrit}>{object.sanskritName}</span>}<p>{discovered?(mode==="mini"?object.caption:object.description):(lockedDescription??`Continue to ${object.discoveryNode} to reveal this story artifact.`)}</p>{discovered&&<div className={styles.chain} aria-label={`Transmission chain: ${object.transmissionChain.join(" to ")}`}>{object.transmissionChain.map((name,index)=><span key={name}>{name}{index<object.transmissionChain.length-1&&<ArrowRight/>}</span>)}</div>}{discovered&&mode!=="mini"&&<SacredObjectJourney objectId={object.id}/>} {reflection&&mode!=="mini"&&<p className={styles.meaning}><span>Reflection on the story</span>{reflection.text}</p>}{discovered&&showSources&&<div className={styles.sources}>{orderedSourceRefs(object.sources).map(source=><span key={source.source}>{source.source}</span>)}</div>}{mode!=="mini"&&<small className={styles.meta}>{discovered?`${object.discoveryNode} · ${object.objectType.replaceAll("-"," ")}`:object.discoveryNode}</small>}</div>
 </div>;
}
