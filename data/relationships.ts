import type {CharacterConnectionMap,Relationship,RelationshipType,RelationshipUnlock,SourceId} from "@/lib/types";

type Seed=Omit<Relationship,"unlocked"|"directional">&{directional?:boolean};
const vr:SourceId[]=["VR-GP","VR-HPS"];
const seeds:Seed[]=[
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
 {id:"REL-RAMA-SITA-MARRIAGE",fromCharacterId:"rama",toCharacterId:"sita",type:"marriage",label:"is married to",eventId:"HJ-11",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:11,directional:false},
 {id:"REL-HANUMAN-JAMBUMALI-OPPOSITION",fromCharacterId:"hanuman",toCharacterId:"jambumali",type:"opposition",label:"defeats",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-HANUMAN-AKSHA-OPPOSITION",fromCharacterId:"hanuman",toCharacterId:"aksha-kumara",type:"opposition",label:"defeats in battle",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-INDRAJIT-HANUMAN-OPPOSITION",fromCharacterId:"indrajit",toCharacterId:"hanuman",type:"opposition",label:"captures with the Brahmāstra",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-RAVANA-INDRAJIT-FAMILY",fromCharacterId:"ravana",toCharacterId:"indrajit",type:"family",label:"is father of",eventId:"HJ-12",sources:vr,unlockAt:12},
 {id:"REL-VIBHISHANA-RAVANA-GUIDANCE",fromCharacterId:"vibhishana",toCharacterId:"ravana",type:"guidance",label:"offers dharmic counsel to",eventId:"HJ-13",sources:vr,unlockAt:13},
 {id:"REL-HANUMAN-RAVANA-MESSENGER",fromCharacterId:"hanuman",toCharacterId:"ravana",type:"messenger",label:"delivers a warning to",eventId:"HJ-13",sources:vr,unlockAt:13},
 {id:"REL-RAVANA-HANUMAN-OPPOSITION",fromCharacterId:"ravana",toCharacterId:"hanuman",type:"opposition",label:"orders the punishment of",eventId:"HJ-14",sources:vr,unlockAt:14},
 {id:"REL-HANUMAN-RAMA-MESSENGER",fromCharacterId:"hanuman",toCharacterId:"rama",type:"messenger",label:"returns Sītā’s message to",eventId:"HJ-15",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:15},
 {id:"REL-SUGRIVA-RAMA-ALLIANCE",fromCharacterId:"sugriva",toCharacterId:"rama",type:"alliance",label:"is allied with",eventId:"HJ-15",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:15,directional:false},
 {id:"REL-RAMA-LAKSHMANA-FAMILY",fromCharacterId:"rama",toCharacterId:"lakshmana",type:"family",label:"is brother of",eventId:"HJ-15",sources:["VR-GP","VR-HPS","RCM-GP"],unlockAt:15,directional:false},
 {id:"REL-HANUMAN-SUGRIVA-SERVICE",fromCharacterId:"hanuman",toCharacterId:"sugriva",type:"service",label:"serves in the search party of",eventId:"HJ-15",sources:vr,unlockAt:15},
];
export const relationships:Relationship[]=seeds.map(item=>({...item,directional:item.directional??true,unlocked:item.unlockAt===0}));
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
