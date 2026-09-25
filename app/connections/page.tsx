"use client";
import Link from "next/link";
import {useEffect,useMemo,useRef,useState} from "react";
import {BookOpen,Compass,Focus,Gamepad2,Lightbulb,LockKeyhole,Share2,Sparkles,X} from "lucide-react";
import {PageHero,ProgressSummary} from "@/components/atlas-page-ui";
import {RelationshipGraph,type NetworkDepth} from "@/components/relationship-graph";
import {RelationshipChallengeGame} from "@/components/relationship-challenge-game";
import {useProgress} from "@/components/progress-provider";
import {CharacterPortrait} from "@/components/character-portrait";
import {characters} from "@/data/discoveries";
import {journeyNodes} from "@/data/journey";
import {meetingNodes} from "@/data/meeting";
import {searchNodes} from "@/data/search";
import {warNodes} from "@/data/war";
import {herbsNodes} from "@/data/herbs";
import {finaleNodes} from "@/data/finale";
import {availableRelationshipIds,relationshipAchievementDefinitions,relationshipTypeLabels,relationships} from "@/data/relationships";
import type {Relationship,RelationshipType} from "@/lib/types";
import styles from "./connections.module.scss";
import {encounterHref} from "@/lib/journey-navigation";
import {characterRoleIsKnown} from "@/data/character-knowledge";
import {orderedSourceIds} from "@/lib/source-readiness";

const allJourneyNodes=[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes];

type Mode="explore"|"build"|"focus";
type FamilyFilter="all"|"bond"|"duty"|"mission"|"political";
const families:{id:FamilyFilter;label:string;types:RelationshipType[]}[]=[
 {id:"all",label:"All",types:[]},{id:"bond",label:"Bond",types:["family","marriage","friendship"]},{id:"duty",label:"Bhakti / Duty",types:["devotion","service","protector"]},{id:"mission",label:"Guidance / Mission",types:["teacher","guidance","messenger"]},{id:"political",label:"Conflict / Political",types:["alliance","opposition"]},
];
const depths:{id:NetworkDepth;label:string}[]=[{id:"first",label:"First degree"},{id:"expanded",label:"Expand network"},{id:"whole",label:"Whole network"}];
function incident(edge:Relationship,id:string){return edge.fromCharacterId===id||edge.toCharacterId===id;}

