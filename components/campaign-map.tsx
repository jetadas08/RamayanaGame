"use client";

import Image from "next/image";
import {useMemo,useState} from "react";
import {BookOpen,Check,ChevronRight,Compass,Info,LockKeyhole,MapPin,Mountain,Route,ShieldCheck,Sparkles,X} from "lucide-react";
import {CharacterPortrait} from "@/components/character-portrait";
import {JourneyMap} from "@/components/journey-map";
import {useProgress} from "@/components/progress-provider";
import {characters} from "@/data/discoveries";
import {journeyNodes} from "@/data/journey";
import {hanumanCampaign,hanumanCampaignChapterPositions,hanumanCampaignChapters,hanumanCampaignLandmarks,hanumanCampaignRoutes} from "@/data/hanuman-campaign";
import {correctAnswerCount,nodeMastery} from "@/lib/progress";
import type {CampaignChapter} from "@/lib/types";
import styles from "@/components/campaign-map.module.scss";

type ChapterState="locked"|"available"|"current"|"completed"|"mastered"|"planned";
const roman=["I","II","III","IV","V","VI","VII","VIII"];
const kandaLabels={kiskindha:"Kiṣkindhā Kāṇḍa",sundara:"Sundara Kāṇḍa",yuddha:"Yuddha Kāṇḍa"};
const chapterShort:Record<string,string>={
 "HC-01":"Hanumān meets Rāma and enters his mission.","HC-02":"The search turns south and Hanumān’s strength awakens.","HC-03":"The great leap and the tests on the way.","HC-04":"The hidden search reaches Sītā in Laṅkā.","HC-05":"The messenger confronts Laṅkā and returns.","HC-06":"Service continues through the war.","HC-07":"A healing mission reaches toward the mountains.","HC-08":"Return, fulfillment, and continuing service.",
};

function chapterState(chapter:CampaignChapter,completedIds:string[],currentId:string,answeredChallenges:Record<string,string>):ChapterState{
 if(chapter.status==="planned")return "planned";
 const nodes=chapter.playableNodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean);
 const complete=nodes.length>0&&nodes.every(node=>completedIds.includes(node.id));
 if(complete){const mastered=nodes.every(node=>nodeMastery({answeredChallenges},node).every(Boolean));return mastered?"mastered":"completed";}
 if(chapter.playableNodeIds.includes(currentId))return "current";
 const first=journeyNodes.findIndex(node=>node.id===chapter.playableNodeIds[0]),current=journeyNodes.findIndex(node=>node.id===currentId);
 return first<=current?"available":"locked";
}

function stateLabel(state:ChapterState){return state==="planned"?"Source review":state==="mastered"?"Mastered":state.charAt(0).toUpperCase()+state.slice(1);}

