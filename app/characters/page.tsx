"use client";
import {characters} from "@/data/discoveries";
import {useProgress} from "@/components/progress-provider";
import {CharacterCard} from "@/components/character-card";

export default function CharactersPage(){
 const {progress}=useProgress();
 const discovered=characters.filter(character=>progress.unlockedCharacters.includes(character.name)).length;
 return <main className="page-shell"><div className="mx-auto max-w-6xl">
  <div className="collection-heading"><div><p className="eyebrow">Character collection</p><h1 className="page-title">Lives within the epic</h1><p className="page-intro">Meet guides, allies and opponents through the encounters that reveal their place in the journey.</p></div><div className="collection-count"><strong>{discovered}</strong><span>of {characters.length}<br/>discovered</span></div></div>
  <div className="character-grid">{characters.map(character=><CharacterCard key={character.id} character={character} unlocked={progress.unlockedCharacters.includes(character.name)}/>)}</div>
 </div></main>;
}
