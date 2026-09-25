"use client";
import {FinaleCompletion} from "@/components/finale-experience";
import {MeetingCompletion,MeetingExplore} from "@/components/meeting-experience";
import {SearchExplore} from "@/components/search-experience";
import {CrossingExplore} from "@/components/crossing-experience";
import {ChapterFourExplore} from "@/components/chapter-four-experience";
import {ChapterFiveExplore} from "@/components/chapter-five-experience";
import {ChapterSixExplore} from "@/components/chapter-six-experience";
import {ChapterSevenExplore} from "@/components/chapter-seven-experience";
import {crossingNodeIds} from "@/data/crossing";
import {chapterFourNodeIds} from "@/data/chapter-four";
import {chapterFiveNodeIds} from "@/data/chapter-five";
import {chapterSixNodeIds} from "@/data/chapter-six";
import {chapterSevenNodeIds} from "@/data/chapter-seven";
import {searchChapterNodes,searchNodes} from "@/data/search";
import {finaleContent,finaleNodes} from "@/data/finale";
import {bhaktiPassOne} from "@/data/bhakti-pass-one";

import {herbsNodes,herbsContent,rescueComparisons,medicinalHerbs} from "@/data/herbs";
import {warNodes,warContent} from "@/data/war";
import {meetingNodes,meetingContent} from "@/data/meeting";
import {allCompletedNodeIds,canEnterNode} from "@/lib/progress";

import Link from "next/link";
import {useEffect,useMemo,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,Award,BookMarked,BookOpenText,Check,CircleHelp,Compass,Flame,Gift,Gem,Link2,MapPinned,Search,Sparkles,Star,UserRound,UsersRound} from "lucide-react";
import {ConfidenceBadge} from "@/components/confidence-badge";
import {useProgress} from "@/components/progress-provider";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {challengeKey} from "@/data/challenges";
import {defaultMasteryResponse,masteryActivityFor,masteryResponseIsCorrect,storedMasteryIsCorrect} from "@/data/mastery-activities";
import {MasteryActivityRenderer} from "@/components/mastery-activity-renderer";
import {SourceComparison,SourceStatusLine} from "@/components/source-comparison";
import {orderedSourceIds} from "@/lib/source-readiness";
import {EncounterActivities} from "@/components/encounter-activities";
import {discoveryKey} from "@/data/encounter-activities";
import {characters} from "@/data/discoveries";
import {relationships} from "@/data/relationships";
import {CharacterPortrait} from "@/components/character-portrait";
import {NodeSceneCard} from "@/components/node-scene-card";
import {SacredObjectCard} from "@/components/sacred-object-card";
import {sacredObjectById} from "@/data/encounter-activities";
import {nodeSceneIsRevealed} from "@/data/node-scenes";
import {completionMasteryCopy,encounterCompletionRewards} from "@/data/encounter-completion";
import {journeyNodes} from "@/data/journey";
import {encounterReturn} from "@/lib/journey-navigation";
import styles from "@/components/journey.module.scss";
import type {EncounterActivity,EncounterReward,JourneyNode} from "@/lib/types";

type EncounterPhase="arrive"|"explore"|"story"|"unlock"|"mastery"|"complete";
const levels=["explorer","seeker","scholar"] as const;
const levelLabels={explorer:"Discover",seeker:"Understand",scholar:"Go Deeper"} as const;

function sceneTheme(node:JourneyNode){
 if(node.id==="HFW-06")return "ocean";
 if(node.id.startsWith("HFW-"))return "court";
 if(node.id.startsWith("HFM-"))return "earth";
 if(node.number>=5&&node.number<=7)return"ocean";
 if(node.number>=10&&node.number<=12)return"grove";
 if(node.number===13)return"court";
 if(node.number>=14)return"return";
 return"saffron";
}

function StepProgress({phase}:{phase:EncounterPhase}){
 const active=phase==="arrive"?"explore":phase==="unlock"?"story":phase;
 const steps=["explore","story","mastery","complete"] as const;
 const activeIndex=steps.indexOf(active as typeof steps[number]);
 return <ol className={styles.stepProgress} aria-label="Encounter progress">{steps.map((step,index)=><li key={step} className={index<activeIndex?styles.stepDone:index===activeIndex?styles.stepCurrent:styles.stepFuture}><span>{index<activeIndex?<Check/>:index+1}</span><strong>{step}</strong></li>)}</ol>;
}

