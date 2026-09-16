"use client";
import {useMemo,useState} from "react";
import {ArrowRight,Check,Lightbulb,Network,RotateCcw} from "lucide-react";
import {useProgress} from "@/components/progress-provider";
import {CharacterPortrait} from "@/components/character-portrait";
import {characters} from "@/data/discoveries";
import {relationshipTypeChallengeFor} from "@/data/relationship-challenges";
import {availableRelationshipIds,relationshipTypeLabels,relationships} from "@/data/relationships";
import type {Relationship} from "@/lib/types";
import styles from "@/app/connections/connections.module.scss";

export function RelationshipChallengeGame(){
 const {progress,answerConnection}=useProgress();
 const [from,setFrom]=useState(""),[to,setTo]=useState(""),[selectedType,setSelectedType]=useState(""),[feedback,setFeedback]=useState<"idle"|"right"|"wrong">("idle"),[confirmedId,setConfirmedId]=useState("");
 const availableSet=useMemo(()=>new Set(availableRelationshipIds(progress.completedNodes.length)),[progress.completedNodes.length]);
 const discoveredSet=useMemo(()=>new Set(progress.unlockedRelationships),[progress.unlockedRelationships]);
 const candidates=useMemo(()=>relationships.filter(edge=>availableSet.has(edge.id)&&progress.unlockedCharacters.includes(characterName(edge.fromCharacterId))&&progress.unlockedCharacters.includes(characterName(edge.toCharacterId))),[availableSet,progress.unlockedCharacters]);
 const undiscovered=candidates.filter(edge=>!discoveredSet.has(edge.id));
 const fromIds=Array.from(new Set(undiscovered.map(edge=>edge.fromCharacterId)));
 const targetIds=Array.from(new Set(undiscovered.filter(edge=>edge.fromCharacterId===from).map(edge=>edge.toCharacterId)));
 const pairEdges=undiscovered.filter(edge=>edge.fromCharacterId===from&&edge.toCharacterId===to);
 const options=(pairEdges[0]&&relationshipTypeChallengeFor(pairEdges[0].id)?.options)??[];
 const confirmed=relationships.find(edge=>edge.id===confirmedId);
 function selectFrom(id:string){setFrom(id);setTo("");setSelectedType("");setFeedback("idle");setConfirmedId("");}
 function selectTo(id:string){setTo(id);setSelectedType("");setFeedback("idle");setConfirmedId("");}
 function check(){
  if(!selectedType||!pairEdges.length)return;
  const edge=pairEdges.find(item=>item.type===selectedType);
  if(edge){answerConnection(`RC-TYPE-${edge.id}`,selectedType);setConfirmedId(edge.id);setFeedback("right");}
  else{answerConnection(`RC-TYPE-${pairEdges[0].id}`,selectedType);setFeedback("wrong");}
 }
 function again(){setSelectedType("");setFeedback("idle");setConfirmedId("");if(pairEdges.length<=1){setFrom("");setTo("");}}
 return <section className={styles.buildGame}>
  <header className={styles.buildHeader}><div><p className="eyebrow">Build the living network</p><h2>Who is connected, and how?</h2><p>Journey encounters reveal clues. You make each relationship part of the network.</p></div><div className={styles.buildCount}><strong>{discoveredSet.size}</strong><span>discovered</span><small>{undiscovered.length} ready to learn</small></div></header>
  {undiscovered.length===0&&feedback!=="right"?<div className={styles.empty}><Network/><h2>Your available network is complete</h2><p>Continue the journey to reveal more characters and relationship clues.</p></div>:<>
   <div className={styles.buildSteps}><span className={from?styles.stepDone:styles.stepActive}>1 Choose first character</span><span className={to?styles.stepDone:from?styles.stepActive:""}>2 Choose second character</span><span className={selectedType?styles.stepDone:to?styles.stepActive:""}>3 Name the relationship</span></div>
   <div className={styles.buildWorkspace}>
    <div className={styles.characterPicker}><p>{from?"First character":"Choose the first character"}</p><div>{from?<CharacterChoice id={from} active onClick={()=>selectFrom("")}/>:fromIds.map(id=><CharacterChoice key={id} id={id} onClick={()=>selectFrom(id)}/>)}</div></div>
    <ArrowRight className={styles.buildArrow}/>
    <div className={styles.characterPicker}><p>{to?"Second character":from?"Who connects with them?":"Choose a first character"}</p><div>{to?<CharacterChoice id={to} active onClick={()=>selectTo("")}/>:targetIds.map(id=><CharacterChoice key={id} id={id} onClick={()=>selectTo(id)}/>)}</div></div>
   </div>
   {pairEdges.length>0&&<div className={styles.relationshipQuestion}><div className={styles.storyClue}><Lightbulb/><div><strong>Story clue</strong><p>{pairEdges[0].clue}</p></div></div><h3>Which relationship does this reveal?</h3><div className={styles.relationshipOptions}>{options.map(option=><button key={option.id} className={selectedType===option.id?(feedback==="right"?styles.correct:feedback==="wrong"?styles.incorrect:styles.optionSelected):""} onClick={()=>{setSelectedType(option.id);setFeedback("idle");}} disabled={feedback==="right"}>{option.label}{feedback==="right"&&selectedType===option.id&&<Check/>}</button>)}</div><button className={styles.checkConnection} onClick={check} disabled={!selectedType||feedback==="right"}>Check connection <ArrowRight/></button></div>}
   {feedback==="wrong"&&<div className={`${styles.connectionFeedback} ${styles.feedbackWrong}`}><strong>Look at the story clue again.</strong><p>The characters are right, but that relationship does not fit this encounter. Choose another bond and retry.</p></div>}
   {feedback==="right"&&confirmed&&<div className={`${styles.connectionFeedback} ${styles.feedbackRight}`}><strong>Connection discovered</strong><p>{characterName(confirmed.fromCharacterId)} {confirmed.label} {characterName(confirmed.toCharacterId)}. This line is now permanent in Explore Network and both character profiles.</p><ConfirmedRelationship relationship={confirmed}/><button className={styles.discoverAnother} onClick={again}>Discover another relationship <RotateCcw/></button></div>}
  </>}
 </section>;
}

function characterName(id:string){return characters.find(character=>character.id===id)?.name??id;}
function CharacterChoice({id,active=false,onClick}:{id:string;active?:boolean;onClick:()=>void}){const character=characters.find(item=>item.id===id);if(!character)return null;return <button className={`${styles.characterChoice} ${active?styles.characterChoiceActive:""}`} onClick={onClick}><span>{character.portrait&&<CharacterPortrait name={character.name} portrait={character.portrait} usage="medallion"/>}</span><strong>{character.name}</strong></button>}
function ConfirmedRelationship({relationship}:{relationship:Relationship}){const from=characters.find(item=>item.id===relationship.fromCharacterId),to=characters.find(item=>item.id===relationship.toCharacterId);if(!from||!to)return null;return <div className={styles.confirmedVisual}><span className={styles.confirmedPerson}><span className={styles.confirmedPortrait}>{from.portrait&&<CharacterPortrait name={from.name} portrait={from.portrait} usage="medallion"/>}</span><strong>{from.name}</strong></span><span className={styles.confirmedBond}><Check/><span>{relationshipTypeLabels[relationship.type]}</span></span><span className={styles.confirmedPerson}><span className={styles.confirmedPortrait}>{to.portrait&&<CharacterPortrait name={to.name} portrait={to.portrait} usage="medallion"/>}</span><strong>{to.name}</strong></span></div>}
