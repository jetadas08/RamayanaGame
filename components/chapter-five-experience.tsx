"use client";

import {ArrowRight,Check,Flame,MessageSquareText,RotateCcw,ScrollText,ShieldAlert,Sparkles} from "lucide-react";
import {useProgress} from "@/components/progress-provider";
import {NodeSceneCard} from "@/components/node-scene-card";
import {activityById} from "@/data/encounter-activities";
import {escalationTrail} from "@/data/chapter-five";
import type {JourneyNode,PredictionChoiceActivity,StoryMemoryActivity} from "@/lib/types";
import styles from "@/components/chapter-five-experience.module.scss";

function Trail({node}:{node:JourneyNode}){
 const {progress}=useProgress();
 const currentIndex=node.id==="HJ-12"?Math.max(1,(progress.sceneDiscoveries.includes("HJ12-BATTLE-DISCOVERIES:12.1")?1:0)+["C5-HJ12-BEAT-2","C5-HJ12-BEAT-3","C5-HJ12-BEAT-4"].filter(id=>progress.predictionChoices[id]===activity<PredictionChoiceActivity>(id).canonicalAnswer).length):node.id==="HJ-13"?4:node.id==="HJ-14"?5:6;
 return <aside className={styles.trail} aria-labelledby="escalation-trail-title"><header><span><ShieldAlert/> Escalation Trail</span><strong id="escalation-trail-title">Every action communicates something</strong></header><ol>{escalationTrail.map((step,index)=><li key={`${step.nodeId}-${index}`} data-state={index<currentIndex?"done":index===currentIndex?"current":"future"}><span>{index<currentIndex?<Check/>:index+1}</span><div><strong>{step.label}</strong>{index===currentIndex&&<small>{step.knowledge}</small>}</div></li>)}</ol></aside>;
}

function activity<T>(id:string){return activityById(id) as T;}

function Choice({item,value,onChoose,locked=false}:{item:PredictionChoiceActivity;value?:string;onChoose:(value:string)=>void;locked?:boolean}){
 const answered=Boolean(value),correct=value===item.canonicalAnswer;
 return <section className={styles.panel} aria-labelledby={`${item.id}-title`}><header><small>{item.title}</small><h3 id={`${item.id}-title`}>{item.prompt}</h3></header><div className={styles.choices} role="group" aria-label={item.prompt}>{item.choices.map(choice=><button type="button" key={choice.id} disabled={locked} aria-pressed={value===choice.id} onClick={()=>onChoose(choice.id)}><span>{value===choice.id?<Check/>:"·"}</span>{choice.label}</button>)}</div>{answered&&<div className={correct?styles.good:styles.bad} role="status"><strong>{correct?item.canonicalReveal:"Reconsider the evidence."}</strong><p>{correct?item.explanation:targetedFeedback[item.id]?.[value!]??item.explanation}</p></div>}</section>;
}

const targetedFeedback:Record<string,Record<string,string>>={
 "C5-HJ12-BEAT-1":{royal:"No royal figure has entered yet. Begin with the rank and objective actually shown.",capture:"The first force attempts suppression; capture becomes explicit only after escalation."},
 "C5-HJ12-BEAT-2":{local:"Named champions, ministers’ sons, and commanders change the rank and organization of the response.",capture:"The force is becoming organized, but the court-directed capture objective has not yet appeared."},
 "C5-HJ12-BEAT-3":{insignificant:"Earlier forces have failed. What does sending a royal son suggest about the perceived seriousness of the threat?",peace:"Akṣa arrives to fight, so this is escalation rather than peace."},
 "C5-HJ12-BEAT-4":{punish:"Indrajit’s binding changes where Hanumān is taken and what can happen next. Look beyond greater force.",retreat:"Laṅkā is trying to contain and present the intruder, not abandon the response."},
 "C5-HJ12-CAPTURE":{defeat:"If defeat were the whole explanation, what does Hanumān’s later behavior suggest about his remaining agency?",escape:"Capture places the messenger closer to the person who must hear the warning."},
 "C5-HJ13-TONE":{ego:"You identified the warning, but this turns Rāma’s message into Hanumān’s personal threat.",flattery:"Protecting the speaker by hiding the truth would fail the entrusted message."},
 "C5-HJ13-REACTION":{agreement:"Rāvaṇa orders punishment rather than returning Sītā.",uncertainty:"His anger and order show that he heard the warning; the evidence points to refusal."},
 "C5-HJ14-TURN":{order:"The order starts the chain, but the danger changes scale only when the flame is carried through the city.",return:"The city-wide consequence occurs before the return crossing."},
 "C5-HJ14-MISSION":{glory:"The mission is measured by service to Sītā and Rāma, not public recognition.",conquest:"Hanumān came as messenger and scout, not as claimant to the city."},
 "C5-HJ15-INTELLIGENCE":{chronology:"Chronology can support the report, but delaying Sītā’s condition makes the most urgent knowledge harder to act on.",victories:"Personal victories are secondary to the person, proof, message, and next action the mission requires."},
};

