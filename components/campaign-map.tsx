"use client";
import {chapterStatus} from "@/lib/campaign-status";
import {finaleNodes} from "@/data/finale";

import {MissionChapterEntry} from "@/components/mission-chapter-entry";
import {HerbsMap} from "@/components/herbs-map";
import {herbsNodes} from "@/data/herbs";

import Image from "next/image";
import {useEffect,useMemo,useRef,useState} from "react";
import {Check,ChevronRight,Compass,Info,LockKeyhole,MapPin,Mountain,Route,Sparkles,X} from "lucide-react";
import {JourneyMap} from "@/components/journey-map";
import {SearchMap} from "@/components/search-map";
import {CrossingMap} from "@/components/crossing-map";
import {useProgress} from "@/components/progress-provider";
import {journeyNodes as legacyNodes} from "@/data/journey";
import {meetingNodes} from "@/data/meeting";
import {searchNodes} from "@/data/search";
import {WarMap} from "@/components/war-map";

import {MeetingMap} from "@/components/meeting-map";
import {warNodes} from "@/data/war";
const journeyNodes=[...meetingNodes,...searchNodes,...legacyNodes,...warNodes,...herbsNodes,...finaleNodes];
import {hanumanCampaign,hanumanCampaignChapterPositions,hanumanCampaignChapters,hanumanCampaignLandmarks,hanumanCampaignRoutes} from "@/data/hanuman-campaign";
import {correctAnswerCount} from "@/lib/progress";
import type {CampaignChapter} from "@/lib/types";
import styles from "@/components/campaign-map.module.scss";

type ChapterState="locked"|"available"|"current"|"completed"|"mastered";
const roman=["I","II","III","IV","V","VI","VII","VIII"];
const kandaLabels={kiskindha:"Kiṣkindhā Kāṇḍa",sundara:"Sundara Kāṇḍa",yuddha:"Yuddha Kāṇḍa"};
const chapterShort:Record<string,string>={
 "HC-01":"Hanumān meets Rāma and enters his mission.","HC-02":"The search turns south and Hanumān’s strength awakens.","HC-03":"The great leap and the tests on the way.","HC-04":"The hidden search reaches Sītā in Laṅkā.","HC-05":"The messenger confronts Laṅkā and returns.","HC-06":"Service continues through the war.","HC-07":"A healing mission reaches toward the mountains.","HC-08":"Return, fulfillment, and continuing service.",
};

function chapterState(chapter:CampaignChapter,progress:ReturnType<typeof useProgress>["progress"]):ChapterState{
 const status=chapterStatus(chapter,progress);
 return status==="In Progress"?"current":status==="Complete"?"completed":status.toLowerCase() as ChapterState;
}

function stateLabel(state:ChapterState){return state==="current"?"In Progress":state==="completed"?"Complete":state==="mastered"?"Mastered":state.charAt(0).toUpperCase()+state.slice(1);}

