"use client";
import {chapterStatus,encounterStatus} from "@/lib/campaign-status";
import {finaleNodes} from "@/data/finale";

import {herbsNodes} from "@/data/herbs";

import Link from "next/link";
import {ArrowRight,BookOpen,Check,Compass,LockKeyhole,Star} from "lucide-react";
import {PageHero,ProgressSummary} from "@/components/atlas-page-ui";
import {journeyNodes as legacyNodes,meetingNodes} from "@/data/journey";
import {warNodes} from "@/data/war";
const journeyNodes=[...meetingNodes,...legacyNodes,...warNodes,...herbsNodes,...finaleNodes];
import {hanumanCampaignChapters,ramayanaEventById} from "@/data/hanuman-campaign";
import {useProgress} from "@/components/progress-provider";
import styles from "@/components/journey.module.scss";
import {correctAnswerCount,nodeMastery,canEnterNode,allCompletedNodeIds} from "@/lib/progress";
import type {CampaignChapter,JourneyNode,JourneyProgressState} from "@/lib/types";
const kandaLabels={kiskindha:"Kiṣkindhā",sundara:"Sundara",yuddha:"Yuddha"};

function Stars({node,progress}:{node:JourneyNode;progress:Parameters<typeof nodeMastery>[0]}){
 const stars=nodeMastery(progress,node),count=stars.filter(Boolean).length;
 return <span className={styles.storyStars} aria-label={`${count} of 3 mastery stars`}>{stars.map((filled,index)=><Star key={index} fill={filled?"currentColor":"none"}/>)}</span>;
}

function EncounterCard({node,progress}:{node:JourneyNode;progress:JourneyProgressState}){
 const complete=allCompletedNodeIds(progress).includes(node.id),locked=!canEnterNode(progress,node),current=!complete&&!locked,state=complete?"complete":current?"current":"locked";
 const content=<><div className={styles.encounterCardTop}><span>{node.id}</span><span className={styles.encounterState}>{complete?<><Check/>{encounterStatus(node,progress)}</>:current?<><Compass/>{encounterStatus(node,progress)}</>:<><LockKeyhole/>Locked</>}</span></div><div className={styles.encounterCardCopy}><small>{node.place}</small><h3>{node.title}</h3><p>{node.excerpt}</p></div><div className={styles.encounterCardBottom}><Stars node={node} progress={progress}/><span>{complete?"Review encounter":current?"Continue":"Complete the previous encounter"}{!locked&&<ArrowRight/>}</span></div></>;
 return locked?<article className={styles.encounterCard} data-state={state}>{content}</article>:<Link className={styles.encounterCard} data-state={state} href={`/journey/hanuman/${node.slug}`}>{content}</Link>;
}

function ChapterSection({chapter,progress}:{chapter:CampaignChapter;progress:JourneyProgressState}){
 const nodes=chapter.playableNodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean);
 const planned=chapter.eventIds.map(id=>ramayanaEventById[id]).filter(event=>event?.sourceReviewRequired);
 const complete=nodes.filter(node=>allCompletedNodeIds(progress).includes(node.id)).length;
 return <section className={styles.chapter} data-tone={chapter.theme} data-status={chapter.status}>
  <header className={styles.chapterHeader}><div><p>{kandaLabels[chapter.kanda]} Kāṇḍa · Chapter {chapter.number}</p><h2>{chapter.title}</h2><span>{chapter.description}</span><em className={styles.chapterStatus}>{chapterStatus(chapter,progress)}</em></div>{nodes.length>0&&<div className={styles.chapterProgress}><strong>{complete} / {nodes.length}</strong><small>playable complete</small><i><b style={{width:`${complete/nodes.length*100}%`}}/></i></div>}</header>
  <div className={styles.chapterAtmosphere} aria-hidden="true"><span/></div>
  {planned.length>0&&<div className={styles.plannedEvents}><div><BookOpen/><span><strong>Source-reviewed expansion</strong><small>Planning titles only; story claims and activities are not yet published.</small></span></div><ul>{planned.map(event=><li key={event.id}><span>{event.id}</span>{event.title}</li>)}</ul></div>}
  {nodes.length>0&&<div className={styles.encounterGrid}>{nodes.map(node=><EncounterCard key={node.id} node={node} progress={progress}/>)}</div>}
 </section>;
}

export default function JourneyPage(){
 const {progress,error,user}=useProgress();
 const completedCount=allCompletedNodeIds(progress).length;
 const masteryStars=correctAnswerCount(progress),nextNode=journeyNodes.find(node=>node.id===progress.currentNode&&!allCompletedNodeIds(progress).includes(node.id))??journeyNodes.find(node=>canEnterNode(progress,node)&&!allCompletedNodeIds(progress).includes(node.id));
 const currentChapter=nextNode?hanumanCampaignChapters.find(chapter=>chapter.playableNodeIds.includes(nextNode.id)):undefined;
 return <main className="atlas-companion-page"><div className={`atlas-companion-shell ${styles.storyShell}`}>
  <PageHero eyebrow="Character campaign · Follow Hanumān" title="A path of courage, wisdom, and service" description={`Follow an eight-chapter campaign across Kiṣkindhā, Sundara, and Yuddha Kāṇḍas. ${journeyNodes.length} encounters are playable, from the first meeting to the return to Ayodhyā. Two additional Search encounters remain planned.`} summary={<div className={styles.journeySummary}><ProgressSummary value={completedCount} total={journeyNodes.length} label="Playable encounters" icon={<Compass/>}/><ProgressSummary value={masteryStars} total={journeyNodes.length*3} label="Mastery stars" icon={<Star/>}/></div>}/>
  <p className={styles.saveStatus} role="status">{error||(user?"Progress linked to your account.":"Guest journey · Saved on this browser.")}</p>
  {!progress.campaignComplete&&nextNode?<section className={styles.continueStory}><div><p className="eyebrow">Follow Hanumān · Chapter {currentChapter?.number}</p><h2>{nextNode.id} · {nextNode.title}</h2><span>{nextNode.excerpt}</span></div><Link href={`/journey/hanuman/${nextNode.slug}`}>Continue Journey <ArrowRight/></Link></section>:<section className={styles.journeyComplete}><span><Check/></span><div><p className="eyebrow">Follow Hanumān · Journey Complete</p><h2>The mission is fulfilled. Service continues.</h2><p>{completedCount} / {journeyNodes.length} playable encounters complete. Revisit chapters, improve mastery, and explore the relationships and objects behind the journey.</p></div><Link href="/journey/hanuman/ayodhya-service-continues">Revisit the finale <ArrowRight/></Link></section>}
  <div className={styles.chapterPath}>{hanumanCampaignChapters.map(chapter=><ChapterSection key={chapter.id} chapter={chapter} progress={progress}/>)}</div>
 </div></main>;
}