export default function ConnectionsPage(){
 const {progress,hydrated,recentRelationshipUnlocks,acknowledgeRelationshipUnlocks}=useProgress();
 const detailTriggerRef=useRef<HTMLElement|null>(null);
 const [mode,setMode]=useState<Mode>("explore"),[family,setFamily]=useState<FamilyFilter>("all"),[focus,setFocus]=useState("hanuman"),[depth,setDepth]=useState<NetworkDepth>("first"),[selectedIds,setSelectedIds]=useState<string[]>([]);
 useEffect(()=>{if(recentRelationshipUnlocks.length){const timer=setTimeout(acknowledgeRelationshipUnlocks,5000);return()=>clearTimeout(timer);}},[recentRelationshipUnlocks,acknowledgeRelationshipUnlocks]);
 const availableIds=useMemo(()=>availableRelationshipIds(progress.completedNodes.length,progress.meetingCompletedNodes.length,progress.warCompletedNodes.length,progress.herbsCompletedNodes.length,progress.finaleCompletedNodes.length),[progress.completedNodes.length,progress.meetingCompletedNodes.length,progress.warCompletedNodes.length,progress.herbsCompletedNodes.length,progress.finaleCompletedNodes.length]);
 const availableSet=useMemo(()=>new Set(availableIds),[availableIds]);
 const discovered=useMemo(()=>relationships.filter(edge=>progress.unlockedRelationships.includes(edge.id)),[progress.unlockedRelationships]);
 const availableUndiscovered=relationships.filter(edge=>availableSet.has(edge.id)&&!progress.unlockedRelationships.includes(edge.id)&&progress.unlockedCharacters.includes(nameFor(edge.fromCharacterId))&&progress.unlockedCharacters.includes(nameFor(edge.toCharacterId)));
 const future=relationships.filter(edge=>!availableSet.has(edge.id));
 const filtered=family==="all"?discovered:discovered.filter(edge=>families.find(item=>item.id===family)!.types.includes(edge.type));
 const shown=useMemo(()=>{const source=mode==="focus"?discovered:filtered;if(depth==="whole")return source;const first=source.filter(edge=>incident(edge,focus));if(depth==="first")return first;const neighbors=new Set(first.flatMap(edge=>[edge.fromCharacterId,edge.toCharacterId]));return source.filter(edge=>neighbors.has(edge.fromCharacterId)||neighbors.has(edge.toCharacterId));},[depth,filtered,focus,mode,discovered]);
 const unlockedCharacters=characters.filter(character=>progress.unlockedCharacters.includes(character.name));
 const selected=selectedIds.map(id=>relationships.find(edge=>edge.id===id)).filter((edge):edge is Relationship=>Boolean(edge));
 const focusCharacter=characters.find(character=>character.id===focus);
 const focusDiscovered=discovered.filter(edge=>incident(edge,focus));
 const focusAvailable=availableUndiscovered.filter(edge=>incident(edge,focus));
 const rememberedConnection=[...discovered].sort((a,b)=>allJourneyNodes.findIndex(node=>node.id===b.eventId)-allJourneyNodes.findIndex(node=>node.id===a.eventId))[0];
 const rememberedNode=rememberedConnection&&allJourneyNodes.find(node=>node.id===rememberedConnection.eventId);
 function changeFocus(id:string){setFocus(id);setDepth("first");setSelectedIds([]);}
 function selectRelations(items:Relationship[]){detailTriggerRef.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setSelectedIds(items.map(item=>item.id));}
 function closeDetails(){setSelectedIds([]);requestAnimationFrame(()=>detailTriggerRef.current?.focus());}
 useEffect(()=>{if(selectedIds.length)requestAnimationFrame(()=>document.querySelector<HTMLElement>('[aria-label="Relationship detail"] h2')?.focus());},[selectedIds]);
 if(!hydrated)return <main className="atlas-companion-page" aria-busy="true"><div className={`atlas-companion-shell ${styles.shell}`}><PageHero eyebrow="Connections · Living knowledge" title="Restoring your network" description="Loading the relationships revealed by your journey."/></div></main>;
 return <main className="atlas-companion-page"><div className={`atlas-companion-shell ${styles.shell}`}>
  <PageHero eyebrow="Sacred bonds · living knowledge" title="Connections" description="Discover how the characters of the Rāmāyaṇa are bound by family, devotion, duty, alliance, guidance, and conflict."/>
  <section className={styles.memoryLead} aria-label="Relationship remembered from the journey"><div><p className="eyebrow">A bond remembered</p><h2>{rememberedConnection?`${nameFor(rememberedConnection.fromCharacterId)} and ${nameFor(rememberedConnection.toCharacterId)}`:"The network begins in the story"}</h2><p>{rememberedConnection?`${nameFor(rememberedConnection.fromCharacterId)} ${rememberedConnection.label} ${nameFor(rememberedConnection.toCharacterId)}.`:"Meet the characters in the journey; the bonds you witness will appear here."}</p><Link href={rememberedNode?encounterHref(rememberedNode.slug,"connections"):"/journey"}>{rememberedNode?`Return to ${rememberedNode.title}`:"Return to the journey"} →</Link></div><div className={styles.summaryStack}><ProgressSummary value={discovered.length} total={relationships.length} label="Relationships discovered" icon={<Share2/>}/><small>{availableUndiscovered.length} clues ready to solve</small></div></section>
  {recentRelationshipUnlocks.length>0&&<div className={styles.unlock}><Sparkles/><div><strong>{recentRelationshipUnlocks.length} {recentRelationshipUnlocks.length===1?"connection":"connections"} discovered</strong><p>The relationship is now part of your permanent network.</p></div></div>}
  <nav className={styles.modeTabs} aria-label="Connection modes"><button aria-pressed={mode==="explore"} className={mode==="explore"?styles.active:""} onClick={()=>setMode("explore")}><Compass size={17}/>Explore Network</button><button aria-pressed={mode==="build"} className={mode==="build"?styles.active:""} onClick={()=>setMode("build")}><Gamepad2 size={17}/>Build Network</button><button aria-pressed={mode==="focus"} className={mode==="focus"?styles.active:""} onClick={()=>{setMode("focus");setDepth("first");setSelectedIds([]);}}><Focus size={17}/>Character Focus</button></nav>
  {mode==="build"?<><RelationshipChallengeGame/><Achievements progress={progress.achievements}/></>:<>
   <section className={styles.exploreControls}><label>Character<select value={focus} onChange={event=>changeFocus(event.target.value)}>{unlockedCharacters.map(character=><option key={character.id} value={character.id}>{character.name}</option>)}</select></label>{mode==="explore"&&<><div><span>Relationship filters</span><div className={styles.segmented}>{families.map(item=><button key={item.id} className={family===item.id?styles.segmentActive:""} aria-pressed={family===item.id} onClick={()=>{setFamily(item.id);setSelectedIds([]);}}>{item.label}</button>)}</div></div><div><span>Network depth</span><div className={styles.segmented}>{depths.map(item=><button key={item.id} disabled={item.id==="whole"&&discovered.length<5} className={depth===item.id?styles.segmentActive:""} aria-pressed={depth===item.id} onClick={()=>{setDepth(item.id);setSelectedIds([]);}}>{item.label}</button>)}</div></div></>}</section>
   {mode==="focus"&&focusCharacter&&<section className={styles.focusSummary}><span className={styles.focusPortrait}>{focusCharacter.portrait&&<CharacterPortrait name={focusCharacter.name} portrait={focusCharacter.portrait} usage="medallion"/>}</span><div><p className="eyebrow">Character focus</p><h2>{focusCharacter.name}</h2><p>{characterRoleIsKnown(focusCharacter.id,progress)?focusCharacter.role:"Their story role is still unfolding."}</p></div><div className={styles.focusNumbers}><strong>{focusDiscovered.length}<small>discovered</small></strong><strong>{focusAvailable.length}<small>ready to learn</small></strong></div><button onClick={()=>setDepth(value=>value==="first"?"expanded":"first")}>{depth==="first"?"Expand network":"First degree"}</button></section>}
   <div className={`${styles.networkWorkspace} ${selected.length?styles.hasDetail:""}`}><section className={styles.networkPanel}>{shown.length||focus?<RelationshipGraph relationships={mode==="focus"?(depth==="first"?focusDiscovered:shown):shown} focusId={focus} depth={depth} unlockedCharacterNames={progress.unlockedCharacters} unlockedRelationshipIds={progress.unlockedRelationships} availableRelationshipIds={availableIds} selectedIds={selectedIds} onSelect={selectRelations} onFocus={changeFocus}/>:<p className="p-8">No discovered connections match this view.</p>}</section>{selected.length>0&&<RelationshipDetail relationships={selected} onClose={closeDetails}/>}</div>
   {!shown.length&&<p className={styles.emptyHint}>No relationship in this view has been discovered yet. Build a connection from an available story clue.</p>}
   <AvailableClues edges={mode==="focus"?focusAvailable:availableUndiscovered} onBuild={()=>setMode("build")}/>
   {future.length>0&&<p className={styles.futureHint}><LockKeyhole/> {future.length} more relationship clues will become available as the journey continues. <Link href="/journey/hanuman">Continue the journey →</Link></p>}
  </>}
 </div></main>;
}

