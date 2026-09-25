"use client";

import {ArrowRight,Check,Lightbulb,RotateCcw,Shield,Users} from "lucide-react";
import {useProgress} from "@/components/progress-provider";
import {NodeSceneCard} from "@/components/node-scene-card";
import {activityById} from "@/data/encounter-activities";
import {warCouncilSteps} from "@/data/chapter-six";
import type {JourneyNode,PredictionChoiceActivity,SceneDiscoveryActivity,StoryMemoryActivity} from "@/lib/types";
import styles from "@/components/chapter-six-experience.module.scss";

function activity<T>(id:string){return activityById(id) as T;}

function Council({node}:{node:JourneyNode}){
 const current=warCouncilSteps.findIndex(step=>step.nodeId===node.id);
 return <aside className={styles.council} aria-labelledby="war-council-title"><header><span><Users/> War Council</span><strong id="war-council-title">Known · needed · who can help · what happens next</strong></header><ol>{warCouncilSteps.map((step,index)=><li key={step.nodeId} data-state={index<current?"known":index===current?"current":"future"}><span>{index<current?<Check/>:index+1}</span><div><small>{step.category}</small><strong>{step.question}</strong>{index===current&&<p>{step.answer}</p>}</div></li>)}</ol></aside>;
}

const feedback:Record<string,Record<string,string>>={
 "C6-HFW01-SECONDARY":{first:"Sītā’s condition and proof answer the first human need; spectacle can support the report later.",equal:"Equal weight can bury urgent knowledge. Priority is part of truthful reporting."},
 "C6-HFW02-EVIDENCE":{birth:"Origin creates reasonable concern, but it does not settle character or intention.",certainty:"A favorable appearance is not a guarantee. Counsel must name both evidence and uncertainty."},
 "C6-HFW02-COUNSEL":{decide:"Hanumān’s insight matters, but refuge belongs to Rāma’s authority.",reject:"Prudence examines evidence; it does not make uncertainty an automatic refusal."},
 "C6-HFW03-ENGINEER":{hanuman:"Hanumān’s strength does not erase Nala’s engineering role.",ravana:"The bridge is the army’s work under Rāma’s campaign, not Rāvaṇa’s."},
 "C6-HFW04-SIGNALS":{loudest:"A louder distant battle may matter, but it is not automatically Hanumān’s immediate responsibility.",glory:"The entrusted post, not personal recognition, defines the first duty."},
 "C6-HFW05-SUPPORT":{display:"Power without restoring the endangered formation leaves the larger problem unsolved.",pursue:"Support begins with the allies whose capacity is collapsing now."},
 "C6-HFW06-IMPULSE":{fly:"Speed becomes useful only after knowledge identifies the remedy and destination.",fight:"Another fight does not answer the wounded army’s immediate need."},
};

function Choice({id}:{id:string}){
 const {progress,selectPrediction}=useProgress(),item=activity<PredictionChoiceActivity>(id),value=progress.predictionChoices[id],correct=value===item.canonicalAnswer;
 return <section className={styles.panel} aria-labelledby={`${id}-title`}><small>{item.title}</small><h3 id={`${id}-title`}>{item.prompt}</h3><div className={styles.choices}>{item.choices.map(choice=><button type="button" key={choice.id} aria-pressed={value===choice.id} onClick={()=>selectPrediction(id,choice.id)}><span>{value===choice.id?<Check/>:"·"}</span>{choice.label}</button>)}</div>{value&&<div className={correct?styles.good:styles.repair} role="status"><strong>{correct?item.canonicalReveal:"Reasoning repair"}</strong><p>{correct?item.explanation:feedback[id]?.[value]??item.explanation}</p></div>}</section>;
}