function CompactCharacters({node,unlockedNames}:{node:JourneyNode;unlockedNames:string[]}){
 return <div className={styles.compactCharacters}><div className={styles.compactLabel}><UsersRound/><span>Characters present</span></div><div className={styles.characterPills}>{node.characters.map(name=>{const character=characters.find(item=>item.name===name),unlocked=unlockedNames.includes(name);return <span key={name} className={styles.characterPill}>{unlocked&&character?.portrait?<i><CharacterPortrait name={name} portrait={character.portrait} usage="medallion"/></i>:<i aria-hidden="true">?</i>}<b>{name}</b></span>})}</div></div>;
}

function RewardItem({reward,node,progress}:{reward:EncounterReward;node:JourneyNode;progress:ReturnType<typeof useProgress>["progress"]}){
 const character=reward.type==="character"?characters.find(item=>item.name===reward.label):undefined;
 const revealed=reward.type==="character"?progress.unlockedCharacters.includes(reward.label):reward.type==="object"?progress.discoveredObjects.includes(reward.id):reward.type==="relationship"?relationships.some(item=>item.eventId===node.id&&progress.unlockedRelationships.includes(item.id)):reward.type==="achievement"?progress.achievements.includes(reward.label):true;
 return <article className={cn(styles.rewardItem,revealed&&styles.rewardRevealed)}>{character?.portrait&&revealed?<span className={styles.rewardPortrait}><CharacterPortrait name={character.name} portrait={character.portrait} usage="reward"/></span>:<span className={styles.rewardIcon}>{revealed?<Sparkles/>:<CircleHelp/>}</span>}<div><small>{revealed?`${reward.type} revealed`:"Optional discovery remains"}</small><strong>{revealed?reward.label:"Still hidden"}</strong></div></article>;
}

function CompletionRewardItem({reward}:{reward:ReturnType<typeof encounterCompletionRewards>[number]}){
 const sacredObject=reward.type==="sacredObject"&&reward.targetId?sacredObjectById(reward.targetId):undefined;
 if(sacredObject)return <Link className={styles.completionObjectReward} href={reward.href??"/progress"}><SacredObjectCard object={sacredObject} discovered mode="mini"/></Link>;
 const Icon=reward.type==="character"?UserRound:reward.type==="relationship"?Link2:reward.type==="connectionClue"?CircleHelp:reward.type==="sacredObject"?Gem:reward.type==="sceneDiscovery"?Search:reward.type==="characterKnowledge"?BookMarked:Award;
 const body=<><span><Icon/></span><div><small>{reward.label}</small><strong>{reward.detail}</strong></div></>;
 return reward.href?<Link className={styles.completionReward} href={reward.href}>{body}<ArrowRight className={styles.completionRewardArrow}/></Link>:<article className={styles.completionReward}>{body}</article>;
}

