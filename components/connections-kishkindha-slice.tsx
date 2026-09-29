"use client";

import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type CSSProperties,type DragEvent} from "react";
import {ArrowRight,BookOpen,Check,Compass,Info,RotateCcw} from "lucide-react";
import {CharacterPortrait} from "@/components/character-portrait";
import {setConnectionsPortraitDragImage} from "@/components/connections-portrait-drag-preview";
import {relationships as journeyRelationships} from "@/data/relationships";
import {kishBuildEdges,kishEdgeById,kishEdges,kishExploreEdges,kishPathChallenges,kishPeople,kishPersonById,kishRelationOptions,kishRounds,type KishEdge,type KishId} from "@/data/connections-kishkindha";
import type {ConnectionMode} from "@/components/connections-family-slice";
import styles from "@/app/connections/kishkindha.module.scss";

const storageKey="ramayana:connections:kishkindha-v1";
type Response={kind:"correct"|"gentle";title:string;body:string;edge?:KishEdge;meaning?:string}|null;
type PositionStyle=CSSProperties&{"--x":string;"--y":string;"--mx":string;"--my":string};
const position=(id:KishId):PositionStyle=>{const p=kishPersonById[id].position;return {"--x":`${p.x}%`,"--y":`${p.y}%`,"--mx":`${p.mx}%`,"--my":`${p.my}%`};};
const pairLabel=(edge:KishEdge)=>`${kishPersonById[edge.from].name} — ${edge.label} — ${kishPersonById[edge.to].name}`;
const isKishId=(value:string):value is KishId=>value in kishPersonById;

