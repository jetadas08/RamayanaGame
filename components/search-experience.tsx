"use client";

import {useMemo,useState} from "react";
import {ArrowRight,Compass,Lightbulb,Route,ShieldCheck} from "lucide-react";
import {useProgress} from "@/components/progress-provider";
import type {JourneyNode} from "@/lib/types";
import styles from "@/components/search-experience.module.scss";

type Prompt={id:string;label:string;options:{id:string;label:string}[];correct:string};
type Action={kicker:string;title:string;instruction:string;prompts:Prompt[];success:string;repair:string};
const statusOptions=[{id:"known",label:"Known"},{id:"assumed",label:"Assumed"},{id:"unknown",label:"Unknown"}];
const actions:Record<string,Action>={
 "HFS-01":{kicker:"Classify the mission",title:"Set the first Search Compass",instruction:"Sort each statement by what the party can responsibly claim now.",prompts:[{id:"sita",label:"Sītā is missing and must be found.",options:statusOptions,correct:"known"},{id:"south",label:"The southern route may hold the needed clue.",options:statusOptions,correct:"assumed"},{id:"where",label:"Where is Sītā being held?",options:statusOptions,correct:"unknown"}],success:"The compass now separates evidence, a working direction, and the open question.",repair:"Keep Sītā’s absence under Known. The southern route is a working assumption. Her location remains Unknown."},
 "HFS-02":{kicker:"Reason about the object",title:"What can the ring actually do?",instruction:"Classify each proposed function before the ring enters the collection.",prompts:[{id:"identity",label:"Make Hanumān recognizable as Rāma’s messenger.",options:[{id:"supports",label:"Supported"},{id:"not",label:"Not supported"}],correct:"supports"},{id:"trust",label:"Carry Rāma’s trust into a future meeting.",options:[{id:"supports",label:"Supported"},{id:"not",label:"Not supported"}],correct:"supports"},{id:"location",label:"Reveal Sītā’s location before the search begins.",options:[{id:"supports",label:"Supported"},{id:"not",label:"Not supported"}],correct:"not"}],success:"The ring carries identity and trust. Its path is Rāma → Hanumān → ? until the search succeeds.",repair:"The ring authenticates a messenger and message. It does not locate Sītā or guarantee the outcome."},
 "HJ-01":{kicker:"Frame the problem",title:"What blocks the mission now?",instruction:"Distinguish the established obstacle from a question the party still must answer.",prompts:[{id:"ocean",label:"The ocean blocks the physical route.",options:[{id:"barrier",label:"Known barrier"},{id:"question",label:"Open question"}],correct:"barrier"},{id:"hope",label:"The party has lost confidence and direction.",options:[{id:"barrier",label:"Known barrier"},{id:"question",label:"Open question"}],correct:"barrier"},{id:"destination",label:"Where exactly is Sītā?",options:[{id:"barrier",label:"Known barrier"},{id:"question",label:"Open question"}],correct:"question"}],success:"The board names the physical and emotional barriers without pretending the destination is known.",repair:"The sea and discouragement are present barriers. Sītā’s exact location is still an open question."},
 "HJ-02":{kicker:"Evaluate testimony",title:"How does Sampāti update the search?",instruction:"Separate his claim, its basis, and the decision it changes.",prompts:[{id:"claim",label:"Sītā is held in Laṅkā.",options:[{id:"claim",label:"Claim"},{id:"basis",label:"Basis"},{id:"impact",label:"Decision impact"}],correct:"claim"},{id:"sight",label:"Sampāti’s far-reaching sight.",options:[{id:"claim",label:"Claim"},{id:"basis",label:"Basis"},{id:"impact",label:"Decision impact"}],correct:"basis"},{id:"south",label:"Direct the mission across the southern ocean.",options:[{id:"claim",label:"Claim"},{id:"basis",label:"Basis"},{id:"impact",label:"Decision impact"}],correct:"impact"}],success:"Testimony becomes actionable because its source, claim, and effect on the route remain visible.",repair:"The location is the claim, Sampāti’s sight is its stated basis, and the changed route is the decision impact."},
 "HJ-03":{kicker:"Match capability to need",title:"Assemble the launch plan",instruction:"Assign the capacity that answers each mission need.",prompts:[{id:"distance",label:"Cross an extraordinary distance.",options:[{id:"reach",label:"Reach"},{id:"judgment",label:"Judgment"},{id:"devotion",label:"Devotion"}],correct:"reach"},{id:"uncertainty",label:"Adapt under uncertainty.",options:[{id:"reach",label:"Reach"},{id:"judgment",label:"Judgment"},{id:"devotion",label:"Devotion"}],correct:"judgment"},{id:"purpose",label:"Keep the mission’s purpose central.",options:[{id:"reach",label:"Reach"},{id:"judgment",label:"Judgment"},{id:"devotion",label:"Devotion"}],correct:"devotion"}],success:"Launch plan: evidence → Laṅkā; messenger → Hanumān; next action → cross the ocean and search.",repair:"Match distance with reach, uncertainty with judgment, and sustained purpose with devotion."},
};

