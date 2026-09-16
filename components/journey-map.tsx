"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Compass, Mountain, Bird, Flame, Crown, Flower2, Swords, Shell, Waves, Footprints, Gem, Mail, House, Users, Wind, ZoomIn, ZoomOut, Star, Info, X, Share2, Route, Maximize2, MoveHorizontal } from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import countries from "world-atlas/countries-50m.json";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import { journeyNodes } from "@/data/journey";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { useProgress } from "@/components/progress-provider";
import { nodeMastery } from "@/lib/progress";
import {CharacterPortrait} from "@/components/character-portrait";
import {characters} from "@/data/discoveries";
import {characterNameById} from "@/data/character-ids";
import {relationshipTypeLabels,relationships} from "@/data/relationships";

const icons = [Users, Bird, Shell, Footprints, Mountain, Shell, Waves, House, Gem, Flower2, Mail, Swords, Crown, Flame, Wind];
// Story-layout coordinates: calibrated to ensure distinct pin separation and no badge collisions
const storyPositions = [
  [260, 330], // HJ-01 The Shore of Decision
  [225, 420], // HJ-02 Sampāti
  [435, 275], // HJ-03 Jāmbavān Reminds Hanumān (offset north-east to completely clear HJ-01)
  [335, 435], // HJ-04 The Leap
  [430, 485], // HJ-05 Maināka
  [520, 470], // HJ-06 Surasā
  [605, 445], // HJ-07 Siṃhikā
  [670, 365], // HJ-08 Laṅkinī
  [790, 385], // HJ-09 Vibhīṣaṇa
  [0, 0],     // HJ-10 Sītā (anchored dynamically to Seetha Eliya)
  [855, 595], // HJ-11 The Ring and the Message (separated from Sītā)
  [660, 630], // HJ-12 Battle in Aśoka Vātikā
  [850, 455], // HJ-13 Rāvaṇa's Court
  [790, 685], // HJ-14 Burning of Laṅkā
  [520, 235], // HJ-15 Return to Rāma
];
type ActiveReveal={kind:"character";name:string}|{kind:"relationship";id:string}|{kind:"route"}|{kind:"complete"};

