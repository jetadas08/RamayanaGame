"use client";

import Link from "next/link";
import {ArrowRight,Check,Compass,LockKeyhole,Star} from "lucide-react";
import {PageHero,ProgressSummary} from "@/components/atlas-page-ui";
import {journeyNodes} from "@/data/journey";
import {useProgress} from "@/components/progress-provider";
import styles from "@/components/journey.module.scss";
import {correctAnswerCount,nodeMastery} from "@/lib/progress";
import type {JourneyNode} from "@/lib/types";

type Chapter={number:number;title:string;description:string;tone:"earth"|"ocean"|"lanka"|"return";nodeIds:string[]};
const chapters:Chapter[]=[
 {number:1,title:"The Search",tone:"earth",description:"At the southern shore, uncertainty gives way to direction as memory, vision, and encouragement awaken the path forward.",nodeIds:["HJ-01","HJ-02","HJ-03"]},
 {number:2,title:"Across the Ocean",tone:"ocean",description:"Hanumān leaves the shore and crosses the sea, meeting welcome, tests, danger, and the guarded threshold of Laṅkā.",nodeIds:["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"]},
 {number:3,title:"Laṅkā",tone:"lanka",description:"Within the island kingdom, the hidden search becomes recognition, message, confrontation, counsel, and consequence.",nodeIds:["HJ-09","HJ-10","HJ-11","HJ-12","HJ-13","HJ-14"]},
 {number:4,title:"Return to Rāma",tone:"return",description:"Bearing Sītā’s token and message, Hanumān completes the crossing by carrying truth and renewed hope home.",nodeIds:["HJ-15"]},
];

function Stars({node,progress}:{node:JourneyNode;progress:Parameters<typeof nodeMastery>[0]}){
 const stars=nodeMastery(progress,node),count=stars.filter(Boolean).length;
 return <span className={styles.storyStars} aria-label={`${count} of 3 mastery stars`}>{stars.map((filled,index)=><Star key={index} fill={filled?"currentColor":"none"}/>)}</span>;
}

function EncounterCard({node,index,completedCount,progress}:{node:JourneyNode;index:number;completedCount:number;progress:Parameters<typeof nodeMastery>[0]}){
 const complete=index<completedCount,current=index===completedCount,locked=index>completedCount,state=complete?"complete":current?"current":"locked";
 const content=<><div className={styles.encounterCardTop}><span>{node.id}</span><span className={styles.encounterState}>{complete?<><Check/>Completed</>:current?<><Compass/>Current</>:<><LockKeyhole/>Locked</>}</span></div><div className={styles.encounterCardCopy}><small>{node.place}</small><h3>{node.title}</h3><p>{node.excerpt}</p></div><div className={styles.encounterCardBottom}><Stars node={node} progress={progress}/><span>{complete?"Review encounter":current?"Continue":"Complete the previous encounter"}{!locked&&<ArrowRight/>}</span></div></>;
 return locked?<article className={styles.encounterCard} data-state={state}>{content}</article>:<Link className={styles.encounterCard} data-state={state} href={`/journey/hanuman/${node.slug}`}>{content}</Link>;
}

function ChapterSection({chapter,completedCount,progress}:{chapter:Chapter;completedCount:number;progress:Parameters<typeof nodeMastery>[0]}){
 const nodes=chapter.nodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean);
 const complete=nodes.filter(node=>journeyNodes.indexOf(node)<completedCount).length;
 return <section className={styles.chapter} data-tone={chapter.tone}>
  <header className={styles.chapterHeader}><div><p>Chapter {chapter.number}</p><h2>{chapter.title}</h2><span>{chapter.description}</span></div><div className={styles.chapterProgress}><strong>{complete} / {nodes.length}</strong><small>complete</small><i><b style={{width:`${nodes.length?complete/nodes.length*100:0}%`}}/></i></div></header>
  <div className={styles.chapterAtmosphere} aria-hidden="true"><span/></div>
  <div className={styles.encounterGrid}>{nodes.map(node=><EncounterCard key={node.id} node={node} index={journeyNodes.indexOf(node)} completedCount={completedCount} progress={progress}/>)}</div>
 </section>;
}

export default function JourneyPage(){
 const {progress,error,user}=useProgress();
 const completedCount=progress.completedNodes.filter(id=>journeyNodes.some(node=>node.id===id)).length;
 const masteryStars=correctAnswerCount(progress),nextNode=journeyNodes[completedCount];
 const currentChapter=nextNode?chapters.find(chapter=>chapter.nodeIds.includes(nextNode.id)):undefined;
 return <main className="atlas-companion-page"><div className={`atlas-companion-shell ${styles.storyShell}`}>
  <PageHero eyebrow="Hanumān’s story path" title="The journey unfolds" description="Follow the chapters of Hanumān’s mission, continue from the present encounter, or return to any completed moment to deepen your mastery." summary={<div className={styles.journeySummary}><ProgressSummary value={completedCount} total={journeyNodes.length} label="Encounters" icon={<Compass/>}/><ProgressSummary value={masteryStars} total={journeyNodes.length*3} label="Mastery stars" icon={<Star/>}/></div>}/>
  <p className={styles.saveStatus} role="status">{error||(user?"Progress linked to your account.":"Guest journey · Saved on this browser.")}</p>
  {nextNode?<section className={styles.continueStory}><div><p className="eyebrow">Continue your journey · Chapter {currentChapter?.number}</p><h2>{nextNode.id} · {nextNode.title}</h2><span>{nextNode.excerpt}</span></div><Link href={`/journey/hanuman/${nextNode.slug}`}>Continue Journey <ArrowRight/></Link></section>:<section className={styles.journeyComplete}><span><Check/></span><div><p className="eyebrow">Hanumān Journey Complete</p><h2>The message has come home</h2><p>Revisit any encounter to strengthen mastery or explore story details you may have missed.</p></div><Link href="/progress">View Progress <ArrowRight/></Link></section>}
  <div className={styles.chapterPath}>{chapters.map(chapter=><ChapterSection key={chapter.number} chapter={chapter} completedCount={completedCount} progress={progress}/>)}</div>
 </div></main>;
}