function AvailableClues({edges,onBuild}:{edges:Relationship[];onBuild:()=>void}){if(!edges.length)return null;return <section className={styles.veiled}><div className={styles.veiledHeading}><div><p className="eyebrow">Ready to discover</p><h2>Relationship clues from your journey</h2></div><Lightbulb/></div><div>{edges.slice(0,6).map(edge=><article key={edge.id}><span className={styles.veiledMark}>?</span><span><strong>{nameFor(edge.fromCharacterId)} → {nameFor(edge.toCharacterId)}</strong><small>{edge.clue}</small></span></article>)}</div><p>{edges.length} {edges.length===1?"relationship is":"relationships are"} ready to learn. <button onClick={onBuild}>Build the network →</button></p></section>}
function Achievements({progress}:{progress:string[]}){return <section className={styles.achievementSection}><p className="eyebrow">Knowledge achievements</p><div className={styles.achievementGrid}>{relationshipAchievementDefinitions.map(item=><article key={item.name}><strong>{progress.includes(item.name)?"✦":"○"} {item.name}</strong><p>{item.description}</p></article>)}</div></section>}
function nameFor(id:string){return characters.find(character=>character.id===id)?.name??id;}
function RelationshipDetail({relationships,onClose}:{relationships:Relationship[];onClose:()=>void}){const first=relationships[0],from=characters.find(c=>c.id===first.fromCharacterId)!,to=characters.find(c=>c.id===first.toCharacterId)!,events=Array.from(new Set(relationships.map(item=>item.eventId))),sources=orderedSourceIds(Array.from(new Set(relationships.flatMap(item=>item.sources))));return <aside className={styles.detailPanel} aria-label="Relationship detail"><button className={styles.closeDetail} onClick={onClose} aria-label="Close relationship details"><X/></button><p className="eyebrow">Discovered connection</p><h2 tabIndex={-1}>{from.name} {first.directional?"→":"↔"} {to.name}</h2><div className={styles.detailSection}><span>Relationships</span><div className={styles.typeChips}>{relationships.map(item=><strong key={item.id}>{relationshipTypeLabels[item.type]}</strong>)}</div></div><div className={styles.detailSection}><span>Meaning</span>{relationships.map(item=><p key={item.id}>{from.name} {item.label} {to.name}.</p>)}</div><div className={styles.detailSection}><span>Discovered in</span>{events.map(event=>{const node=allJourneyNodes.find(item=>item.id===event);return node?<Link key={event} href={encounterHref(node.slug,"connections")}><BookOpen size={15}/>{event} · {node.title}</Link>:<p key={event}>{event}</p>;})}</div><div className={styles.detailSection}><span>Sources</span><div className={styles.sourceChips}>{sources.map(source=><strong key={source}>{source}</strong>)}</div></div><div className={styles.characterLinks}><Link href={`/characters/${from.id}`}>View {from.name}</Link><Link href={`/characters/${to.id}`}>View {to.name}</Link></div></aside>}
