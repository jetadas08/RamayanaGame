"use client";
import {chapterStatus} from "@/lib/campaign-status";


import Link from "next/link";
import {useState} from "react";
import {ArrowRight,Award,Check,Compass,Eye,Gem,Link2,LockKeyhole,Map as MapIcon,RotateCcw,Sparkles,Star,Users} from "lucide-react";
import {PageHero,ProgressSummary,SectionPanel} from "@/components/atlas-page-ui";
import {areas,achievements} from "@/data/discoveries";
import {useProgress} from "@/components/progress-provider";
import styles from "@/components/journey.module.scss";
import {sacredObjects} from "@/data/encounter-activities";
import {SacredObjectCard} from "@/components/sacred-object-card";
import {achievementDefinitions,progressCounts,progressTotals} from "@/data/progress-metrics";
import {hanumanCampaignChapters} from "@/data/hanuman-campaign";
import {meetingNodes} from "@/data/meeting";
import {searchNodes} from "@/data/search";
import {journeyNodes as legacyNodes} from "@/data/journey";
import {warNodes} from "@/data/war";
import {herbsNodes} from "@/data/herbs";
import {finaleNodes} from "@/data/finale";
import {allCompletedNodeIds,canEnterNode,recentChangeLabel} from "@/lib/progress";
import {encounterHref} from "@/lib/journey-navigation";

const statIcons={Encounters:Compass,"Mastery stars":Star,Characters:Users,Connections:Link2,Discoveries:Eye,"Sacred objects":Gem,Achievements:Award};
const kandaLabels={kiskindha:"Kiṣkindhā",sundara:"Sundara",yuddha:"Yuddha"};
function achievementHint(name:string,category:string){
 const milestone=achievements.find(item=>item.name===name);
 if(milestone?.perfectNode)return `Earn all three mastery stars in ${legacyNodes[milestone.perfectNode-1]?.title??"the related encounter"}.`;
 if(milestone?.totalStars)return `Earn ${milestone.totalStars} mastery stars across the journey.`;
 if(milestone)return `Complete ${legacyNodes[milestone.node-1]?.title??"the related encounter"}.`;
 if(category==="Campaign")return "Complete the final encounter. Perfect mastery is optional.";
 if(category==="Connections")return "Explore or confirm the related connection.";
 if(category==="Discovery")return "Explore the relevant scene or Sacred Object.";
 if(category==="Characters")return "Discover and learn about the related characters.";
 if(category.startsWith("HFM-")||category.startsWith("HFS-")||category.startsWith("HJ-")||category.startsWith("HFF-"))return `Earn three mastery stars in ${category} for this deeper memory.`;
 return "Continue the related story encounter.";
}