export function Encounter({node,nextSlug}:{node:JourneyNode;nextSlug?:string}){
 const {progress,completeNode,revealScene,saveEncounterPhase,hydrated}=useProgress();
 const [phase,setPhaseState]=useState<EncounterPhase>("arrive");
 function setPhase(next:EncounterPhase){setPhaseState(next);saveEncounterPhase(node.id,next);}
 const restored=useRef(false);
 const entryProgress=useRef<typeof progress|null>(null);
 const [showGuide,setShowGuide]=useState(false);
 const [questionIndex,setQuestionIndex]=useState(0);
 const level=levels[questionIndex];
 const activity=useMemo(()=>masteryActivityFor(node,level),[node,level]);
 const storedValue=progress.answeredChallenges[challengeKey(node.id,level)];
 const previousAnswer=storedValue?.includes("|")?storedValue.split(/\|([\s\S]+)/)[1]:storedValue;
 const [answer,setAnswer]=useState("");
 const [revealed,setRevealed]=useState(false);
 const correct=masteryResponseIsCorrect(activity,answer);

 const isFinale=node.id.startsWith("HFF-");
 const isMeeting=node.id.startsWith("HFM-");
 const isSearch=["HFS-01","HFS-02","HJ-01","HJ-02","HJ-03"].includes(node.id);
 const isCrossing=crossingNodeIds.includes(node.id as typeof crossingNodeIds[number]);
 const isChapterFour=chapterFourNodeIds.includes(node.id as typeof chapterFourNodeIds[number]);
 const isChapterFive=chapterFiveNodeIds.includes(node.id as typeof chapterFiveNodeIds[number]);
 const isChapterSix=chapterSixNodeIds.includes(node.id as typeof chapterSixNodeIds[number]);
 const isChapterSeven=chapterSevenNodeIds.includes(node.id as typeof chapterSevenNodeIds[number]);
 const phaseRoot=useRef<HTMLDivElement>(null);
 const answerResultRef=useRef<HTMLDivElement>(null);
 const answerSubmittedRef=useRef(false);
 const [returnContext,setReturnContext]=useState({href:"/journey",label:"Journey"});
 const [entryQuery,setEntryQuery]=useState("");
 useEffect(()=>{setReturnContext(encounterReturn(window.location.search));setEntryQuery(window.location.search);},[]);
 useEffect(()=>{const frame=requestAnimationFrame(()=>{const heading=phaseRoot.current?.querySelector<HTMLElement>("section[aria-labelledby] h2");if(!heading)return;heading.tabIndex=-1;heading.focus({preventScroll:true});const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;heading.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});});return()=>cancelAnimationFrame(frame);},[phase,questionIndex]);
 useEffect(()=>{if(phase!=="mastery"||!revealed||!answerSubmittedRef.current)return;answerSubmittedRef.current=false;const frame=requestAnimationFrame(()=>answerResultRef.current?.focus({preventScroll:true}));return()=>cancelAnimationFrame(frame);},[phase,revealed]);
 const activities=node.activities??[];
 const observations=activities.filter(activity=>activity.id.endsWith("-OBSERVE"));
 const exploreActivities=activities.filter((activity):activity is Extract<EncounterActivity,{type:"sceneDiscovery"}>=>activity.type==="sceneDiscovery"&&!activity.embedded);
 const storyActivities=useMemo(()=>isChapterSix||isChapterSeven?[]:(node.activities??[]).filter(activity=>!activity.id.endsWith("-OBSERVE")&&!activity.id.startsWith("C4-")&&!activity.id.startsWith("C5-")&&!activity.id.startsWith("C6-")&&!activity.id.startsWith("C7-")&&activity.id!=="HJ11-RING-JOURNEY"&&activity.id!=="HJ15-TOKEN-JOURNEY").filter(activity=>activity.type==="predictionChoice"||activity.type==="storyMemory"||activity.type==="connectionBuilder"||activity.type==="evidenceSort"),[node.activities,isChapterSix,isChapterSeven]);
 const unlockActivities=activities.filter(activity=>activity.type==="characterUnlock"||activity.type==="relationshipUnlock"||activity.type==="objectDiscovery");
 const battleActivity=activities.find(activity=>activity.type==="sceneDiscovery"&&activity.embedded);
 const requiredDiscoveryKeys=exploreActivities.filter(activity=>!activity.optional).flatMap(activity=>activity.hotspots.map(hotspot=>discoveryKey(activity.id,hotspot.id)));
 const allDiscoveryKeys=exploreActivities.flatMap(activity=>activity.hotspots.map(hotspot=>discoveryKey(activity.id,hotspot.id)));
 const requiredExplorationComplete=requiredDiscoveryKeys.every(id=>progress.sceneDiscoveries.includes(id));
 const discoveriesFound=allDiscoveryKeys.filter(id=>progress.sceneDiscoveries.includes(id)).length;
 const battleDiscoveryIds=battleActivity?.type==="sceneDiscovery"?battleActivity.hotspots.map(hotspot=>discoveryKey(battleActivity.id,hotspot.id)).filter(id=>progress.sceneDiscoveries.includes(id)):[];
 const hasStartedMastery=levels.some(item=>progress.answeredChallenges[challengeKey(node.id,item)]);
 const masteryComplete=levels.every(item=>progress.answeredChallenges[challengeKey(node.id,item)]);
 const battleComplete=hasStartedMastery||Boolean(node.subEncounters&&battleDiscoveryIds.length===node.subEncounters.length);
 const storyComplete=storyActivities.every(activity=>activity.type==="evidenceSort"?(progress.storyMemoryAnswers[activity.id]?.split(",").filter(Boolean).length??0)===activity.statements.length:activity.type==="connectionBuilder"?Boolean(progress.storyMemoryAnswers[activity.id]):activity.type==="predictionChoice"?Boolean(progress.predictionChoices[activity.id]):(progress.storyMemoryAnswers[activity.id]?.split(",").filter(Boolean).length??0)===activity.items.length)&&(!node.subEncounters||isChapterFive||battleComplete);
 const unlockComplete=unlockActivities.every(activity=>activity.type==="objectDiscovery"?progress.discoveredObjects.includes(activity.objectId):progress.sceneDiscoveries.includes(activity.id));
 const hasExplore=isFinale||isSearch||isCrossing||isChapterFour||isChapterFive||isChapterSix||isChapterSeven||exploreActivities.length>0;
 const [animateScene,setAnimateScene]=useState(false);
 const stars=levels.filter(item=>storedMasteryIsCorrect(node,item,progress.answeredChallenges[challengeKey(node.id,item)])).length;
 const sceneRevealed=nodeSceneIsRevealed(node.scene,node.id,progress);
 const sceneCompletion={earned:discoveriesFound+battleDiscoveryIds.length,total:allDiscoveryKeys.length+(node.subEncounters?.length??0)};
 const completionRewards=encounterCompletionRewards(node,progress,sceneCompletion,entryProgress.current??undefined);
 const rewardPriority={sacredObject:0,relationship:1,character:2,connectionClue:3,characterKnowledge:4,sceneDiscovery:5,achievement:6} as const;
 const orderedCompletionRewards=[...completionRewards].sort((a,b)=>(rewardPriority[a.type]??99)-(rewardPriority[b.type]??99));
 const primaryCompletionReward=orderedCompletionRewards[0],secondaryCompletionRewards=orderedCompletionRewards.slice(1);
 const nextNode=nextSlug?[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].find(item=>item.slug===nextSlug):undefined;
 const searchSequence=searchChapterNodes(journeyNodes),searchIndex=searchSequence.findIndex(item=>item.id===node.id);

 useEffect(()=>{
  if(!hydrated||restored.current)return;
  restored.current=true;
  entryProgress.current=progress;
  const firstUnanswered=levels.findIndex(item=>!progress.answeredChallenges[challengeKey(node.id,item)]);
  const saved=progress.encounterPhases[node.id];
  if(masteryComplete)setPhaseState("complete");
  else if(hasStartedMastery){setQuestionIndex(firstUnanswered<0?2:firstUnanswered);setPhaseState("mastery");}
  else if(saved==="mastery"&&unlockComplete)setPhaseState("mastery");
  else if(saved==="unlock"||progress.revealedScenes.includes(node.id))setPhaseState(unlockComplete?"mastery":"unlock");
  else if(saved==="story"||storyActivities.some(activity=>progress.predictionChoices[activity.id]||progress.storyMemoryAnswers[activity.id]))setPhaseState("story");
  else if(saved==="explore"||allDiscoveryKeys.some(id=>progress.sceneDiscoveries.includes(id)))setPhaseState("explore");
  try{setShowGuide(localStorage.getItem("ramayana-journey-onboarding-v1")!=="seen");}catch{setShowGuide(false);}
 },[hasStartedMastery,hydrated,masteryComplete,node.id,progress,unlockComplete,storyActivities,allDiscoveryKeys]);

 useEffect(()=>{
  setAnswer(previousAnswer??defaultMasteryResponse(activity));
  setRevealed(Boolean(previousAnswer));
 },[previousAnswer,questionIndex,activity]);

 function dismissGuide(){setShowGuide(false);try{localStorage.setItem("ramayana-journey-onboarding-v1","seen");}catch{/* The encounter remains usable without browser storage. */}}
 function enterScene(){dismissGuide();setPhase(hasExplore?"explore":"story");}
 function afterStory(){setAnimateScene(!sceneRevealed);revealScene(node.id);setPhase("unlock");}
 function checkAnswer(){if(!answer)return;answerSubmittedRef.current=true;setRevealed(true);completeNode(node,level,activity.id,answer);}
 function retry(){setAnswer(defaultMasteryResponse(activity));setRevealed(false);}
 function nextQuestion(){setQuestionIndex(current=>Math.min(current+1,levels.length-1));setRevealed(false);}
 function reviewMastery(){const missed=levels.findIndex(item=>!storedMasteryIsCorrect(node,item,progress.answeredChallenges[challengeKey(node.id,item)]));setQuestionIndex(missed<0?0:missed);setRevealed(false);setPhase("mastery");}

 if(!hydrated)return <main className="page-shell">Loading your journey…</main>;
 if(!canEnterNode(progress,node)){
  const completed=new Set(allCompletedNodeIds(progress));
  const prerequisite=[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].find(item=>canEnterNode(progress,item)&&!completed.has(item.id));
  return <main className="page-shell"><h1 className="page-title">This encounter awaits</h1><p className="page-intro">{prerequisite?`Complete ${prerequisite.id} — ${prerequisite.title} to continue the story.`:"Continue the earlier encounters to reach this story."}</p><Link className="cta-primary mt-6" href={prerequisite?`/journey/hanuman/${prerequisite.slug}`:"/journey/hanuman"}>{prerequisite?`Continue ${prerequisite.id}`:"Return to the atlas"}</Link></main>;
 }

 return <main className={styles.encounterShell} data-scene-theme={sceneTheme(node)} data-finale={isFinale} data-phase={phase}>
  <div className={styles.encounterFrame} ref={phaseRoot}>
   <nav className={styles.encounterNav}><Link href={returnContext.href}><ArrowLeft/> {returnContext.label}</Link><span>{node.place} · {isSearch?searchIndex+1:node.number} / {isSearch?searchSequence.length:isFinale?finaleNodes.length:node.id.startsWith("HFH-")?herbsNodes.length:node.id.startsWith("HFW-")?warNodes.length:node.id.startsWith("HFM-")?meetingNodes.length:journeyNodes.length}</span><span aria-label={`${stars} of 3 mastery stars`}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</span></nav>
   <header className={styles.compactHeader} id="encounter-title"><div><p className="eyebrow">{node.eyebrow}</p><h1>{node.title}</h1></div><div className={styles.headerMeta}><Badge>{node.id}</Badge></div></header>
   <StepProgress phase={phase}/>

   {phase==="arrive"&&<section className={styles.phaseStage} aria-labelledby="arrive-title"><div className={styles.arrivalGrid}><div className={styles.arrivalCopy}><span className={styles.phaseKicker}><Compass/> Explore · Arrive</span><h2 id="arrive-title">Enter {node.place}</h2><p>{node.excerpt}</p><CompactCharacters node={node} unlockedNames={progress.unlockedCharacters}/>{showGuide&&<aside className={styles.onboarding}><div><Sparkles/><p><strong>How the journey works</strong><span>Explore the scene and discover the story. Complete all three mastery steps to continue; correct answers earn mastery stars.</span></p></div><button onClick={dismissGuide} aria-label="Dismiss journey guide">Got it</button></aside>}<Button className={styles.primaryAction} onClick={enterScene}>Begin exploring <ArrowRight/></Button></div><NodeSceneCard scene={node.scene} revealed={sceneRevealed} priority/></div></section>}

   {phase==="explore"&&isFinale&&<section className={styles.phaseStage} aria-labelledby="explore-title"><div className={styles.phaseHeading}><p className="eyebrow">Explore · Observe before interpreting</p><h2 id="explore-title">Look before the story unfolds</h2></div><NodeSceneCard scene={node.scene} revealed={false}/><EncounterActivities node={node} activities={observations} compact/><div className={styles.phaseAction}><Button disabled={!observations.every(a=>progress.predictionChoices[a.id])} onClick={()=>setPhase("story")}>Follow the story <ArrowRight/></Button></div></section>}
   {phase==="explore"&&isMeeting&&<section className={styles.phaseStage} aria-labelledby="explore-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><Compass/> Explore</span><p className={styles.phaseCounter}>{discoveriesFound} of {allDiscoveryKeys.length} observations made</p><h2 id="explore-title">Look before the story explains</h2><p>Inspect the scene, gather evidence, and form an interpretation.</p></div>{exploreActivities[0]&&<MeetingExplore node={node} activity={exploreActivities[0]}/>}<div className={styles.phaseAction}><Button onClick={()=>setPhase("story")} disabled={!requiredExplorationComplete}>Infer what happens next <ArrowRight/></Button>{!requiredExplorationComplete&&<small>Inspect every numbered clue. Each control also includes a non-visual description.</small>}</div></section>}
   {phase==="explore"&&isSearch&&<section className={styles.phaseStage} aria-labelledby="search-action-title"><SearchExplore node={node} onComplete={()=>setPhase("story")}/></section>}
   {phase==="explore"&&isCrossing&&<section className={styles.phaseStage} aria-labelledby="crossing-action-title"><CrossingExplore node={node} onComplete={()=>setPhase("story")}/></section>}
   {phase==="explore"&&isChapterFour&&<section className={styles.phaseStage} aria-labelledby="crossing-action-title"><ChapterFourExplore node={node} onComplete={()=>setPhase("story")}/></section>}
   {phase==="explore"&&isChapterFive&&<section className={styles.phaseStage} aria-labelledby="chapter-five-action-title"><ChapterFiveExplore node={node} onComplete={()=>setPhase("story")}/></section>}
   {phase==="explore"&&isChapterSix&&<section className={styles.phaseStage} aria-labelledby="chapter-six-action-title"><ChapterSixExplore node={node} onComplete={()=>setPhase("story")}/></section>}
   {phase==="explore"&&isChapterSeven&&<section className={styles.phaseStage} aria-labelledby="chapter-seven-action-title"><ChapterSevenExplore node={node} onComplete={()=>setPhase("story")}/></section>}
   {phase==="explore"&&!isFinale&&!isMeeting&&!isSearch&&!isCrossing&&!isChapterFour&&!isChapterFive&&!isChapterSix&&!isChapterSeven&&<section className={styles.phaseStage} aria-labelledby="explore-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><Compass/> Explore</span><p className={styles.phaseCounter}>{discoveriesFound} of {allDiscoveryKeys.length} discoveries found{exploreActivities.some(activity=>activity.optional)?" · optional discovery available":""}</p><h2 id="explore-title">Look closely at the scene</h2><p>Open the story markers to learn who and what shapes this moment.</p></div><EncounterActivities node={node} activities={exploreActivities} compact/><div className={styles.phaseAction}><Button onClick={()=>setPhase("story")} disabled={!requiredExplorationComplete}>Continue the story <ArrowRight/></Button>{!requiredExplorationComplete&&<small>Find the required discoveries to continue. Optional discoveries can be revisited later.</small>}</div></section>}

   {phase==="story"&&<section className={styles.phaseStage} aria-labelledby="story-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><BookOpenText/> Story</span><h2 id="story-title">Infer, then reveal</h2><p>{isMeeting?"Use the evidence you noticed before the canonical account appears.":"What unfolds here"}</p></div>{!isFinale&&!isMeeting&&<article className={styles.storyFocus}><p>{node.story}</p>{node.id==="HJ-11"&&<aside className={styles.returnToken}><small>Return token entrusted</small><strong>Sītā’s Cūḍāmaṇi</strong><span>Sītā <ArrowRight/> Hanumān <ArrowRight/> <b>?</b></span><p>{storyComplete?<><b>Reflection on the story · </b>{bhaktiPassOne.cudamaniEntrusted.text}</>:"The future endpoint stays hidden until Hanumān completes the return."}</p></aside>}{node.id==="HJ-15"&&<aside className={styles.returnToken}><small>Return token completed</small><strong>Sītā’s Cūḍāmaṇi</strong><span>Sītā <ArrowRight/> Hanumān <ArrowRight/> <b>Rāma</b></span><p>The token makes Sītā’s contact, message, and relational sign visible on return.</p></aside>}</article>}{storyActivities.length>0&&<EncounterActivities node={node} activities={storyActivities} compact/>}{(isFinale||isMeeting)&&storyComplete&&<article className={styles.storyFocus} role="status"><p>{node.story}</p>{node.id==="HFF-02"&&<p>Story echo · <Link href="/journey/hanuman/sita-found">The first meeting in the grove</Link> · <Link href="/journey/hanuman/ring-and-message">The ring and the message</Link></p>}</article>}<div className={styles.phaseAction}><Button onClick={afterStory} disabled={!storyComplete}>{storyActivities.length||node.subEncounters?"See what was revealed":"Continue"} <ArrowRight/></Button>{!storyComplete&&<small>Complete the story interaction to reveal the canonical account.</small>}</div></section>}

   {phase==="unlock"&&<section className={styles.phaseStage} aria-labelledby="unlock-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><Gift/> Story · Revealed</span><h2 id="unlock-title">What this moment changes</h2><p>{node.scene.captionRevealed}</p></div><div className={styles.unlockScene}><NodeSceneCard scene={node.scene} revealed={sceneRevealed} animateReveal={animateScene}/></div>{unlockActivities.length>0&&<EncounterActivities node={node} activities={unlockActivities} compact/>}{Boolean(node.rewards?.length)&&<div className={styles.rewardGrid}>{node.rewards!.map(reward=><RewardItem key={reward.id} reward={reward} node={node} progress={progress}/>)}</div>}<div className={styles.phaseAction}><Button onClick={()=>setPhase("mastery")} disabled={!unlockComplete}>Reflect on what happened <ArrowRight/></Button>{!unlockComplete&&<small>Reveal the story reward before beginning mastery.</small>}</div></section>}

   {phase==="mastery"&&<section className={styles.phaseStage} aria-labelledby="mastery-title"><div className={styles.masteryHeading}><div><span className={styles.phaseKicker}><Flame/> Mastery</span><p className="eyebrow">Activity {questionIndex+1} of 3 · {levelLabels[level]}</p><h2 id="mastery-title">What did you discover?</h2><p>You have seen what happened. Now reflect on what it means. Correct responses earn mastery stars; every attempt keeps the journey moving.</p></div><span className={styles.largeStars} aria-label={`${stars} of 3 mastery stars earned`}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</span></div><div className={styles.levels} aria-label="Activity progress">{levels.map((item,index)=>{const value=progress.answeredChallenges[challengeKey(node.id,item)],available=index===0||levels.slice(0,index).every(previous=>progress.answeredChallenges[challengeKey(node.id,previous)]),mastered=storedMasteryIsCorrect(node,item,value);return <button key={item} disabled={!available} aria-pressed={questionIndex===index} onClick={()=>setQuestionIndex(index)}>{mastered?<Check/>:index+1}<span>{levelLabels[item]}</span></button>})}</div><div className={styles.questionFocus}><MasteryActivityRenderer activity={activity} response={answer} onChange={setAnswer} revealed={revealed}/>{revealed&&<div className={cn(styles.feedback,correct?styles.feedbackCorrect:styles.feedbackWrong)} ref={answerResultRef} tabIndex={-1} role="status" aria-label={correct?"Correct. Continue when ready.":"Incorrect. You can try again or continue."}><strong>{correct?"Well seen.":"Not quite. Use the correction above, then retry or continue."}</strong>{correct&&<p>{activity.explanation}</p>}</div>}{!revealed&&<Button onClick={checkAnswer} disabled={!answer}>Check response <ArrowRight/></Button>}{revealed&&!correct&&<Button variant="secondary" onClick={retry}>Try again</Button>}{revealed&&questionIndex<2&&<Button onClick={nextQuestion}>Continue to activity {questionIndex+2} <ArrowRight/></Button>}{revealed&&questionIndex===2&&<Button onClick={()=>setPhase("complete")}>View completion <ArrowRight/></Button>}{revealed&&!correct&&<details className={styles.masteryExplanation}><summary>Explanation and source context</summary><p>{activity.explanation}</p></details>}</div></section>}

   {phase==="complete"&&isFinale&&<FinaleCompletion node={node} stars={stars} nextSlug={nextSlug} newlyCompleted={!entryProgress.current?.finaleCompletedNodes.includes(node.id)} onReplay={reviewMastery}/>}
   {phase==="complete"&&isMeeting&&<MeetingCompletion node={node} stars={stars} rewards={completionRewards} nextSlug={nextSlug} onReplay={reviewMastery}/>}
   {phase==="complete"&&!isFinale&&!isMeeting&&<section className={styles.phaseStage} aria-labelledby="complete-title"><div className={styles.completionGrid}>
    <div className={styles.completionIntro}><span className={styles.completionSeal}><Check/></span><p className="eyebrow">Encounter complete</p><h2 id="complete-title">{node.title}</h2>{node.id==="HJ-11"&&<><p className="eyebrow">Chapter IV complete · Sītā in Laṅkā</p><p>The search becomes hope.</p></>}{node.id==="HFH-03"&&<><p className="eyebrow">Chapter VII complete · The Mountain of Herbs</p><p>Strength becomes lifesaving service.</p></>}{node.id==="HFW-06"&&<><p className="eyebrow">Chapter VI complete · The War</p><p>Service becomes responsibility for an entire army.</p></>}{node.id==="HFM-05"&&<p className="eyebrow">Chapter I complete · The Meeting</p>}<div className={styles.completionStars} aria-label={`${stars} of 3 mastery stars earned`}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</div><p className={styles.completionMastery}>{completionMasteryCopy(stars)}</p><p className={styles.completionTakeaway}>{node.completionTakeaway}</p></div>
    <NodeSceneCard scene={node.scene} revealed={sceneRevealed}/>
    <div className={styles.completionDetails}>
     {node.id==="HJ-11"&&<section className={styles.nextEncounter}><small>Trust Thread resolved</small><h3>Unknown observer → trusted messenger</h3><p>Possible ally → Sītā verified → Rāma’s Ring delivered → message trusted.</p></section>}
     {primaryCompletionReward&&<section className={styles.meaningfulChange} aria-labelledby="completion-rewards"><p className="eyebrow" id="completion-rewards">What changed</p><CompletionRewardItem reward={primaryCompletionReward}/></section>}
     {node.id==="HFH-03"?<section className={styles.nextEncounter}><small>Chapter VIII unlocked</small><h3>Mission Fulfilled</h3><p>{node.nextNodeTeaser}</p></section>:node.id==="HFW-06"?<section className={styles.nextEncounter}><small>Chapter VII unlocked</small><h3>The Mountain of Herbs</h3><p>{node.nextNodeTeaser}</p></section>:nextNode?<section className={styles.nextEncounter}><small>{node.id==="HFM-05"?"Chapter II — The Search":node.id==="HJ-11"?"Chapter V — Messenger and Warrior":node.id==="HJ-15"?"Chapter VI — The War":"Next encounter"}</small><h3>{nextNode.title}</h3><p>{node.nextNodeTeaser}</p></section>:<section className={styles.journeyComplete}><Sparkles/><div><small>Hanumān Journey complete</small><h3>The message has returned to Rāma</h3><p>You completed the journey. Revisit its stories, relationships, and sacred objects.</p></div></section>}
     <div className={styles.completionActions}>{node.id==="HFH-03"?<Link href="/journey/hanuman/chapters/mission-fulfilled"><Button>Continue to Mission Fulfilled <ArrowRight/></Button></Link>:node.id==="HFW-06"?<Link href="/journey/hanuman/chapters/mountain-of-herbs"><Button>Continue to The Mountain of Herbs <ArrowRight/></Button></Link>:nextNode?<Link href={`/journey/hanuman/${nextNode.slug}${entryQuery}`}><Button>Continue to {nextNode.title} <ArrowRight/></Button></Link>:<Link href="/journey/hanuman"><Button>Return to the completed atlas <Check/></Button></Link>}<Button variant="secondary" onClick={reviewMastery}>{stars<3?"Improve mastery":"Replay activities"}</Button></div>
     {secondaryCompletionRewards.length>0&&<details className={styles.optionalRewards}><summary>Journey record · {secondaryCompletionRewards.length} other {secondaryCompletionRewards.length===1?"update":"updates"}</summary><div>{secondaryCompletionRewards.map(reward=><CompletionRewardItem key={reward.id} reward={reward}/>)}</div></details>}
    </div>
   </div></section>}

   <details className={styles.deeperDrawer}><summary><span><CircleHelp/> Explore deeper</span><small>Place, sources, traditions, and meaning</small></summary><div className={styles.deeperGrid}>{node.id.startsWith("HFH-")&&<section><details><summary>Two medicinal rescues · Vālmīki</summary>{rescueComparisons.map(item=><article key={item.title} className="py-4"><h3>{item.title}</h3><small>{item.source}</small><p>{item.body}</p></article>)}<h3>Four herbs · Yuddha 74</h3><dl>{medicinalHerbs.map(([name,purpose])=><div key={name}><dt>{name}</dt><dd>{purpose}</dd></div>)}</dl></details></section>}<section><p className="eyebrow">Deeper meaning</p><p className={styles.teaching}>{node.teaching}</p></section><section><details className={styles.mobileSourceDisclosure}><summary>Why here? · location and tradition</summary><dl><div><dt>Textual setting</dt><dd>{node.whyHere.textual}</dd></div><div><dt>Modern identification</dt><dd>{node.whyHere.modern}</dd></div><div><dt>Tradition</dt><dd>{node.whyHere.tradition}</dd></div><div><dt>Why this confidence?</dt><dd>{node.whyHere.reason}</dd></div></dl></details></section><section><p className="eyebrow">Map accuracy</p><div className={styles.mapAccuracy}><MapPinned/><div><strong>{node.displayType}</strong><ConfidenceBadge level={node.confidence}/></div></div></section><section><details className={styles.mobileSourceDisclosure}><summary>Source lens</summary><div className={styles.sourceBadges}>{orderedSourceIds(node.sourceLabels).map(source=><Badge key={source}>{source}</Badge>)}</div></details></section>{node.id==="HFW-03"?progress.warCompletedNodes.includes("HFW-03")?<section><SourceComparison node={node} compact/></section>:null:node.id==="HJ-10"?progress.completedNodes.includes("HJ-10")?<SourceComparison node={node} compact/>:null:!node.id.startsWith("HJ-")?<section><p className="eyebrow">Source notes · optional enrichment</p><p>{[...meetingContent,...warContent,...herbsContent,...finaleContent].find(item=>item.id===node.id)?.sourceNote}</p><SourceStatusLine node={node}/><a href="#encounter-title">Return to {node.title} ↑</a></section>:<SourceComparison node={node} compact/>}</div></details>
  </div>
 </main>;
}