function Sequence({id,max}:{id:string;max?:number}){
 const {progress,saveStoryMemory}=useProgress(),item=activity<StoryMemoryActivity>(id),value=progress.storyMemoryAnswers[id]?.split(",").filter(Boolean)??[],limit=max??item.correctOrder.length,complete=value.length===limit,order=item.correctOrder.slice(0,limit),correct=complete&&(max?order.every(entry=>value.includes(entry)):value.join(",")===order.join(","));
 const add=(entry:string)=>{if(value.includes(entry)||complete)return;saveStoryMemory(id,[...value,entry]);};
 return <section className={styles.panel} aria-labelledby={`${id}-title`}><small>{item.title}</small><h3 id={`${id}-title`}>{item.prompt}</h3><div className={styles.slots}>{value.map((entry,index)=><span key={entry}><b>{index+1}</b>{item.items.find(x=>x.id===entry)?.label}</span>)}{Array.from({length:limit-value.length},(_,index)=><i key={index}>?</i>)}</div><div className={styles.sequenceChoices}>{item.items.map(entry=><button type="button" key={entry.id} disabled={value.includes(entry.id)||complete} onClick={()=>add(entry.id)}>{entry.label}</button>)}</div>{complete&&<div className={correct?styles.good:styles.repair}><strong>{correct?"The priority is clear.":"The facts are present, but their priority or order changes the judgment."}</strong><p>{item.explanation}</p>{!correct&&<button type="button" onClick={()=>saveStoryMemory(id,[])}><RotateCcw/> Rebuild</button>}</div>}</section>;
}

function Discovery({id}:{id:string}){
 const {progress,discoverScene}=useProgress(),item=activity<SceneDiscoveryActivity>(id);
 return <section className={styles.panel}><small>{item.title}</small><h3>{item.prompt}</h3><div className={styles.discoveries}>{item.hotspots.map(h=>{const found=progress.sceneDiscoveries.includes(`${id}:${h.id}`);return <button type="button" key={h.id} data-found={found} onClick={()=>discoverScene(id,h.id)}><span>{found?<Check/>:<Lightbulb/>}</span><strong>{h.label}</strong>{found&&<p>{h.detail}</p>}</button>})}</div></section>;
}

function SourceCare(){return <details className={styles.sourceCare}><summary>Source distinction · Vibhīṣaṇa</summary><p><strong>Vālmīki Rāmāyaṇa:</strong> this council scene stands on Vibhīṣaṇa’s arrival, the leaders’ concern, Hanumān’s reasoning, and Rāma’s decision. It does not assume an earlier meeting in Laṅkā.</p><p><strong>Rāmacaritamānasa layer:</strong> the earlier HJ-09 meeting may be remembered as a separately labeled devotional-tradition callback; it is not imported here as a Vālmīki fact.</p></details>}

function Action({ready,label,onComplete}:{ready:boolean;label:string;onComplete:()=>void}){return <div className={styles.action}><button type="button" disabled={!ready} onClick={onComplete}>{label} <ArrowRight/></button>{!ready&&<small>Inspect the evidence, commit to a judgment, and repair it when needed.</small>}</div>}
const predictionCorrect=(progress:ReturnType<typeof useProgress>["progress"],id:string)=>progress.predictionChoices[id]===activity<PredictionChoiceActivity>(id).canonicalAnswer;
const sequenceCorrect=(progress:ReturnType<typeof useProgress>["progress"],id:string,max?:number)=>{const item=activity<StoryMemoryActivity>(id),value=progress.storyMemoryAnswers[id]?.split(",").filter(Boolean)??[],order=item.correctOrder.slice(0,max);return value.length===order.length&&(max?order.every(x=>value.includes(x)):value.join(",")===order.join(","));};