export function CampaignMap(){
 const {progress}=useProgress();
 const currentChapter=hanumanCampaignChapters.find(chapter=>chapter.playableNodeIds.includes(progress.currentNode))??hanumanCampaignChapters[4];
 const [selectedId,setSelectedId]=useState(currentChapter.id),[chapterMapId,setChapterMapId]=useState<string|null>(null),[accuracyOpen,setAccuracyOpen]=useState(false);
 const selected=hanumanCampaignChapters.find(chapter=>chapter.id===selectedId)??currentChapter;
 const hanuman=characters.find(character=>character.id==="hanuman");
 const stars=correctAnswerCount(progress),playableChapters=hanumanCampaignChapters.filter(chapter=>chapter.playableNodeIds.length>0).length;
 const states=useMemo(()=>Object.fromEntries(hanumanCampaignChapters.map(chapter=>[chapter.id,chapterState(chapter,progress.completedNodes,progress.currentNode,progress.answeredChallenges)])) as Record<string,ChapterState>,[progress.completedNodes,progress.currentNode,progress.answeredChallenges]);
 const selectedState=states[selected.id],selectedNodes=selected.playableNodeIds.map(id=>journeyNodes.find(node=>node.id===id)!).filter(Boolean),selectedComplete=selectedNodes.filter(node=>progress.completedNodes.includes(node.id)).length;
 const thumbnail=selectedNodes[0]?.scene.imageRevealed??"/images/campaign-map-atlas-v1.png";
 if(chapterMapId)return <JourneyMap chapterId={chapterMapId} onBack={()=>setChapterMapId(null)}/>;
 const canEnter=!(["planned","locked"] as ChapterState[]).includes(selectedState);
 return <main className={styles.page}>
  <header className={styles.heading}><div><p>Character campaign · Follow Hanumān</p><h1>{hanumanCampaign.title}</h1><span>{hanumanCampaign.subtitle}</span></div><div className={styles.compactProgress}><strong>{playableChapters}<small> / 8 chapters playable</small></strong><span>{progress.completedNodes.length} / {journeyNodes.length} encounters</span><span>{stars} / {journeyNodes.length*3} mastery stars</span></div></header>
  <section className={styles.shell}>
   <aside className={styles.chapterNav} aria-label="Follow Hanumān chapters"><div className={styles.navTitle}><Compass/><span><strong>Follow Hanumān</strong><small>Chapters of the journey</small></span></div><div className={styles.chapterList}>{hanumanCampaignChapters.map(chapter=>{const state=states[chapter.id];return <button key={chapter.id} type="button" data-state={state} aria-pressed={selected.id===chapter.id} onClick={()=>setSelectedId(chapter.id)}><b>{roman[chapter.number-1]}</b><span><strong>{chapter.title}</strong><small>{kandaLabels[chapter.kanda]}</small><em>{chapterShort[chapter.id]}</em></span><i>{state==="mastered"?<Sparkles/>:state==="completed"?<Check/>:state==="locked"?<LockKeyhole/>:state==="planned"?<BookOpen/>:<ChevronRight/>}</i></button>;})}</div></aside>
   <div className={styles.mapViewport}>
    <Image src="/images/campaign-map-atlas-v1.png" alt="Painted campaign atlas of India, the Himalayas, and Laṅkā" fill priority sizes="(max-width: 1250px) 100vw, calc(100vw - 360px)"/>
    <div className={styles.mapShade}/>
    <svg className={styles.routeLayer} viewBox="0 0 1000 560" aria-label="Campaign routes">
     <defs><marker id="campaign-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10L3 5Z"/></marker></defs>
     {hanumanCampaignRoutes.map(segment=>{const [x1,y1]=[segment.from[0]*10,segment.from[1]*5.6],[x2,y2]=[segment.to[0]*10,segment.to[1]*5.6],control=segment.control?[segment.control[0]*10,segment.control[1]*5.6]:[(x1+x2)/2,(y1+y2)/2];const state=states[segment.chapterId],selectedRoute=selected.id===segment.chapterId;return <path key={segment.id} data-state={state} data-route={segment.routeType} className={selectedRoute?styles.selectedRoute:undefined} d={`M ${x1} ${y1} Q ${control[0]} ${control[1]} ${x2} ${y2}`} markerEnd="url(#campaign-arrow)"/>;})}
    </svg>
    <div className={styles.mapLabels} aria-label="Campaign landmarks">{hanumanCampaignLandmarks.map(landmark=><button type="button" key={landmark.id} style={{left:`${landmark.x}%`,top:`${landmark.y}%`}} title={landmark.description} onClick={()=>setAccuracyOpen(true)} data-kind={landmark.kind}><span>{landmark.kind==="mountain"?<Mountain/>:<MapPin/>}</span><strong>{landmark.name}</strong></button>)}</div>
    <div className={styles.chapterMarkers}>{hanumanCampaignChapters.map(chapter=>{const point=hanumanCampaignChapterPositions[chapter.id],state=states[chapter.id];return <button type="button" key={chapter.id} style={{left:`${point.x}%`,top:`${point.y}%`}} data-state={state} aria-label={`Chapter ${roman[chapter.number-1]}: ${chapter.title}. ${stateLabel(state)}`} aria-pressed={selected.id===chapter.id} onClick={()=>setSelectedId(chapter.id)}><span>{point.label}</span></button>;})}</div>
    <button className={styles.accuracy} type="button" onClick={()=>setAccuracyOpen(true)}><Info/>Map accuracy</button>
    <div className={styles.legend}><strong>Map legend</strong><span><i data-symbol="chapter"/>Chapter region</span><span><i data-symbol="current"/>Current route</span><span><i data-symbol="complete"/>Completed route</span><span><i data-symbol="future"/>Future route</span></div>
    {hanuman?.portrait&&<aside className={styles.hanumanIdentity}><div><CharacterPortrait name={hanuman.name} portrait={hanuman.portrait} usage="detail"/></div><blockquote>“Service is the highest strength.”<small>Hanumān</small></blockquote></aside>}
    {accuracyOpen&&<aside className={styles.accuracyPanel}><button onClick={()=>setAccuracyOpen(false)} aria-label="Close map accuracy"><X/></button><p>Map accuracy</p><h2>Story geography, shown with care</h2><span>Markers orient the campaign without claiming equal certainty. Rāmeśvaram is a traditional transition landmark; the Sundara Kāṇḍa leap and later Yuddha Kāṇḍa Setu route remain separate.</span><ul>{hanumanCampaignLandmarks.map(item=><li key={item.id}><b>{item.name}</b><small>{item.description}</small></li>)}</ul></aside>}
    <article className={styles.infoCard} data-state={selectedState}><Image src={thumbnail} alt="" width={184} height={144}/><div><small>Chapter {roman[selected.number-1]}</small><h2>{selected.title}</h2><span>{kandaLabels[selected.kanda]}</span></div><p>{chapterShort[selected.id]}</p><div className={styles.chapterProgress}><span>{selected.playableNodeIds.length?`${selectedComplete} / ${selected.playableNodeIds.length} encounters`:`${stateLabel(selectedState)} · coming later`}</span><i><b style={{width:`${selected.playableNodeIds.length?selectedComplete/selected.playableNodeIds.length*100:0}%`}}/></i></div><button type="button" disabled={!canEnter} onClick={()=>canEnter&&setChapterMapId(selected.id)}>{selectedState==="completed"||selectedState==="mastered"?"Review Chapter":selectedState==="current"?"Continue Chapter":selectedState==="planned"?"Source review":"Enter Chapter"}<ChevronRight/></button></article>
   </div>
  </section>
  <footer className={styles.distinction}><Route/><p><strong>Two routes, two moments:</strong> Hanumān’s ocean leap belongs to Sundara Kāṇḍa. Rāma Setu appears only with the later Yuddha Kāṇḍa campaign route.</p><ShieldCheck/><span>Existing encounter progress preserved</span></footer>
 </main>;
}