export function KishkindhaNetworkSlice({mode,onModeChange,unlockedRelationshipIds}:{mode:ConnectionMode;onModeChange:(mode:ConnectionMode)=>void;unlockedRelationshipIds:string[]}){
 const [placed,setPlaced]=useState<string[]>([]);
 const [pathSolved,setPathSolved]=useState<number[]>([]);
 const [selectedPortrait,setSelectedPortrait]=useState<KishId|null>(null);
 const [anchored,setAnchored]=useState(false);
 const [relation,setRelation]=useState<string|null>(null);
 const [pathChoice,setPathChoice]=useState<"direct"|"later"|"through"|null>(null);
 const [via,setVia]=useState<KishId|null>(null);
 const [response,setResponse]=useState<Response>(null);
 const [selectedEdge,setSelectedEdge]=useState<string|null>(null);
 const [exploreId,setExploreId]=useState<KishId>("hanuman");
 const [hintOpen,setHintOpen]=useState(false);
 const [focusId,setFocusId]=useState<KishId>("hanuman");
 const [learnMore,setLearnMore]=useState(false);
 const [dragging,setDragging]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const graphRef=useRef<HTMLDivElement|null>(null);
 const dragPreviewCleanup=useRef<(()=>void)|null>(null);
 useEffect(()=>()=>dragPreviewCleanup.current?.(),[]);

 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)??"null") as {placed?:string[];paths?:number[]}|null;if(saved){const valid:string[]=[];for(const edge of kishBuildEdges){if(saved.placed?.[valid.length]===edge.id)valid.push(edge.id);else break;}setPlaced(valid);setPathSolved((saved.paths??[]).filter((value,index)=>value===index&&index<kishPathChallenges.length));}}catch{/* Invalid local learning state starts afresh. */}setLoaded(true);},[]);
 useEffect(()=>{if(loaded)localStorage.setItem(storageKey,JSON.stringify({placed,paths:pathSolved}));},[loaded,placed,pathSolved]);

 const edgeIndex=placed.length;
 const currentEdge=kishBuildEdges[edgeIndex];
 const roundIndex=edgeIndex<2?0:edgeIndex<7?1:edgeIndex<kishBuildEdges.length?2:3;
 const round=kishRounds[roundIndex];
 const currentPath=kishPathChallenges[pathSolved.length];
 const buildComplete=edgeIndex===kishBuildEdges.length&&pathSolved.length===kishPathChallenges.length;
 const visibleIds=useMemo(()=>new Set<KishId>(["hanuman",...(currentEdge?[currentEdge.from]:kishPeople.map(person=>person.id)),...placed.flatMap(id=>{const edge=kishEdgeById[id];return edge?[edge.from,edge.to]:[]})] as KishId[]),[currentEdge,placed]);
 const selectedPerson=kishPersonById[focusId];
 const visibleEdges=kishEdges.filter(edge=>placed.includes(edge.id));
 const journeyLinks=journeyRelationships.filter(edge=>unlockedRelationshipIds.includes(edge.id));

 function selectPortrait(id:KishId){setSelectedPortrait(id);setAnchored(false);setRelation(null);setResponse(null);}
 function attemptAnchor(sourceId:KishId,portraitId=selectedPortrait){
  if(!currentEdge||!portraitId)return;
  if(sourceId!==currentEdge.from){setResponse({kind:"gentle",title:"Follow the highlighted person",body:`Place this portrait beside ${kishPersonById[currentEdge.from].name} to consider their connection.`});return;}
  if(portraitId!==currentEdge.to){setResponse({kind:"gentle",title:"A different moment in the network",body:round.wrongCharacter});setSelectedPortrait(null);setAnchored(false);setRelation(null);return;}
  setSelectedPortrait(portraitId);setAnchored(true);setRelation(null);setResponse(null);
 }
 function onDrop(event:DragEvent<HTMLButtonElement>,sourceId:KishId){event.preventDefault();const id=event.dataTransfer.getData("text/plain");dragPreviewCleanup.current?.();dragPreviewCleanup.current=null;setDragging(false);if(isKishId(id))attemptAnchor(sourceId,id);}
 function confirmEdge(){
  if(!currentEdge||!selectedPortrait||!anchored||!relation)return;
  if(relation!==currentEdge.relation){setResponse({kind:"gentle",title:"Look at this bond again",body:round.wrongEdge});return;}
  setPlaced(previous=>[...previous,currentEdge.id]);setSelectedEdge(currentEdge.id);setResponse({kind:"correct",title:`${kishPersonById[currentEdge.to].name} joins the network`,body:round.correct,edge:currentEdge,meaning:currentEdge.meaning});setSelectedPortrait(null);setAnchored(false);setRelation(null);
  if(window.innerWidth<720)requestAnimationFrame(()=>graphRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"}));
 }
 function confirmPath(){
  if(!currentPath||!pathChoice)return;
  if(pathChoice!==currentPath.answer||(pathChoice==="through"&&via!==currentPath.via)){setResponse({kind:"gentle",title:"Look for the story moment",body:pathChoice==="through"&&via!==currentPath.via?"That person does not complete this route. Follow Hanumān's first embassy through Sugrīva.":round.wrongEdge});return;}
  setPathSolved(previous=>[...previous,previous.length]);setResponse({kind:"correct",title:"You traced the connection",body:currentPath.explanation,meaning:round.meaning});setPathChoice(null);setVia(null);
 }
 function openFocus(id:KishId){setFocusId(id);setLearnMore(false);onModeChange("focus");}
 function graphNodeAction(id:KishId){
  if(mode==="build"&&currentEdge&&selectedPortrait){attemptAnchor(id);return;}
  if(mode==="build"&&!currentEdge&&currentPath&&pathChoice==="through"){setVia(id);setResponse(null);return;}
  if(mode==="focus")openFocus(id);else{setExploreId(id);setHintOpen(false);setSelectedEdge(null);}
 }
 function resetLearning(){setPlaced([]);setPathSolved([]);setSelectedPortrait(null);setAnchored(false);setRelation(null);setResponse(null);setSelectedEdge(null);setPathChoice(null);setVia(null);}
 const activeExplore=kishPersonById[exploreId];
 const activeEdge=selectedEdge?kishEdgeById[selectedEdge]:null;
 const contextualEdges=kishExploreEdges.filter(edge=>edge.from===exploreId||edge.to===exploreId);

 return <div className={styles.slice}>
  <header className={styles.intro}><div><p className="eyebrow">Kiṣkindhā · a world of bonds</p><h2>{mode==="build"?"Let the wider network take shape":mode==="focus"?"A life within the network":"Follow the ties through Kiṣkindhā"}</h2><p>{mode==="build"?"Place people beside one another, name each tie, then trace the routes between them.":mode==="focus"?"Meet a person through the people, choices, and source moments around them.":"Inspect the people and the bonds you have revealed. The clues are here before you build."}</p></div><div className={styles.progress} aria-label={`${placed.length} of ${kishBuildEdges.length} Kiṣkindhā connections built`}><strong>{placed.length}<span> / {kishBuildEdges.length}</span></strong><small>ties placed</small></div></header>

  {mode!=="focus"&&<div className={styles.workspace}>
   <section className={styles.graphPanel} aria-label="Kiṣkindhā relationship graph"><div className={styles.graphTop}><strong><Compass size={17}/> Kiṣkindhā network</strong><span>{mode==="build"&&currentEdge?`Round ${roundIndex+1} · ${round.title}`:mode==="build"?"Trace the paths":"Select a person or revealed line"}</span></div>
    <div ref={graphRef} className={`${styles.graphViewport} ${dragging?styles.dragging:""}`}>
     <div className={styles.graph}>
      <GraphLines placed={placed} selectedEdge={selectedEdge} onSelect={id=>{setSelectedEdge(id);setResponse(null);}}/>
      {kishPeople.map(person=>{const revealed=mode==="explore"||visibleIds.has(person.id);const target=mode==="build"&&currentEdge?.from===person.id;const pathPoint=mode==="build"&&!currentEdge&&pathChoice==="through"&&person.id===currentPath?.via;const node=<><span className={styles.nodePortrait}>{revealed?<CharacterPortrait name={person.name} portrait={person.portrait} usage="medallion" draggable={false}/>:<span aria-hidden="true">?</span>}</span><strong>{revealed?person.name:"Unrevealed"}</strong>{target&&<small>Place beside me</small>}</>;const className=`${styles.graphNode} ${revealed?styles.revealed:styles.veiled} ${target?styles.graphTarget:""} ${pathPoint?styles.pathPoint:""}`;return revealed?<button key={person.id} type="button" draggable={false} onDragStart={event=>event.preventDefault()} className={className} style={position(person.id)} onClick={()=>graphNodeAction(person.id)} onDragOver={event=>{if(target)event.preventDefault();}} onDrop={event=>onDrop(event,person.id)} aria-label={`${person.name}${target?", place selected portrait here":""}`} aria-pressed={mode==="explore"&&exploreId===person.id}>{node}</button>:<span key={person.id} className={className} style={position(person.id)} aria-hidden="true">{node}</span>;})}
      {mode==="build"&&currentEdge&&<p className={styles.graphInstruction}>Choose a portrait, then place it beside {kishPersonById[currentEdge.from].name}.</p>}
      {mode==="build"&&!currentEdge&&currentPath&&<p className={styles.graphInstruction}>Trace {kishPersonById[currentPath.from].name} → {kishPersonById[currentPath.to].name}</p>}
     </div>
    </div>
    <div className={styles.graphFooter}><span>Family · alliance · counsel · shared mission</span><span>Follow the paths, not just the portraits</span></div>
   </section>

   {mode==="build"?<section className={styles.sidePanel} aria-label="Build the Kiṣkindhā network">
    <p className="eyebrow">Build Network · Round {roundIndex+1} of 4</p><h3>{round.title}</h3><p className={styles.instruction}>{round.instruction}</p>
    {currentEdge?<>
     <p className={styles.stepCount}>Connection {Array.from(round.edgeIds as readonly string[]).indexOf(currentEdge.id)+1} of {round.edgeIds.length} in this round</p>
     <div className={styles.tray} role="group" aria-label="Choose a portrait to place">{kishPeople.filter(person=>person.id!==currentEdge.from).map(person=><button key={person.id} type="button" draggable onDragStart={event=>{dragPreviewCleanup.current?.();event.dataTransfer.setData("text/plain",person.id);event.dataTransfer.effectAllowed="move";dragPreviewCleanup.current=setConnectionsPortraitDragImage(event.dataTransfer,event.currentTarget,person.portrait,person.name);setDragging(true);}} onDragEnd={()=>{dragPreviewCleanup.current?.();dragPreviewCleanup.current=null;setDragging(false);}} aria-pressed={selectedPortrait===person.id} onClick={()=>selectPortrait(person.id)}><span className={styles.trayPortrait}><CharacterPortrait name={person.name} portrait={person.portrait} usage="medallion"/></span><span>{person.name}</span></button>)}</div>
     {selectedPortrait&&!anchored&&<div className={styles.selectionHelp} role="status"><strong>{kishPersonById[selectedPortrait].name} selected</strong><p>Place this portrait beside {kishPersonById[currentEdge.from].name} in the graph.</p><button type="button" onClick={()=>attemptAnchor(currentEdge.from)}>Place beside {kishPersonById[currentEdge.from].name} <ArrowRight size={16}/></button></div>}
     {selectedPortrait&&anchored&&<div className={styles.choices}><p className="eyebrow">Name the relationship</p><h4>{kishPersonById[currentEdge.from].name} and {kishPersonById[selectedPortrait].name}</h4><div role="group" aria-label="Relationship choices">{[...kishRelationOptions[currentEdge.relation].slice(edgeIndex%3),...kishRelationOptions[currentEdge.relation].slice(0,edgeIndex%3)].map(choice=><button key={choice.value} type="button" aria-pressed={relation===choice.value} onClick={()=>{setRelation(choice.value);setResponse(null);}}>{choice.label}</button>)}</div><button type="button" className={styles.primary} disabled={!relation} onClick={confirmEdge}>Reveal connection <ArrowRight size={17}/></button></div>}
    </>:currentPath?<div className={styles.pathChallenge}><p className={styles.stepCount}>Path {pathSolved.length+1} of {kishPathChallenges.length}</p><h4>{currentPath.prompt}</h4><p>Look at the people on the graph, then choose the route that fits this story moment.</p><div role="group" aria-label="Choose a path type"><button aria-pressed={pathChoice==="direct"} onClick={()=>{setPathChoice("direct");setVia(null);setResponse(null);}}>Direct in this moment</button><button aria-pressed={pathChoice==="later"} onClick={()=>{setPathChoice("later");setVia(null);setResponse(null);}}>Direct later</button><button aria-pressed={pathChoice==="through"} onClick={()=>{setPathChoice("through");setVia(null);setResponse(null);}}>Through someone else</button></div>{pathChoice==="through"&&<div className={styles.viaPicker}><p>Choose the person on the graph who completes this path.</p><div>{kishPeople.filter(person=>person.id!==currentPath.from&&person.id!==currentPath.to).map(person=><button key={person.id} aria-pressed={via===person.id} onClick={()=>setVia(person.id)}>{person.name}</button>)}</div></div>}<button className={styles.primary} disabled={!pathChoice||(pathChoice==="through"&&!via)} onClick={confirmPath}>Trace this route <ArrowRight size={17}/></button></div>:<div className={styles.completed}><Check size={24}/><h3>The Kiṣkindhā network is yours to explore</h3><p>The people, their ties, and the paths between them remain visible.</p><button className={styles.primary} onClick={()=>onModeChange("explore")}>Explore the completed network <ArrowRight size={17}/></button></div>}
    {response&&<div className={`${styles.feedback} ${response.kind==="correct"?styles.feedbackCorrect:""}`} role="status" aria-live="polite"><strong>{response.kind==="correct"&&<Check size={17}/>} {response.title}</strong>{response.edge?<div className={styles.meaning}><p><b>Fact</b><span>{response.edge.fact}</span></p><p><b>Story context</b><span>{response.edge.context}</span></p>{response.meaning&&<p><b>Meaning · reflection</b><span>{response.meaning}</span></p>}</div>:<><p>{response.body}</p>{response.meaning&&<p><strong>Meaning · reflection</strong> {response.meaning}</p>}</>}{response.kind==="correct"&&response.edge&&<p className={styles.feedbackBody}>{response.body}</p>}</div>}
    {buildComplete&&<button className={styles.quietAction} onClick={resetLearning}><RotateCcw size={15}/> Rebuild this network</button>}
   </section>:<section className={styles.sidePanel} aria-label="Explore the Kiṣkindhā network"><p className="eyebrow">Explore Network</p><h3>Look before you connect</h3><p className={styles.instruction}>Choose a portrait. Follow what you notice before you name each bond.</p><div className={styles.explorePeople} role="group" aria-label="People to inspect">{kishPeople.map(person=><button key={person.id} aria-pressed={exploreId===person.id} onClick={()=>{setExploreId(person.id);setHintOpen(false);setSelectedEdge(null);}}>{person.name}</button>)}</div><article className={styles.clue} aria-live="polite"><p className="eyebrow">A clue to consider</p><h4>{activeExplore.name}</h4><p>{activeExplore.explore}</p><button className={styles.quietAction} aria-expanded={hintOpen} onClick={()=>setHintOpen(value=>!value)}>{hintOpen?"Hide deeper hint":"Look a little deeper"} <ArrowRight size={15}/></button>{hintOpen&&<p className={styles.deeperHint}>{activeExplore.hint}</p>}<button className={styles.quietAction} onClick={()=>openFocus(activeExplore.id)}>Character Focus: {activeExplore.name} <ArrowRight size={15}/></button></article>{activeEdge&&<EdgeDetail edge={activeEdge}/>}{contextualEdges.length>0&&<details className={styles.contextual}><summary>Further story ties around {activeExplore.name}</summary><div>{contextualEdges.map(edge=><button key={edge.id} type="button" onClick={()=>setSelectedEdge(edge.id)} aria-pressed={selectedEdge===edge.id}>{pairLabel(edge)} <ArrowRight size={14}/></button>)}</div></details>}<button className={styles.primary} onClick={()=>onModeChange("build")}>{buildComplete?"Revisit Build Network":"Build this network"} <ArrowRight size={17}/></button><div className={styles.journeyLinks}><p className="eyebrow">From your journey</p><p>{journeyLinks.length} relationship{journeyLinks.length===1?"":"s"} recorded in Journey. These remain separate from this Connections challenge.</p><Link href="/journey/hanuman">Revisit the story <ArrowRight size={15}/></Link></div></section>}

   <section className={styles.semanticPanel} aria-labelledby="kish-relations-heading"><div><h3 id="kish-relations-heading">Relationships revealed</h3><span>{placed.length} of {kishBuildEdges.length}</span></div>{visibleEdges.length?<ol>{visibleEdges.map(edge=><li key={edge.id}><button onClick={()=>{setSelectedEdge(edge.id);if(mode==="build")onModeChange("explore");}}><span className={styles.edgeGlyph} data-kind={edge.kind} aria-hidden="true"/><span><strong>{pairLabel(edge)}</strong><small>{edge.kind==="conflict"?"Family and conflict":edge.kind==="alliance"?"Mutual alliance":edge.kind==="counsel"?"Counsel":edge.kind==="mission"?"Shared mission":edge.kind==="service"?"Service or meeting":"Family"}</small></span><Info size={15} aria-hidden="true"/></button></li>)}</ol>:<p>No ties revealed yet. Inspect the people, then build the first connection.</p>}{pathSolved.length>0&&<p className={styles.pathRecord}>Traced paths: {pathSolved.length} of {kishPathChallenges.length}. Hanumān’s path to Vāli passes through Sugrīva.</p>}</section>
  </div>}

  {mode==="focus"&&<div className={styles.focusLayout}><section className={styles.focusNav} aria-labelledby="kish-people-heading"><p className="eyebrow">Character Focus</p><h3 id="kish-people-heading">Choose a person</h3><div>{kishPeople.map(person=><button key={person.id} aria-pressed={focusId===person.id} onClick={()=>{setFocusId(person.id);setLearnMore(false);}}><span className={styles.trayPortrait}><CharacterPortrait name={person.name} portrait={person.portrait} usage="medallion"/></span>{person.name}</button>)}</div><button className={styles.quietAction} onClick={()=>onModeChange("explore")}>← Return to network</button></section><article className={styles.profile} aria-labelledby="kish-profile-heading"><div className={styles.profileHead}><span className={styles.profilePortrait}><CharacterPortrait name={selectedPerson.name} portrait={selectedPerson.portrait} usage="detail"/></span><div><p className="eyebrow">A person within Kiṣkindhā</p><h3 id="kish-profile-heading">{selectedPerson.name}</h3><ul>{selectedPerson.facts.map(fact=><li key={fact}>{fact}</li>)}</ul></div></div><div className={styles.profileNetwork}><h4>Nearby in this network</h4>{visibleEdges.filter(edge=>edge.from===focusId||edge.to===focusId).length?<div>{visibleEdges.filter(edge=>edge.from===focusId||edge.to===focusId).map(edge=>{const other=edge.from===focusId?edge.to:edge.from;return <button key={edge.id} onClick={()=>{setFocusId(other);setLearnMore(false);}}>{edge.label} · {kishPersonById[other].name} <ArrowRight size={15}/></button>;})}</div>:<p>Build a tie to see this person’s nearest connections here. Their story is still available below.</p>}</div><button className={styles.primary} aria-expanded={learnMore} aria-controls="kish-learn-more" onClick={()=>setLearnMore(value=>!value)}>{learnMore?"Close Learn More":`Learn More about ${selectedPerson.name}`} <BookOpen size={17}/></button>{learnMore&&<div id="kish-learn-more" className={styles.learnMore}><p className="eyebrow">Relationships · story · source</p><h4>Follow {selectedPerson.name} further</h4>{selectedPerson.sections.map(section=><details key={section.title} className={styles.learnSection}><summary>{section.title}</summary><div><p>{section.body}</p>{section.edgeIds.map(id=>{const edge=kishEdgeById[id];return edge?<SourceNotes key={id} edge={edge}/>:null;})}</div></details>)}</div>}</article></div>}
 </div>;
}

