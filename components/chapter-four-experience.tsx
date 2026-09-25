"use client";
import {useMemo,useState} from "react";
import {ArrowRight,Building2,Check,Eye,KeyRound,Link2,MoonStar,ShieldQuestion,Sparkles} from "lucide-react";
import {useProgress} from "@/components/progress-provider";
import {NodeSceneCard} from "@/components/node-scene-card";
import {activityById,discoveryKey,sacredObjectById} from "@/data/encounter-activities";
import {chapterFourDesign,trustThread} from "@/data/chapter-four";
import type {EvidenceSortActivity,JourneyNode,PredictionChoiceActivity,SceneDiscoveryActivity,StoryMemoryActivity} from "@/lib/types";
import styles from "@/components/chapter-four-experience.module.scss";

type ChapterFourId=keyof typeof chapterFourDesign;

function TrustThread({node,completed}:{node:JourneyNode;completed:string[]}){
 return <aside className={styles.thread} aria-labelledby="trust-thread-title"><header><span><Link2/> Trust Thread</span><strong id="trust-thread-title">Verify before revealing yourself</strong></header><ol>{trustThread.map((stage,index)=>{const done=completed.includes(stage.nodeId),current=stage.nodeId===node.id;return <li key={stage.nodeId} data-state={done?"done":current?"current":"future"}><span>{done?<Check/>:index+1}</span><div><small>{stage.verb}</small><strong>{stage.question}</strong></div></li>})}</ol></aside>;
}

function ChoiceGroup({activity,selected,onChoose,label,disabled=false}:{activity:PredictionChoiceActivity;selected?:string;onChoose:(id:string)=>void;label:string;disabled?:boolean}){
 return <div className={styles.choiceGroup} role="group" aria-label={label}>{activity.choices.map(choice=><button key={choice.id} type="button" disabled={disabled} aria-pressed={selected===choice.id} onClick={()=>onChoose(choice.id)}><span>{selected===choice.id?<Check/>:<ShieldQuestion/>}</span>{choice.label}</button>)}</div>;
}

