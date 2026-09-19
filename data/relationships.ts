import type {CharacterConnectionMap,NarrativeContext,Relationship,RelationshipType,RelationshipUnlock,SourceId} from "@/lib/types";
import {characterNameById} from "@/data/character-ids";

type Seed=Omit<Relationship,"unlocked"|"directional"|"clue"|"discoverableFrom"|"narrativeContexts">&{directional?:boolean};
const vr:SourceId[]=["VR-GP","VR-HPS"];
const seeds:Seed[]=[
 {id:"REL-HANUMAN-BHARATA-MESSENGER",fromCharacterId:"hanuman",toCharacterId:"bharata",type:"messenger",label:"brings Rāma’s return message to",eventId:"HFF-03",sources:["VR-GP"],unlockAt:99,finaleUnlockAt:2},
 {id:"REL-BHARATA-RAMA-FAMILY",fromCharacterId:"bharata",toCharacterId:"rama",type:"family",label:"is brother of",eventId:"HFF-03",sources:["VR-GP"],unlockAt:99,finaleUnlockAt:3,directional:false},
 {id:"REL-BHARATA-RAMA-DEVOTION",fromCharacterId:"bharata",toCharacterId:"rama",type:"devotion",label:"awaits the return and restores the kingdom to",eventId:"HFF-04",sources:["VR-GP"],unlockAt:99,finaleUnlockAt:4},
 {id:"REL-SUSHENA-LAKSHMANA-PROTECTOR",fromCharacterId:"sushena",toCharacterId:"lakshmana",type:"protector",label:"diagnoses and treats as monkey-physician",eventId:"HFH-03",sources:["VR-GP"],unlockAt:99,herbsUnlockAt:3,roleContext:"Physician / healing: examines signs of life, prepares medicine, and administers treatment in Yuddha 101."},
 {id:"REL-SUSHENA-HANUMAN-GUIDANCE",fromCharacterId:"sushena",toCharacterId:"hanuman",type:"guidance",label:"instructs to retrieve medicine in the second rescue",eventId:"HFH-03",sources:["VR-GP"],unlockAt:99,herbsUnlockAt:3,roleContext:"Medicinal instruction in the second mission, distinct from Jāmbavān’s first mission."},
 {id:"REL-HANUMAN-VIBHISHANA-ALLIANCE",fromCharacterId:"hanuman",toCharacterId:"vibhishana",type:"alliance",label:"supports through reasoned counsel and shared rescue work",eventId:"HFW-02",sources:["VR-GP"],unlockAt:99,warUnlockAt:2,directional:false},
 {id:"REL-VIBHISHANA-RAMA-ALLIANCE",fromCharacterId:"vibhishana",toCharacterId:"rama",type:"alliance",label:"seeks refuge and joins the cause of",eventId:"HFW-02",sources:["VR-GP"],unlockAt:99,warUnlockAt:2},
 {id:"REL-NALA-RAMA-SERVICE",fromCharacterId:"nala",toCharacterId:"rama",type:"service",label:"builds the bridge for the army of",eventId:"HFW-03",sources:["VR-GP"],unlockAt:99,warUnlockAt:3},
 {id:"REL-DHUMRAKSHA-HANUMAN-OPPOSITION",fromCharacterId:"dhumraksha",toCharacterId:"hanuman",type:"opposition",label:"advances against the western sector commanded by",eventId:"HFW-04",sources:["VR-GP"],unlockAt:99,warUnlockAt:4},
 {id:"REL-AKAMPANA-HANUMAN-OPPOSITION",fromCharacterId:"akampana",toCharacterId:"hanuman",type:"opposition",label:"attacks the warriors protected by",eventId:"HFW-05",sources:["VR-GP"],unlockAt:99,warUnlockAt:5},
 {id:"REL-JAMBAVAN-HANUMAN-RESCUE",fromCharacterId:"jambavan",toCharacterId:"hanuman",type:"guidance",label:"directs toward the lifesaving mission",eventId:"HFW-06",sources:["VR-GP"],unlockAt:99,warUnlockAt:6},

 {id:"REL-RAMA-HANUMAN-SERVICE",fromCharacterId:"rama",toCharacterId:"hanuman",type:"service",label:"entrusts the search mission to",eventId:"HJ-01",sources:vr,unlockAt:0},
 {id:"REL-ANGADA-PARTY-GUIDANCE",fromCharacterId:"angada",toCharacterId:"vanara-search-party",type:"guidance",label:"leads",eventId:"HJ-01",sources:vr,unlockAt:1},
 {id:"REL-SAMPATI-PARTY-GUIDANCE",fromCharacterId:"sampati",toCharacterId:"vanara-search-party",type:"guidance",label:"reveals Sītā’s direction to",eventId:"HJ-02",sources:vr,unlockAt:2},
 {id:"REL-JAMBAVAN-HANUMAN-GUIDANCE",fromCharacterId:"jambavan",toCharacterId:"hanuman",type:"guidance",label:"awakens remembered strength in",eventId:"HJ-03",sources:["VR-GP","RCM-GP"],unlockAt:3},
 {id:"REL-HANUMAN-RAMA-DEVOTION",fromCharacterId:"hanuman",toCharacterId:"rama",type:"devotion",label:"is devoted to",eventId:"HJ-04",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:4},
 {id:"REL-MAINAKA-HANUMAN-ALLIANCE",fromCharacterId:"mainaka",toCharacterId:"hanuman",type:"alliance",label:"offers rest and aid to",eventId:"HJ-05",sources:vr,unlockAt:5},
 {id:"REL-SURASA-HANUMAN-GUIDANCE",fromCharacterId:"surasa",toCharacterId:"hanuman",type:"guidance",label:"tests and blesses",eventId:"HJ-06",sources:vr,unlockAt:6},
 {id:"REL-SIMHIKA-HANUMAN-OPPOSITION",fromCharacterId:"simhika",toCharacterId:"hanuman",type:"opposition",label:"seizes the shadow of",eventId:"HJ-07",sources:vr,unlockAt:7},
 {id:"REL-LANKINI-HANUMAN-OPPOSITION",fromCharacterId:"lankini",toCharacterId:"hanuman",type:"opposition",label:"guards Laṅkā against",eventId:"HJ-08",sources:vr,unlockAt:8},
 {id:"REL-HANUMAN-VIBHISHANA-FRIENDSHIP",fromCharacterId:"hanuman",toCharacterId:"vibhishana",type:"friendship",label:"meets as a dharmic ally",eventId:"HJ-09",sources:["RCM-GP"],unlockAt:9},
 {id:"REL-TRIJATA-SITA-PROTECTOR",fromCharacterId:"trijata",toCharacterId:"sita",type:"protector",label:"reassures and protects hope for",eventId:"HJ-10",sources:vr,unlockAt:10},
 {id:"REL-HANUMAN-SITA-MESSENGER",fromCharacterId:"hanuman",toCharacterId:"sita",type:"messenger",label:"delivers Rāma’s message to",eventId:"HJ-11",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:11},
 {id:"REL-HANUMAN-RAMA-SERVICE",fromCharacterId:"hanuman",toCharacterId:"rama",type:"service",label:"carries out the search mission for",eventId:"HJ-11",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:11},
 {id:"REL-RAMA-SITA-MARRIAGE",fromCharacterId:"rama",toCharacterId:"sita",type:"marriage",label:"is married to",eventId:"HFM-03",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:11,directional:false},
 {id:"REL-HANUMAN-JAMBUMALI-OPPOSITION",fromCharacterId:"hanuman",toCharacterId:"jambumali",type:"opposition",label:"defeats",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-HANUMAN-AKSHA-OPPOSITION",fromCharacterId:"hanuman",toCharacterId:"aksha-kumara",type:"opposition",label:"defeats in battle",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-INDRAJIT-HANUMAN-OPPOSITION",fromCharacterId:"indrajit",toCharacterId:"hanuman",type:"opposition",label:"captures with the Brahmāstra",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-RAVANA-INDRAJIT-FAMILY",fromCharacterId:"ravana",toCharacterId:"indrajit",type:"family",label:"is father of",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-RAVANA-VIBHISHANA-FAMILY",fromCharacterId:"ravana",toCharacterId:"vibhishana",type:"family",label:"is brother of",eventId:"HJ-13",sources:vr,unlockAt:13,directional:false},
 {id:"REL-VIBHISHANA-RAVANA-GUIDANCE",fromCharacterId:"vibhishana",toCharacterId:"ravana",type:"guidance",label:"offers dharmic counsel to",eventId:"HJ-13",sources:vr,unlockAt:13},
 {id:"REL-HANUMAN-RAVANA-MESSENGER",fromCharacterId:"hanuman",toCharacterId:"ravana",type:"messenger",label:"delivers a warning to",eventId:"HJ-13",sources:vr,unlockAt:13},
 {id:"REL-RAVANA-HANUMAN-OPPOSITION",fromCharacterId:"ravana",toCharacterId:"hanuman",type:"opposition",label:"orders the punishment of",eventId:"HJ-14",sources:vr,unlockAt:14},
 {id:"REL-HANUMAN-RAMA-MESSENGER",fromCharacterId:"hanuman",toCharacterId:"rama",type:"messenger",label:"returns Sītā’s message to",eventId:"HJ-15",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:15},
 {id:"REL-SUGRIVA-RAMA-ALLIANCE",fromCharacterId:"sugriva",toCharacterId:"rama",type:"alliance",label:"is allied with",eventId:"HFM-04",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:15,directional:false},
 {id:"REL-RAMA-LAKSHMANA-FAMILY",fromCharacterId:"rama",toCharacterId:"lakshmana",type:"family",label:"is brother of",eventId:"HFM-03",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:15,directional:false},
 {id:"REL-HANUMAN-SUGRIVA-SERVICE",fromCharacterId:"hanuman",toCharacterId:"sugriva",type:"service",label:"serves as envoy for",eventId:"HFM-01",sources:vr,unlockAt:15},
];
const typeClues:Record<RelationshipType,string>={
 family:"The story identifies their family relationship.",marriage:"They are joined in marriage across the mission.",devotion:"Their relationship is shaped by steadfast faith and purpose.",service:"Their relationship is expressed through accepted responsibility and service.",teacher:"Their relationship passes knowledge deliberately from guide to learner.",alliance:"They join their aims through a shared cause.",friendship:"They recognize common purpose in an unexpected place.",opposition:"Their purposes come into direct conflict.",messenger:"Trusted words or proof pass between them through a messenger relationship.",protector:"Their relationship preserves safety or hope.",guidance:"One helps the other recognize the strength or choice needed next.",
};
function contextsFor(seed:Seed):NarrativeContext[]{const ids=[seed.fromCharacterId,seed.toCharacterId],contexts:NarrativeContext[]=["hanuman"];for(const context of ["rama","sita","bharata","ravana"] as const)if(ids.includes(context))contexts.push(context);return Array.from(new Set(contexts));}
export const relationships:Relationship[]=seeds.map(item=>({...item,directional:item.directional??true,unlocked:false,clue:`${characterNameById[item.fromCharacterId]} ${item.label} ${characterNameById[item.toCharacterId]}. ${typeClues[item.type]}`,discoverableFrom:item.id==="REL-JAMBAVAN-HANUMAN-RESCUE"?[item.eventId,"HFH-01"]:item.id==="REL-HANUMAN-VIBHISHANA-ALLIANCE"?[item.eventId,"HFH-01"]:[item.eventId],narrativeContexts:contextsFor(item)}));
export function availableRelationshipIds(completedEncounterCount:number,meetingCount=0,warCount=0,herbsCount=0,finaleCount=0){const early:Record<string,number>={"REL-HANUMAN-SUGRIVA-SERVICE":1,"REL-HANUMAN-RAMA-SERVICE":2,"REL-HANUMAN-RAMA-DEVOTION":2,"REL-RAMA-SITA-MARRIAGE":3,"REL-RAMA-LAKSHMANA-FAMILY":3,"REL-SUGRIVA-RAMA-ALLIANCE":4};return relationships.filter(item=>(item.finaleUnlockAt!==undefined?item.finaleUnlockAt<=finaleCount:item.herbsUnlockAt!==undefined?item.herbsUnlockAt<=herbsCount:item.warUnlockAt!==undefined?item.warUnlockAt<=warCount:item.unlockAt<=completedEncounterCount)||(early[item.id]??99)<=meetingCount).map(item=>item.id);}
export const relationshipUnlocks:RelationshipUnlock[]=Array.from(new Set(relationships.map(r=>r.eventId))).map(eventId=>({eventId,relationshipIds:relationships.filter(r=>r.eventId===eventId).map(r=>r.id)}));
export const characterConnectionMap:CharacterConnectionMap=relationships.reduce((map,relationship)=>{for(const id of [relationship.fromCharacterId,relationship.toCharacterId]) (map[id]??=[]).push(relationship);return map;},{} as CharacterConnectionMap);
export const relationshipTypeLabels:Record<RelationshipType,string>={family:"Family",marriage:"Marriage",devotion:"Devotion",service:"Service",teacher:"Teacher",alliance:"Alliance",friendship:"Friendship",opposition:"Opposition",messenger:"Messenger",protector:"Protector",guidance:"Guidance"};
export const relationshipTypes=Object.keys(relationshipTypeLabels) as RelationshipType[];
export const relationshipAchievementDefinitions=[
 {name:"First Connection",description:"Answer one relationship challenge correctly."},
 {name:"Web of Dharma",description:"Understand five distinct connections."},
 {name:"Messenger of Rāma",description:"Master Hanumān’s messenger connection to Sītā."},
 {name:"Family of Ayodhyā",description:"Recognize a family connection of Ayodhyā."},
 {name:"Friend of the Vānaras",description:"Master alliance, friendship, or guidance among Rāma’s allies."},
 {name:"Master of Connections",description:"Answer twelve relationship challenges correctly."},
];
