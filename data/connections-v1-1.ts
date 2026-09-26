import type {CharacterPortraitData} from "@/lib/types";
import {characters} from "@/data/discoveries";

export type NetworkLens="family-origins"|"kishkindha"|"rama-circle"|"search"|"lanka"|"allies"|"opponents"|"bhakti-service"|"full";
export type NetworkCharacterKind="journey"|"network";
export type NetworkRelationshipClass="direct"|"contextual"|"indirect";
export type NetworkRelationshipType="mother"|"father"|"divine-father"|"spouse"|"sibling"|"devotion"|"service"|"guidance"|"alliance"|"friendship"|"political"|"conflict"|"opponent"|"mission-companion"|"indirect-network";
export type NetworkClaimType="textualFact"|"traditionalIdentification"|"laterTextualTradition"|"regionalTradition"|"commentaryInsight"|"popularTradition"|"learningInterpretation";
export type NetworkVerification="verifiedInCitedText"|"pendingGitaPressEditionAudit"|"journeyRecord"|"developmentPlaceholder";
export interface NetworkSource {work:string;edition:string;locator:string;url?:string;claimType:NetworkClaimType;verification:NetworkVerification;}
export interface NetworkCharacter {id:string;name:string;kind:NetworkCharacterKind;portrait:CharacterPortraitData;summary:string;position?:{x:number;y:number};}
export interface NetworkRelationship {id:string;sourceCharacterId:string;targetCharacterId:string;type:NetworkRelationshipType;label:string;statement?:string;classification:NetworkRelationshipClass;lens:NetworkLens;storyContext:string;shortExplanation:string;meaning?:{text:string;claimType:"learningInterpretation"};sources:NetworkSource[];verification:NetworkVerification;buildEligible:boolean;distractorEligible:boolean;displayPriority:number;}
export interface ProfileSection {title:string;body:string;claimType:NetworkClaimType;source:NetworkSource;}

const source=(locator:string):NetworkSource=>({work:"Vālmīki Rāmāyaṇa",edition:"Sanskrit Documents online text (not Gita Press); approved edition audit pending",locator,url:"https://www.sanskritdocuments.org/sites/valmikiramayan/kish/sarga66/kishkindharoman66.htm",claimType:"textualFact",verification:"pendingGitaPressEditionAudit"});
const journeyPortrait=(id:string)=>characters.find(person=>person.id===id)?.portrait;
const portrait=(src:string):CharacterPortraitData=>({src,position:"50% 24%",thumbnailPosition:"50% 24%"});

export const familyCharacters:NetworkCharacter[]=[
 {id:"hanuman",name:"Hanumān",kind:"journey",portrait:journeyPortrait("hanuman")!,summary:"Rāma’s messenger, whose family and origins are the focus of this network.",position:{x:50,y:52}},
 {id:"anjana",name:"Añjanā",kind:"network",portrait:portrait("/images/characters/anjana-connections-v1.png"),summary:"Mother of Hanumān.",position:{x:18,y:31}},
 {id:"kesari",name:"Keśarī",kind:"network",portrait:portrait("/images/characters/kesari-connections-v1.png"),summary:"Añjanā’s husband; named in Hanumān’s family lineage.",position:{x:82,y:31}},
 {id:"vayu",name:"Vāyu",kind:"network",portrait:portrait("/images/characters/vayu-connections-v1.png"),summary:"The wind deity named as Hanumān’s divine father.",position:{x:50,y:15}},
 {id:"rama",name:"Rāma",kind:"journey",portrait:journeyPortrait("rama")!,summary:"Hanumān’s object of devotion and service in the journey."},
 {id:"sugriva",name:"Sugrīva",kind:"journey",portrait:journeyPortrait("sugriva")!,summary:"The vānar king for whom Hanumān serves as envoy."},
 {id:"jambavan",name:"Jāmbavān",kind:"journey",portrait:journeyPortrait("jambavan")!,summary:"The elder who reminds Hanumān of his strength."},
 {id:"ravana",name:"Rāvaṇa",kind:"journey",portrait:journeyPortrait("ravana")!,summary:"The king of Laṅkā, opposed by Rāma’s allies."},
];
export const familyCharacterById=Object.fromEntries(familyCharacters.map(character=>[character.id,character])) as Record<string,NetworkCharacter>;

