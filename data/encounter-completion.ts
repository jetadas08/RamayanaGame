import {characterFieldIsUnlocked,characterProfileFields} from "@/data/character-knowledge";
import {characterNameById} from "@/data/character-ids";
import {achievements,characters} from "@/data/discoveries";
import {sacredObjects} from "@/data/encounter-activities";
import {availableRelationshipIds,relationships} from "@/data/relationships";
import type {JourneyNode,JourneyProgressState} from "@/lib/types";

export type EncounterCompletionRewardType="character"|"relationship"|"connectionClue"|"sacredObject"|"sceneDiscovery"|"characterKnowledge"|"achievement";
export interface EncounterCompletionReward {
 id:string;
 type:EncounterCompletionRewardType;
 label:string;
 detail:string;
 href?:string;
 targetId?:string;
}

const joined=(items:string[])=>items.length>3?`${items.slice(0,3).join(", ")} + ${items.length-3} more`:items.join(", ");
export const completionMasteryCopy=(stars:number)=>stars===3?"3 of 3 mastery stars earned.":`${stars} of 3 mastery stars earned. You can continue now or replay the activities to improve your mastery.`;

export function encounterCompletionRewards(node:JourneyNode,progress:JourneyProgressState,scene:{earned:number;total:number},entry?:JourneyProgressState):EncounterCompletionReward[]{
 const rewards:EncounterCompletionReward[]=[];
 const label=(added:string,fresh:boolean)=>entry&&!fresh?"In your record":added;
 const undiscoveredHiddenCharacters=new Set((node.activities??[]).flatMap(activity=>activity.type==="sceneDiscovery"&&activity.hidden?activity.hotspots.filter(hotspot=>hotspot.unlockCharacter&&!progress.sceneDiscoveries.includes(`${activity.id}:${hotspot.id}`)).map(hotspot=>hotspot.unlockCharacter!):[]));
 const discoveredCharacters=characters.filter(character=>character.appearances[0]===node.id&&progress.unlockedCharacters.includes(character.name)&&!undiscoveredHiddenCharacters.has(character.name));
 // HJ-12 preserves the complete source roster in Characters while keeping the
 // completion reward focused on the two figures who change the escalation.
 const newCharacters=node.id==="HJ-12"?discoveredCharacters.filter(character=>["Akṣa Kumāra","Indrajit"].includes(character.name)):discoveredCharacters;
 if(newCharacters.length)rewards.push({id:`${node.id}-characters`,type:"character",label:label("Added to Characters",newCharacters.some(character=>!entry?.unlockedCharacters.includes(character.name))),detail:joined(newCharacters.map(character=>character.name)),href:newCharacters.length===1?`/characters/${newCharacters[0].id}`:"/characters"});

 const available=new Set(availableRelationshipIds(progress.completedNodes.length,progress.meetingCompletedNodes.length,progress.warCompletedNodes.length,progress.herbsCompletedNodes.length,progress.finaleCompletedNodes.length));
 const nodeRelationships=relationships.filter(relationship=>(relationship.discoverableFrom.includes(node.id)||(node.id.startsWith("HFM-")&&availableRelationshipIds(0,node.number).includes(relationship.id)&&!availableRelationshipIds(0,node.number-1).includes(relationship.id)))&&available.has(relationship.id)&&!undiscoveredHiddenCharacters.has(characterNameById[relationship.fromCharacterId]??"")&&!undiscoveredHiddenCharacters.has(characterNameById[relationship.toCharacterId]??""));
 const relationshipText=(relationship:typeof relationships[number])=>`${characterNameById[relationship.fromCharacterId]??relationship.fromCharacterId} ${relationship.label} ${characterNameById[relationship.toCharacterId]??relationship.toCharacterId}`;
 const discovered=nodeRelationships.filter(relationship=>progress.unlockedRelationships.includes(relationship.id));
 const clues=nodeRelationships.filter(relationship=>!progress.unlockedRelationships.includes(relationship.id));
 if(discovered.length)rewards.push({id:`${node.id}-relationships`,type:"relationship",label:label("Added to Connections",discovered.some(relationship=>!entry?.unlockedRelationships.includes(relationship.id))),detail:joined(discovered.map(relationshipText)),href:"/connections"});
 if(clues.length)rewards.push({id:`${node.id}-clues`,type:"connectionClue",label:"Clue saved for later reasoning",detail:joined(clues.map(relationship=>relationship.clue)),href:"/connections"});

 for(const object of sacredObjects.filter(item=>item.discoveryNode===node.id&&progress.discoveredObjects.includes(item.id)))rewards.push({id:object.id,type:"sacredObject",label:label("Sacred Object · carried into later encounters",!entry?.discoveredObjects.includes(object.id)),detail:object.name,href:"/progress",targetId:object.id});
 if(scene.total>0&&scene.earned>0)rewards.push({id:`${node.id}-scene`,type:"sceneDiscovery",label:label("Added to journey record",progress.sceneDiscoveries.length>(entry?.sceneDiscoveries.length??0)),detail:`${scene.earned} of ${scene.total} observations saved`});

 const knowledge=characterProfileFields.filter(field=>field.unlock.kind==="journey"&&field.unlock.nodeId===node.id&&characterFieldIsUnlocked(field,progress)&&!undiscoveredHiddenCharacters.has(characterNameById[field.characterId]??""));
 if(knowledge.length){const names=Array.from(new Set(knowledge.map(field=>characterNameById[field.characterId]).filter((name):name is string=>Boolean(name))));rewards.push({id:`${node.id}-knowledge`,type:"characterKnowledge",label:label("Added to Characters",knowledge.some(field=>!entry||!characterFieldIsUnlocked(field,entry))),detail:`${joined(names)} · ${knowledge.length} ${knowledge.length===1?"profile fact":"profile facts"}`,href:names.length===1?`/characters/${knowledge[0].characterId}`:"/characters"});}

 for(const achievement of achievements.filter(item=>node.id.startsWith("HJ-")&&item.node===node.number&&progress.achievements.includes(item.name)))rewards.push({id:`achievement-${achievement.name}`,type:"achievement",label:label("Achievement earned",!entry?.achievements.includes(achievement.name)),detail:achievement.name,href:"/progress"});
 return rewards;
}
