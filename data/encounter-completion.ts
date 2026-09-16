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

export function encounterCompletionRewards(node:JourneyNode,progress:JourneyProgressState,scene:{earned:number;total:number}):EncounterCompletionReward[]{
 const rewards:EncounterCompletionReward[]=[];
 const undiscoveredHiddenCharacters=new Set((node.activities??[]).flatMap(activity=>activity.type==="sceneDiscovery"&&activity.hidden?activity.hotspots.filter(hotspot=>hotspot.unlockCharacter&&!progress.sceneDiscoveries.includes(`${activity.id}:${hotspot.id}`)).map(hotspot=>hotspot.unlockCharacter!):[]));
 const newCharacters=characters.filter(character=>character.unlockNode===node.number&&progress.unlockedCharacters.includes(character.name)&&!undiscoveredHiddenCharacters.has(character.name));
 if(newCharacters.length)rewards.push({id:`${node.id}-characters`,type:"character",label:newCharacters.length===1?"Character discovered":"Characters discovered",detail:joined(newCharacters.map(character=>character.name)),href:newCharacters.length===1?`/characters/${newCharacters[0].id}`:"/characters"});

 const available=new Set(availableRelationshipIds(progress.completedNodes.length));
 const nodeRelationships=relationships.filter(relationship=>relationship.eventId===node.id&&available.has(relationship.id)&&!undiscoveredHiddenCharacters.has(characterNameById[relationship.fromCharacterId]??"")&&!undiscoveredHiddenCharacters.has(characterNameById[relationship.toCharacterId]??""));
 const relationshipText=(relationship:typeof relationships[number])=>`${characterNameById[relationship.fromCharacterId]??relationship.fromCharacterId} ${relationship.label} ${characterNameById[relationship.toCharacterId]??relationship.toCharacterId}`;
 const discovered=nodeRelationships.filter(relationship=>progress.unlockedRelationships.includes(relationship.id));
 const clues=nodeRelationships.filter(relationship=>!progress.unlockedRelationships.includes(relationship.id));
 if(discovered.length)rewards.push({id:`${node.id}-relationships`,type:"relationship",label:discovered.length===1?"Connection discovered":"Connections discovered",detail:joined(discovered.map(relationshipText)),href:"/connections"});
 if(clues.length)rewards.push({id:`${node.id}-clues`,type:"connectionClue",label:clues.length===1?"Connection clue available":"Connection clues available",detail:joined(clues.map(relationship=>relationship.clue)),href:"/connections"});

 for(const object of sacredObjects.filter(item=>item.discoveryNode===node.id&&progress.discoveredObjects.includes(item.id)))rewards.push({id:object.id,type:"sacredObject",label:"Sacred object discovered",detail:object.name,href:"/progress",targetId:object.id});
 if(scene.total>0&&scene.earned>0)rewards.push({id:`${node.id}-scene`,type:"sceneDiscovery",label:"Scene discoveries",detail:`${scene.earned} of ${scene.total} revealed`});

 const knowledge=characterProfileFields.filter(field=>field.unlock.kind==="journey"&&field.unlock.nodeId===node.id&&characterFieldIsUnlocked(field,progress)&&!undiscoveredHiddenCharacters.has(characterNameById[field.characterId]??""));
 if(knowledge.length){const names=Array.from(new Set(knowledge.map(field=>characterNameById[field.characterId]).filter((name):name is string=>Boolean(name))));rewards.push({id:`${node.id}-knowledge`,type:"characterKnowledge",label:"Character knowledge added",detail:`${joined(names)} · ${knowledge.length} ${knowledge.length===1?"profile fact":"profile facts"}`,href:names.length===1?`/characters/${knowledge[0].characterId}`:"/characters"});}

 for(const achievement of achievements.filter(item=>item.node===node.number&&progress.achievements.includes(item.name)))rewards.push({id:`achievement-${achievement.name}`,type:"achievement",label:"Achievement earned",detail:achievement.name,href:"/progress"});
 return rewards;
}
