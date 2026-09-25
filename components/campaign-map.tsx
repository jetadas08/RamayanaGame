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
import {hanumanCampaign,hanumanCampaignChapterPositions,hanumanCampaignChapters,hanumanCampaignCompanionStoryStates,hanumanCampaignLandmarks,hanumanCampaignRoutes} from "@/data/hanuman-campaign";
import {correctAnswerCount} from "@/lib/progress";
import type {CampaignChapter} from "@/lib/types";
import styles from "@/components/campaign-map.module.scss";
import {JourneyCompanion} from "@/components/journey-companion";
import {useCampaignCompanion} from "@/components/use-campaign-companion";

type ChapterState="locked"|"available"|"current"|"completed"|"mastered";
const roman=["I","II","III","IV","V","VI","VII","VIII"];
const kandaLabels={kiskindha:"Kiṣkindhā Kāṇḍa",sundara:"Sundara Kāṇḍa",yuddha:"Yuddha Kāṇḍa"};
const chapterShort:Record<string,string>={
 "HC-01":"Hanumān meets Rāma and enters his mission.","HC-02":"The search turns south and Hanumān’s strength awakens.","HC-03":"The great leap and the tests on the way.","HC-04":"The hidden search reaches Sītā in Laṅkā.","HC-05":"The messenger confronts Laṅkā and returns.","HC-06":"Service continues through the war.","HC-07":"A healing mission reaches toward the mountains.","HC-08":"Return, fulfillment, and continuing service.",
};

function chapterState(chapter:CampaignChapter,progress:ReturnType<typeof useProgress>["progress"]):ChapterState{
 const status=chapterStatus(chapter,progress);
 return status==="Current"||status==="In Progress"?"current":status==="Complete"?"completed":status.toLowerCase() as ChapterState;
}

function stateLabel(state:ChapterState){return state==="current"?"Current":state==="completed"?"Complete":state==="mastered"?"Mastered":state.charAt(0).toUpperCase()+state.slice(1);}

