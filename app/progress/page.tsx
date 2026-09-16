"use client";

import {useState} from "react";
import {Award,Check,Compass,Eye,Gem,Link2,LockKeyhole,Map as MapIcon,RotateCcw,Sparkles,Star,Users} from "lucide-react";
import {PageHero,ProgressSummary,SectionPanel} from "@/components/atlas-page-ui";
import {areas} from "@/data/discoveries";
import {useProgress} from "@/components/progress-provider";
import styles from "@/components/journey.module.scss";
import {sacredObjects} from "@/data/encounter-activities";
import {SacredObjectCard} from "@/components/sacred-object-card";
import {achievementDefinitions,progressCounts,progressTotals} from "@/data/progress-metrics";

const statIcons={Encounters:Compass,"Mastery stars":Star,Characters:Users,Connections:Link2,Discoveries:Eye,"Sacred objects":Gem,Achievements:Award};

export default function ProgressPage(){
 const {progress,error,user,resetProgress}=useProgress();
 const [confirmReset,setConfirmReset]=useState(false);
 const counts=progressCounts(progress),completedCount=counts.encounters;
 const stats=[
  {value:counts.encounters,total:progressTotals.encounters,label:"Encounters",group:"journey"},
  {value:counts.masteryStars,total:progressTotals.masteryStars,label:"Mastery stars",group:"journey"},
  {value:counts.characters,total:progressTotals.characters,label:"Characters",group:"world"},
  {value:counts.connections,total:progressTotals.connections,label:"Connections",group:"world"},
  {value:counts.discoveries,total:progressTotals.discoveries,label:"Discoveries",group:"world"},
  {value:counts.sacredObjects,total:progressTotals.sacredObjects,label:"Sacred objects",group:"world"},
  {value:counts.achievements,total:progressTotals.achievements,label:"Achievements",group:"recognition"},
 ];
 return <main className="atlas-companion-page"><div className={`atlas-companion-shell ${styles.recordShell}`}>
  <PageHero eyebrow="Progress · Journey record" title="Your living record" description="Review mastery, discoveries, sacred objects, relationships, and achievements gathered across Hanumān’s journey." summary={<ProgressSummary value={completedCount} total={progressTotals.encounters} label="Encounters complete" icon={<Compass/>}/>}/>
  <div className={styles.statGrid}>{stats.map(({value,total,label,group})=>{const Icon=statIcons[label as keyof typeof statIcons];return <article className={styles.metric} data-group={group} key={label}><span><Icon/></span><div><strong>{Math.min(value,total)}<em> / {total}</em></strong><small>{label}</small></div></article>;})}</div>
  <div className={styles.recordStatus}><p role="status">{error||(user?"Progress linked to your account.":"Guest journey · Saved on this browser.")}</p>{confirmReset?<div className={styles.resetConfirm}><button onClick={()=>{resetProgress();setConfirmReset(false);}}><RotateCcw/>Confirm reset</button><button onClick={()=>setConfirmReset(false)}>Cancel</button><span>This clears journey stars, discoveries, connection answers, and achievements.</span></div>:<button className={styles.resetTrigger} onClick={()=>setConfirmReset(true)}><RotateCcw/>Reset journey progress</button>}</div>
  <div className={styles.recordColumns}>
   <SectionPanel eyebrow="Recognition" title="Discoveries & achievements" className={styles.achievementPanel}>
    <div className={styles.achievementList}>{achievementDefinitions.map(item=>{const unlocked=progress.achievements.includes(item.name);return <article className={unlocked?styles.unlockedAchievement:styles.lockedAchievement} key={item.name}><span>{unlocked?<Sparkles/>:<LockKeyhole/>}</span><div><strong>{item.name}</strong><small>{item.description}</small></div><em>{item.category}</em></article>;})}</div>
   </SectionPanel>
   <div>
    <SectionPanel eyebrow="Collection" title={`Sacred Objects — ${Math.min(progress.discoveredObjects.length,sacredObjects.length)}/${sacredObjects.length}`} className={styles.objectPanel}>
     <div className={styles.objectGrid}>{sacredObjects.map(object=><SacredObjectCard key={object.id} object={object} discovered={progress.discoveredObjects.includes(object.id)} mode="standard"/>)}</div>
    </SectionPanel>
    <SectionPanel eyebrow="Atlas progress" title="Map regions" className={styles.regionPanel}>
     <div className={styles.regionGrid}>{areas.map(area=>{const complete=completedCount>=area.through,discovered=completedCount+1>=area.from,state=complete?"complete":discovered?"discovered":"locked";return <article data-state={state} key={area.id}><span>{complete?<Check/>:discovered?<MapIcon/>:<LockKeyhole/>}</span><div><strong>{area.name}</strong><small>{complete?"Completed":discovered?"Discovered":"Still veiled"}</small></div></article>;})}</div>
    </SectionPanel>
   </div>
  </div>
 </div></main>;
}