export function JourneyMap() {
  const { progress,pendingMapUnlocks,acknowledgeMapUnlock } = useProgress();
  const [selection, setSelection] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const [fitOverview, setFitOverview] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [accuracyOpen,setAccuracyOpen]=useState(false);
  const [activeReveal,setActiveReveal]=useState<ActiveReveal|null>(null);
  const pendingReveal=pendingMapUnlocks[0];
  const selected = journeyNodes.find(n => n.id === (selection ?? progress.currentNode)) ?? journeyNodes[0];
  const available = journeyNodes.findIndex(n => n.id === progress.currentNode);
  const beginCue = progress.completedNodes.length === 0;
  const map = useMemo(() => {
    const projection = geoMercator().center([79.05,8.55]).scale(6900).translate([500,360]);
    const topology = countries as unknown as Topology;
    const land = feature(topology, topology.objects.countries as GeometryCollection) as unknown as FeatureCollection<Geometry>;
    const landPath = geoPath(projection)({...land, features: land.features.filter(f => ["144","356"].includes(String(f.id)))}) ?? "";
    const project = (point: [number, number]) => projection(point)!.map(value => Number(value.toFixed(2)));
    const sita = project([80.804,6.936]);
    const rameswaram = project([79.313,9.288]);
    const points = storyPositions.map(p => [...p]);
    points[9] = sita;
    const bridge = [[79.42,9.17],[79.58,9.1],[79.73,9.1],[79.86,9.08]].map(p => project([p[0],p[1]]));
    return {landPath, points, sita, rameswaram, bridge: bridge.map((p,i) => `${i?"L":"M"} ${p[0]} ${p[1]}`).join(" ")};
  }, []);

  useEffect(()=>{
    if(!pendingReveal)return;
    setSelection(pendingReveal.nodeId);
    const sequence:ActiveReveal[]=[...pendingReveal.characterNames.map(name=>({kind:"character" as const,name})),...pendingReveal.relationshipIds.map(id=>({kind:"relationship" as const,id})),...(pendingReveal.nextNodeId?[{kind:"route" as const}]:[{kind:"complete" as const}])];
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,duration=reduced?220:850;
    setActiveReveal(sequence[0]??null);
    const timers=sequence.slice(1).map((item,index)=>window.setTimeout(()=>setActiveReveal(item),duration*(index+1)));
    const finish=window.setTimeout(()=>{setActiveReveal(null);acknowledgeMapUnlock(pendingReveal.id);},duration*Math.max(sequence.length,1));
    return()=>{timers.forEach(window.clearTimeout);window.clearTimeout(finish);};
  },[pendingReveal,acknowledgeMapUnlock]);
  function chooseNode(id:string){setSelection(id);}
  const revealNode=pendingReveal&&journeyNodes.find(node=>node.id===pendingReveal.nodeId);
  const revealPoint=revealNode?map.points[revealNode.number-1]:undefined;
  const revealCharacter=activeReveal?.kind==="character"?characters.find(character=>character.name===activeReveal.name):undefined;
  const revealRelationship=activeReveal?.kind==="relationship"?relationships.find(relationship=>relationship.id===activeReveal.id):undefined;
  const journeyComplete=progress.completedNodes.length===journeyNodes.length;
  const progressPercent=Math.round(progress.completedNodes.length/journeyNodes.length*100);
  const currentNode=journeyNodes[available]??journeyNodes[0];
  const hanuman=characters.find(character=>character.id==="hanuman");
  const rama=characters.find(character=>character.id==="rama");

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const activeNodeId = selection ?? progress.currentNode;
    const activeNodeObj = journeyNodes.find(n => n.id === activeNodeId) ?? journeyNodes[0];
    const point = map.points[activeNodeObj.number - 1];
    if (!point) return;
    if (container.scrollWidth > container.clientWidth) {
      const targetX = (point[0] / 1000) * container.scrollWidth;
      const scrollPos = Math.max(0, targetX - container.clientWidth / 2);
      container.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, [selection, progress.currentNode, map.points]);

  return <div className="atlas-page">
    <div className="atlas-heading"><div><p className="eyebrow">Devotion · Courage · A higher purpose</p><h1>Hanumān Journey Map</h1><p>A passage through the epic, across sea and sacred memory.</p></div><div className={`atlas-heading-progress ${journeyComplete?"is-complete":""}`}><div className="atlas-progress-seal" style={{"--journey-progress":`${progressPercent*3.6}deg`} as React.CSSProperties}><Compass size={26}/></div><span><small>Journey progress</small>{progress.completedNodes.length}<small> / 15 discovered</small><b className="atlas-progress-line"><i style={{width:`${progressPercent}%`}}/></b><em>{journeyComplete?"Journey complete":`${currentNode.id} · ${currentNode.title}`}</em></span></div></div>
    <div className="atlas-stage">
    <aside className="atlas-devotional-figure" aria-label="Hanumān, guardian of the journey">{hanuman?.portrait&&<div className="atlas-figure-portrait"><CharacterPortrait name={hanuman.name} portrait={hanuman.portrait} usage="detail"/></div>}<div className="atlas-figure-copy"><span>✦</span><strong>Faith moves mountains</strong><small>Across oceans.<br/>Within yourself.</small></div></aside>
    <div className="atlas-frame">
      <div className="atlas-scroll" ref={scrollContainerRef} onScroll={() => setShowSwipeHint(false)}>
        {showSwipeHint && (
          <div className="atlas-swipe-hint" role="status" onClick={() => setShowSwipeHint(false)}>
            <MoveHorizontal size={14} />
            <span>Swipe to explore crossing &amp; Laṅkā</span>
          </div>
        )}
        <div className={`atlas-art ${zoom?"is-zoomed":""} ${fitOverview?"is-fit-overview":""}`}>
          <svg viewBox="0 0 1000 760" className="atlas-svg" aria-label="Illustrated map of South India and Sri Lanka">
            <defs>
              <marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10L3 5Z" fill="#ffda86"/></marker>
            </defs>
            <image className="atlas-map-base" href="/images/atlas-base-v3.png" x="0" y="0" width="1000" height="760" preserveAspectRatio="xMidYMid slice"/>
            <path d={map.bridge} fill="none" stroke="#d9cf94" strokeWidth="4" strokeDasharray="5 5"/>
            <circle cx={map.rameswaram[0]} cy={map.rameswaram[1]} r="3" fill="#fff2be"/>
            <text className="atlas-place" x={map.rameswaram[0]-8} y={map.rameswaram[1]-12} textAnchor="end">Rāmeśvaram</text>
            <text className="atlas-water" x="535" y="185">PALK STRAIT</text>
            <text className="atlas-place small" x="625" y="282">Rāma Setu (trad.)</text>
            <text className="atlas-country" x="290" y="205" textAnchor="middle">BHĀRATA</text>
            <text className="atlas-country-sub" x="290" y="227" textAnchor="middle">SOUTH INDIA</text>
            <text className="atlas-country" x="734" y="325" textAnchor="middle">LAṄKĀ</text>
            <text className="atlas-country-sub" x="734" y="345" textAnchor="middle">SRI LANKA</text>
            <text className="atlas-water" x="415" y="352">GULF OF MANNAR</text>
            <text className="atlas-water" x="250" y="719">INDIAN OCEAN</text>
            <g className={`atlas-progress-route ${journeyComplete?"journey-complete":""}`} aria-hidden="true">
              {map.points.slice(0,-1).map(([x,y],index)=>{const [nextX,nextY]=map.points[index+1],completed=index<progress.completedNodes.length,isActive=index===Math.max(0,available-1),isNew=activeReveal?.kind==="route"&&pendingReveal?.nextNodeId===journeyNodes[index+1].id;return <path key={journeyNodes[index].id} d={`M ${x} ${y} L ${nextX} ${nextY}`} className={`${completed?"is-completed":""} ${isActive?"is-active-route":""} ${isNew?"is-new":""}`}/>;})}
            </g>
            <path className="atlas-route" d="M340 430 Q390 445 435 468 T510 502 Q552 503 580 460 Q650 418 672 380" markerEnd="url(#route-arrow)"/>
            <text className="atlas-route-label" x="350" y="590">Hanumān’s ocean crossing</text>
            <text className="atlas-route-label small" x="392" y="697">Return to Rāma · Bhārata</text>
            <ellipse cx="326" cy="408" rx="38" ry="29" fill="#b6562a" fillOpacity=".3" stroke="#ffd08b" strokeDasharray="5 4" strokeWidth="2"/>
            <path d={`M${map.sita[0]} ${map.sita[1]} L797 604`} stroke="#9ccafa" strokeWidth="1.3" strokeDasharray="3 4" fill="none"/>
            <ellipse cx={map.sita[0]} cy={map.sita[1]} rx="23" ry="18" fill="#407fa1" fillOpacity=".3" stroke="#b4d6f4" strokeWidth="1"/>
            <g transform="translate(925 674)" className="atlas-compass"><circle r="34"/><circle r="27"/><path d="M0-42V42M-42 0H42M-24-24L24 24M24-24L-24 24"/><path d="M0-35L8 0L0 35L-8 0Z" fill="#deb873"/><text y="-49" textAnchor="middle">N</text></g>
          </svg>
          {journeyNodes.map((node,index) => {
            const Icon = icons[index]; const [x,y] = map.points[index];
            const isSelected = selected.id === node.id;
            const isLocked = index > available;
            const questionStars = nodeMastery(progress,node);
            const newlyUnlocked=activeReveal?.kind==="route"&&pendingReveal?.nextNodeId===node.id;
            const pinContent=<>
              <span className="pin-emblem">{node.id==="HJ-15"&&rama?.portrait?<CharacterPortrait name={rama.name} portrait={rama.portrait} usage="medallion"/>:<Icon size={22}/>} {progress.completedNodes.includes(node.id)&&<Check className="pin-check" size={12}/>}</span><span className="pin-label">{index>available&&<span aria-hidden="true">🔒 </span>}{node.title}</span>{["HJ-05","HJ-06","HJ-07"].includes(node.id)&&<small>(narrative)</small>}
              <span className="pin-stars" aria-label={`${questionStars.filter(Boolean).length} of 3 questions correct`}>{questionStars.map((filled,star)=><Star key={star} size={11} fill={filled?"currentColor":"none"}/>)}</span>
              {beginCue&&index===0&&<span className="atlas-begin-cue">Begin the journey</span>}
            </>;
            const className=`atlas-pin node-${node.number} ${isLocked?"is-locked":"is-enterable"} level-${node.confidence} ${isSelected?"is-selected":""} ${node.id===progress.currentNode?"is-current":""} ${progress.completedNodes.includes(node.id)?"is-completed":""} ${newlyUnlocked?"is-newly-unlocked":""} ${node.id==="HJ-14"?"fire-pin":""}`;
            const style={left:`${(x/10).toFixed(3)}%`,top:`${(y/7.6).toFixed(3)}%`};
            if(isLocked)return <button key={node.id} type="button" onClick={()=>setSelection(node.id)} aria-label={`${node.title}. Complete the previous encounter to unlock this location.`} aria-pressed={isSelected} title="Complete the previous encounter to unlock this location." className={className} style={style}>{pinContent}</button>;
            return <Link key={node.id} href={`/journey/hanuman/${node.slug}`} onClick={()=>chooseNode(node.id)} aria-label={`Enter ${node.title}`} aria-current={node.id===progress.currentNode?"step":undefined} className={className} style={style}>{pinContent}</Link>;
          })}
          <button className="atlas-accuracy-trigger" aria-expanded={accuracyOpen} onClick={()=>setAccuracyOpen(value=>!value)}><Info/>Map accuracy</button>
          {accuracyOpen&&<aside className="atlas-accuracy-panel" aria-label="Map accuracy guide"><button onClick={()=>setAccuracyOpen(false)} aria-label="Close map accuracy guide"><X/></button><p className="eyebrow">Map accuracy</p><h2>How certain are these locations?</h2><p>Some Rāmāyaṇa locations can be strongly anchored, while others are known through tradition, proposed identifications, or narrative geography.</p><dl><div><dt>A</dt><dd>Strongly anchored</dd></div><div><dt>B</dt><dd>Traditional identification</dd></div><div><dt>C</dt><dd>Plausible identification</dd></div><div><dt>D</dt><dd>Debated location</dd></div><div><dt>E</dt><dd>Narrative / unknown</dd></div></dl></aside>}
          {activeReveal&&revealPoint&&<div className={`atlas-unlock-reveal reveal-${activeReveal.kind}`} role="status" style={{left:`clamp(150px,${(revealPoint[0]/10).toFixed(3)}%,calc(100% - 150px))`,top:`clamp(90px,${(revealPoint[1]/7.6).toFixed(3)}%,calc(100% - 90px))`}}>{activeReveal.kind==="character"&&revealCharacter?.portrait&&<><span className="atlas-reveal-portrait"><CharacterPortrait name={revealCharacter.name} portrait={revealCharacter.portrait} usage="reward"/></span><div><small>Character discovered</small><strong>{revealCharacter.name}</strong></div></>}{activeReveal.kind==="relationship"&&revealRelationship&&<><Share2/><div><small>Relationship discovered</small><strong>{characterNameById[revealRelationship.fromCharacterId]} → {characterNameById[revealRelationship.toCharacterId]} — {relationshipTypeLabels[revealRelationship.type]}</strong></div></>}{activeReveal.kind==="route"&&<><Route/><div><small>Journey advanced</small><strong>The next path is revealed</strong></div></>}{activeReveal.kind==="complete"&&<><Check/><div><small>Journey fulfilled</small><strong>Hanumān Journey Complete</strong></div></>}</div>}
        </div>
      </div>
      <div className="atlas-tools">
        <div className="atlas-tool-group">
          <button onClick={() => { setZoom(v=>!v); if (fitOverview) setFitOverview(false); }} aria-label={zoom?"Fit view":"Enlarge map"}>
            {zoom?<ZoomOut size={18}/>:<ZoomIn size={18}/>}
          </button>
          <button className="atlas-fit-toggle" onClick={() => { setFitOverview(v=>!v); if (zoom) setZoom(false); }} aria-label={fitOverview?"Normal scroll view":"Fit map overview"}>
            <Maximize2 size={16}/>
            <span>{fitOverview ? "Detail" : "Fit"}</span>
          </button>
        </div>
        <span className="atlas-tagline">Explore · Learn · Be inspired</span>
      </div>
    </div>
    </div>
    <div className="atlas-caption"><span>Coastlines: Natural Earth, 1:50m · North up</span><span>Story markers are symbolic; traditional regions are approximate.</span></div>
    <section className={`atlas-encounter ${selected.id===progress.currentNode?"is-current":""}`} aria-live="polite">
      <div className="atlas-encounter-title"><p className="eyebrow">{selected.id} · {selected.eyebrow}</p><h2>{selected.title}</h2><ConfidenceBadge level={selected.confidence}/></div>
      <div><p>{selected.excerpt}</p><small>{selected.place}</small>{selected.confidence!=="A"&&<details className="atlas-why-here"><summary>Why here?</summary><p>{selected.whyHere.reason}</p></details>}</div>
      {selected.number-1>available?<p className="atlas-locked-note">Complete the previous encounter to unlock this location.</p>:<Link className="atlas-enter-encounter" href={`/journey/hanuman/${selected.slug}`}>{beginCue&&selected.number===1?"Begin the journey":"Enter encounter"}<span>→</span></Link>}
    </section>
  </div>;
}