function GraphLines({placed,selectedEdge,onSelect}:{placed:string[];selectedEdge:string|null;onSelect:(id:string)=>void}){
 const lines=[...placed.map(id=>kishEdgeById[id]).filter(Boolean),...(selectedEdge&&!placed.includes(selectedEdge)&&kishEdgeById[selectedEdge]?[kishEdgeById[selectedEdge]]:[])];
 return <><svg className={`${styles.lines} ${styles.desktopLines}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{lines.map(edge=>{const a=kishPersonById[edge.from].position,b=kishPersonById[edge.to].position;return <line key={edge.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} data-kind={edge.kind} className={selectedEdge===edge.id?styles.lineSelected:""}/>;})}</svg><svg className={`${styles.lines} ${styles.mobileLines}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{lines.map(edge=>{const a=kishPersonById[edge.from].position,b=kishPersonById[edge.to].position;return <line key={edge.id} x1={a.mx} y1={a.my} x2={b.mx} y2={b.my} data-kind={edge.kind} className={selectedEdge===edge.id?styles.lineSelected:""}/>;})}</svg>{lines.map(edge=>{const a=kishPersonById[edge.from].position,b=kishPersonById[edge.to].position;const style={"--x":`${(a.x+b.x)/2}%`,"--y":`${(a.y+b.y)/2}%`,"--mx":`${(a.mx+b.mx)/2}%`,"--my":`${(a.my+b.my)/2}%`} as PositionStyle;return <button key={edge.id} className={styles.lineButton} style={style} onClick={()=>onSelect(edge.id)} aria-label={`${pairLabel(edge)}. Inspect relationship`} title={edge.label}><span aria-hidden="true">{edge.kind==="conflict"?"◆":edge.kind==="alliance"?"◇":edge.kind==="mission"?"✦":"·"}</span></button>;})}</>;
}

function EdgeDetail({edge}:{edge:KishEdge}){return <article className={styles.edgeDetail}><p className="eyebrow">A revealed relationship</p><h4>{edge.label}</h4><p>{edge.fact}</p><p>{edge.context}</p>{edge.meaning&&<p><strong>Meaning · reflection</strong><br/>{edge.meaning}</p>}<SourceNotes edge={edge}/></article>;}

function SourceNotes({edge}:{edge:KishEdge}){return <details className={styles.sourceNotes}><summary>Source notes · {edge.label}</summary><div><p><strong>Textual basis:</strong> {edge.fact}</p><p><strong>Interpretive note:</strong> {edge.meaning??"The relationship is paraphrased for this story moment; it is not an exact quotation."}</p>{edge.sources.map(source=><dl key={`${source.work}-${source.passage}`}><div><dt>Tradition</dt><dd>{source.tradition}</dd></div><div><dt>Source</dt><dd>{source.work}</dd></div><div><dt>Edition</dt><dd>{source.edition}</dd></div><div><dt>Passage</dt><dd>{source.passage}</dd></div><div><dt>Printed page</dt><dd>{source.printedPage}</dd></div><div><dt>Verification</dt><dd>Checked against the approved edition page image. Paraphrase only.</dd></div><div><dt>Scope</dt><dd>{source.note}</dd></div></dl>)}</div></details>;}