function Play({node,onComplete}:{node:JourneyNode;onComplete:()=>void}){
 const {progress}=useProgress();
 if(node.id==="HFW-01"){const ready=sequenceCorrect(progress,"C6-HFW01-RAMA",3)&&sequenceCorrect(progress,"C6-HFW01-ARMY",3)&&predictionCorrect(progress,"C6-HFW01-SECONDARY");return <><div className={styles.intro}><span>Prioritize</span><h2 id="chapter-six-action-title">Turn firsthand experience into war intelligence</h2><p>You have more true information than the council can use at once. Decide what Rāma needs first, what the army needs next, and what remains supporting detail.</p></div><Sequence id="C6-HFW01-RAMA" max={3}/><Sequence id="C6-HFW01-ARMY" max={3}/><Choice id="C6-HFW01-SECONDARY"/><Action ready={ready} label="Brief the council" onComplete={onComplete}/></>}
 if(node.id==="HFW-02"){const ready=["C6-HFW02-EVIDENCE","C6-HFW02-COUNSEL","C6-HFW02-AUTHORITY"].every(id=>predictionCorrect(progress,id));return <><div className={styles.intro}><span>Counsel</span><h2 id="chapter-six-action-title">Reason carefully without taking another person’s authority</h2><p>Separate suspicion, prudence, support, and final decision. Uncertainty is part of the council’s work.</p></div><SourceCare/><Choice id="C6-HFW02-EVIDENCE"/><Choice id="C6-HFW02-COUNSEL"/><Choice id="C6-HFW02-AUTHORITY"/><Action ready={ready} label="Hear Rāma’s decision" onComplete={onComplete}/></>}
 if(node.id==="HFW-03"){const ids=["C6-HFW03-ENGINEER","C6-HFW03-LABOR","C6-HFW03-HANUMAN"],ready=ids.every(id=>predictionCorrect(progress,id));return <><div className={styles.intro}><span>Coordinate</span><h2 id="chapter-six-action-title">Match the right person to the right work</h2><p>The whole army must cross. One hero’s earlier leap cannot replace engineering, shared labor, leadership, and protection.</p></div><div className={styles.roleGrid}>{ids.map(id=><Choice key={id} id={id}/>)}</div><Action ready={ready} label="Cross with the army" onComplete={onComplete}/></>}
 if(node.id==="HFW-04"){const ready=predictionCorrect(progress,"C6-HFW04-SIGNALS")&&predictionCorrect(progress,"C6-HFW04-REPAIR");return <><div className={styles.intro}><span>Hold</span><h2 id="chapter-six-action-title">Choose responsibility over spectacle</h2><p>Several signals compete for attention. Read role, place, and consequence before moving toward the loudest threat.</p></div><Choice id="C6-HFW04-SIGNALS"/>{progress.predictionChoices["C6-HFW04-SIGNALS"]&&!predictionCorrect(progress,"C6-HFW04-SIGNALS")&&<Choice id="C6-HFW04-REPAIR"/>}{predictionCorrect(progress,"C6-HFW04-SIGNALS")&&!progress.predictionChoices["C6-HFW04-REPAIR"]&&<Choice id="C6-HFW04-REPAIR"/>}<Action ready={ready} label="Hold the western gate" onComplete={onComplete}/></>}
 if(node.id==="HFW-05"){const ready=predictionCorrect(progress,"C6-HFW05-SUPPORT")&&predictionCorrect(progress,"C6-HFW05-BENEFICIARY");return <><div className={styles.intro}><span>Support</span><h2 id="chapter-six-action-title">Measure strength by what it protects</h2><p>The important change is larger than a duel: endangered allies regain the ability to act together.</p></div><Choice id="C6-HFW05-SUPPORT"/><Choice id="C6-HFW05-BENEFICIARY"/><Action ready={ready} label="Restore the formation" onComplete={onComplete}/></>}
 const found=activity<SceneDiscoveryActivity>("C6-HFW06-ASSESS").hotspots.every(h=>progress.sceneDiscoveries.includes(`C6-HFW06-ASSESS:${h.id}`)),ready=found&&predictionCorrect(progress,"C6-HFW06-IMPULSE")&&sequenceCorrect(progress,"C6-HFW06-TRIAGE");
 return <><div className={`${styles.intro} ${styles.crisis}`}><span><Shield/> Triage</span><h2 id="chapter-six-action-title">The next great act begins with diagnosis</h2><p>Darkness, injury, and incomplete information make speed tempting. Inspect the crisis until knowledge can define the next mission.</p></div><Discovery id="C6-HFW06-ASSESS"/>{found&&<Choice id="C6-HFW06-IMPULSE"/>}{predictionCorrect(progress,"C6-HFW06-IMPULSE")&&<Sequence id="C6-HFW06-TRIAGE"/>}{ready&&<section className={styles.finale}><small>Chapter VI · Collective responsibility</small><h3>The war does not end with a victory pose.</h3><p>It ends with a diagnosis and the discovery that Hanumān is the right servant for the next lifesaving mission.</p><strong>Next · Chapter VII — The Mountain of Herbs</strong></section>}<Action ready={ready} label="Carry the diagnosis into Chapter VII" onComplete={onComplete}/></>;
}

export function ChapterSixExplore({node,onComplete}:{node:JourneyNode;onComplete:()=>void}){return <div className={styles.experience}><Council node={node}/><div className={styles.scene}><NodeSceneCard scene={node.scene} revealed={false} observation/></div><Play node={node} onComplete={onComplete}/></div>}