export function SearchBoard({nodeId}:{nodeId:string}){
 const {progress}=useProgress();
 const entries=useMemo(()=>{
  const completed=new Set([...progress.searchCompletedNodes,...progress.completedNodes]);
  const result=[{label:"Mission",value:"Find Sītā",state:"known"},{label:"Direction",value:"Southern route",state:"assumed"},{label:"Open question",value:"Where is Sītā?",state:"unknown"}];
  if(completed.has("HFS-02")||nodeId==="HFS-02")result.push({label:"Evidence carried",value:"Rāma’s ring · Rāma → Hanumān → ?",state:"known"});
  if(completed.has("HJ-01")||nodeId==="HJ-01")result.push({label:"Barrier",value:"Ocean + loss of hope",state:"known"});
  if(completed.has("HJ-02")||nodeId==="HJ-02")result.push({label:"Testimony",value:"Sampāti identifies Laṅkā",state:"known"},{label:"Direction updated",value:"Across the southern ocean",state:"known"});
  if(completed.has("HJ-03")||nodeId==="HJ-03")result.push({label:"Messenger",value:"Hanumān",state:"known"},{label:"Next action",value:"Leap, cross, search",state:"known"});
  return result;
 },[progress.searchCompletedNodes,progress.completedNodes,nodeId]);
 return <aside className={styles.board} aria-label="Persistent Search Compass"><header><Compass/><div><small>Chapter II · Evidence and direction</small><h3>Search Compass</h3></div></header><dl>{entries.map(entry=><div key={`${entry.label}-${entry.value}`} data-state={entry.state}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>)}</dl></aside>;
}

export function SearchExplore({node,onComplete}:{node:JourneyNode;onComplete:()=>void}){
 const {progress,saveSearchBoardAnswer}=useProgress();
 const action=actions[node.id];
 const stored=Boolean(progress.searchBoardAnswers[node.id]);
 const [values,setValues]=useState<Record<string,string>>({});
 const [checked,setChecked]=useState(false);
 const correct=action.prompts.every(prompt=>values[prompt.id]===prompt.correct);
 function submit(){setChecked(true);if(correct)saveSearchBoardAnswer(node.id,"reasoned");}
 function repair(){setValues(Object.fromEntries(action.prompts.map(prompt=>[prompt.id,prompt.correct])));saveSearchBoardAnswer(node.id,"guided-repair");setChecked(true);}
 return <div className={styles.experience}>
  <SearchBoard nodeId={node.id}/>
  <section className={styles.action} aria-labelledby="search-action-title"><p className="eyebrow"><Route/> {action.kicker}</p><h2 id="search-action-title">{action.title}</h2><p>{action.instruction}</p><div className={styles.promptList}>{action.prompts.map((prompt,index)=><label key={prompt.id}><span><b>{index+1}</b>{prompt.label}</span><select value={values[prompt.id]??""} onChange={event=>{setValues(current=>({...current,[prompt.id]:event.target.value}));setChecked(false);}} disabled={stored}><option value="">Choose…</option>{prompt.options.map(option=><option value={option.id} key={option.id}>{option.label}</option>)}</select></label>)}</div>
   {(checked||stored)&&<div className={correct||stored?styles.success:styles.repair} role="status">{correct||stored?<ShieldCheck/>:<Lightbulb/>}<div><strong>{correct||stored?"Board updated":"One more reasoning pass"}</strong><p>{correct||stored?action.success:action.repair}</p></div></div>}
   <div className={styles.actions}>{!stored&&<button type="button" onClick={submit} disabled={!action.prompts.every(prompt=>values[prompt.id])}>Check reasoning</button>}{checked&&!correct&&!stored&&<button type="button" onClick={repair}>Use evidence-guided repair</button>}{stored&&<button type="button" onClick={onComplete}>Continue to the canonical story <ArrowRight/></button>}</div>
  </section>
 </div>;
}
