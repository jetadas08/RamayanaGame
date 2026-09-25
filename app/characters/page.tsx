"use client";
import {characters} from "@/data/discoveries";
import {useProgress} from "@/components/progress-provider";
import {CharacterCard} from "@/components/character-card";
import {useState} from "react";

export default function CharactersPage(){
 const {progress,hydrated}=useProgress();
 const [showUndiscovered,setShowUndiscovered]=useState(false);
 const discovered=characters.filter(character=>progress.unlockedCharacters.includes(character.name)).length;
 if(!hydrated)return <main className="page-shell" aria-busy="true"><div className="mx-auto max-w-6xl"><p className="eyebrow">Character collection</p><h1 className="page-title">Restoring your character memories</h1><p className="page-intro">Loading the people revealed by your journey.</p></div></main>;
 return <main className="page-shell"><div className="mx-auto max-w-6xl">
  <div className="collection-heading"><div><p className="eyebrow">Character collection</p><h1 className="page-title">Lives within the epic</h1><p className="page-intro">Meet guides, allies and opponents through the encounters that reveal their place in the journey.</p></div><div className="collection-count"><strong>{discovered}</strong><span>of {characters.length}<br/>discovered</span></div></div>
  <button className="character-collection-toggle" aria-expanded={showUndiscovered} onClick={()=>setShowUndiscovered(value=>!value)}>{showUndiscovered?"Show discovered characters":"Show undiscovered characters"} · {characters.length-discovered}</button>
  <div className="character-grid" data-show-undiscovered={showUndiscovered}>{characters.map(character=><CharacterCard key={character.id} character={character} unlocked={progress.unlockedCharacters.includes(character.name)} progress={progress}/>)}</div>
 </div></main>;
}
