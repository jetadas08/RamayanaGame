"use client";

import Link from "next/link";
import {ArrowLeft, BookMarked, HeartHandshake, LockKeyhole, Sparkles, UsersRound} from "lucide-react";
import {CharacterPortrait} from "@/components/character-portrait";
import {characters,relationships} from "@/data/discoveries";
import {journeyNodes} from "@/data/journey";
import {useProgress} from "@/components/progress-provider";
import {characterNameById} from "@/data/character-ids";
import {relationshipTypeLabels} from "@/data/relationships";

export function CharacterDetail({id}:{id:string}){
 const {progress,hydrated}=useProgress();
 const character=characters.find(item=>item.id===id)!;
 if(!hydrated)return <main className="page-shell">Loading your collection…</main>;
 const unlocked=progress.unlockedCharacters.includes(character.name);
 if(!unlocked)return <main className="page-shell"><div className="mx-auto max-w-3xl"><Link className="character-back" href="/characters"><ArrowLeft size={16}/> Character collection</Link><section className="character-detail-locked"><LockKeyhole size={34}/><p className="eyebrow">Undiscovered character</p><h1 className="font-display text-5xl">This story is still hidden</h1><p>Complete <strong>{character.unlockEncounter}</strong> to reveal this character record.</p><Link className="cta-primary" href={`/journey/hanuman/${journeyNodes[character.unlockNode-1].slug}`}>Go to HJ-{String(character.unlockNode).padStart(2,"0")}</Link></section></div></main>;

 const appearanceNodes=journeyNodes.filter(node=>character.appearances.includes(node.id));
 const relationRecords=relationships.filter(relation=>character.keyRelationships.includes(relation.id)&&progress.unlockedRelationships.includes(relation.id));
 return <main className="page-shell"><div className="mx-auto max-w-5xl">
  <Link className="character-back" href="/characters"><ArrowLeft size={16}/> Character collection</Link>
  <header className="character-detail-hero">
   <div className="character-detail-portrait">{character.portrait&&<CharacterPortrait name={character.name} portrait={character.portrait} usage="detail"/>}</div>
   <div><p className="eyebrow">{character.group} · Discovered</p><h1 className="page-title">{character.name}</h1><p className="character-detail-script">{character.sanskrit}</p><p className="character-transliteration">{character.transliteration}</p><p className="page-intro">{character.role}</p><div className="character-qualities mt-6">{character.qualities.map(quality=><span key={quality}>{quality}</span>)}</div></div>
  </header>
  <div className="character-detail-grid">
   <section className="character-detail-panel character-significance"><Sparkles/><div><p className="eyebrow">Spiritual significance</p><p>{character.spiritualSignificance}</p></div></section>
   <section className="character-detail-panel"><div className="character-section-title"><BookMarked/><div><p className="eyebrow">Story appearances</p><h2>Where this figure appears</h2></div></div><div className="character-record-list">{appearanceNodes.map(node=>{const revealed=progress.completedNodes.includes(node.id);return revealed?<Link key={node.id} href={`/journey/hanuman/${node.slug}`}><span>{node.id}</span><strong>{node.title}</strong><small>Open encounter →</small></Link>:<div key={node.id} className="unrevealed"><span>{node.id}</span><strong>Later appearance</strong><small>Continue the journey</small></div>})}</div></section>
   <section className="character-detail-panel"><div className="character-section-title"><HeartHandshake/><div><p className="eyebrow">Key relationships</p><h2>Discovered connections</h2></div></div>{relationRecords.length?<div className="character-relationship-list">{relationRecords.map(relation=><div key={relation.id}><span>{relationshipTypeLabels[relation.type]}</span><p><strong>{characterNameById[relation.fromCharacterId]}</strong> {relation.label} <strong>{characterNameById[relation.toCharacterId]}</strong></p></div>)}</div>:<p className="character-empty">Continue the journey to reveal this figure’s relationships.</p>}</section>
   <section className="character-detail-panel"><div className="character-section-title"><UsersRound/><div><p className="eyebrow">Sources</p><h2>Traditions in this record</h2></div></div><div className="character-source-list">{character.sources.map(source=><span key={source}>{source}</span>)}</div><p className="character-source-note">Source labels follow the comparison layers used by this journey.</p></section>
  </div>
 </div></main>;
}
