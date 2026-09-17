"use client";

import Link from "next/link";
import {ArrowRight,BookOpen,Check,Compass,LockKeyhole,Star} from "lucide-react";
import {PageHero,ProgressSummary} from "@/components/atlas-page-ui";
import {journeyNodes} from "@/data/journey";
import {hanumanCampaignChapters,ramayanaEventById} from "@/data/hanuman-campaign";
import {useProgress} from "@/components/progress-provider";
import styles from "@/components/journey.module.scss";
import {correctAnswerCount,nodeMastery} from "@/lib/progress";
import type {CampaignChapter,JourneyNode} from "@/lib/types";
const kandaLabels={kiskindha:"Kiṣkindhā",sundara:"Sundara",yuddha:"Yuddha"};

function Stars({node,progress}:{node:JourneyNode;progress:Parameters<typeof nodeMastery>[0]}){
 const stars=nodeMastery(progress,node),count=stars.filter(Boolean).length;
 return <span className={styles.storyStars} aria-label={`${count} of 3 mastery stars`}>{stars.map((filled,index)=><Star key={index} fill={filled?"currentColor":"none"}/>)}</span>;
}

function EncounterCard({node,index,completedCount,progress}:{node:JourneyNode;index:number;completedCount:number;progress:Parameters<typeof nodeMastery>[0]}){
 const complete=index<completedCount,current=index===completedCount,locked=index>completedCount,state=complete?"complete":current?"current":"locked";
 const content=<><div className={styles.encounterCardTop}><span>{node.id}</span><span className={styles.encounterState}>{complete?<><Check/>Completed</>:current?<><Compass/>Current</>:<><LockKeyhole/>Locked</>}</span></div><div className={styles.encounterCardCopy}><small>{node.place}</small><h3>{node.title}</h3><p>{node.excerpt}</p></div><div className={styles.encounterCardBottom}><Stars node={node} progress={progress}/><span>{complete?"Review encounter":current?"Continue":"Complete the previous encounter"}{!locked&&<ArrowRight/>}</span></div></>;
 return locked?<article className={styles.encounterCard} data-state={state}>{content}</article>:<Link className={styles.encounterCard} data-state={state} href={`/journey/hanuman/${node.slug}`}>{content}</Link>;
}

function ChapterSection({chapter,completedCount,progress}:{chapter:CampaignChapter;completedCount:number;progress:Parameters<typeof nodeMastery>[0]}){
 const nodes=chapter.playableNodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean);
 const planned=chapter.eventIds.map(id=>ramayanaEventById[id]).filter(event=>event?.sourceReviewRequired);
 const complete=nodes.filter(node=>journeyNodes.indexOf(node)<completedCount).length;
 return <section className={styles.chapter} data-tone={chapter.theme} data-status={chapter.status}>
  <header className={styles.chapterHeader}><div><p>{kandaLabels[chapter.kanda]} Kāṇḍa · Chapter {chapter.number}</p><h2>{chapter.title}</h2><span>{chapter.description}</span><em className={styles.chapterStatus}>{chapter.status==="planned"?"Planned · source review required":chapter.status==="mixed"?`${nodes.length} playable · ${planned.length} planned`:`${nodes.length} encounters available`}</em></div><div className={styles.chapterProgress}><strong>{complete} / {nodes.length}</strong><small>{nodes.length?"playable complete":"playable encounters"}</small><i><b style={{width:`${nodes.length?complete/nodes.length*100:0}%`}}/></i></div></header>
  <div className={styles.chapterAtmosphere} aria-hidden="true"><span/></div>
  {planned.length>0&&<div className={styles.plannedEvents}><div><BookOpen/><span><strong>Source-reviewed expansion</strong><small>Planning titles only; story claims and activities are not yet published.</small></span></div><ul>{planned.map(event=><li key={event.id}><span>{event.id}</span>{event.title}</li>)}</ul></div>}
  {nodes.length>0&&<div className={styles.encounterGrid}>{nodes.map(node=><EncounterCard key={node.id} node={node} index={journeyNodes.indexOf(node)} completedCount={completedCount} progress={progress}/>)}</div>}
 </section>;
}

export default function JourneyPage(){
 const {progress,error,user}=useProgress();
 const completedCount=progress.completedNodes.filter(id=>journeyNodes.some(node=>node.id===id)).length;
 const masteryStars=correctAnswerCount(progress),nextNode=journeyNodes[completedCount];
 const currentChapter=nextNode?hanumanCampaignChapters.find(chapter=>chapter.playableNodeIds.includes(nextNode.id)):undefined;
 return <main className="atlas-companion-page"><div className={`atlas-companion-shell ${styles.storyShell}`}>
  <PageHero eyebrow="Character campaign · Follow Hanumān" title="A path of courage, wisdom, and service" description="Follow an eight-chapter campaign across Kiṣkindhā, Sundara, and Yuddha Kāṇḍas. The fifteen-encounter Mission to Laṅkā is playable now; additional chapters remain visibly planned until their sources are reviewed." summary={<div className={styles.journeySummary}><ProgressSummary value={completedCount} total={journeyNodes.length} label="Playable encounters" icon={<Compass/>}/><ProgressSummary value={masteryStars} total={journeyNodes.length*3} label="Mastery stars" icon={<Star/>}/></div>}/>
  <p className={styles.saveStatus} role="status">{error||(user?"Progress linked to your account.":"Guest journey · Saved on this browser.")}</p>
  {nextNode?<section className={styles.continueStory}><div><p className="eyebrow">Continue Mission to Laṅkā · Chapter {currentChapter?.number}</p><h2>{nextNode.id} · {nextNode.title}</h2><span>{nextNode.excerpt}</span></div><Link href={`/journey/hanuman/${nextNode.slug}`}>Continue Journey <ArrowRight/></Link></section>:<section className={styles.journeyComplete}><span><Check/></span><div><p className="eyebrow">Mission to Laṅkā complete</p><h2>The message has come home</h2><p>You completed the campaign’s current playable center. Revisit its encounters for mastery while the war and fulfillment chapters await source review.</p></div><Link href="/progress">View Progress <ArrowRight/></Link></section>}
  <div className={styles.chapterPath}>{hanumanCampaignChapters.map(chapter=><ChapterSection key={chapter.id} chapter={chapter} completedCount={completedCount} progress={progress}/>)}</div>
 </div></main>;
}
