"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import {Compass,Focus,Gamepad2,Sparkles} from "lucide-react";
import {PageHero} from "@/components/atlas-page-ui";
import {FamilyNetworkSlice,type ConnectionMode} from "@/components/connections-family-slice";
import {KishkindhaNetworkSlice} from "@/components/connections-kishkindha-slice";
import {useProgress} from "@/components/progress-provider";
import {characters} from "@/data/discoveries";
import {relationships} from "@/data/relationships";
import styles from "./connections.module.scss";
import kishStyles from "./kishkindha.module.scss";

function nameFor(id:string){return characters.find(person=>person.id===id)?.name??id;}

export default function ConnectionsPage(){
 const {progress,hydrated,recentRelationshipUnlocks,acknowledgeRelationshipUnlocks}=useProgress();
 const [mode,setMode]=useState<ConnectionMode>("build");
 const [lens,setLens]=useState<"family"|"kishkindha">("family");
 useEffect(()=>{if(recentRelationshipUnlocks.length){const timer=setTimeout(acknowledgeRelationshipUnlocks,5000);return()=>clearTimeout(timer);}},[recentRelationshipUnlocks,acknowledgeRelationshipUnlocks]);
 const discovered=relationships.filter(edge=>progress.unlockedRelationships.includes(edge.id));
 const remembered=discovered.at(-1);
 if(!hydrated)return <main className={`atlas-companion-page ${styles.connectionsPage}`} aria-busy="true"><div className={`atlas-companion-shell ${styles.shell}`}><PageHero eyebrow="Connections · Living knowledge" title="Restoring your network" description="Loading the relationships revealed by your journey."/></div></main>;
 return <main className={`atlas-companion-page ${styles.connectionsPage}`}><div className={`atlas-companion-shell ${styles.shell}`}>
  <PageHero eyebrow="Sacred bonds · living knowledge" title="Connections" description="Explore the bonds that shape Hanumān’s world."/>
  {recentRelationshipUnlocks.length>0&&<div className={styles.unlock}><Sparkles/><div><strong>{recentRelationshipUnlocks.length} {recentRelationshipUnlocks.length===1?"connection":"connections"} discovered</strong><p>The relationship is now part of your permanent network.</p></div></div>}
  <nav className={kishStyles.lensTabs} aria-label="Connection lenses"><button type="button" aria-current={lens==="family"?"page":undefined} onClick={()=>{setLens("family");setMode("build");}}>Family & Origins</button><button type="button" aria-current={lens==="kishkindha"?"page":undefined} onClick={()=>{setLens("kishkindha");setMode("explore");}}>Kiṣkindhā</button></nav>
  <nav className={styles.modeTabs} aria-label="Connection modes"><button aria-pressed={mode==="explore"} className={mode==="explore"?styles.active:""} onClick={()=>setMode("explore")}><Compass size={17}/>Explore Network</button><button aria-pressed={mode==="build"} className={mode==="build"?styles.active:""} onClick={()=>setMode("build")}><Gamepad2 size={17}/>Build Network</button><button aria-pressed={mode==="focus"} className={mode==="focus"?styles.active:""} onClick={()=>setMode("focus")}><Focus size={17}/>Character Focus</button></nav>
  {lens==="family"?<FamilyNetworkSlice mode={mode} onModeChange={setMode} unlockedRelationshipIds={progress.unlockedRelationships}/>:<KishkindhaNetworkSlice mode={mode} onModeChange={setMode} unlockedRelationshipIds={progress.unlockedRelationships}/>}
  <section className={styles.memoryLead} aria-label="Relationship remembered from the journey"><div><p className="eyebrow">A bond remembered</p><h2>{remembered?`${nameFor(remembered.fromCharacterId)} and ${nameFor(remembered.toCharacterId)}`:"The network begins in the story"}</h2><p>{remembered?`${nameFor(remembered.fromCharacterId)} ${remembered.label} ${nameFor(remembered.toCharacterId)}.`:"Meet the characters in the journey; the bonds you witness will appear here."}</p><Link href="/journey/hanuman">Return to the journey →</Link></div><div className={styles.familyJourneyCount}><strong>{discovered.length} / {relationships.length}</strong><span>Journey bonds discovered</span></div></section>
 </div></main>;
}
