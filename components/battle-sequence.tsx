"use client";

import {useState} from "react";
import {ArrowRight, Check, Swords} from "lucide-react";
import type {SubEncounter} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import styles from "@/components/journey.module.scss";

export function BattleSequence({stages,discoveredStageIds=[],onDiscoverStage,onComplete}:{stages:SubEncounter[];discoveredStageIds?:string[];onDiscoverStage?:(stageId:string)=>void;onComplete:()=>void}){
 const initialIndex=Math.min(discoveredStageIds.length,stages.length-1);
 const [stageIndex,setStageIndex]=useState(initialIndex);
 const [choice,setChoice]=useState<number|null>(discoveredStageIds.length===stages.length?0:null);
 const stage=stages[stageIndex];
 const finished=stageIndex===stages.length-1&&choice!==null;

 function continueBattle(){
  if(choice===null)return;
  if(finished){onComplete();return;}
  setStageIndex(index=>index+1);
  setChoice(null);
 }

 return <section className="mt-16">
  <div className="flex items-center gap-3"><Swords className="text-[var(--gold)]"/><div><p className="eyebrow">HJ-12 mini-chapter · Encounter {stageIndex+1} of {stages.length}</p><h2 className="font-display text-3xl text-[var(--cream)]">The battle escalates</h2></div></div>
  <div className={styles.battleProgress} aria-label={(stageIndex+(choice!==null?1:0))+" of "+stages.length+" battle encounters explored"}>{stages.map((item,index)=><span key={item.id} className={index<stageIndex||index===stageIndex&&choice!==null?styles.done:index===stageIndex?styles.current:""}>{index<stageIndex||index===stageIndex&&choice!==null?<Check size={13}/>:index+1}</span>)}</div>
  <Card className="challenge-card mt-6 p-7 sm:p-9">
   <p className="eyebrow">{stage.id} · {stage.title}</p>
   <h3 className="font-display mt-2 text-3xl text-[var(--cream)]">{stage.opponent}</h3>
   <p className="mt-6 text-lg text-[var(--cream)]">{stage.decision.prompt}</p>
   <div className="mt-5 grid gap-3">{stage.decision.options.map((option,index)=><button className={"choice "+(choice===index?"selected":"")} disabled={choice!==null} key={option.label} onClick={()=>{setChoice(index);onDiscoverStage?.(stage.id);}}><span>{String.fromCharCode(65+index)}</span>{option.label}</button>)}</div>
   {choice!==null&&<div className="mt-5 rounded-2xl border border-[#7eae75]/30 bg-[#7eae75]/10 p-4 text-sm leading-6 text-[#c7e0c1]" role="status"><strong>Story insight.</strong> {stage.decision.options[choice].feedback}<p className="mt-2 text-[#d8c9b2]">{stage.outcome}</p></div>}
   {choice!==null&&<Button className="mt-6" onClick={continueBattle}>{finished?"Begin the three-question recap":"Continue to encounter "+(stageIndex+2)} <ArrowRight size={16}/></Button>}
  </Card>
 </section>;
}
