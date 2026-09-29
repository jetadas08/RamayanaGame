import type {CharacterPortraitData} from "@/lib/types";
import {characters} from "@/data/discoveries";

export type NetworkLens="family-origins"|"kishkindha"|"rama-circle"|"search"|"lanka"|"allies"|"opponents"|"bhakti-service"|"full";
export type NetworkCharacterKind="journey"|"network";
export type NetworkRelationshipClass="direct"|"contextual"|"indirect";
export type NetworkRelationshipType="mother"|"father"|"divine-father"|"spouse"|"sibling"|"devotion"|"service"|"guidance"|"alliance"|"friendship"|"political"|"conflict"|"opponent"|"mission-companion"|"indirect-network";
export type NetworkClaimType="textualFact"|"traditionalIdentification"|"laterTextualTradition"|"regionalTradition"|"commentaryInsight"|"popularTradition"|"learningInterpretation";
export type NetworkVerification="verifiedInCitedText"|"verifiedInApprovedEdition"|"pendingGitaPressEditionAudit"|"journeyRecord"|"developmentPlaceholder";
export interface NetworkSource {work:string;edition:string;locator:string;url?:string;claimType:NetworkClaimType;verification:NetworkVerification;}
export interface NetworkCharacter {id:string;name:string;kind:NetworkCharacterKind;portrait:CharacterPortraitData;summary:string;position?:{x:number;y:number};}
export interface NetworkRelationship {id:string;sourceCharacterId:string;targetCharacterId:string;type:NetworkRelationshipType;label:string;statement?:string;classification:NetworkRelationshipClass;lens:NetworkLens;storyContext:string;shortExplanation:string;meaning?:{text:string;claimType:"learningInterpretation"};sources:NetworkSource[];verification:NetworkVerification;buildEligible:boolean;distractorEligible:boolean;displayPriority:number;}
const source=(locator:string):NetworkSource=>({work:"Vālmīki Rāmāyaṇa",edition:"Gita Press, Part 1; passage verified on the approved page image; paraphrase only",locator,claimType:"textualFact",verification:"verifiedInApprovedEdition"});
const journeyPortrait=(id:string)=>characters.find(person=>person.id===id)?.portrait;
const portrait=(src:string):CharacterPortraitData=>({src,position:"50% 24%",thumbnailPosition:"50% 24%"});

export const familyCharacters:NetworkCharacter[]=[
 {id:"hanuman",name:"Hanumān",kind:"journey",portrait:journeyPortrait("hanuman")!,summary:"Hanumān, Rāma’s devoted messenger, stands at the heart of these family bonds.",position:{x:50,y:52}},
 {id:"anjana",name:"Añjanā",kind:"network",portrait:portrait("/images/characters/anjana-connections-v1.png"),summary:"Mother of Hanumān.",position:{x:18,y:31}},
 {id:"kesari",name:"Keśarī",kind:"network",portrait:portrait("/images/characters/kesari-connections-v1.png"),summary:"Añjanā’s husband and Hanumān’s father in the family lineage.",position:{x:82,y:31}},
 {id:"vayu",name:"Vāyu",kind:"network",portrait:portrait("/images/characters/vayu-connections-v1.png"),summary:"The wind deity with a divine role in Hanumān’s birth.",position:{x:50,y:15}},
 {id:"rama",name:"Rāma",kind:"journey",portrait:journeyPortrait("rama")!,summary:"Hanumān’s object of devotion and service in the journey."},
 {id:"sugriva",name:"Sugrīva",kind:"journey",portrait:journeyPortrait("sugriva")!,summary:"The vānar king for whom Hanumān serves as envoy."},
 {id:"jambavan",name:"Jāmbavān",kind:"journey",portrait:journeyPortrait("jambavan")!,summary:"The elder who reminds Hanumān of his strength."},
 {id:"ravana",name:"Rāvaṇa",kind:"journey",portrait:journeyPortrait("ravana")!,summary:"The king of Laṅkā, opposed by Rāma’s allies."},
];
export const familyCharacterById=Object.fromEntries(familyCharacters.map(character=>[character.id,character])) as Record<string,NetworkCharacter>;