function Sequence({item,value,onSave,max=item.items.length,unordered=false}:{item:StoryMemoryActivity;value:string[];onSave:(ids:string[])=>void;max?:number;unordered?:boolean}){
 const complete=value.length===max;
 const correct=complete&&(unordered?item.correctOrder.every(id=>value.includes(id)):value.join(",")===item.correctOrder.join(","));
 const add=(id:string)=>{if(value.includes(id)||value.length>=max)return;onSave([...value,id]);};
 return <section className={styles.panel} aria-labelledby={`${item.id}-title`}><header><small>{item.title}</small><h3 id={`${item.id}-title`}>{item.prompt}</h3></header><div className={styles.sequence} aria-live="polite">{value.map((id,index)=><span key={id}><b>{index+1}</b>{item.items.find(entry=>entry.id===id)?.label}</span>)}{Array.from({length:max-value.length},(_,index)=><i key={index}>?</i>)}</div><div className={styles.sequenceChoices}>{item.items.map(entry=><button type="button" key={entry.id} disabled={value.includes(entry.id)||value.length>=max} onClick={()=>add(entry.id)}>{entry.label}</button>)}</div>{complete&&<div className={correct?styles.good:styles.bad} role="status"><strong>{correct?"The structure serves the mission.":"The pieces are present, but their order or priority changes the meaning."}</strong><p>{item.explanation}</p>{!correct&&<button type="button" className={styles.reset} onClick={()=>onSave([])}><RotateCcw/> Rebuild</button>}</div>}</section>;
}

function HJ12({onComplete}:{onComplete:()=>void}){
 const {progress,selectPrediction,discoverScene}=useProgress();
 const ids=["C5-HJ12-BEAT-2","C5-HJ12-BEAT-3","C5-HJ12-BEAT-4"];
 const discoveries=[["12.2","12.3","12.4"],["12.5"],["12.6"]];
 const initialObserved=progress.sceneDiscoveries.includes("HJ12-BATTLE-DISCOVERIES:12.1");
 const correct=ids.map(id=>progress.predictionChoices[id]===activity<PredictionChoiceActivity>(id).canonicalAnswer);
 function choose(index:number,value:string){const item=activity<PredictionChoiceActivity>(ids[index]);selectPrediction(item.id,value);if(value===item.canonicalAnswer)discoveries[index].forEach(hotspot=>discoverScene("HJ12-BATTLE-DISCOVERIES",hotspot));}
 return <><div className={styles.intro}><span><ShieldAlert/> Read escalation</span><h2 id="chapter-five-action-title">What serves the mission now?</h2><p>Read the rank, objective, and information in each response. The names remain in the source record; the playable structure follows four meaningful shifts.</p></div><div className={styles.beatSummary}><span>1 · Kiṅkaras</span><span>2 · Jambumālī, ministers’ sons, five commanders</span><span>3 · Akṣa Kumāra</span><span>4 · Indrajit / Brahmāstra</span></div><section className={styles.panel}><header><small>Beat 1 · Observe the initial response</small><h3>Kiṅkaras arrive as a massed guard force.</h3></header><p>The first response treats Hanumān as a local disturbance that numbers can suppress. Notice the scale and rank before interpreting the larger conflict.</p><button type="button" disabled={initialObserved} onClick={()=>discoverScene("HJ12-BATTLE-DISCOVERIES","12.1")}>{initialObserved?<><Check/> Initial response recorded</>:"Record the first shift"}</button></section>{initialObserved&&ids.map((id,index)=><div key={id} className={index>0&&!correct[index-1]?styles.locked:""}><Choice item={activity(id)} value={progress.predictionChoices[id]} onChoose={value=>choose(index,value)} locked={index>0&&!correct[index-1]}/></div>)}<Action ready={initialObserved&&correct.every(Boolean)} label="Follow the strategic capture into court" onClick={onComplete}/></>;
}

