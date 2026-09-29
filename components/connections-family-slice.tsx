"use client";

import Link from "next/link";
import {useEffect,useMemo,useRef,useState,type DragEvent} from "react";
import {ArrowRight,BookOpen,Check,Compass,Grip,Info,RotateCcw} from "lucide-react";
import {CharacterPortrait} from "@/components/character-portrait";
import {setConnectionsPortraitDragImage} from "@/components/connections-portrait-drag-preview";
import {characters} from "@/data/discoveries";
import {distractorContext,familyBuildEdges,familyCharacterById,familyExploreClues,familyOptions,familyPoolIds,relationshipLabels,type NetworkCharacter,type NetworkRelationshipType} from "@/data/connections-v1-1";
import {relationships as journeyRelationships} from "@/data/relationships";
import {familyProfiles,type FamilyProfileSection} from "@/data/connections-family-profiles";
import styles from "@/app/connections/connections.module.scss";

export type ConnectionMode="explore"|"build"|"focus";
type Feedback={kind:"correct"|"tryAgain"|"otherLens";title:string;body:string;edgeId?:string}|null;

export function FamilyNetworkSlice({mode,onModeChange,unlockedRelationshipIds}:{mode:ConnectionMode;onModeChange:(mode:ConnectionMode)=>void;unlockedRelationshipIds:string[]}){
 const [placed,setPlaced]=useState<string[]>([]);
 const [candidate,setCandidate]=useState<string|null>(null);
 const [paired,setPaired]=useState(false);
 const [relation,setRelation]=useState<NetworkRelationshipType|null>(null);
 const [feedback,setFeedback]=useState<Feedback>(null);
 const [focusId,setFocusId]=useState("hanuman");
 const [learnMore,setLearnMore]=useState(false);
 const [dragging,setDragging]=useState(false);
 const [exploreId,setExploreId]=useState<string>("hanuman");
 const [exploreJourneyId,setExploreJourneyId]=useState<string|null>(null);
 const pointerCandidate=useRef<string|null>(null);
 const nativeDropHandled=useRef(false);
 const dragPreviewCleanup=useRef<(()=>void)|null>(null);
 const graphRef=useRef<HTMLDivElement|null>(null);
 useEffect(()=>()=>dragPreviewCleanup.current?.(),[]);
 const placedEdges=useMemo(()=>familyBuildEdges.filter(edge=>placed.includes(edge.id)),[placed]);
 const complete=placed.length===familyBuildEdges.length;
 const discoveredJourney=journeyRelationships.filter(edge=>unlockedRelationshipIds.includes(edge.id));
 const activeJourney=discoveredJourney.find(edge=>edge.id===exploreJourneyId);
 const feedbackEdge=familyBuildEdges.find(edge=>edge.id===feedback?.edgeId);

 function selectCandidate(id:string){setCandidate(id);setPaired(false);setRelation(null);setFeedback(null);}
 function pairWithHanuman(id=candidate){if(!id)return;setCandidate(id);setPaired(true);setRelation(null);setFeedback(null);setDragging(false);}
 function onDrop(event:DragEvent<HTMLElement>){event.preventDefault();nativeDropHandled.current=true;pointerCandidate.current=null;const id=event.dataTransfer.getData("text/plain");if(familyPoolIds.some(item=>item===id)&&!placed.some(edgeId=>familyBuildEdges.find(edge=>edge.id===edgeId)?.sourceCharacterId===id))pairWithHanuman(id);dragPreviewCleanup.current?.();dragPreviewCleanup.current=null;setDragging(false);}
 function validate(){if(!candidate||!relation||!paired)return;const edge=familyBuildEdges.find(item=>item.sourceCharacterId===candidate);
  if(edge&&edge.type===relation){setPlaced(current=>current.includes(edge.id)?current:[...current,edge.id]);setFeedback({kind:"correct",title:`${familyCharacterById[candidate].name} joins the network`,body:edge.shortExplanation,edgeId:edge.id});setFocusId(candidate);setCandidate(null);setPaired(false);setRelation(null);if(window.innerWidth<=950)requestAnimationFrame(()=>graphRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"}));}
  else if(!edge){setFeedback({kind:"otherLens",title:"A bond beyond Family & Origins",body:distractorContext[candidate]??"This person belongs to another part of Hanumān’s journey, beyond his family origins."});setPaired(false);setCandidate(null);setRelation(null);}
  else setFeedback({kind:"tryAgain",title:"Look at this bond again",body:`${familyCharacterById[candidate].name} belongs in this network, but “${relationshipLabels[relation]}” does not fit this bond. Try another relationship.`});
 }
 function openFocus(id:string,showLearnMore=false){setFocusId(id);setLearnMore(showLearnMore);onModeChange("focus");}
 const remaining=familyPoolIds.filter(id=>!placedEdges.some(edge=>edge.sourceCharacterId===id));
 const selectedPerson=familyCharacterById[focusId]??familyCharacterById.hanuman;
 return <div className={styles.familySlice} onMouseUpCapture={event=>{const id=pointerCandidate.current;pointerCandidate.current=null;if(id&&document.elementFromPoint(event.clientX,event.clientY)?.closest("[data-family-drop-target]"))pairWithHanuman(id);}}>
  <header className={styles.familyIntro}><div><p className="eyebrow">Hanumān · Family & Origins</p><h2>{mode==="build"?"Let the relationships take shape":mode==="focus"?"A person within the story":"Read the living network"}</h2><p>{mode==="build"?"Place a portrait with Hanumān, then name their bond.":mode==="focus"?"Meet one person, follow their closest bonds, and look deeper when curiosity calls.":"Meet the people around Hanumān’s beginnings before you build their bonds."}</p></div><span className={styles.familyProgress} aria-label={`${placed.length} of ${familyBuildEdges.length} family connections revealed`}><strong>{placed.length}<span> / {familyBuildEdges.length}</span></strong><small>family bonds revealed</small></span></header>
  {mode!=="focus"&&<div className={styles.familyLayout}>
   <section className={styles.familyGraphSection} aria-label="Hanumān Family and Origins network"><div className={styles.familyGraphTop}><span><Compass size={16}/> Family & Origins</span><small>{mode==="build"?"Place a portrait with Hanumān":"Select a portrait or a revealed bond"}</small></div>
    <div ref={graphRef} className={`${styles.familyGraph} ${dragging?styles.familyDragging:""}`} data-family-drop-target onDragOver={event=>event.preventDefault()} onDrop={onDrop}>
     <svg className={styles.familyEdges} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{placedEdges.map(edge=>{const person=familyCharacterById[edge.sourceCharacterId];return <line key={edge.id} x1="50" y1="52" x2={person.position!.x} y2={person.position!.y}/>;})}</svg>
     {placedEdges.map(edge=>{const person=familyCharacterById[edge.sourceCharacterId];return <button key={edge.id} className={styles.familyEdgeLabel} style={{left:`${(person.position!.x+50)/2}%`,top:`${(person.position!.y+52)/2}%`}} onClick={()=>openFocus(person.id)} aria-label={`${person.name}: ${edge.label}. View character focus`}><span className={styles.familyEdgeLong}>{edge.label}</span><span className={styles.familyEdgeShort}>{edge.type==="divine-father"?"Divine father":edge.type==="father"?"Father":"Mother"}</span></button>;})}
     {placedEdges.map(edge=>{const person=familyCharacterById[edge.sourceCharacterId];return <NetworkPortrait key={person.id} person={person} x={person.position!.x} y={person.position!.y} onClick={()=>openFocus(person.id)}/>;})}
     <div className={styles.familyCenter} style={{left:"50%",top:"52%"}}><button className={styles.familyTarget} draggable={false} onDragStart={event=>event.preventDefault()} onClick={()=>mode==="build"&&candidate?pairWithHanuman():mode==="explore"?setExploreId("hanuman"):openFocus("hanuman")} aria-label={mode==="build"&&candidate?`Place ${familyCharacterById[candidate].name} with Hanumān; choose relationship next`:mode==="explore"?"Inspect Hanumān":"Focus Hanumān"}><span className={styles.familyPortrait}><CharacterPortrait name="Hanumān" portrait={familyCharacterById.hanuman.portrait} usage="medallion" draggable={false}/></span><strong>Hanumān</strong><small>{mode==="build"&&candidate?"Place here":"At the centre"}</small></button></div>
     {mode==="build"&&!candidate&&placedEdges.length===0&&<p className={styles.familyGraphHint}>The first bond has not yet been placed.</p>}
    </div>

   </section>
   {mode==="build"?<section className={styles.familyBuildSide} aria-label="Build the network"><p className="eyebrow">Portrait pool</p><h3>Who belongs to his beginnings?</h3><p className={styles.familySideIntro}>Drag a portrait toward Hanumān, or choose one and tap the central portrait. Keyboard selection follows the same path.</p><div className={styles.familyPool}>{remaining.map(id=><button key={id} draggable onMouseDown={()=>{pointerCandidate.current=id;}} onDragStart={event=>{pointerCandidate.current=null;nativeDropHandled.current=false;dragPreviewCleanup.current?.();event.dataTransfer.setData("text/plain",id);event.dataTransfer.effectAllowed="move";dragPreviewCleanup.current=setConnectionsPortraitDragImage(event.dataTransfer,event.currentTarget,familyCharacterById[id].portrait,familyCharacterById[id].name);setDragging(true);}} onDragEnd={event=>{if(!nativeDropHandled.current&&document.elementFromPoint(event.clientX,event.clientY)?.closest("[data-family-drop-target]"))pairWithHanuman(id);nativeDropHandled.current=false;dragPreviewCleanup.current?.();dragPreviewCleanup.current=null;setDragging(false);}} className={`${styles.familyPoolPerson} ${candidate===id?styles.familyPoolSelected:""}`} aria-pressed={candidate===id} onClick={()=>selectCandidate(id)}><span className={styles.familyPoolPortrait}><CharacterPortrait name={familyCharacterById[id].name} portrait={familyCharacterById[id].portrait} usage="medallion"/></span><strong>{familyCharacterById[id].name}</strong><Grip size={15} aria-hidden="true"/></button>)}</div>
    {candidate&&!paired&&<div className={styles.familyInstruction}><ArrowRight size={16}/><span>{familyCharacterById[candidate].name} selected. Place this portrait with Hanumān in the graph.<button onClick={()=>pairWithHanuman()}>Place with Hanumān <ArrowRight size={15}/></button></span></div>}
    {candidate&&paired&&<div className={styles.familyDecision}><p className="eyebrow">Name the relationship</p><h4>{familyCharacterById[candidate].name} and Hanumān</h4><div role="group" aria-label="Choose a relationship">{familyOptions[candidate].map(type=><button key={type} aria-pressed={relation===type} className={relation===type?styles.familyRelationSelected:""} onClick={()=>{setRelation(type);setFeedback(null);}}>{relationshipLabels[type]}</button>)}</div><button className={styles.familyPrimary} disabled={!relation} onClick={validate}>Reveal connection <ArrowRight size={17}/></button></div>}
    {feedback&&<div className={`${styles.familyFeedback} ${feedback.kind==="correct"?styles.familyFeedbackCorrect:""}`} role="status" aria-live="polite"><strong>{feedback.kind==="correct"&&<Check size={17}/>} {feedback.title}</strong>{feedback.kind==="correct"&&feedbackEdge?<div className={styles.familyMeaning}><p><b>Fact</b><span>{feedbackEdge.shortExplanation}</span></p><p><b>Story context</b><span>{feedbackEdge.storyContext}</span></p><p><b>Meaning · reflection</b><span>{feedbackEdge.meaning?.text}</span></p></div>:<p>{feedback.body}</p>}{feedback.kind==="correct"&&<button onClick={()=>openFocus(focusId,true)}>Learn more about {selectedPerson.name} <ArrowRight size={15}/></button>}{feedback.kind==="otherLens"&&<button onClick={()=>{setFeedback(null);setCandidate(null);}}>Choose another portrait <RotateCcw size={15}/></button>}</div>}
    {complete&&<button className={styles.familyQuietAction} onClick={()=>onModeChange("explore")}>Explore the completed network <ArrowRight size={16}/></button>}
   </section>:<section className={styles.familyExploreSide}><p className="eyebrow">Explore network</p><h3>Look before you connect</h3><p>Hanumān meets many people on his journey. Some are family; others guide him, serve beside him, or oppose him. Look closely before choosing the bonds that belong here.</p><div className={styles.familyExplorePeople} role="group" aria-label="People to inspect before building">{["hanuman",...familyPoolIds].map(id=><button key={id} aria-pressed={exploreId===id} onClick={()=>setExploreId(id)}><span className={styles.familyPoolPortrait}><CharacterPortrait name={familyCharacterById[id].name} portrait={familyCharacterById[id].portrait} usage="medallion"/></span>{familyCharacterById[id].name}</button>)}</div>{familyExploreClues[exploreId]&&<div className={styles.familyExploreClue} aria-live="polite"><p className="eyebrow">A clue to consider</p><h4>{familyCharacterById[exploreId].name}</h4><p>{familyExploreClues[exploreId].scene}</p><p><strong>{familyExploreClues[exploreId].question}</strong></p></div>}<button className={styles.familyPrimary} onClick={()=>onModeChange("build")}>{complete?"Revisit Build Network":"Build this network"}<ArrowRight size={17}/></button><div className={styles.familyJourneyRecord}><p className="eyebrow">Beyond family</p><h4>Journey relationships</h4><p>{discoveredJourney.length} relationship{discoveredJourney.length===1?"":"s"} recorded in your journey. These are separate from Family & Origins.</p>{discoveredJourney.length?<><div className={styles.familyJourneyChoices}>{discoveredJourney.slice(0,12).map(edge=><button key={edge.id} aria-pressed={exploreJourneyId===edge.id} onClick={()=>setExploreJourneyId(edge.id)}>{characters.find(c=>c.id===edge.fromCharacterId)?.name??edge.fromCharacterId} · {characters.find(c=>c.id===edge.toCharacterId)?.name??edge.toCharacterId}</button>)}</div>{activeJourney&&<p className={styles.familyJourneyDetail}><strong>{activeJourney.label}</strong> · {activeJourney.clue}</p>}{discoveredJourney.length>12&&<small>Showing the first twelve recorded bonds.</small>}</>:<p>Journey bonds appear as you meet people in the story.</p>}</div></section>}
    <section className={styles.familyEdgeList} aria-labelledby="family-bonds-title"><h3 id="family-bonds-title">Hanumān’s revealed bonds</h3>{placedEdges.length?<ul>{placedEdges.map(edge=><li key={edge.id}><button onClick={()=>openFocus(edge.sourceCharacterId)} aria-label={`${edge.statement} Open character focus`}><Check size={16}/><span><strong>{edge.statement}</strong><small>{edge.label}</small></span><ArrowRight size={15}/></button></li>)}</ul>:<p>No family bonds revealed yet. Inspect the portraits, then build the first connection.</p>}{placed.includes("family-kesari-hanuman")&&placed.includes("family-vayu-hanuman")&&<p className={styles.familyComplete}>Keśarī is Hanumān’s father in the family lineage; Vāyu has a divine role in his birth.</p>}{complete&&<p className={styles.familyComplete}>Three bonds now surround Hanumān at the beginning of his journey.</p>}</section>
  </div>}
  {mode==="focus"&&<div className={styles.familyFocusLayout}>
   <section className={styles.familyFocusPeople} aria-labelledby="focus-people-title">
    <p className="eyebrow">Character focus</p><h3 id="focus-people-title">Choose a person</h3>
    <div>{[familyCharacterById.hanuman,...placedEdges.map(edge=>familyCharacterById[edge.sourceCharacterId])].map(person=><button key={person.id} aria-pressed={focusId===person.id} onClick={()=>{setFocusId(person.id);setLearnMore(false);}}><span className={styles.familyFocusThumb}><CharacterPortrait name={person.name} portrait={person.portrait} usage="medallion"/></span>{person.name}</button>)}</div>
    {!placedEdges.length&&<p>Build a family bond to add more portraits here.</p>}
    <button className={styles.familyBackToNetwork} onClick={()=>onModeChange("explore")}><ArrowRight size={16} aria-hidden="true"/> Return to network</button>
   </section>
   <article className={styles.familyProfile} aria-labelledby="family-profile-title">
    <div className={styles.familyProfileTop}>
     <span className={styles.familyProfilePortrait}><CharacterPortrait name={selectedPerson.name} portrait={selectedPerson.portrait} usage="detail"/></span>
     <div><p className="eyebrow">{selectedPerson.kind==="journey"?"Journey character":"Family & Origins"}</p><h3 id="family-profile-title">{selectedPerson.name}</h3>
      {focusId in familyProfiles?<ul className={styles.familyProfileFacts}>{familyProfiles[focusId as keyof typeof familyProfiles].facts.map(fact=><li key={fact}>{fact}</li>)}</ul>:<p>{selectedPerson.summary}</p>}
     </div>
    </div>
    <div className={styles.familyProfileLinks}><h4>Immediate network</h4>{placedEdges.filter(edge=>edge.sourceCharacterId===selectedPerson.id||selectedPerson.id==="hanuman").map(edge=><button key={edge.id} onClick={()=>{setFocusId(edge.sourceCharacterId===selectedPerson.id?"hanuman":edge.sourceCharacterId);setLearnMore(false);}}>{edge.statement} <ArrowRight size={15} aria-hidden="true"/></button>)}{!placedEdges.length&&<p>No family bond has been revealed yet.</p>}</div>
    {focusId in familyProfiles?<>
     <button className={styles.familyPrimary} aria-expanded={learnMore} aria-controls="family-learn-more" onClick={()=>setLearnMore(value=>!value)}>{learnMore?"Close Learn More":`Learn More about ${selectedPerson.name}`}<BookOpen size={17} aria-hidden="true"/></button>
     {learnMore&&<div id="family-learn-more" className={styles.familyLearnMore}><p className="eyebrow">Origins · context · meaning</p><h3>Explore {selectedPerson.name} further</h3><p className={styles.familyLearnIntro}>Open a section to follow their story. The source notes are there whenever you want to look closer.</p>{familyProfiles[focusId as keyof typeof familyProfiles].sections.map(section=><FamilyProfileDisclosure key={section.title} section={section}/>)}</div>}
    </>:selectedPerson.kind==="journey"?<Link className={styles.familyProfileJourneyLink} href={`/characters/${selectedPerson.id}`}>Open the full character profile <ArrowRight size={16}/></Link>:<p className={styles.familyPlaceholder}><Info size={16}/> There is more to discover about this person as the journey grows.</p>}
   </article>
  </div>}
 </div>;
}

function NetworkPortrait({person,x,y,onClick}:{person:NetworkCharacter;x:number;y:number;onClick:()=>void}){return <button className={styles.familyPlacedPerson} draggable={false} onDragStart={event=>event.preventDefault()} style={{left:`${x}%`,top:`${y}%`}} onClick={onClick} aria-label={`${person.name}, revealed family connection. Open character focus`}><span className={styles.familyPortrait}><CharacterPortrait name={person.name} portrait={person.portrait} usage="medallion" draggable={false}/></span><strong>{person.name}</strong></button>}

function FamilyProfileDisclosure({section}:{section:FamilyProfileSection}){
 return <details className={styles.familyLearnSection}>
  <summary>{section.title}</summary>
  <div><h4 className={styles.familySrOnly}>{section.title}</h4><p>{section.body}</p>
   {section.storyContext&&section.meaning&&<div className={styles.familyMeaning}><p><b>Story context</b><span>{section.storyContext}</span></p><p><b>Meaning · reflection</b><span>{section.meaning}</span></p></div>}
   <details className={styles.familySourceNotes}><summary>Source notes</summary><div><p><strong>Claim type:</strong> {section.claimType==="learningInterpretation"?"Interpretive learning note":"Textual basis"}</p>{section.sourceLimit&&<p><strong>Scope:</strong> {section.sourceLimit}</p>}{section.sources.map(source=><dl key={`${source.work}-${source.locator}`}><div><dt>Work</dt><dd>{source.work}</dd></div><div><dt>Edition</dt><dd>{source.edition}</dd></div><div><dt>Passage</dt><dd>{source.locator}</dd></div><div><dt>Printed page</dt><dd>{source.printedPage}</dd></div><div><dt>Source status</dt><dd>Checked against the approved Gita Press page. This is a paraphrase; an exact quotation needs a separate line-by-line check.</dd></div></dl>)}</div></details>
  </div>
 </details>;
}