export default function ProgressPage(){
 const {progress,error,user,resetProgress,hydrated}=useProgress();
 const [confirmReset,setConfirmReset]=useState(false),[showAllAchievements,setShowAllAchievements]=useState(false);
 const counts=progressCounts(progress),completedCount=counts.encounters;
 const journeyNodes=[...meetingNodes,...searchNodes,...legacyNodes,...warNodes,...herbsNodes,...finaleNodes];
 const completedIds=allCompletedNodeIds(progress);
 const nextNode=journeyNodes.find(node=>node.id===progress.currentNode&&!completedIds.includes(node.id))??journeyNodes.find(node=>canEnterNode(progress,node)&&!completedIds.includes(node.id));
 const currentChapter=nextNode?hanumanCampaignChapters.find(chapter=>chapter.playableNodeIds.includes(nextNode.id)):hanumanCampaignChapters.at(-1);
 const recentNode=[...journeyNodes].reverse().find(node=>completedIds.includes(node.id));
 const finale=finaleNodes.at(-1)!;
 const stats=[
  {value:counts.encounters,total:progressTotals.encounters,label:"Encounters",group:"journey"},
  {value:counts.masteryStars,total:progressTotals.masteryStars,label:"Mastery stars",group:"journey"},
  {value:counts.characters,total:progressTotals.characters,label:"Characters",group:"world"},
  {value:counts.connections,total:progressTotals.connections,label:"Connections",group:"world"},
  {value:counts.discoveries,total:progressTotals.discoveries,label:"Discoveries",group:"world"},
  {value:counts.sacredObjects,total:progressTotals.sacredObjects,label:"Sacred objects",group:"world"},
  {value:counts.achievements,total:progressTotals.achievements,label:"Achievements",group:"recognition"},
 ];
 if(!hydrated)return <main className="atlas-companion-page" aria-busy="true"><div className={`atlas-companion-shell ${styles.recordShell}`}><PageHero eyebrow="Progress · Journey record" title="Restoring your living record" description="Loading saved encounter, mastery, and discovery progress."/></div></main>;
 return <main className="atlas-companion-page"><div className={`atlas-companion-shell ${styles.recordShell}`}>
  <PageHero eyebrow="Progress · Journey record" title="Your living record" description="Follow Hanumān campaign progress separately from the characters, relationships, places, and objects you learn across the shared Ramayana world." summary={<ProgressSummary value={completedCount} total={progressTotals.encounters} label="Playable encounters" icon={<Compass/>}/>}/>
  {!progress.campaignComplete&&nextNode?<section className={styles.currentJourney} aria-labelledby="current-journey-title"><div className={styles.currentJourneyCopy}><p className="eyebrow">Current journey · Chapter {currentChapter?.number}</p><h2 id="current-journey-title">Next · {nextNode.id} — {nextNode.title}</h2><p>{nextNode.excerpt}</p>{recentNode&&<aside><small>Last time</small><span>{recentNode.completionTakeaway||recentNode.excerpt}</span></aside>}</div><Link className={styles.currentJourneyAction} href={encounterHref(nextNode.slug,"progress")}>Continue journey <ArrowRight/></Link></section>:<section className={styles.currentJourney} aria-labelledby="current-journey-title"><div className={styles.currentJourneyCopy}><p className="eyebrow">Journey complete</p><h2 id="current-journey-title">The mission is fulfilled. Service continues.</h2><p>Return to the final encounter, revisit Hanumān’s memories, or trace the relationships formed across the campaign.</p><div className={styles.completeAlternatives}><Link href="/characters/hanuman#memory-trail">Character memory</Link><Link href="/connections">Connections</Link><Link href="/journey">Journey chapters</Link></div></div><Link className={styles.currentJourneyAction} href={encounterHref(finale.slug,"progress")}>Revisit final journey <ArrowRight/></Link></section>}
  {progress.recentChanges.length>0&&<section className={styles.recentChanges} aria-label="Recently changed"><strong>Recently changed</strong><ul>{[...progress.recentChanges].reverse().slice(0,5).map(change=><li key={`${change.kind}-${change.id}`}>{recentChangeLabel(change)}</li>)}</ul></section>}
  <Link className={styles.mobileObjectShortcut} href="#sacred-objects"><Gem/><span><strong>Sacred Objects</strong><small>{Math.min(progress.discoveredObjects.length,sacredObjects.length)} of {sacredObjects.length} discovered · view the story behind each</small></span><ArrowRight/></Link>
  <div className={styles.recordHeading}><p className="eyebrow">Your record</p><h2>What you have carried forward</h2></div>
  <div className={styles.statGrid}>{stats.map(({value,total,label,group})=>{const Icon=statIcons[label as keyof typeof statIcons];return <article className={styles.metric} data-group={group} key={label}><span><Icon/></span><div><strong>{Math.min(value,total)}<em> / {total}</em></strong><small>{label}</small></div></article>;})}</div>
  <div className={styles.recordStatus}><p role="status">{error||(user?"Progress linked to your account.":"Guest journey · Saved on this browser.")}</p>{confirmReset?<div className={styles.resetConfirm}><button onClick={()=>{resetProgress();setConfirmReset(false);}}><RotateCcw/>Confirm reset</button><button onClick={()=>setConfirmReset(false)}>Cancel</button><span>This clears journey stars, discoveries, connection answers, and achievements.</span></div>:<button className={styles.resetTrigger} onClick={()=>setConfirmReset(true)}><RotateCcw/>Reset journey progress</button>}</div>
  <SectionPanel eyebrow="Character campaign" title={`Follow Hanumān · ${hanumanCampaignChapters.length} chapters`} className={styles.campaignPanel}>
   <p className={styles.campaignNote}>The current campaign offers {progressTotals.encounters} playable encounters and {progressTotals.masteryStars} mastery stars. Completion and mastery are tracked separately.</p>
   <div className={styles.campaignChapterGrid}>{hanumanCampaignChapters.map(chapter=>{const status=chapterStatus(chapter,progress);return <article key={chapter.id} data-state={status.toLowerCase().replace(" ","-")}><span>{status==="Complete"||status==="Mastered"?<Check/>:status==="Locked"?<LockKeyhole/>:<Compass/>}</span><div><small>Chapter {chapter.number} · {kandaLabels[chapter.kanda]} Kāṇḍa</small><strong>{chapter.title}</strong><em>{status}</em></div></article>;})}</div>
  </SectionPanel>
  <div className={styles.recordColumns}>
   <div>
    <SectionPanel eyebrow="Collection" title={`Sacred Objects — ${Math.min(progress.discoveredObjects.length,sacredObjects.length)}/${sacredObjects.length}`} className={styles.objectPanel}>
     <div className={styles.objectGrid} id="sacred-objects">{sacredObjects.map(object=><SacredObjectCard key={object.id} object={object} discovered={progress.discoveredObjects.includes(object.id)} mode="standard"/>)}</div>
    </SectionPanel>
    <SectionPanel eyebrow="Atlas progress" title="Map regions" className={styles.regionPanel}>
     <div className={styles.regionGrid}>{areas.map(area=>{const complete=progress.completedNodes.length>=area.through,discovered=progress.completedNodes.length+1>=area.from,state=complete?"complete":discovered?"discovered":"locked";return <article data-state={state} key={area.id}><span>{complete?<Check/>:discovered?<MapIcon/>:<LockKeyhole/>}</span><div><strong>{area.name}</strong><small>{complete?"Completed":discovered?"Discovered":"Still veiled"}</small></div></article>;})}</div>
    </SectionPanel>
   </div>
   <SectionPanel eyebrow="Recognition" title="Discoveries & achievements" className={styles.achievementPanel}>
    <div className={styles.achievementList} data-expanded={showAllAchievements}>{achievementDefinitions.map(item=>{const unlocked=progress.achievements.includes(item.name);return <article className={unlocked?styles.unlockedAchievement:styles.lockedAchievement} key={item.name}><span>{unlocked?<Sparkles/>:<LockKeyhole/>}</span><div><strong>{unlocked?item.name:"Achievement awaits"}</strong><small>{unlocked?item.description:achievementHint(item.name,item.category)}</small></div><em>{unlocked?item.category:"Locked"}</em></article>;})}</div><button className={styles.mobileRecordToggle} aria-expanded={showAllAchievements} onClick={()=>setShowAllAchievements(value=>!value)}>{showAllAchievements?"Show fewer achievements":`Show all ${achievementDefinitions.length} achievements`}</button>
   </SectionPanel>
  </div>
 </div></main>;
}