export function ChapterFourExplore({node,onComplete}:{node:JourneyNode;onComplete:()=>void}){
 const id=node.id as ChapterFourId,config=chapterFourDesign[id];
 const {progress,discoverScene,selectPrediction,saveStoryMemory,discoverSacredObject}=useProgress();
 const evidence=useMemo(()=>config.evidenceActivityId?activityById(config.evidenceActivityId) as SceneDiscoveryActivity:undefined,[config.evidenceActivityId]);
 const decision=activityById(config.decisionActivityId) as PredictionChoiceActivity;
 const repair=config.repairActivityId?activityById(config.repairActivityId) as PredictionChoiceActivity:undefined;
 const prelude="prelude" in config?{
  hypothesis:activityById(config.prelude.hypothesisActivityId) as PredictionChoiceActivity,
  evidence:activityById(config.prelude.evidenceSortActivityId) as EvidenceSortActivity,
  revision:activityById(config.prelude.revisionActivityId) as PredictionChoiceActivity,
 }:undefined;
 const recall="recallActivityId" in config?activityById(config.recallActivityId) as PredictionChoiceActivity:undefined;
 const proof="proofActivityId" in config?activityById(config.proofActivityId) as StoryMemoryActivity:undefined;
 const found=evidence?.hotspots.filter(h=>progress.sceneDiscoveries.includes(discoveryKey(evidence.id,h.id)))??[];
 const decisionValue=progress.predictionChoices[decision.id];
 const repairValue=repair?progress.predictionChoices[repair.id]:undefined;
 const recallValue=recall?progress.predictionChoices[recall.id]:undefined;
 const [proofPath,setProofPath]=useState<string[]>(()=>proof?progress.storyMemoryAnswers[proof.id]?.split(",").filter(Boolean)??[]:[]);
 const [classifications,setClassifications]=useState<Record<string,string>>(()=>prelude?Object.fromEntries(prelude.evidence.statements.map((statement,index)=>[statement.id,progress.storyMemoryAnswers[prelude.evidence.id]?.split(",")[index]??""])):{});
 const evidenceReady=found.length>=config.minimumEvidence;
 const decisionCorrect=decisionValue===config.correctDecision;
 const repairCorrect=!repair||repairValue===config.correctRepair;
 const repairSatisfied=!repair||!repairValue||repairCorrect;
 const recallCorrect=!recall||recallValue===("correctRecall" in config?config.correctRecall:"");
 const proofCorrect=!proof||proofPath.join(",")===proof.correctOrder.join(",");
 const hypothesisValue=prelude?progress.predictionChoices[prelude.hypothesis.id]:undefined;
 const revisionValue=prelude?progress.predictionChoices[prelude.revision.id]:undefined;
 const classificationValues=prelude?prelude.evidence.statements.map(statement=>classifications[statement.id]??""):[];
 const classificationComplete=!prelude||classificationValues.every(Boolean);
 const classificationCorrect=!prelude||prelude.evidence.statements.every(statement=>classifications[statement.id]===statement.correct);
 const legacyVerificationStarted=Boolean(prelude&&(found.length||decisionValue||progress.completedNodes.includes(node.id)));
 const preludeComplete=!prelude||legacyVerificationStarted||(hypothesisValue===prelude.hypothesis.canonicalAnswer&&classificationCorrect&&revisionValue===prelude.revision.canonicalAnswer);
 const complete=preludeComplete&&evidenceReady&&decisionCorrect&&repairSatisfied&&recallCorrect&&proofCorrect;
 const feedback=decisionValue?config.feedback[decisionValue as keyof typeof config.feedback]:undefined;

 function chooseDecision(choice:string){selectPrediction(decision.id,choice)}
 function classify(statementId:string,categoryId:string){if(!prelude)return;const next={...classifications,[statementId]:categoryId};setClassifications(next);const values=prelude.evidence.statements.map(statement=>next[statement.id]??"");if(values.every(Boolean))saveStoryMemory(prelude.evidence.id,values)}
 function addProof(step:string){if(!proof||proofPath.includes(step)||proofPath.length===proof.items.length)return;const next=[...proofPath,step];setProofPath(next);saveStoryMemory(proof.id,next)}
 function resetProof(){if(!proof)return;setProofPath([]);saveStoryMemory(proof.id,[])}
 function finish(){if(node.id==="HJ-11")discoverSacredObject("ramas-ring");onComplete()}

 return <div className={styles.experience}>
  <TrustThread node={node} completed={progress.completedNodes}/>
  <header className={styles.intro}><span><Eye/> {config.verb}</span><h2 id="crossing-action-title">Notice correctly before you act</h2><p>{prelude?"A first resemblance can guide the search. Only context can test whether that recognition deserves trust.":"Enemy territory makes information uneven. Gather evidence, consider the other person’s perspective, then commit."}</p></header>

  {prelude&&!legacyVerificationStarted&&!preludeComplete&&<section className={styles.palaceSequence} aria-labelledby="palace-search-title">
   <div className={styles.palaceScene} role="img" aria-label="A dim royal sleeping chamber at night. Hanumān observes from concealment while Rāvaṇa sleeps near members of his household; one prominent, richly adorned woman remains unidentified.">
    <span className={styles.palaceMoon}><MoonStar aria-hidden="true"/></span><span className={styles.palaceArchitecture}><Building2 aria-hidden="true"/></span><span className={styles.hiddenObserver}><Eye aria-hidden="true"/> Hanumān remains concealed</span>
    <div><small>Beat 1 · Searching Rāvaṇa’s palace</small><strong>A royal chamber after nightfall</strong><p>Rāvaṇa sleeps. Women of his household rest nearby. One prominent woman draws Hanumān’s attention.</p></div>
   </div>
   <div className={styles.palaceContent}>
    <div className={styles.panelHeading}><div><small>Beat 2 · A possible Sītā</small><h3>{prelude.hypothesis.title}</h3><p>{prelude.hypothesis.prompt}</p></div><strong>?</strong></div>
    <ChoiceGroup activity={prelude.hypothesis} selected={hypothesisValue} onChoose={choice=>selectPrediction(prelude.hypothesis.id,choice)} label="Choose how Hanumān should test the first hypothesis"/>
    {hypothesisValue&&<p className={hypothesisValue===prelude.hypothesis.canonicalAnswer?styles.goodFeedback:styles.badFeedback} role="status">{prelude.hypothesis.feedbackByChoice?.[hypothesisValue]??prelude.hypothesis.explanation}</p>}
    {hypothesisValue&&<div className={styles.classifier}>
     <div><small>Beat 3 · The context does not fit</small><h3>{prelude.evidence.title}</h3><p>{prelude.evidence.prompt}</p></div>
     <fieldset><legend className="sr-only">Classify the evidence for the possible identification</legend>{prelude.evidence.statements.map(statement=><label key={statement.id}><span>{statement.label}</span><select value={classifications[statement.id]??""} onChange={event=>classify(statement.id,event.target.value)} aria-label={`Classify: ${statement.label}`}><option value="">Choose a category</option>{prelude.evidence.categories.map(category=><option key={category.id} value={category.id}>{category.label}</option>)}</select>{classifications[statement.id]&&<small data-correct={classifications[statement.id]===statement.correct}>{statement.feedbackByCategory?.[classifications[statement.id]]}</small>}</label>)}</fieldset>
     {classificationComplete&&<p className={classificationCorrect?styles.goodFeedback:styles.badFeedback} role="status">{classificationCorrect?prelude.evidence.explanation:"Some evidence is still carrying more—or less—weight than it should. Compare a general location with the specific condition of the royal household."}</p>}
    </div>}
    {classificationCorrect&&<div className={styles.revision}>
     <small>Beat 4 · Revise the hypothesis</small><h3>{prelude.revision.prompt}</h3><ChoiceGroup activity={prelude.revision} selected={revisionValue} onChoose={choice=>selectPrediction(prelude.revision.id,choice)} label="Choose the revised conclusion"/>
     {revisionValue&&<p className={revisionValue===prelude.revision.canonicalAnswer?styles.goodFeedback:styles.badFeedback} role="status">{prelude.revision.feedbackByChoice?.[revisionValue]??prelude.revision.explanation}</p>}
    </div>}
    <p className={styles.sourceNote}><strong>Vālmīki Rāmāyaṇa source layer.</strong> The palace-search episode is not attributed here to the Rāmacaritamānasa. Exact sarga and verse range await verification against the approved Gita Press edition.</p>
   </div>
  </section>}

  {prelude&&preludeComplete&&!legacyVerificationStarted&&<div className={styles.continueSearch} aria-live="polite"><Sparkles aria-hidden="true"/><div><small>Beat 5 · Continue the search</small><h3>Good judgment changes when the evidence changes.</h3><p>The woman is Mandodarī. Hanumān releases the first conclusion and continues searching—now more alert to the difference between resemblance and verification.</p></div></div>}
  {preludeComplete&&<div className={styles.transition}><span>Beat 6</span><strong>Aśoka Vātikā · True verification</strong><p>The next figure must withstand a stronger test: appearance, captivity, conduct, remembrance, and prior knowledge must converge.</p></div>}
  {preludeComplete&&<div className={styles.scene}><NodeSceneCard scene={node.scene} revealed={false} observation/></div>}

  {preludeComplete&&evidence&&<section className={styles.panel} aria-labelledby={`${node.id}-evidence-title`}><div className={styles.panelHeading}><div><small>Step 1 · Observe</small><h3 id={`${node.id}-evidence-title`}>{evidence.title}</h3><p>{evidence.prompt}</p></div><strong aria-live="polite">{found.length}/{evidence.hotspots.length}</strong></div><div className={styles.evidenceGrid}>{evidence.hotspots.map((clue,index)=>{const revealed=found.includes(clue);return <button type="button" key={clue.id} aria-pressed={revealed} onClick={()=>discoverScene(evidence.id,clue.id)}><span>{revealed?<Check/>:index+1}</span><div><strong>{revealed?clue.label:"Inspect this clue"}</strong>{revealed&&<p>{clue.detail}</p>}</div></button>})}</div>{!evidenceReady&&<p className={styles.guidance}>Gather at least {config.minimumEvidence} independent clues before making a judgment.</p>}</section>}

  {recall&&<section className={styles.panel} aria-labelledby={`${node.id}-recall-title`}><div className={styles.panelHeading}><div><small>Prior knowledge · Sacred Object</small><h3 id={`${node.id}-recall-title`}>{recall.title}</h3><p>{recall.prompt}</p></div><KeyRound/></div>{sacredObjectById("ramas-ring")&&<p className={styles.objectCallback}>Rāma → Hanumān → <strong>?</strong> <span>The trust entrusted in Chapter II must now become useful.</span></p>}<ChoiceGroup activity={recall} selected={recallValue} onChoose={choice=>selectPrediction(recall.id,choice)} label="Recall the ring's purpose"/>{recallValue&&<p className={recallCorrect?styles.goodFeedback:styles.badFeedback} role="status">{recallCorrect?recall.explanation:"The ring was carried for recognition—not authority or force. Reconsider what Sītā would need from an unknown messenger."}</p>}</section>}

  {(evidenceReady&&recallCorrect)&&<section className={styles.panel} aria-labelledby={`${node.id}-decision-title`}><div className={styles.panelHeading}><div><small>Step 2 · Commit</small><h3 id={`${node.id}-decision-title`}>{config.prompt}</h3></div><ShieldQuestion/></div><ChoiceGroup activity={decision} selected={decisionValue} onChoose={chooseDecision} disabled={Boolean(decisionValue&&!decisionCorrect&&repair&&!repairCorrect)} label="Choose how Hanumān should proceed"/>{feedback&&<p className={decisionCorrect?styles.goodFeedback:styles.badFeedback} role="status">{feedback}</p>}
   {decisionValue&&!decisionCorrect&&repair&&<div className={styles.repair}><small>Reasoning repair</small><h4>{config.repairPrompt}</h4><ChoiceGroup activity={repair} selected={repairValue} onChoose={choice=>selectPrediction(repair.id,choice)} label="Choose a repair action"/>{repairValue&&<p className={repairCorrect?styles.goodFeedback:styles.badFeedback} role="status">{repairCorrect?repair.explanation:"That clue still rests on appearance or location. Look for independent conduct that tests the first impression."}</p>}{repairCorrect&&<p className={styles.guidance}>Use the evidence to revise the judgment above.</p>}</div>}
  </section>}

  {decisionCorrect&&proof&&<section className={styles.panel} aria-labelledby={`${node.id}-proof-title`}><div className={styles.panelHeading}><div><small>Step 3 · Construct proof</small><h3 id={`${node.id}-proof-title`}>{proof.title}</h3><p>{proof.prompt}</p></div><Link2/></div><div className={styles.proofPath}>{proofPath.map((step,index)=><span key={step}><b>{index+1}</b>{proof.items.find(item=>item.id===step)?.label}</span>)}{Array.from({length:proof.items.length-proofPath.length},(_,index)=><i key={index}>?</i>)}</div><div className={styles.proofChoices}>{proof.items.map(item=><button type="button" key={item.id} disabled={proofPath.includes(item.id)||proofPath.length===proof.items.length} onClick={()=>addProof(item.id)}>{item.label}</button>)}</div>{proofPath.length===proof.items.length&&<div className={proofCorrect?styles.goodFeedback:styles.badFeedback} role="status"><strong>{proofCorrect?"The proof agrees":"The pieces are present, but their sequence asks for blind trust too early."}</strong><p>{proof.explanation}</p>{!proofCorrect&&<button type="button" className={styles.retry} onClick={resetProof}>Rebuild the proof chain</button>}</div>}</section>}

  {complete&&<section className={styles.verified} aria-live="polite"><Sparkles/><div><small>Verified</small><h3>{config.verifiedTitle}</h3><p>{config.verifiedText}</p>{node.id==="HJ-11"&&<p className={styles.transmission}>Rāma <ArrowRight/> Hanumān <ArrowRight/> <strong>Sītā</strong></p>}</div></section>}
  <div className={styles.action}><button type="button" disabled={!complete} onClick={finish}>Continue to the story <ArrowRight/></button>{!complete&&<small>Observation must become a supported judgment before the story is revealed.</small>}</div>
 </div>;
}