export function CampaignMap(){
 const {progress,hydrated}=useProgress();
 const currentChapter=hanumanCampaignChapters.find(chapter=>chapter.playableNodeIds.includes(progress.currentNode))??hanumanCampaignChapters[1];
 const [selectedId,setSelectedId]=useState<string|null>(null),[chapterMapId,setChapterMapId]=useState<string|null>(null),[accuracyTarget,setAccuracyTarget]=useState<string|null>(null);
 const mapScrollerRef=useRef<HTMLDivElement>(null);
 const selected=hanumanCampaignChapters.find(chapter=>chapter.id===selectedId)??currentChapter;
 const activeLandmark=hanumanCampaignLandmarks.find(landmark=>landmark.id===accuracyTarget);
 const [legendOpen,setLegendOpen]=useState(false);
 const stars=correctAnswerCount(progress),playableChapters=hanumanCampaignChapters.filter(chapter=>chapter.playableNodeIds.length>0).length;
 const states=useMemo(()=>Object.fromEntries(hanumanCampaignChapters.map(chapter=>[chapter.id,chapterState(chapter,progress)])) as Record<string,ChapterState>,[progress]);
 const allCompleted=[...progress.meetingCompletedNodes,...progress.searchCompletedNodes,...progress.completedNodes,...progress.warCompletedNodes,...progress.finaleCompletedNodes,...progress.herbsCompletedNodes];
 const selectedState=states[selected.id],selectedNodes=selected.playableNodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean),selectedComplete=selectedNodes.filter(node=>allCompleted.includes(node.id)).length;
 const thumbnail=selectedNodes[0]?.scene.imageRevealed??"/images/campaign-map-atlas-v1.png";
 function centerChapter(id:string,explicit=true){setSelectedId(id);const scroller=mapScrollerRef.current;if(!scroller||!window.matchMedia("(max-width: 760px)").matches)return;const point=hanumanCampaignChapterPositions[id];window.requestAnimationFrame(()=>{const target=point.x/100*scroller.scrollWidth-scroller.clientWidth/2;scroller.scrollTo({left:Math.max(0,target),behavior:explicit&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches?"smooth":"auto"});});}
 useEffect(()=>{if(hydrated)centerChapter(currentChapter.id,false);},[hydrated,currentChapter.id]);
 if(!hydrated)return <main className={styles.page} aria-busy="true"><header className={styles.heading}><div><p>The living journey</p><h1>Restoring your campaign map</h1><span>Loading saved chapter and encounter progress.</span></div></header></main>;
 if(chapterMapId==="HC-06")return <WarMap onBack={()=>setChapterMapId(null)}/>;
 if(chapterMapId==="HC-07")return <HerbsMap onBack={()=>setChapterMapId(null)}/>;
 if(chapterMapId==="HC-08")return <MissionChapterEntry/>;
 if(chapterMapId==="HC-01")return <MeetingMap onBack={()=>setChapterMapId(null)}/>;
 if(chapterMapId==="HC-02")return <SearchMap onBack={()=>setChapterMapId(null)}/>;
 if(chapterMapId==="HC-03")return <CrossingMap onBack={()=>setChapterMapId(null)}/>;
 if(chapterMapId)return <JourneyMap chapterId={chapterMapId} onBack={()=>setChapterMapId(null)}/>;
 const canEnter=selectedState!=="locked";
 return <main className={styles.page}>
  <header className={styles.heading}><div><p>The living journey</p><h1>{hanumanCampaign.title}</h1><span>{hanumanCampaign.subtitle}</span></div><div className={styles.compactProgress}><strong>{playableChapters}<small> / {hanumanCampaignChapters.length} chapters playable</small></strong><span>{allCompleted.length} / {journeyNodes.length} encounters</span><span>{stars} / {journeyNodes.length*3} mastery stars</span></div></header>
  <section className={styles.shell}>
   <aside className={styles.chapterNav} aria-label="Follow Hanumān chapters"><div className={styles.navTitle}><Compass/><span><strong>Chapters · {hanumanCampaignChapters.length}</strong><small>Choose a chapter to explore</small></span></div><label className={styles.chapterSelect}>Choose chapter<select value={selected.id} onChange={event=>centerChapter(event.target.value)}>{hanumanCampaignChapters.map(chapter=><option key={chapter.id} value={chapter.id}>{roman[chapter.number-1]} · {chapter.title} — {chapterStatus(chapter,progress)}</option>)}</select></label><div className={styles.chapterList}>{hanumanCampaignChapters.map(chapter=>{const state=states[chapter.id];return <button key={chapter.id} type="button" data-state={state} aria-pressed={selected.id===chapter.id} onClick={()=>centerChapter(chapter.id)}><b>{roman[chapter.number-1]}</b><span><strong>{chapter.title}</strong><small>{kandaLabels[chapter.kanda]}</small><em>{chapterStatus(chapter,progress)} · {chapter.playableNodeIds.filter(id=>allCompleted.includes(id)).length}/{chapter.playableNodeIds.length} complete</em></span><i>{state==="mastered"?<Sparkles/>:state==="completed"?<Check/>:state==="locked"?<LockKeyhole/>:<ChevronRight/>}</i></button>;})}</div></aside>
   <div className={styles.mapViewport}><div className={styles.mapScroller} ref={mapScrollerRef} tabIndex={0} aria-label="Campaign map. Scroll horizontally on smaller screens."><div className={styles.mapCanvas}>
    <Image src="/images/campaign-map-atlas-v1.png" alt="Painted campaign atlas of India, the Himalayas, and Laṅkā" fill priority sizes="(max-width: 1250px) 100vw, calc(100vw - 360px)"/>
    <div className={styles.mapShade}/>
    <svg className={styles.routeLayer} viewBox="0 0 1000 560" aria-label="Campaign routes">
     <defs><marker id="campaign-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10L3 5Z"/></marker></defs>
     {hanumanCampaignRoutes.map(segment=>{const [x1,y1]=[segment.from[0]*10,segment.from[1]*5.6],[x2,y2]=[segment.to[0]*10,segment.to[1]*5.6],control=segment.control?[segment.control[0]*10,segment.control[1]*5.6]:[(x1+x2)/2,(y1+y2)/2];const state=states[segment.chapterId],selectedRoute=selected.id===segment.chapterId;return <path key={segment.id} data-state={state} data-route={segment.routeType} className={selectedRoute?styles.selectedRoute:undefined} d={`M ${x1} ${y1} Q ${control[0]} ${control[1]} ${x2} ${y2}`} markerEnd="url(#campaign-arrow)"/>;})}
    </svg>
    <div className={styles.mapLabels} aria-label="Campaign landmarks">{hanumanCampaignLandmarks.map(landmark=><button type="button" key={landmark.id} style={{left:`${landmark.x}%`,top:`${landmark.y}%`}} title={`About ${landmark.name}`} aria-expanded={accuracyTarget===landmark.id} onClick={()=>setAccuracyTarget(landmark.id)} data-landmark={landmark.id} data-kind={landmark.kind}><span>{landmark.kind==="mountain"?<Mountain/>:<MapPin/>}</span><strong>{landmark.name}</strong></button>)}</div>
    <div className={styles.chapterMarkers}>{hanumanCampaignChapters.map(chapter=>{const point=hanumanCampaignChapterPositions[chapter.id],state=states[chapter.id];return <button type="button" key={chapter.id} style={{left:`${point.x}%`,top:`${point.y}%`}} data-state={state} aria-label={`Chapter ${roman[chapter.number-1]}: ${chapter.title}. ${chapterStatus(chapter,progress)}`} aria-pressed={selected.id===chapter.id} onClick={()=>centerChapter(chapter.id)}><span>{point.label}</span></button>;})}</div>
    <button className={styles.accuracy} type="button" onClick={()=>setAccuracyTarget("overview")}><Info/>Map accuracy</button>
    <button className={styles.legendToggle} aria-expanded={legendOpen} onClick={()=>setLegendOpen(!legendOpen)}>Legend</button>{legendOpen&&<div className={styles.legend}><strong>Map legend</strong><span><i data-symbol="chapter"/>Chapter region</span><span><i data-symbol="current"/>Current route</span><span><i data-symbol="complete"/>Completed route</span><span><i data-symbol="future"/>Future route</span></div>}
    {accuracyTarget&&<aside className={styles.accuracyPanel} aria-label={activeLandmark?`About ${activeLandmark.name}`:"Map accuracy"}><button onClick={()=>setAccuracyTarget(null)} aria-label="Close map accuracy"><X/></button><p>{activeLandmark?"Why here?":"Map accuracy"}</p><h2>{activeLandmark?.name??"Story geography, shown with care"}</h2><span>{activeLandmark?.description??"Markers orient the campaign without claiming equal certainty. Textual locations, traditional identifications, and modern geography are distinguished. Select a named location to learn why it appears here. Hanumān’s Sundara Kāṇḍa leap and the later Yuddha Kāṇḍa Setu route remain separate."}</span></aside>}
    </div></div><article className={styles.infoCard} data-state={selectedState}><Image src={thumbnail} alt="" width={184} height={144}/><div><small>Chapter {roman[selected.number-1]}</small><h2>{selected.title}</h2><span>{kandaLabels[selected.kanda]}</span></div><p>{chapterShort[selected.id]}</p><div className={styles.chapterProgress}><span>{selectedComplete} / {selected.playableNodeIds.length} encounters · {stateLabel(selectedState)}</span><i><b style={{width:`${selected.playableNodeIds.length?selectedComplete/selected.playableNodeIds.length*100:0}%`}}/></i></div><button type="button" disabled={!canEnter} onClick={()=>canEnter&&setChapterMapId(selected.id)}>{selectedState==="completed"||selectedState==="mastered"?"Review Chapter":selectedState==="current"?"Continue journey":selectedState==="locked"?"Chapter locked":"Enter Chapter"}<ChevronRight/></button></article>
   </div>
  </section>
  <footer className={styles.distinction}><Route/><p><strong>Two routes, two moments:</strong> Hanumān’s ocean leap belongs to Sundara Kāṇḍa. Rāma Setu appears only with the later Yuddha Kāṇḍa campaign route.</p></footer>
 </main>;
}