export const networkRelationships:NetworkRelationship[]=[
 {id:"family-anjana-hanuman",sourceCharacterId:"anjana",targetCharacterId:"hanuman",type:"mother",label:"Mother of Hanumān",statement:"Añjanā is Hanumān’s mother.",classification:"direct",lens:"family-origins",storyContext:"Jāmbavān recalls Hanumān’s origin before the ocean leap.",shortExplanation:"Añjanā is named as Hanumān’s mother; the account also names her as Keśarī’s wife.",meaning:{text:"His later service has a personal beginning, not only a story of extraordinary strength.",claimType:"learningInterpretation"},sources:[source("Kiṣkindhā Kāṇḍa 4.66.8, 20")],verification:"pendingGitaPressEditionAudit",buildEligible:true,distractorEligible:false,displayPriority:1},
 {id:"family-kesari-hanuman",sourceCharacterId:"kesari",targetCharacterId:"hanuman",type:"father",label:"Father in the family lineage",statement:"Keśarī is Hanumān’s father in the family lineage.",classification:"direct",lens:"family-origins",storyContext:"Jāmbavān distinguishes Keśarī’s family line from Vāyu’s divine role.",shortExplanation:"Keśarī is named as Añjanā’s husband and Hanumān as his son in the account.",meaning:{text:"Family lineage is one part of the beginning of Hanumān’s path toward service.",claimType:"learningInterpretation"},sources:[source("Kiṣkindhā Kāṇḍa 4.66.8, 29–30")],verification:"pendingGitaPressEditionAudit",buildEligible:true,distractorEligible:false,displayPriority:2},
 {id:"family-vayu-hanuman",sourceCharacterId:"vayu",targetCharacterId:"hanuman",type:"divine-father",label:"Divine father · Wind",statement:"Vāyu is named as Hanumān’s divine father.",classification:"direct",lens:"family-origins",storyContext:"The origin account relates Hanumān’s birth and power to Vāyu.",shortExplanation:"Vāyu is identified as Hanumān’s divine father. This does not erase Keśarī’s distinct place in the lineage.",meaning:{text:"In the journey, Hanumān turns remarkable strength toward the task of serving Rāma.",claimType:"learningInterpretation"},sources:[source("Kiṣkindhā Kāṇḍa 4.66.17–20, 29–30")],verification:"pendingGitaPressEditionAudit",buildEligible:true,distractorEligible:false,displayPriority:3},
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
 hanuman:{scene:"Hanumān is the traveler at the center of this network.",question:"Which bonds describe his beginnings, and which belong to his later journey?"},
 anjana:{scene:"A figure named in the account of Hanumān’s beginnings.",question:"What place might she have in his origins?"},
 kesari:{scene:"A vānar figure named in the same origin account.",question:"How might his place differ from Vāyu’s?"},
 vayu:{scene:"The wind deity appears in the account of Hanumān’s beginnings.",question:"What kind of bond could this be?"},
 rama:{scene:"Hanumān’s later journey centers on service to Rāma.",question:"Does an important bond always belong to a family lens?"},
 sugriva:{scene:"Hanumān acts as envoy for Sugrīva in the journey.",question:"Is an envoy’s bond the same as an origin bond?"},
 jambavan:{scene:"An elder of the search party recalls Hanumān’s strength.",question:"Where does guidance belong in this network?"},
 ravana:{scene:"The ruler of Laṅkā stands in the later conflict.",question:"Can an opponent belong to a family lens?"},
};
export const distractorContext:Record<string,string>={
 rama:"Rāma belongs to Hanumān’s devotion and service story, not this family lens.",
 sugriva:"Sugrīva belongs to Hanumān’s Kiṣkindhā service and alliance network, not this family lens.",
 jambavan:"Jāmbavān guides Hanumān at a crucial moment, but is not a family connection here.",
 ravana:"Rāvaṇa belongs to the later opposition in Laṅkā, not Hanumān’s family origins.",
 vali:networkRelationships.find(edge=>edge.id==="kishkindha-vali-context")!.shortExplanation,
};
export const anjanaProfile:ProfileSection[]=[
 {title:"Identity",body:"The origin account names her Añjanā and also recalls the name Puñjikasthalā.",claimType:"textualFact",source:source("Kiṣkindhā Kāṇḍa 4.66.8")},
 {title:"Family & lineage",body:"Añjanā is named as Keśarī’s wife and Hanumān’s mother.",claimType:"textualFact",source:source("Kiṣkindhā Kāṇḍa 4.66.8, 20")},
 {title:"Earlier identity and transformation",body:"The account presents an earlier apsaras identity and a curse-linked change of form. Details beyond these cited lines await editorial review.",claimType:"textualFact",source:source("Kiṣkindhā Kāṇḍa 4.66.8–10")},
 {title:"Hanumān’s birth and Vāyu",body:"The account connects Vāyu with the promised son and names Añjanā as Hanumān’s mother. Keśarī’s lineage role remains distinct.",claimType:"textualFact",source:source("Kiṣkindhā Kāṇḍa 4.66.17–20, 29–30")},
];