function HJ13({onComplete}:{onComplete:()=>void}){
 const {progress,selectPrediction,saveStoryMemory}=useProgress();
 const tone=activity<PredictionChoiceActivity>("C5-HJ13-TONE"),toneValue=progress.predictionChoices[tone.id],toneCorrect=toneValue===tone.canonicalAnswer;
 const repair=activity<PredictionChoiceActivity>("C5-HJ13-REPAIR"),repairValue=progress.predictionChoices[repair.id],needsRepair=Boolean(toneValue&&!toneCorrect),repairCorrect=repairValue===repair.canonicalAnswer;
 const message=activity<StoryMemoryActivity>("C5-HJ13-MESSAGE"),messageValue=progress.storyMemoryAnswers[message.id]?.split(",").filter(Boolean)??[],messageCorrect=messageValue.join(",")===message.correctOrder.join(",");
 const reaction=activity<PredictionChoiceActivity>("C5-HJ13-REACTION"),reactionValue=progress.predictionChoices[reaction.id],reactionCorrect=reactionValue===reaction.canonicalAnswer;
 return <><div className={styles.intro}><span><MessageSquareText/> Deliver</span><h2 id="chapter-five-action-title">Build a message that belongs to the mission</h2><p>Physical force has brought Hanumān to court. Now clarity, loyalty, warning, and the possibility of correction must do the work.</p></div><Choice item={tone} value={toneValue} onChoose={value=>selectPrediction(tone.id,value)} locked={needsRepair&&!repairCorrect}/>{needsRepair&&<div className={styles.repair}><p>Reasoning repair · remove the element that turns warning into ego.</p><Choice item={repair} value={repairValue} onChoose={value=>selectPrediction(repair.id,value)}/>{repairCorrect&&<small>Now revise the message opening above.</small>}</div>}{toneCorrect&&<Sequence item={message} value={messageValue} onSave={ids=>saveStoryMemory(message.id,ids)}/>} {messageCorrect&&<Choice item={reaction} value={reactionValue} onChoose={value=>selectPrediction(reaction.id,value)}/>}<Action ready={toneCorrect&&messageCorrect&&reactionCorrect} label="Reveal the court’s decision" onClick={onComplete}/></>;
}

function HJ14({onComplete}:{onComplete:()=>void}){
 const {progress,selectPrediction,saveStoryMemory}=useProgress();
 const chain=activity<StoryMemoryActivity>("C5-HJ14-CAUSE"),chainValue=progress.storyMemoryAnswers[chain.id]?.split(",").filter(Boolean)??[],chainCorrect=chainValue.join(",")===chain.correctOrder.join(",");
 const turn=activity<PredictionChoiceActivity>("C5-HJ14-TURN"),turnValue=progress.predictionChoices[turn.id],turnCorrect=turnValue===turn.canonicalAnswer;
 const mission=activity<PredictionChoiceActivity>("C5-HJ14-MISSION"),missionValue=progress.predictionChoices[mission.id],missionCorrect=missionValue===mission.canonicalAnswer;
 return <div className={styles.fireExperience}><div className={styles.intro}><span><Flame/> Trace consequence</span><h2 id="chapter-five-action-title">When does punishment become danger to Laṅkā?</h2><p>Reconstruct the chain before interpreting it. Separate the initial decision, Hanumān’s agency, and the wider consequence.</p></div><Sequence item={chain} value={chainValue} onSave={ids=>saveStoryMemory(chain.id,ids)}/>{chainCorrect&&<Choice item={turn} value={turnValue} onChoose={value=>selectPrediction(turn.id,value)}/>} {turnCorrect&&<Choice item={mission} value={missionValue} onChoose={value=>selectPrediction(mission.id,value)}/>}<Action ready={chainCorrect&&turnCorrect&&missionCorrect} label="Reveal the consequence" onClick={onComplete}/></div>;
}