export function CampaignMap(){
 const {progress,hydrated}=useProgress();
 const currentChapter=hanumanCampaignChapters.find(chapter=>chapter.playableNodeIds.includes(progress.currentNode))??hanumanCampaignChapters[1];
 const campaignCompanion=useCampaignCompanion();
 const [selectedId,setSelectedId]=useState<string|null>(null),[chapterMapId,setChapterMapId]=useState<string|null>(null),[accuracyTarget,setAccuracyTarget]=useState<string|null>(null),[mobileMap,setMobileMap]=useState(false);
 const mapScrollerRef=useRef<HTMLDivElement>(null);
 const accuracyHeadingRef=useRef<HTMLHeadingElement>(null),accuracyTriggerRef=useRef<HTMLElement|null>(null);
 function openAccuracy(target:string){accuracyTriggerRef.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setAccuracyTarget(target);}
 function closeAccuracy(){setAccuracyTarget(null);requestAnimationFrame(()=>accuracyTriggerRef.current?.focus());}
 useEffect(()=>{if(accuracyTarget)requestAnimationFrame(()=>accuracyHeadingRef.current?.focus());},[accuracyTarget]);
 const selected=hanumanCampaignChapters.find(chapter=>chapter.id===selectedId)??currentChapter;
 const activeLandmark=hanumanCampaignLandmarks.find(landmark=>landmark.id===accuracyTarget);
 const [legendOpen,setLegendOpen]=useState(false);
 const stars=correctAnswerCount(progress),playableChapters=hanumanCampaignChapters.filter(chapter=>chapter.playableNodeIds.length>0).length;
 const states=useMemo(()=>Object.fromEntries(hanumanCampaignChapters.map(chapter=>[chapter.id,chapterState(chapter,progress)])) as Record<string,ChapterState>,[progress]);
 const allCompleted=[...progress.meetingCompletedNodes,...progress.searchCompletedNodes,...progress.completedNodes,...progress.warCompletedNodes,...progress.finaleCompletedNodes,...progress.herbsCompletedNodes];
 const selectedState=states[selected.id],selectedNodes=selected.playableNodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean),selectedComplete=selectedNodes.filter(node=>allCompleted.includes(node.id)).length;
 const thumbnail=selectedNodes[0]?.scene.imageRevealed??"/images/campaign-map-atlas-v1.png";
 const companionAnchor=campaignCompanion.currentState,previousAnchor=campaignCompanion.previousState,nextAnchor=campaignCompanion.nextState;
 const companionPoint=mobileMap?(companionAnchor.mobilePoint??companionAnchor.point):companionAnchor.point,previousPoint=previousAnchor?(mobileMap?(previousAnchor.mobilePoint??previousAnchor.point):previousAnchor.point):undefined,nextPoint=nextAnchor?(mobileMap?(nextAnchor.mobilePoint??nextAnchor.point):nextAnchor.point):undefined;
 const travelControl=mobileMap?{x:companionAnchor.approachControl.x+.4,y:companionAnchor.approachControl.y+.5}:companionAnchor.approachControl;
 const currentStoryIndex=hanumanCampaignCompanionStoryStates.findIndex(state=>state.stateId===companionAnchor.stateId);
 const reachedStoryStates=hanumanCampaignCompanionStoryStates.slice(0,currentStoryIndex+1);
 const activeMilestoneTrail=reachedStoryStates.flatMap((state,index)=>index>0&&state.chapterId===currentChapter.id&&state.stateId!=="search-departs-kishkindha"?[{from:reachedStoryStates[index-1],to:state}]:[]);
 function closeChapterMap(){setChapterMapId(null);window.history.replaceState({},"","/journey/hanuman");}
 function centerChapter(id:string,explicit=true){setSelectedId(id);const scroller=mapScrollerRef.current;if(!scroller||!window.matchMedia("(max-width: 760px)").matches)return;const point=hanumanCampaignChapterPositions[id];window.requestAnimationFrame(()=>{const target=point.x/100*scroller.scrollWidth-scroller.clientWidth/2;scroller.scrollTo({left:Math.max(0,target),behavior:explicit&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches?"smooth":"auto"});});}
 function openChapterFromMarker(id:string){setSelectedId(id);if(states[id]!=="locked")setChapterMapId(id);else centerChapter(id);}
 useEffect(()=>{if(!hydrated)return;const requested=new URLSearchParams(window.location.search).get("chapter");if(requested&&hanumanCampaignChapters.some(chapter=>chapter.id===requested)){setSelectedId(requested);setChapterMapId(requested);return;}centerChapter(currentChapter.id,false);},[hydrated,currentChapter.id]);
 useEffect(()=>{const query=window.matchMedia("(max-width: 560px)"),update=()=>setMobileMap(query.matches);update();query.addEventListener("change",update);return()=>query.removeEventListener("change",update);},[]);
 useEffect(()=>{if(!hydrated)return;const frame=requestAnimationFrame(()=>{const heading=document.querySelector<HTMLElement>("main h1,[role='main'] h1");if(!heading)return;document.title=`${heading.textContent?.trim()||"Follow Hanumān"} | Rāmāyaṇa`;heading.tabIndex=-1;heading.focus({preventScroll:true});});return()=>cancelAnimationFrame(frame);},[chapterMapId,hydrated]);
 if(!hydrated)return <main className={styles.page} aria-busy="true"><header className={styles.heading}><div><p>The living journey</p><h1>Restoring your campaign map</h1><span>Loading saved chapter and encounter progress.</span></div></header></main>;
 if(chapterMapId==="HC-06")return <WarMap onBack={closeChapterMap}/>;
 if(chapterMapId==="HC-07")return <HerbsMap onBack={closeChapterMap}/>;
 if(chapterMapId==="HC-08")return <MissionChapterEntry/>;
 if(chapterMapId==="HC-01")return <MeetingMap onBack={closeChapterMap}/>;
 if(chapterMapId==="HC-02")return <SearchMap onBack={closeChapterMap}/>;
 if(chapterMapId==="HC-03")return <CrossingMap onBack={closeChapterMap}/>;
 if(chapterMapId)return <JourneyMap chapterId={chapterMapId} onBack={closeChapterMap}/>;
 const canEnter=selectedState!=="locked";
 return <main className={styles.page}>
  <header className={styles.heading}><div><p>Map · Where the journey moves</p><h1>{hanumanCampaign.title}</h1><span>Select a chapter region, then enter its encounter map.</span></div><div className={styles.compactProgress}><strong>{playableChapters}<small> / {hanumanCampaignChapters.length} chapters playable</small></strong><span>{allCompleted.length} / {journeyNodes.length} encounters</span><span>{stars} / {journeyNodes.length*3} mastery stars</span></div></header>
  <section className={styles.shell}>
   <aside className={styles.chapterNav} aria-label="Follow Hanumān chapters"><div className={styles.navTitle}><Compass/><span><strong>Campaign atlas</strong><small>Choose a chapter to see where it unfolds</small></span></div><label className={styles.chapterSelect}>Choose chapter<select value={selected.id} onChange={event=>centerChapter(event.target.value)}>{hanumanCampaignChapters.map(chapter=><option key={chapter.id} value={chapter.id}>{roman[chapter.number-1]} · {chapter.title} — {chapterStatus(chapter,progress)}</option>)}</select></label><div className={styles.mobileChapterAction}><div><small>Chapter {roman[selected.number-1]} · {stateLabel(selectedState)}</small><strong>{selected.title}</strong></div><button type="button" disabled={!canEnter} onClick={()=>setChapterMapId(selected.id)}>{canEnter?selectedState==="completed"||selectedState==="mastered"?"Review":"Enter":"Locked"}<ChevronRight aria-hidden="true"/></button></div><div className={styles.chapterList}>{hanumanCampaignChapters.map(chapter=>{const state=states[chapter.id];return <button key={chapter.id} type="button" data-state={state} aria-pressed={selected.id===chapter.id} onClick={()=>centerChapter(chapter.id)}><b>{roman[chapter.number-1]}</b><span><strong>{chapter.title}</strong><small>{kandaLabels[chapter.kanda]}</small><em>{chapterStatus(chapter,progress)} · {chapter.playableNodeIds.filter(id=>allCompleted.includes(id)).length}/{chapter.playableNodeIds.length} complete</em></span><i>{state==="mastered"?<Sparkles/>:state==="completed"?<Check/>:state==="locked"?<LockKeyhole/>:<ChevronRight/>}</i></button>;})}</div></aside>
   <div className={styles.mapViewport}><div className={styles.mapScroller} ref={mapScrollerRef} tabIndex={0} aria-label="Campaign map. Scroll horizontally on smaller screens."><div className={styles.mapCanvas}>
    <Image src="/images/campaign-map-atlas-v1.png" alt="Painted campaign atlas of India, the Himalayas, and Laṅkā" fill priority sizes="(max-width: 1250px) 100vw, calc(100vw - 360px)"/>
    <div className={styles.mapShade} data-traveling={campaignCompanion.animate}/>
    <svg className={styles.routeLayer} viewBox="0 0 1000 560" aria-hidden="true">
     <defs><marker id="campaign-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10L3 5Z"/></marker></defs>
     {hanumanCampaignRoutes.map(segment=>{const [x1,y1]=[segment.from[0]*10,segment.from[1]*5.6],[x2,y2]=[segment.to[0]*10,segment.to[1]*5.6],control=segment.control?[segment.control[0]*10,segment.control[1]*5.6]:[(x1+x2)/2,(y1+y2)/2],state=states[segment.chapterId];if(state!=="completed"&&state!=="mastered")return null;return <path key={segment.id} data-state={state} data-route={segment.routeType} data-segment={segment.id} d={`M ${x1} ${y1} Q ${control[0]} ${control[1]} ${x2} ${y2}`} markerEnd="url(#campaign-arrow)"/>;})}
     {activeMilestoneTrail.map(({from,to})=>{const start=mobileMap?(from.mobilePoint??from.point):from.point,end=mobileMap?(to.mobilePoint??to.point):to.point,control=mobileMap?{x:to.approachControl.x+.4,y:to.approachControl.y+.5}:to.approachControl,arrival={x:end.x+to.arrivalOffset.x,y:end.y+to.arrivalOffset.y};return <path key={`milestone-${to.stateId}`} className={styles.milestoneRoute} data-route={to.movementPreset} data-travel-active={campaignCompanion.animate&&to.stateId===companionAnchor.stateId} d={`M ${start.x*10} ${start.y*5.6} C ${control.x*10} ${control.y*5.6}, ${arrival.x*10} ${arrival.y*5.6}, ${end.x*10} ${end.y*5.6}`} markerEnd="url(#campaign-arrow)"/>;})}
    </svg>
    <div className={styles.mapLabels} aria-label="Campaign landmarks">{hanumanCampaignLandmarks.map(landmark=><button type="button" key={landmark.id} style={{left:`${landmark.x}%`,top:`${landmark.y}%`}} title={`About ${landmark.name}`} aria-expanded={accuracyTarget===landmark.id} onClick={()=>openAccuracy(landmark.id)} data-landmark={landmark.id} data-kind={landmark.kind}><span>{landmark.kind==="mountain"?<Mountain/>:<MapPin/>}</span><strong>{landmark.name}</strong></button>)}</div>
    <div className={styles.chapterMarkers}>{hanumanCampaignChapters.map(chapter=>{const point=hanumanCampaignChapterPositions[chapter.id],state=states[chapter.id],opens=state!=="locked";return <button type="button" key={chapter.id} style={{left:`${point.x}%`,top:`${point.y}%`}} data-state={state} data-action={opens?"open":"select"} data-destination={campaignCompanion.animate&&chapter.id===currentChapter.id} aria-label={`${opens?"Open":"Select"} Chapter ${roman[chapter.number-1]}: ${chapter.title}. ${chapterStatus(chapter,progress)}`} aria-pressed={selected.id===chapter.id} onClick={()=>openChapterFromMarker(chapter.id)}><span>{point.label}</span></button>;})}</div>
    <JourneyCompanion companionId="hanuman" current={companionPoint} previous={previousPoint} next={nextPoint} travelControl={travelControl} arrivalOffset={companionAnchor.arrivalOffset} restingFacing={companionAnchor.facing} ground={companionAnchor.ground} animate={campaignCompanion.animate} eventKey={campaignCompanion.pending?.id} movementPreset={campaignCompanion.pending?.movementPreset??companionAnchor.movementPreset} macro routeOffset={0} restingState={progress.campaignComplete?"campaign-complete":"resting"} onSettled={campaignCompanion.settle}/>
    <button className={styles.accuracy} type="button" onClick={()=>openAccuracy("overview")}><Info/>Map accuracy</button>
    <button className={styles.legendToggle} aria-expanded={legendOpen} onClick={()=>setLegendOpen(!legendOpen)}>Map key</button>{legendOpen&&<div className={styles.legend}><strong>Map key</strong><span><i data-symbol="chapter"/>Chapter region</span><span><i data-symbol="current"/>Current route</span><span><i data-symbol="complete"/>Completed route</span><span><i data-symbol="future"/>Future route</span></div>}
    {accuracyTarget&&<aside className={styles.accuracyPanel} aria-label={activeLandmark?`About ${activeLandmark.name}`:"Map accuracy"}><button onClick={closeAccuracy} aria-label="Close map accuracy"><X/></button><p>{activeLandmark?"Why here?":"Map accuracy"}</p><h2 ref={accuracyHeadingRef} tabIndex={-1}>{activeLandmark?.name??"Story geography, shown with care"}</h2><span>{activeLandmark?.description??"Markers orient the campaign without claiming equal certainty. Textual locations, traditional identifications, and modern geography are distinguished. Select a named location to learn why it appears here. Hanumān’s Sundara Kāṇḍa leap and the later Yuddha Kāṇḍa Setu route remain separate."}</span></aside>}
    </div></div><article className={styles.infoCard} data-state={selectedState}><Image src={thumbnail} alt="" width={184} height={144}/><div><small>Chapter {roman[selected.number-1]}</small><h2>{selected.title}</h2><span>{kandaLabels[selected.kanda]}</span></div><p>{chapterShort[selected.id]}</p><div className={styles.chapterProgress}><span>{selectedComplete} / {selected.playableNodeIds.length} encounters · {stateLabel(selectedState)}</span><i><b style={{width:`${selected.playableNodeIds.length?selectedComplete/selected.playableNodeIds.length*100:0}%`}}/></i></div><button type="button" disabled={!canEnter} onClick={()=>canEnter&&setChapterMapId(selected.id)}>{selectedState==="completed"||selectedState==="mastered"?"Review Chapter":selectedState==="current"?"Continue journey":selectedState==="locked"?"Chapter locked":"Enter Chapter"}<ChevronRight/></button></article>
   </div>
  </section>
  <footer className={styles.distinction}><Route/><p><strong>Two routes, two moments:</strong> Hanumān’s ocean leap belongs to Sundara Kāṇḍa. Rāma Setu appears only with the later Yuddha Kāṇḍa campaign route.</p></footer>
 </main>;
}
