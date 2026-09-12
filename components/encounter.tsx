"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,BookOpenText,Check,CircleHelp,Compass,Flame,Gift,MapPinned,Sparkles,Star,UsersRound} from "lucide-react";
import {ConfidenceBadge} from "@/components/confidence-badge";
import {useProgress} from "@/components/progress-provider";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {challengeKey,challengePoolFor,storedAnswerIsCorrect} from "@/data/challenges";
import {BattleSequence} from "@/components/battle-sequence";
import {SourceComparison} from "@/components/source-comparison";
import {EncounterActivities} from "@/components/encounter-activities";
import {discoveryKey} from "@/data/encounter-activities";
import {characters} from "@/data/discoveries";
import {relationships} from "@/data/relationships";
import {CharacterPortrait} from "@/components/character-portrait";
import styles from "@/components/journey.module.scss";
import type {EncounterActivity,EncounterReward,JourneyNode} from "@/lib/types";

type EncounterPhase="arrive"|"explore"|"story"|"unlock"|"mastery"|"complete";
const levels=["explorer","seeker","scholar"] as const;
const levelLabels={explorer:"Discover",seeker:"Understand",scholar:"Go Deeper"} as const;

function sceneTheme(node:JourneyNode){
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

export function Encounter({node,nextSlug}:{node:JourneyNode;nextSlug?:string}){
 const {progress,completeNode,discoverScene,hydrated}=useProgress();
 const [phase,setPhase]=useState<EncounterPhase>("arrive");
 const restored=useRef(false);
 const [showGuide,setShowGuide]=useState(false);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [variants,setVariants]=useState([0,0,0]);
 const level=levels[questionIndex];
 const pool=challengePoolFor(node,level);
 const storedValue=progress.answeredChallenges[challengeKey(node.id,level)];
 const storedId=storedValue?.includes("|")?storedValue.split("|")[0]:undefined;
 const storedVariant=pool.findIndex(item=>item.id===storedId);
 const challenge=pool[storedVariant>=0?storedVariant:variants[questionIndex]];
 const previousAnswer=storedValue?.includes("|")?storedValue.split("|")[1]:storedValue;
 const [answer,setAnswer]=useState("");
 const [revealed,setRevealed]=useState(false);
 const correct=answer===challenge.answer;

 const activities=node.activities??[];
 const exploreActivities=activities.filter((activity):activity is Extract<EncounterActivity,{type:"sceneDiscovery"}>=>activity.type==="sceneDiscovery"&&!activity.embedded);
 const storyActivities=activities.filter(activity=>activity.type==="predictionChoice"||activity.type==="storyMemory");
 const unlockActivities=activities.filter(activity=>activity.type==="characterUnlock"||activity.type==="relationshipUnlock"||activity.type==="objectDiscovery");
 const battleActivity=activities.find(activity=>activity.type==="sceneDiscovery"&&activity.embedded);
 const requiredDiscoveryKeys=exploreActivities.filter(activity=>!activity.optional).flatMap(activity=>activity.hotspots.map(hotspot=>discoveryKey(activity.id,hotspot.id)));
 const allDiscoveryKeys=exploreActivities.flatMap(activity=>activity.hotspots.map(hotspot=>discoveryKey(activity.id,hotspot.id)));
 const requiredExplorationComplete=requiredDiscoveryKeys.every(id=>progress.sceneDiscoveries.includes(id));
 const discoveriesFound=allDiscoveryKeys.filter(id=>progress.sceneDiscoveries.includes(id)).length;
 const battleDiscoveryIds=battleActivity?.type==="sceneDiscovery"?battleActivity.hotspots.map(hotspot=>discoveryKey(battleActivity.id,hotspot.id)).filter(id=>progress.sceneDiscoveries.includes(id)):[];
 const hasStartedMastery=levels.some(item=>progress.answeredChallenges[challengeKey(node.id,item)]);
 const masteryComplete=levels.every(item=>progress.answeredChallenges[challengeKey(node.id,item)]);
 const [battleComplete,setBattleComplete]=useState(hasStartedMastery||Boolean(node.subEncounters&&battleDiscoveryIds.length===node.subEncounters.length));
 const storyComplete=storyActivities.every(activity=>activity.type==="predictionChoice"?Boolean(progress.predictionChoices[activity.id]):(progress.storyMemoryAnswers[activity.id]?.split(",").filter(Boolean).length??0)===activity.items.length)&&(!node.subEncounters||battleComplete);
 const unlockComplete=unlockActivities.every(activity=>activity.type==="objectDiscovery"?progress.discoveredObjects.includes(activity.objectId):progress.sceneDiscoveries.includes(activity.id));
 const hasExplore=exploreActivities.length>0;
 const hasUnlock=unlockActivities.length>0||Boolean(node.rewards?.length);
 const stars=levels.filter(item=>storedAnswerIsCorrect(node,item,progress.answeredChallenges[challengeKey(node.id,item)])).length;

 useEffect(()=>{
  if(!hydrated||restored.current)return;
  restored.current=true;
  const firstUnanswered=levels.findIndex(item=>!progress.answeredChallenges[challengeKey(node.id,item)]);
  if(masteryComplete)setPhase("complete");
  else if(hasStartedMastery){setQuestionIndex(firstUnanswered<0?2:firstUnanswered);setPhase("mastery");}
  try{setShowGuide(localStorage.getItem("ramayana-journey-onboarding-v1")!=="seen");}catch{setShowGuide(false);}
 },[hasStartedMastery,hydrated,masteryComplete,node.id,progress.answeredChallenges]);

 useEffect(()=>{
  setAnswer(previousAnswer??"");
  setRevealed(Boolean(previousAnswer));
 },[previousAnswer,questionIndex]);

 useEffect(()=>{
  setVariants(levels.map(item=>progress.answeredChallenges[challengeKey(node.id,item)]?0:Math.floor(Math.random()*3)));
 // Questions rotate when an unanswered encounter is opened.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[node.id,hydrated]);

 function dismissGuide(){setShowGuide(false);try{localStorage.setItem("ramayana-journey-onboarding-v1","seen");}catch{/* The encounter remains usable without browser storage. */}}
 function enterScene(){dismissGuide();setPhase(hasExplore?"explore":"story");}
 function afterStory(){setPhase(hasUnlock?"unlock":"mastery");}
 function checkAnswer(){if(!answer)return;setRevealed(true);completeNode(node,level,challenge.id!,answer);}
 function nextQuestion(){setQuestionIndex(current=>Math.min(current+1,levels.length-1));setAnswer("");setRevealed(false);}

 if(!hydrated)return <main className="page-shell">Loading your journey…</main>;
 if(node.number>progress.completedNodes.length+1)return <main className="page-shell"><h1 className="page-title">This encounter awaits</h1><p className="page-intro">Complete the earlier encounters to reveal this part of the journey.</p><Link className="cta-primary mt-6" href="/journey/hanuman">Return to the atlas</Link></main>;

 return <main className={styles.encounterShell} data-scene-theme={sceneTheme(node)}>
  <div className={styles.encounterFrame}>
   <nav className={styles.encounterNav}><Link href="/journey/hanuman"><ArrowLeft/> Journey map</Link><span>{node.place} · {node.number} / 15</span><span aria-label={`${stars} of 3 mastery stars`}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</span></nav>
   <header className={styles.compactHeader}><div><p className="eyebrow">{node.eyebrow}</p><h1>{node.title}</h1></div><div className={styles.headerMeta}><Badge>{node.id}</Badge><ConfidenceBadge level={node.confidence}/></div></header>
   <StepProgress phase={phase}/>

   {phase==="arrive"&&<section className={styles.phaseStage} aria-labelledby="arrive-title"><div className={styles.arrivalGrid}><div className={styles.arrivalCopy}><span className={styles.phaseKicker}><Compass/> Arrive</span><h2 id="arrive-title">Enter {node.place}</h2><p>{node.excerpt}</p><CompactCharacters node={node} unlockedNames={progress.unlockedCharacters}/>{showGuide&&<aside className={styles.onboarding}><div><Sparkles/><p><strong>How the journey works</strong><span>Explore the scene · discover the story · answer 3 questions · earn stars · unlock the path ahead.</span></p></div><button onClick={dismissGuide} aria-label="Dismiss journey guide">Got it</button></aside>}<Button className={styles.primaryAction} onClick={enterScene}>Enter the scene <ArrowRight/></Button></div><div className={styles.sceneWindow} aria-label={`${node.place}, shown as a ${node.displayType}`}><span><MapPinned/></span><small>{node.displayType} · confidence {node.confidence}</small><strong>{node.place}</strong><p>A living story landscape</p></div></div></section>}

   {phase==="explore"&&<section className={styles.phaseStage} aria-labelledby="explore-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><Compass/> Explore</span><p className={styles.phaseCounter}>{discoveriesFound} of {allDiscoveryKeys.length} discoveries found{exploreActivities.some(activity=>activity.optional)?" · optional discovery available":""}</p><h2 id="explore-title">Look closely at the scene</h2><p>Open the story markers to learn who and what shapes this moment.</p></div><EncounterActivities node={node} activities={exploreActivities} compact/><div className={styles.phaseAction}><Button onClick={()=>setPhase("story")} disabled={!requiredExplorationComplete}>Continue the story <ArrowRight/></Button>{!requiredExplorationComplete&&<small>Find the required discoveries to continue. Optional discoveries can be revisited later.</small>}</div></section>}

   {phase==="story"&&<section className={styles.phaseStage} aria-labelledby="story-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><BookOpenText/> Story</span><h2 id="story-title">What unfolds here</h2></div><article className={styles.storyFocus}><p>{node.story}</p></article>{storyActivities.length>0&&<EncounterActivities node={node} activities={storyActivities} compact/>}{node.subEncounters&&!battleComplete&&<BattleSequence stages={node.subEncounters} discoveredStageIds={battleDiscoveryIds.map(id=>id.split(":")[1])} onDiscoverStage={stageId=>battleActivity&&discoverScene(battleActivity.id,stageId)} onComplete={()=>setBattleComplete(true)}/>}<div className={styles.phaseAction}><Button onClick={afterStory} disabled={!storyComplete}>{storyActivities.length||node.subEncounters?"See what was revealed":"Continue"} <ArrowRight/></Button>{!storyComplete&&<small>Complete the story interaction to reveal the next step.</small>}</div></section>}

   {phase==="unlock"&&<section className={styles.phaseStage} aria-labelledby="unlock-title"><div className={styles.phaseHeading}><span className={styles.phaseKicker}><Gift/> Revealed</span><h2 id="unlock-title">The journey expands</h2><p>New knowledge becomes part of your collection and living network.</p></div>{unlockActivities.length>0&&<EncounterActivities node={node} activities={unlockActivities} compact/>}{Boolean(node.rewards?.length)&&<div className={styles.rewardGrid}>{node.rewards!.map(reward=><RewardItem key={reward.id} reward={reward} node={node} progress={progress}/>)}</div>}<div className={styles.phaseAction}><Button onClick={()=>setPhase("mastery")} disabled={!unlockComplete}>Test your understanding <ArrowRight/></Button>{!unlockComplete&&<small>Reveal the story reward before beginning mastery.</small>}</div></section>}

   {phase==="mastery"&&<section className={styles.phaseStage} aria-labelledby="mastery-title"><div className={styles.masteryHeading}><div><span className={styles.phaseKicker}><Flame/> Mastery</span><p className="eyebrow">Question {questionIndex+1} of 3 · {levelLabels[level]}</p><h2 id="mastery-title">What did you discover?</h2><p>Correct answers earn mastery stars. Every answer keeps the journey moving.</p></div><span className={styles.largeStars}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</span></div><div className={styles.levels} aria-label="Question progress">{levels.map((item,index)=>{const value=progress.answeredChallenges[challengeKey(node.id,item)],available=index===0||levels.slice(0,index).every(previous=>progress.answeredChallenges[challengeKey(node.id,previous)]),mastered=storedAnswerIsCorrect(node,item,value);return <button key={item} disabled={!available} aria-pressed={questionIndex===index} onClick={()=>setQuestionIndex(index)}>{mastered?<Check/>:index+1}<span>{levelLabels[item]}</span></button>})}</div><div className={styles.questionFocus}><p>{challenge.prompt}</p><div className={styles.answerChoices}>{challenge.choices.map(choice=><button key={choice.id} disabled={revealed} onClick={()=>setAnswer(choice.id)} className={cn(answer===choice.id&&styles.answerSelected,revealed&&choice.id===challenge.answer&&styles.answerCorrect,revealed&&answer===choice.id&&!correct&&styles.answerWrong)}><span>{choice.id.toUpperCase()}</span>{choice.label}</button>)}</div>{revealed&&<div className={cn(styles.feedback,correct?styles.feedbackCorrect:styles.feedbackWrong)} role="status"><strong>{correct?"Well seen.":`A useful distinction: the stronger answer is “${challenge.choices.find(choice=>choice.id===challenge.answer)?.label}.”`}</strong><p>{challenge.explanation}</p></div>}{!revealed&&<Button onClick={checkAnswer} disabled={!answer}>Check answer <ArrowRight/></Button>}{revealed&&questionIndex<2&&<Button onClick={nextQuestion}>Continue to question {questionIndex+2} <ArrowRight/></Button>}{revealed&&questionIndex===2&&<Button onClick={()=>setPhase("complete")}>View completion <ArrowRight/></Button>}</div></section>}

   {phase==="complete"&&<section className={styles.phaseStage} aria-labelledby="complete-title"><div className={styles.completion}><span className={styles.completionSeal}><Check/></span><p className="eyebrow">Encounter complete</p><h2 id="complete-title">{node.title}</h2><div className={styles.completionStars}>{[0,1,2].map(index=><Star key={index} fill={index<stars?"currentColor":"none"}/>)}</div><p>{stars} of 3 mastery stars earned. The path continues regardless of score.</p><div className={styles.completionStats}><span><strong>{discoveriesFound}/{allDiscoveryKeys.length||0}</strong> discoveries</span><span><strong>{(node.rewards??[]).filter(reward=>reward.type==="character"&&progress.unlockedCharacters.includes(reward.label)).length}</strong> characters</span><span><strong>{relationships.filter(item=>item.eventId===node.id&&progress.unlockedRelationships.includes(item.id)).length}</strong> relationships</span><span><strong>{(node.rewards??[]).filter(reward=>reward.type==="object"&&progress.discoveredObjects.includes(reward.id)).length}</strong> objects</span></div><p className={styles.nextReveal}>{nextSlug?"The next encounter is now available.":"Hanumān’s journey is complete."}</p>{nextSlug?<Link href={`/journey/hanuman/${nextSlug}`}><Button>Continue Journey <ArrowRight/></Button></Link>:<Link href="/journey/hanuman"><Button>Return to the completed atlas <Check/></Button></Link>}</div></section>}

   <details className={styles.deeperDrawer}><summary><span><CircleHelp/> Explore deeper</span><small>Place, sources, traditions, and meaning</small></summary><div className={styles.deeperGrid}><section><p className="eyebrow">Deeper meaning</p><p className={styles.teaching}>{node.teaching}</p></section><section><p className="eyebrow">Why here?</p><dl><div><dt>Textual setting</dt><dd>{node.whyHere.textual}</dd></div><div><dt>Modern identification</dt><dd>{node.whyHere.modern}</dd></div><div><dt>Tradition</dt><dd>{node.whyHere.tradition}</dd></div><div><dt>Why this confidence?</dt><dd>{node.whyHere.reason}</dd></div></dl></section><section><p className="eyebrow">Source lens</p><div className={styles.sourceBadges}>{node.sourceLabels.map(source=><Badge key={source}>{source}</Badge>)}</div></section><SourceComparison node={node} compact/></div></details>
  </div>
 </main>;
}
