import {characterNameById} from "@/data/character-ids";
import {relationshipTypeLabels,relationshipTypes,relationships} from "@/data/relationships";
import type {Difficulty,Relationship,RelationshipChallenge,RelationshipType} from "@/lib/types";

function rotate<T>(items:T[],offset:number){return [...items.slice(offset%items.length),...items.slice(0,offset%items.length)];}
function typeOptions(answer:RelationshipType,index:number){const choices=Array.from(new Set([answer,...rotate(relationshipTypes,index).filter(type=>type!==answer)])).slice(0,4);return rotate(choices,index%4).map(id=>({id,label:relationshipTypeLabels[id]}));}
const characterIds=Array.from(new Set(relationships.flatMap(r=>[r.fromCharacterId,r.toCharacterId])));
function characterOptions(answer:string,index:number){const choices=Array.from(new Set([answer,...rotate(characterIds,index).filter(id=>id!==answer)])).slice(0,4);return rotate(choices,index%4).map(id=>({id,label:characterNameById[id]??id}));}
function eventLabel(eventId:string){return eventId.replace("HJ-","Encounter ");}

const generated=relationships.flatMap((relationship,index):RelationshipChallenge[]=>[
 {id:`RC-TYPE-${relationship.id}`,type:"identify-type",difficulty:"explorer",prompt:`${characterNameById[relationship.fromCharacterId]} — ? — ${characterNameById[relationship.toCharacterId]}`,context:`In ${eventLabel(relationship.eventId)}, ${relationship.label}. Which relationship is being revealed?`,relationshipIds:[relationship.id],options:typeOptions(relationship.type,index),answer:relationship.type,explanation:`${characterNameById[relationship.fromCharacterId]} → ${characterNameById[relationship.toCharacterId]} is ${relationshipTypeLabels[relationship.type]} here: ${relationship.label}.`},
 {id:`RC-CHAR-${relationship.id}`,type:"complete-character",difficulty:"seeker",prompt:`${characterNameById[relationship.fromCharacterId]} — ${relationshipTypeLabels[relationship.type]} — ?`,context:`Complete the directed connection revealed in ${eventLabel(relationship.eventId)}.`,relationshipIds:[relationship.id],options:characterOptions(relationship.toCharacterId,index+3),answer:relationship.toCharacterId,explanation:`The connection leads to ${characterNameById[relationship.toCharacterId]}: ${relationship.label}.`},
]);

const configured:RelationshipChallenge[]=[
 {id:"RC-NETWORK-HANUMAN-MESSENGER",type:"missing-network",difficulty:"scholar",prompt:"Jāmbavān → Guidance → Hanumān → ? → Sītā",context:"Restore the missing relationship label in this discovered network.",relationshipIds:["REL-JAMBAVAN-HANUMAN-GUIDANCE","REL-HANUMAN-SITA-MESSENGER"],options:typeOptions("messenger",5),answer:"messenger",explanation:"Hanumān reaches Sītā as Rāma’s messenger, carrying words and the signet ring."},
 {id:"RC-NETWORK-RAMA-HANUMAN-SITA",type:"connection-chain",difficulty:"scholar",prompt:"Rāma → Hanumān → ?",context:"Reconstruct the mission chain: Rāma entrusts Hanumān, and Hanumān carries the message onward.",relationshipIds:["REL-RAMA-HANUMAN-SERVICE","REL-HANUMAN-SITA-MESSENGER"],options:characterOptions("sita",7),answer:"sita",explanation:"The chain reaches Sītā: Rāma entrusts the mission to Hanumān, who becomes the messenger to her."},
 {id:"RC-NETWORK-COUNSEL-COURT",type:"missing-network",difficulty:"scholar",prompt:"Vibhīṣaṇa → ? → Rāvaṇa",context:"Name the directed relationship shown when Vibhīṣaṇa speaks in Rāvaṇa’s court.",relationshipIds:["REL-VIBHISHANA-RAVANA-GUIDANCE"],options:typeOptions("guidance",9),answer:"guidance",explanation:"Vibhīṣaṇa offers guidance to Rāvaṇa. The direction matters: Rāvaṇa does not guide Vibhīṣaṇa in this event."},
];
export const relationshipChallenges=[...generated,...configured];
export function availableRelationshipChallenges(unlockedIds:string[]){const unlocked=new Set(unlockedIds);return relationshipChallenges.filter(challenge=>challenge.relationshipIds.every(id=>unlocked.has(id)));}
export function relationshipChallengeById(id:string){return relationshipChallenges.find(challenge=>challenge.id===id);}
export function correctRelationshipAnswers(answers:Record<string,string>){return Object.entries(answers).filter(([id,answer])=>relationshipChallengeById(id)?.answer===answer);}
export function relationshipAchievementNames(answers:Record<string,string>){
 const correct=correctRelationshipAnswers(answers);const ids=new Set(correct.map(([id])=>id));const names:string[]=[];
 if(correct.length>=1)names.push("First Connection");
 if(new Set(correct.flatMap(([id])=>relationshipChallengeById(id)?.relationshipIds??[])).size>=5)names.push("Web of Dharma");
 if(ids.has("RC-TYPE-REL-HANUMAN-SITA-MESSENGER")||ids.has("RC-NETWORK-HANUMAN-MESSENGER"))names.push("Messenger of Rāma");
 if(ids.has("RC-TYPE-REL-RAMA-LAKSHMANA-FAMILY")||ids.has("RC-CHAR-REL-RAMA-LAKSHMANA-FAMILY"))names.push("Family of Ayodhyā");
 if(correct.some(([id])=>relationshipChallengeById(id)?.relationshipIds.some(relId=>["REL-JAMBAVAN-HANUMAN-GUIDANCE","REL-HANUMAN-VIBHISHANA-FRIENDSHIP","REL-SUGRIVA-RAMA-ALLIANCE"].includes(relId))))names.push("Friend of the Vānaras");
 if(correct.length>=12)names.push("Master of Connections");
 return names;
}
export const relationshipChallengeLevels:Record<Difficulty,string>={explorer:"Identify the bond",seeker:"Complete the connection",scholar:"Reconstruct the network"};
export function relationshipByIds(ids:string[]):Relationship[]{return ids.map(id=>relationships.find(r=>r.id===id)).filter((r):r is Relationship=>Boolean(r));}