export const networkRelationships:NetworkRelationship[]=[
 {id:"family-anjana-hanuman",sourceCharacterId:"anjana",targetCharacterId:"hanuman",type:"mother",label:"Mother of Hanumān",statement:"Añjanā is Hanumān’s mother.",classification:"direct",lens:"family-origins",storyContext:"Before the ocean leap, Jāmbavān recalls the family into which Hanumān was born.",shortExplanation:"Añjanā is Hanumān’s mother and Keśarī’s wife.",meaning:{text:"Before Hanumān’s great service across the sea, the story remembers his family beginnings.",claimType:"learningInterpretation"},sources:[source("Kiṣkindhā Kāṇḍa 4.66.8, 20; printed pp. 922–923")],verification:"verifiedInApprovedEdition",buildEligible:true,distractorEligible:false,displayPriority:1},
 {id:"family-kesari-hanuman",sourceCharacterId:"kesari",targetCharacterId:"hanuman",type:"father",label:"Father in the family lineage",statement:"Keśarī is Hanumān’s father in the family lineage.",classification:"direct",lens:"family-origins",storyContext:"Jāmbavān remembers Keśarī’s family bond alongside Vāyu’s divine role.",shortExplanation:"Keśarī is Añjanā’s husband and Hanumān’s father in the family lineage.",meaning:{text:"Hanumān’s journey toward service begins within a family, even as Vāyu has a divine role in his birth.",claimType:"learningInterpretation"},sources:[source("Kiṣkindhā Kāṇḍa 4.66.8, 29–30; printed pp. 922, 924")],verification:"verifiedInApprovedEdition",buildEligible:true,distractorEligible:false,displayPriority:2},
 {id:"family-vayu-hanuman",sourceCharacterId:"vayu",targetCharacterId:"hanuman",type:"divine-father",label:"Divine father · Wind",statement:"Vāyu is Hanumān’s divine father.",classification:"direct",lens:"family-origins",storyContext:"Hanumān’s birth story ties his strength and speed to Vāyu.",shortExplanation:"Vāyu is Hanumān’s divine father. Keśarī remains his father in the family lineage.",meaning:{text:"Hanumān brings that extraordinary strength to Rāma’s work.",claimType:"learningInterpretation"},sources:[source("Kiṣkindhā Kāṇḍa 4.66.17–20, 29–30; printed pp. 922–924")],verification:"verifiedInApprovedEdition",buildEligible:true,distractorEligible:false,displayPriority:3},
 {id:"kishkindha-vali-context",sourceCharacterId:"hanuman",targetCharacterId:"vali",type:"political",label:"Context of Sugrīva’s conflict",classification:"contextual",lens:"kishkindha",storyContext:"Sugrīva’s conflict with Vāli frames Hanumān’s first embassy.",shortExplanation:"Vāli belongs to Hanumān’s wider Kiṣkindhā story, not to this Family & Origins graph.",sources:[{work:"Follow Hanumān Chapter I story record",edition:"Current app narrative",locator:"HFM-01–04",claimType:"learningInterpretation",verification:"journeyRecord"}],verification:"journeyRecord",buildEligible:false,distractorEligible:true,displayPriority:90},
];
export const familyBuildEdges=networkRelationships.filter(edge=>edge.lens==="family-origins"&&edge.buildEligible).sort((a,b)=>a.displayPriority-b.displayPriority);
export const familyPoolIds=["anjana","rama","kesari","sugriva","vayu","jambavan","ravana"] as const;
export const relationshipLabels:Record<NetworkRelationshipType,string>={mother:"Mother",father:"Father in family lineage","divine-father":"Divine father",spouse:"Spouse",sibling:"Sibling",devotion:"Devotion",service:"Service",guidance:"Guidance",alliance:"Alliance",friendship:"Friendship",political:"Political context",conflict:"Conflict",opponent:"Opponent","mission-companion":"Mission companion","indirect-network":"Indirect network"};
export const familyOptions:Record<string,NetworkRelationshipType[]>={
 anjana:["mother","spouse","guidance"],kesari:["father","guidance","service"],vayu:["divine-father","father","guidance"],
 rama:["devotion","father","alliance"],sugriva:["service","father","friendship"],jambavan:["guidance","father","mission-companion"],ravana:["opponent","father","political"],
};
export const familyExploreClues:Record<string,{scene:string;question:string}>={
 hanuman:{scene:"Hanumān stands at the heart of this network.",question:"Which ties belong to his beginnings, and which come later in his journey?"},
 anjana:{scene:"Añjanā appears in the story of Hanumān’s beginnings.",question:"Where might she stand in his family?"},
 kesari:{scene:"Keśarī, a vānar leader, is part of Hanumān’s beginnings.",question:"How might his bond differ from Vāyu’s?"},
 vayu:{scene:"Vāyu is the wind deity.",question:"What could the wind have to do with Hanumān’s beginnings?"},
 rama:{scene:"Hanumān’s life will become closely bound to Rāma’s.",question:"Is this a family bond, or one formed on the journey?"},
 sugriva:{scene:"Hanumān acts as envoy for Sugrīva in the journey.",question:"Does that service belong among his family ties?"},
 jambavan:{scene:"Jāmbavān helps Hanumān remember his strength.",question:"Is that family, or guidance?"},
 ravana:{scene:"Rāvaṇa stands against Rāma’s companions in Laṅkā.",question:"Can an opponent belong to this family map?"},
};
export const distractorContext:Record<string,string>={
 rama:"Rāma is central to Hanumān’s life. Their bond grows through devotion and service, beyond these family origins.",
 sugriva:"Hanumān serves as Sugrīva’s envoy. Their bond belongs to the Kiṣkindhā journey, beyond his family origins.",
 jambavan:"Jāmbavān reminds Hanumān of his strength. That is guidance, not a family bond here.",
 ravana:"Rāvaṇa is part of the later struggle in Laṅkā, not Hanumān’s family origins.",
 vali:networkRelationships.find(edge=>edge.id==="kishkindha-vali-context")!.shortExplanation,
};