function HJ15({onComplete}:{onComplete:()=>void}){
 const {progress,selectPrediction,saveStoryMemory,discoverSacredObject}=useProgress();
 const report=activity<StoryMemoryActivity>("C5-HJ15-REPORT"),reportValue=progress.storyMemoryAnswers[report.id]?.split(",").filter(Boolean)??[],reportCorrect=reportValue.length===3&&report.correctOrder.every(id=>reportValue.includes(id));
 const intelligence=activity<PredictionChoiceActivity>("C5-HJ15-INTELLIGENCE"),intelligenceValue=progress.predictionChoices[intelligence.id],intelligenceCorrect=intelligenceValue===intelligence.canonicalAnswer;
 const token=activity<StoryMemoryActivity>("C5-HJ15-CUDAMANI"),tokenComplete=progress.storyMemoryAnswers[token.id]===token.correctOrder.join(",")&&progress.discoveredObjects.includes("sitas-cudamani");
 function finishToken(){saveStoryMemory(token.id,token.correctOrder);discoverSacredObject("sitas-cudamani");}
 return <><div className={styles.intro}><span><ScrollText/> Report</span><h2 id="chapter-five-action-title">Turn experience into useful intelligence</h2><p>Rāma does not need every detail first. Prioritize the person, proof, message, and action that now serve the rescue.</p></div><Sequence item={report} value={reportValue} onSave={ids=>saveStoryMemory(report.id,ids)} max={3} unordered/>{reportCorrect&&<Choice item={intelligence} value={intelligenceValue} onChoose={value=>selectPrediction(intelligence.id,value)}/>} {intelligenceCorrect&&<section className={styles.objects} aria-labelledby="return-tokens"><Sparkles/><div><small id="return-tokens">Two entrusted journeys</small><p><strong>Rāma’s Ring</strong> · Rāma → Hanumān → Sītā</p><p><strong>Sītā’s Cūḍāmaṇi</strong> · Sītā → Hanumān → Rāma</p>{!tokenComplete?<button type="button" onClick={finishToken}>Return the cūḍāmaṇi <ArrowRight/></button>:<span><Check/> Proof and message have returned.</span>}</div></section>}{tokenComplete&&<section className={styles.finale} aria-labelledby="chapter-five-recap"><small>Chapter V · Open action → completed mission</small><h3 id="chapter-five-recap">The messenger returns with proof.</h3><p>Aśoka Vātikā → escalation · Rāvaṇa’s Court → warning · Burning of Laṅkā → consequence · Return to Rāma → report</p><strong>Next · Chapter VI — The War</strong><span>Individual mission becomes collective war.</span></section>}<Action ready={reportCorrect&&intelligenceCorrect&&tokenComplete} label="Deliver the mission report" onClick={onComplete}/></>;
}

function Action({ready,label,onClick}:{ready:boolean;label:string;onClick:()=>void}){return <div className={styles.action}><button type="button" disabled={!ready} onClick={onClick}>{label} <ArrowRight/></button>{!ready&&<small>Commit, inspect the feedback, and repair the reasoning before continuing.</small>}</div>}

export function ChapterFiveExplore({node,onComplete}:{node:JourneyNode;onComplete:()=>void}){
 return <div className={styles.experience}><Trail node={node}/><div className={styles.scene}><NodeSceneCard scene={node.scene} revealed={false} observation/></div>{node.id==="HJ-12"?<HJ12 onComplete={onComplete}/>:node.id==="HJ-13"?<HJ13 onComplete={onComplete}/>:node.id==="HJ-14"?<HJ14 onComplete={onComplete}/>:<HJ15 onComplete={onComplete}/>}</div>;
}
