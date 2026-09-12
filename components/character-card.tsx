import Link from "next/link";
import {BookOpenText, LockKeyhole, Sparkles, UsersRound} from "lucide-react";
import {CharacterPortrait} from "@/components/character-portrait";
import type {CharacterProfile} from "@/lib/types";

export function CharacterCard({character,unlocked}:{character:CharacterProfile;unlocked:boolean}){
 const card=<article className={`character-card ${unlocked?"discovered":"locked"}`}>
  <div className="character-card-portrait">
   {unlocked&&character.portrait?<CharacterPortrait name={character.name} portrait={character.portrait} usage="card"/>:<div className="character-lock"><LockKeyhole/><span>Undiscovered</span></div>}
  </div>
  <div className="character-card-body">
   <div className="flex items-center justify-between gap-3"><p className="eyebrow">{unlocked?"Discovered":`Unlock at HJ-${String(character.unlockNode).padStart(2,"0")}`}</p>{unlocked&&<Sparkles aria-hidden="true" size={16} className="text-[var(--gold)]"/>}</div>
   <h2 className="font-display mt-3 text-3xl">{unlocked?character.name:"Unknown figure"}</h2>
   <p className="character-script">{unlocked?character.sanskrit:"????"}</p>
   {unlocked?<>
    <p className="character-role">{character.role}</p>
    <div className="character-meta"><span><UsersRound size={14}/>{character.group}</span><span><BookOpenText size={14}/>{character.appearances.length} {character.appearances.length===1?"appearance":"appearances"}</span></div>
    <div className="character-qualities">{character.qualities.slice(0,3).map(quality=><span key={quality}>{quality}</span>)}</div>
    <p className="character-open">Open character record →</p>
   </>:<p className="character-lock-hint">Complete <strong>{character.unlockEncounter}</strong> to reveal this character.</p>}
  </div>
 </article>;
 return unlocked?<Link href={`/characters/${character.id}`} aria-label={`Open ${character.name} character record`}>{card}</Link>:card;
}
