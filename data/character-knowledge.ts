import {finaleMemories,finaleMemoryNames,finaleNodes} from "@/data/finale";
import {meetingMemories,meetingMemoryNames} from "@/data/meeting";
import {herbsNodes} from "@/data/herbs";
import {warNodes} from "@/data/war";
import type {CharacterChallenge,CharacterChallengeType,CharacterKnowledgeProgress,CharacterKnowledgeProfileDefinition,CharacterKnowledgeScope,CharacterKnowledgeUnlockMethod,CharacterProfileDepth,CharacterProfileField,CharacterProfileSection,JourneyProgressState,SourceId,SourceReference} from "@/lib/types";
import {characterNameById} from "@/data/character-ids";
import {journeyNodes} from "@/data/journey";
import {characters,relationships} from "@/data/discoveries";
import {sacredObjects} from "@/data/encounter-activities";

const sections:CharacterProfileSection[]=["overview","family","guidance","connections","journey","events","objects","sources"];
const source=(id:SourceId,summary:string,claimType:SourceReference["claimType"]="textualFact"):SourceReference=>({source:id,claimType,summary,verification:"planningReference"});
const choice=(...labels:string[])=>labels.map((label,index)=>({id:String.fromCharCode(97+index),label}));

type Seed={id:string;title:string;quality:string;node:string;event:string;source:SourceId;relationshipId?:string;relationshipLabel?:string;challenge:{type:CharacterChallengeType;prompt:string;options:string[];answer:string;explanation:string}};
const seeds:Seed[]=[
 {id:"hanuman",title:"Rāma’s messenger",quality:"Devotion joined with courage and discernment",node:"HJ-01",event:"Carries Rāma’s purpose across the ocean and finds Sītā",source:"VR-GP",relationshipId:"REL-HANUMAN-RAMA-DEVOTION",relationshipLabel:"Devoted to Rāma",challenge:{type:"family-connection",prompt:"Who is named as Hanumān’s divine father?",options:["Vāyu","Indra","Daśaratha","Janaka"],answer:"a",explanation:"Vāyu, the Wind, is named as Hanumān’s divine father in the Vālmīki tradition."}},
 {id:"rama",title:"Bearer of the mission",quality:"Dharma, compassion and steadfast leadership",node:"HJ-01",event:"Entrusts the search for Sītā to Hanumān",source:"VR-GP",relationshipId:"REL-RAMA-HANUMAN-SERVICE",relationshipLabel:"Entrusts Hanumān with the search",challenge:{type:"story-role",prompt:"What role does Rāma play in Hanumān’s journey?",options:["He entrusts the mission and awaits Sītā’s news","He guards Laṅkā’s gate","He tests Hanumān over the ocean"],answer:"a",explanation:"Rāma’s trust gives the journey its purpose and Hanumān carries that purpose to Laṅkā."}},
 {id:"sita",title:"The heart of the search",quality:"Steadfastness, dignity and hope",node:"HJ-10",event:"Receives Rāma’s ring and entrusts Hanumān with her message",source:"VR-HPS",relationshipId:"REL-HANUMAN-SITA-MESSENGER",relationshipLabel:"Receives Rāma’s message from Hanumān",challenge:{type:"key-event",prompt:"What allows Sītā to recognize Hanumān as Rāma’s messenger?",options:["Rāma’s ring","A map of Laṅkā","Maināka’s blessing"],answer:"a",explanation:"The ring is a trusted sign that makes Hanumān’s words recognizable to Sītā."}},
 {id:"lakshmana",title:"Rāma’s steadfast brother",quality:"Loyalty and vigilance",node:"HJ-15",event:"Awaits the search party’s return beside Rāma",source:"VR-GP",relationshipId:"REL-RAMA-LAKSHMANA-FAMILY",relationshipLabel:"Brother of Rāma",challenge:{type:"key-event",prompt:"Where is Lakṣmaṇa when Hanumān completes the journey?",options:["Awaiting the search party beside Rāma","Guarding the gates of Laṅkā","Resting on Mount Maināka","Searching Aśoka Vātikā alone"],answer:"a",explanation:"Lakṣmaṇa waits beside Rāma as Hanumān returns with Sītā’s message and token."}},
 {id:"jambavan",title:"Elder guide of the search",quality:"Wisdom that awakens forgotten strength",node:"HJ-03",event:"Reminds Hanumān of his power before the leap",source:"VR-GP",relationshipId:"REL-JAMBAVAN-HANUMAN-GUIDANCE",relationshipLabel:"Guides Hanumān",challenge:{type:"identify-guide",prompt:"Who reminds Hanumān of his strength?",options:["Jāmbavān","Sampāti","Indrajit","Laṅkinī"],answer:"a",explanation:"Jāmbavān’s guidance awakens the strength Hanumān needs for the crossing."}},
 {id:"sugriva",title:"King of the Vanara allies",quality:"Alliance and coordinated action",node:"HJ-15",event:"Coordinates the search through his alliance with Rāma",source:"VR-GP",relationshipId:"REL-SUGRIVA-RAMA-ALLIANCE",relationshipLabel:"Allied with Rāma",challenge:{type:"connected-character",prompt:"With whom is Sugrīva allied in this journey?",options:["Rāma","Rāvaṇa","Indrajit","Sampāti"],answer:"a",explanation:"Sugrīva’s alliance with Rāma makes the southern search possible."}},
 {id:"vibhishana",title:"A voice of dharma within Laṅkā",quality:"Conscience and moral courage",node:"HJ-09",event:"Offers dharmic counsel within Rāvaṇa’s court",source:"RCM-GP",relationshipId:"REL-VIBHISHANA-RAVANA-GUIDANCE",relationshipLabel:"Counsels Rāvaṇa",challenge:{type:"source-aware",prompt:"Which journey source layer contains Hanumān’s early meeting with Vibhīṣaṇa?",options:["RCM-GP","VR-GP","Geography layer"],answer:"a",explanation:"The early Laṅkā meeting is presented specifically from the Rāmacaritamānasa layer."}},
 {id:"sampati",title:"The elder who restores direction",quality:"Vision placed in service of the search",node:"HJ-02",event:"Reveals that Sītā is in Laṅkā",source:"VR-GP",relationshipId:"REL-SAMPATI-PARTY-GUIDANCE",relationshipLabel:"Guides the search party",challenge:{type:"story-role",prompt:"What does Sampāti contribute to the search?",options:["He reveals Sītā’s direction","He carries Rāma’s ring","He guards Laṅkā"],answer:"a",explanation:"Sampāti’s far sight gives the discouraged search party a direction and renewed purpose."}},
 {id:"mainaka",title:"The mountain of hospitality",quality:"Hospitality without possession",node:"HJ-05",event:"Offers Hanumān rest during the ocean crossing",source:"VR-HPS",relationshipId:"REL-MAINAKA-HANUMAN-ALLIANCE",relationshipLabel:"Offers Hanumān aid",challenge:{type:"character-quality",prompt:"Which quality is most clearly shown by Maināka’s offer?",options:["Hospitality","Pride","Opposition","Secrecy"],answer:"a",explanation:"Maināka offers rest and honors Hanumān without obstructing his mission."}},
 {id:"surasa",title:"The divine test",quality:"A test answered through intelligence and agility",node:"HJ-06",event:"Blesses Hanumān after he satisfies her condition",source:"VR-HPS",relationshipId:"REL-SURASA-HANUMAN-GUIDANCE",relationshipLabel:"Tests and blesses Hanumān",challenge:{type:"character-quality",prompt:"Which quality lets Hanumān pass Surasā’s test?",options:["Flexible intelligence","Uncontrolled force","Suspicion","Rest"],answer:"a",explanation:"Hanumān changes strategy and size, satisfying the test without abandoning the mission."}},
 {id:"simhika",title:"The shadow-catching adversary",quality:"Discernment before a predatory threat",node:"HJ-07",event:"Seizes Hanumān’s shadow and is overcome during the crossing",source:"VR-HPS",relationshipId:"REL-SIMHIKA-HANUMAN-OPPOSITION",relationshipLabel:"Seizes Hanumān’s shadow",challenge:{type:"story-role",prompt:"What distinguishes Siṃhikā from Surasā in the ocean crossing?",options:["She is a hostile threat who seizes Hanumān’s shadow","She offers Hanumān a place to rest","She blesses him after a divine test"],answer:"a",explanation:"Siṃhikā is presented as a predatory obstacle, so Hanumān answers her differently from Surasā’s test."}},
 {id:"lankini",title:"Guardian of Laṅkā’s threshold",quality:"Guardianship and omen",node:"HJ-08",event:"Recognizes an omen of Laṅkā’s fall",source:"VR-HPS",relationshipId:"REL-LANKINI-HANUMAN-OPPOSITION",relationshipLabel:"Opposes Hanumān at the threshold",challenge:{type:"key-event",prompt:"What does Laṅkinī recognize after her defeat?",options:["An omen of Laṅkā’s fall","Hanumān’s coronation","The end of the ocean"],answer:"a",explanation:"The encounter signals that Rāma’s mission has crossed Laṅkā’s threshold."}},
 {id:"ravana",title:"King of Laṅkā",quality:"Great power compromised by pride",node:"HJ-12",event:"Rejects Hanumān’s counsel to return Sītā",source:"VR-HPS",relationshipId:"REL-RAVANA-INDRAJIT-FAMILY",relationshipLabel:"Father of Indrajit",challenge:{type:"family-connection",prompt:"Which warrior in the grove battle is Rāvaṇa’s son?",options:["Indrajit","Jāmbavān","Sampāti","Maināka"],answer:"a",explanation:"Indrajit, also called Meghanāda, is Rāvaṇa’s son."}},
 {id:"aksha-kumara",title:"Prince of Laṅkā",quality:"Youthful valor within a tragic escalation",node:"HJ-12",event:"Faces Hanumān in the fifth stage of the grove battle",source:"VR-HPS",relationshipId:"REL-HANUMAN-AKSHA-OPPOSITION",relationshipLabel:"Faces Hanumān in battle",challenge:{type:"key-event",prompt:"When does Prince Akṣa enter the grove battle sequence?",options:["After the five commanders","Before the Kiṅkaras","After Indrajit captures Hanumān"],answer:"a",explanation:"Prince Akṣa enters after the commanders and before Indrajit, raising the conflict to the royal house."}},
 {id:"indrajit",title:"Strategist and prince of Laṅkā",quality:"Formidable skill directed toward Laṅkā’s defense",node:"HJ-12",event:"Uses the Brahmāstra and carries Hanumān into Rāvaṇa’s court",source:"VR-HPS",relationshipId:"REL-INDRAJIT-HANUMAN-OPPOSITION",relationshipLabel:"Captures Hanumān",challenge:{type:"key-event",prompt:"What is the result of Indrajit’s encounter with Hanumān?",options:["Hanumān is brought before Rāvaṇa","Hanumān returns to Maināka","The search party turns back"],answer:"a",explanation:"The encounter moves the story into Rāvaṇa’s court, where Hanumān speaks as Rāma’s messenger."}},
 {id:"trijata",title:"Compassionate witness in Aśoka Vātikā",quality:"Compassion and truthful vision",node:"HJ-10",event:"Her dream offers reassurance to Sītā",source:"VR-HPS",relationshipId:"REL-TRIJATA-SITA-PROTECTOR",relationshipLabel:"Protects hope for Sītā",challenge:{type:"story-role",prompt:"What role does Trijaṭā play in Sītā’s captivity?",options:["She offers reassurance through her dream","She captures Hanumān","She commands the grove battle"],answer:"a",explanation:"Trijaṭā’s dream becomes a source of reassurance amid the hostility of the grove."}},
];

const relationshipSection=(seed:Seed):CharacterProfileSection=>seed.relationshipId?.includes("JAMBAVAN-HANUMAN-GUIDANCE")||seed.relationshipId?.includes("VIBHISHANA-RAVANA-GUIDANCE")?"guidance":seed.relationshipId?.includes("FAMILY")?"family":"connections";
const genericProfileFields:CharacterProfileField[]=seeds.flatMap(seed=>{
 const challengeId=`CK-${seed.id.toUpperCase()}`;
 const base:CharacterProfileField[]=[
  {id:`${seed.id}-title`,characterId:seed.id,section:"overview",label:"Story role",value:seed.title,sources:[source(seed.source,seed.title)],sourceStatus:"Textual",unlock:{kind:"discovery"}},
  {id:`${seed.id}-quality`,characterId:seed.id,section:"overview",label:"Meaning",value:seed.quality,sources:[source(seed.source,seed.quality,"learningInterpretation")],sourceStatus:"Textual",unlock:{kind:"discovery"}},
  {id:`${seed.id}-first-encounter`,characterId:seed.id,section:"journey",label:"First discovered",value:seed.node,sources:[source(seed.source,`Appears at ${seed.node}`)],sourceStatus:"Textual",unlock:{kind:"journey",nodeId:seed.node}},
  {id:`${seed.id}-event`,characterId:seed.id,section:"events",label:"Key event",value:seed.event,sources:[source(seed.source,seed.event)],sourceStatus:"Textual",unlock:{kind:"challenge",challengeId}},
  {id:`${seed.id}-source`,characterId:seed.id,section:"sources",label:"Source layer",value:seed.source,sources:[source(seed.source,"Primary approved layer for this dossier")],sourceStatus:seed.source==="RCM-GP"?"Traditional":"Textual",unlock:{kind:"journey",nodeId:seed.node}},
 ];
 if(seed.relationshipId)base.push({id:`${seed.id}-relationship`,characterId:seed.id,section:relationshipSection(seed),label:relationshipSection(seed)==="family"?"Family":"Connection",value:seed.relationshipLabel!,relationshipId:seed.relationshipId,sources:[source(seed.source,seed.relationshipLabel!)],sourceStatus:"Textual",unlock:{kind:"relationship",relationshipId:seed.relationshipId}});
 if(seed.id==="hanuman")base.push({id:"hanuman-father",characterId:"hanuman",section:"family",label:"Divine father",value:"Vāyu",sources:[source("VR-GP","Hanumān is identified with Vāyu as divine father")],sourceStatus:"Textual",unlock:{kind:"challenge",challengeId}});
 if(seed.id==="rama")base.push({id:"rama-spouse",characterId:"rama",section:"family",label:"Spouse",value:"Sītā",relatedCharacterId:"sita",relationshipId:"REL-RAMA-SITA-MARRIAGE",sources:[source("VR-GP","Rāma and Sītā are spouses")],sourceStatus:"Textual",unlock:{kind:"relationship",relationshipId:"REL-RAMA-SITA-MARRIAGE"}});
 if(seed.id==="sita")base.push({id:"sita-spouse",characterId:"sita",section:"family",label:"Spouse",value:"Rāma",relatedCharacterId:"rama",relationshipId:"REL-RAMA-SITA-MARRIAGE",sources:[source("VR-GP","Sītā and Rāma are spouses")],sourceStatus:"Textual",unlock:{kind:"relationship",relationshipId:"REL-RAMA-SITA-MARRIAGE"}});
 return base;
});

const ravanaSource=(summary:string,claimType:SourceReference["claimType"]="textualFact")=>[source("VR-HPS",summary,claimType),source("VR-GP",summary,claimType)];
const ravanaFields:CharacterProfileField[]=[
 {id:"ravana-name",characterId:"ravana",section:"overview",label:"Name",value:"Rāvaṇa · रावण",sources:ravanaSource("Character name used in the approved Vālmīki layers"),sourceStatus:"Textual",unlock:{kind:"discovery"}},
 {id:"ravana-title",characterId:"ravana",section:"overview",label:"Title",value:"King of Laṅkā",sources:ravanaSource("Rāvaṇa rules the city and kingdom of Laṅkā"),sourceStatus:"Textual",unlock:{kind:"discovery"}},
 {id:"ravana-house",characterId:"ravana",section:"overview",label:"House",value:"Royal house of Laṅkā",sources:ravanaSource("Rāvaṇa and Indrajit belong to Laṅkā’s royal house"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-12"}},
 {id:"ravana-role",characterId:"ravana",section:"overview",label:"Story role",value:"The king who refuses the messenger’s counsel to return Sītā",sources:ravanaSource("Hanumān addresses Rāvaṇa as Rāma’s messenger"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-13"}},
 {id:"ravana-quality",characterId:"ravana",section:"overview",label:"Learning meaning",value:"Great power compromised by pride",sources:ravanaSource("Learning interpretation of Rāvaṇa’s choice in court","learningInterpretation"),sourceStatus:"Textual",unlock:{kind:"challenge",challengeId:"CK-RAVANA-COURT"}},
 {id:"ravana-son-indrajit",characterId:"ravana",section:"family",label:"Son",familyGroup:"Children",value:"Indrajit / Meghanāda",relatedCharacterId:"indrajit",relationshipId:"REL-RAVANA-INDRAJIT-FAMILY",sources:ravanaSource("Indrajit, also called Meghanāda, is Rāvaṇa’s son"),sourceStatus:"Textual",unlock:{kind:"challenge",challengeId:"CK-RAVANA-SON"}},
 {id:"ravana-brother-vibhishana",characterId:"ravana",section:"family",label:"Brother",familyGroup:"Siblings",value:"Vibhīṣaṇa",relatedCharacterId:"vibhishana",relationshipId:"REL-RAVANA-VIBHISHANA-FAMILY",sources:ravanaSource("Vibhīṣaṇa is Rāvaṇa’s brother"),sourceStatus:"Textual",unlock:{kind:"challenge",challengeId:"CK-RAVANA-BROTHER"}},
 {id:"ravana-counsel",characterId:"ravana",section:"guidance",label:"Counsel received",value:"Vibhīṣaṇa offers dharmic counsel",relatedCharacterId:"vibhishana",relationshipId:"REL-VIBHISHANA-RAVANA-GUIDANCE",sources:ravanaSource("Vibhīṣaṇa counsels Rāvaṇa in the court sequence"),sourceStatus:"Textual",unlock:{kind:"relationship",relationshipId:"REL-VIBHISHANA-RAVANA-GUIDANCE"}},
 {id:"ravana-hanuman-warning",characterId:"ravana",section:"connections",label:"Messenger",value:"Hanumān delivers Rāma’s warning",relatedCharacterId:"hanuman",relationshipId:"REL-HANUMAN-RAVANA-MESSENGER",sources:ravanaSource("Hanumān delivers a warning to Rāvaṇa"),sourceStatus:"Textual",unlock:{kind:"relationship",relationshipId:"REL-HANUMAN-RAVANA-MESSENGER"}},
 {id:"ravana-hanuman-opposition",characterId:"ravana",section:"connections",label:"Opposition",value:"Rāvaṇa orders Hanumān’s punishment",relatedCharacterId:"hanuman",relationshipId:"REL-RAVANA-HANUMAN-OPPOSITION",sources:ravanaSource("Rāvaṇa orders the punishment of Hanumān"),sourceStatus:"Textual",unlock:{kind:"relationship",relationshipId:"REL-RAVANA-HANUMAN-OPPOSITION"}},
 {id:"ravana-first-discovered",characterId:"ravana",section:"journey",label:"First discovered",value:"HJ-12 · Battle in Aśoka Vātikā",sources:ravanaSource("Rāvaṇa enters the V1 journey record during the grove battle escalation"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-12"}},
 {id:"ravana-court-place",characterId:"ravana",section:"journey",label:"Major encounter",value:"HJ-13 · Rāvaṇa’s Court, Laṅkā",sources:ravanaSource("The messenger is brought before Rāvaṇa in his court"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-13"}},
 {id:"ravana-city-place",characterId:"ravana",section:"journey",label:"Kingdom in the journey",value:"Laṅkā, represented as an epic region rather than a precise modern point",sources:[source("VR-HPS","Vālmīki places Rāvaṇa’s city upon Trikūṭa in Laṅkā"),source("TRAD","Modern Sri Lanka is retained only as a broad traditional macro-identification","traditionalIdentification")],sourceStatus:"Debated / multiple traditions",unlock:{kind:"journey",nodeId:"HJ-13"}},
 {id:"ravana-battle-command",characterId:"ravana",section:"events",label:"Escalation",value:"Sends successive forces against Hanumān after the grove is destroyed",sources:ravanaSource("The grove battle escalates through Laṅkā’s forces and princes"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-12"}},
 {id:"ravana-rejects-warning",characterId:"ravana",section:"events",label:"Court decision",value:"Rejects the counsel to return Sītā and avoid destruction",sources:ravanaSource("Rāvaṇa refuses the alternative offered by the messenger"),sourceStatus:"Textual",unlock:{kind:"challenge",challengeId:"CK-RAVANA-COURT"}},
 {id:"ravana-orders-tail",characterId:"ravana",section:"events",label:"Punishment ordered",value:"Orders Hanumān’s tail wrapped and burned",sources:ravanaSource("The punishment ordered in court begins the burning episode"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-14"}},
 {id:"ravana-consequence",characterId:"ravana",section:"events",label:"Consequence",value:"The intended humiliation becomes the burning of Laṅkā",sources:ravanaSource("Hanumān turns the punishment back upon the city","learningInterpretation"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-14"}},
 {id:"ravana-source-vr",characterId:"ravana",section:"sources",label:"Shared textual layer",value:"VR-GP · VR-HPS",sources:ravanaSource("Approved Vālmīki source layers used for the V1 dossier"),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-13"}},
 {id:"ravana-source-rcm",characterId:"ravana",section:"sources",label:"Comparison layer",value:"RCM-GP · included where the V1 journey marks a shared comparison",sources:[source("RCM-GP","Approved devotional comparison layer; exact uploaded-edition locator remains pending","textualFact")],sourceStatus:"Later devotional tradition",unlock:{kind:"journey",nodeId:"HJ-14"}},
 {id:"ravana-source-geography",characterId:"ravana",section:"sources",label:"Geographic caution",value:"The app does not claim a precise modern coordinate for Rāvaṇa’s city",sources:[source("VR-HPS","Epic city on Trikūṭa in Laṅkā"),source("TRAD","Broad macro-identification only","traditionalIdentification")],sourceStatus:"Debated / multiple traditions",unlock:{kind:"journey",nodeId:"HJ-13"}},
];

const majorProfileConfig:Record<string,{journey:string[];events:string[];relationships?:string[]}>={
 hanuman:{journey:["HJ-01","HJ-04","HJ-11","HJ-15"],events:["HJ-13","HJ-15"],relationships:["REL-JAMBAVAN-HANUMAN-GUIDANCE","REL-HANUMAN-RAMA-DEVOTION","REL-HANUMAN-SITA-MESSENGER","REL-HANUMAN-RAVANA-MESSENGER"]},
 rama:{journey:["HJ-01","HJ-11","HJ-15"],events:["HJ-11","HJ-15"]},
 sita:{journey:["HJ-10","HJ-11","HJ-14"],events:["HJ-10","HJ-11","HJ-14"]},
 lakshmana:{journey:["HJ-15"],events:["HJ-15"]},
 sugriva:{journey:["HJ-15"],events:["HJ-15"]},
 vibhishana:{journey:["HJ-09","HJ-13"],events:["HJ-09","HJ-13"]},
 jambavan:{journey:["HJ-01","HJ-03","HJ-15"],events:["HJ-03","HJ-15"]},
 indrajit:{journey:["HJ-12","HJ-13"],events:["HJ-12","HJ-13"]},
};
const validSourceIds=new Set<SourceId>(["VR-GP","VR-HPS","RCM-GP","TRAD"]);
const sourceRefs=(ids:string[],summary:string,claimType:SourceReference["claimType"]="textualFact")=>ids.filter((id):id is SourceId=>validSourceIds.has(id as SourceId)).map(id=>source(id,summary,claimType));
function familyDescriptor(characterId:string,relation:(typeof relationships)[number]){
 if(relation.type==="marriage")return{label:"Spouse",familyGroup:"Spouse" as const};
 if(relation.label.includes("brother"))return{label:"Sibling",familyGroup:"Siblings" as const};
 if(relation.label.includes("father"))return relation.fromCharacterId===characterId?{label:"Child",familyGroup:"Children" as const}:{label:"Parent",familyGroup:"Parents" as const};
 return{label:"Family",familyGroup:"Siblings" as const};
}
function buildMajorProfile(characterId:string):CharacterProfileField[]{
 const character=characters.find(item=>item.id===characterId)!,seed=seeds.find(item=>item.id===characterId)!,config=majorProfileConfig[characterId],challengeId=`CK-${characterId.toUpperCase()}`,firstNode=config.journey[0];
 const profileSources=character.sources.filter((id):id is SourceId=>validSourceIds.has(id as SourceId));
 const identitySources=sourceRefs(profileSources,`Approved V1 identity record for ${character.name}`);
 const fields:CharacterProfileField[]=[
  {id:`${characterId}-identity-name`,characterId,section:"overview",label:"Name",value:character.name,sources:identitySources,sourceStatus:"Textual",unlock:{kind:"discovery"}},
  {id:`${characterId}-identity-script`,characterId,section:"overview",label:"Sanskrit record",value:character.sanskrit,sources:identitySources,sourceStatus:"Textual",unlock:{kind:"discovery"}},
  {id:`${characterId}-identity-title`,characterId,section:"overview",label:"V1 title",value:seed.title,sources:identitySources,sourceStatus:"Textual",unlock:{kind:"journey",nodeId:firstNode}},
  {id:`${characterId}-identity-role`,characterId,section:"overview",label:"Story role",value:character.role,sources:identitySources,sourceStatus:"Textual",unlock:{kind:"discovery"}},
  {id:`${characterId}-identity-group`,characterId,section:"overview",label:"Kingdom or group",value:character.group,sources:identitySources,sourceStatus:"Textual",unlock:{kind:"journey",nodeId:firstNode}},
  {id:`${characterId}-identity-meaning`,characterId,section:"overview",label:"Learning meaning",value:character.spiritualSignificance,sources:sourceRefs(profileSources,`V1 learning interpretation for ${character.name}`,"learningInterpretation"),sourceStatus:"Textual",unlock:{kind:"challenge",challengeId}},
  {id:`${characterId}-identity-first`,characterId,section:"overview",label:"First V1 appearance",value:firstNode,sources:identitySources,sourceStatus:"Textual",unlock:{kind:"journey",nodeId:firstNode}},
 ];
 const combinedQualities=characterId==="rama"||characterId==="hanuman";
 for(const [index,quality] of (combinedQualities?[character.qualities.join(" · ")]:character.qualities).entries())fields.push({id:`${characterId}-identity-quality-${index+1}`,characterId,section:"overview",label:index===0?"Key qualities":"Supporting quality",value:quality,sources:sourceRefs(profileSources,`Learning quality attached to ${character.name}`,"learningInterpretation"),sourceStatus:"Textual",unlock:{kind:"challenge",challengeId}});
 if(characterId==="hanuman")fields.push({id:"hanuman-father",characterId,section:"family",label:"Divine father",familyGroup:"Parents",value:"Vāyu",sources:[source("VR-GP","Hanumān is identified with Vāyu as divine father")],sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HJ-04"}});
 fields.push({id:`${characterId}-event-v1-role`,characterId,section:"events",label:"V1 narrative role",value:seed.event,sources:[source(seed.source,seed.event)],sourceStatus:"Textual",unlock:{kind:"challenge",challengeId}});
 for(const nodeId of config.journey){const node=journeyNodes.find(item=>item.id===nodeId)!;fields.push({id:`${characterId}-journey-${nodeId.toLowerCase()}`,characterId,section:"journey",label:"Journey encounter",value:`${node.id} · ${node.title} · ${node.place}`,sources:sourceRefs(node.sourceLabels,`${character.name} appears in ${node.title}`),sourceStatus:node.sourceLabels.includes("TRAD")?"Debated / multiple traditions":"Textual",unlock:{kind:"journey",nodeId}});}
 for(const [index,nodeId] of config.events.entries()){const node=journeyNodes.find(item=>item.id===nodeId)!;fields.push({id:`${characterId}-event-${nodeId.toLowerCase()}`,characterId,section:"events",label:"Key event",value:node.excerpt,sources:sourceRefs(node.sourceLabels,node.excerpt),sourceStatus:"Textual",unlock:index===0?{kind:"challenge",challengeId}:{kind:"journey",nodeId}});}
 const related=(config.relationships?relationships.filter(item=>config.relationships!.includes(item.id)):relationships.filter(item=>item.fromCharacterId===characterId||item.toCharacterId===characterId));
 for(const relation of related){const otherId=relation.fromCharacterId===characterId?relation.toCharacterId:relation.fromCharacterId,otherName=characterNameById[otherId]??otherId,isFamily=relation.type==="family"||relation.type==="marriage",isGuidance=relation.type==="guidance"||relation.type==="teacher",family=isFamily?familyDescriptor(characterId,relation):undefined;fields.push({id:`${characterId}-relationship-${relation.id.toLowerCase()}`,characterId,section:isFamily?"family":isGuidance?"guidance":"connections",label:family?.label??relation.type[0].toUpperCase()+relation.type.slice(1),familyGroup:family?.familyGroup,value:isFamily?otherName:`${characterNameById[relation.fromCharacterId]} ${relation.label} ${characterNameById[relation.toCharacterId]}`,relatedCharacterId:otherId,relationshipId:relation.id,sources:relation.sources.map(id=>source(id,relation.label)),sourceStatus:relation.sources.length===1&&relation.sources[0]==="RCM-GP"?"Later devotional tradition":"Textual",unlock:{kind:"relationship",relationshipId:relation.id}});}
 for(const object of sacredObjects.filter(item=>item.relatedCharacters.includes(character.name)))fields.push({id:`${characterId}-object-${object.id}`,characterId,section:"objects",label:"Sacred object",value:`${object.name} — ${object.description}`,sources:object.sources,sourceStatus:"Textual",unlock:{kind:"object",objectId:object.id}});
 for(const id of profileSources)fields.push({id:`${characterId}-source-${id.toLowerCase()}`,characterId,section:"sources",label:"Approved source layer",value:id,sources:[source(id,`Approved V1 source layer for ${character.name}`)],sourceStatus:id==="RCM-GP"?"Later devotional tradition":id==="TRAD"?"Traditional":"Textual",unlock:{kind:"journey",nodeId:config.journey.at(-1)!}});
 return fields;
}
const majorProfileFields=Object.keys(majorProfileConfig).flatMap(buildMajorProfile);
const enrichedMajorIds=new Set([...Object.keys(majorProfileConfig),"ravana"]);
const depthByCharacter:Record<string,CharacterProfileDepth>={bharata:"supporting",shatrughna:"encounter",sushena:"supporting",hanuman:"major",rama:"major",sita:"major",ravana:"major",lakshmana:"major",jambavan:"supporting",vibhishana:"supporting",sugriva:"supporting",indrajit:"supporting",trijata:"supporting",sampati:"supporting",mainaka:"encounter",surasa:"encounter",simhika:"encounter",lankini:"encounter","aksha-kumara":"encounter"};
const futureScopeByCharacter:Partial<Record<string,CharacterKnowledgeScope>>={rama:"rama-path-v1",sita:"sita-path-v1",ravana:"ravana-path-v1"};
const unlockMethod=(unlock:CharacterProfileField["unlock"]):CharacterKnowledgeUnlockMethod=>{
 switch(unlock.kind){
  case "discovery":return "autoOnCharacterDiscovery";
  case "journey":return unlock.nodeId==="HJ-15"?"autoOnJourneyComplete":"autoOnJourneyNode";
  case "relationship":return "connectionsChallenge";
  case "challenge":return "characterChallenge";
  case "object":return "sacredObjectDiscovery";
  case "sourceExploration":return "sourceExploration";
  case "pendingReview":return "unavailablePendingReview";
  case "achievement":return "autoOnJourneyComplete";
 }
};
const scoped=(field:CharacterProfileField):CharacterProfileField=>{
 const future=futureScopeByCharacter[field.characterId];
 return {...field,scopes:future?["hanuman-v1",future]:["hanuman-v1"],unlockMethod:unlockMethod(field.unlock),countsTowardCompletion:field.countsTowardCompletion??field.unlock.kind!=="pendingReview",claimType:field.sources[0]?.claimType??"textualFact"};
};
const coreFields=[...genericProfileFields.filter(field=>!enrichedMajorIds.has(field.characterId)),...majorProfileFields,...ravanaFields];
const profiledIds=new Set(coreFields.map(field=>field.characterId));
const conciseEncounterFields:CharacterProfileField[]=characters.filter(character=>!profiledIds.has(character.id)).flatMap(character=>{
 const node=[...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].find(item=>item.id===character.appearances[0])!;
 const ids=character.sources.filter((id):id is SourceId=>validSourceIds.has(id as SourceId));
 return [
  {id:`${character.id}-identity`,characterId:character.id,section:"overview",label:"Identity",value:character.role,sources:sourceRefs(ids,`V1 role for ${character.name}`),sourceStatus:"Textual",unlock:{kind:"discovery"}},
  {id:`${character.id}-encounter`,characterId:character.id,section:"journey",label:"Encounter",value:`${node.id} · ${node.title}`,sources:sourceRefs(node.sourceLabels,`${character.name} appears in ${node.title}`),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:node.id}},
  {id:`${character.id}-source`,characterId:character.id,section:"sources",label:"Source record",value:ids.join(" · "),sources:sourceRefs(ids,`Approved V1 source layer for ${character.name}`),sourceStatus:"Textual",unlock:{kind:"journey",nodeId:node.id}},
 ] as CharacterProfileField[];
});

const herbsKnowledge:CharacterProfileField[]=[
 ['jambavan','HFH-01','Guidance in crisis','Jāmbavān asks whether Hanumān lives, then entrusts him with the first medicinal mission.','6.74'],
 ['hanuman','HFH-01','Four medicinal herbs','Mṛta Sañjīvanī restores life; Viśalyakaraṇī removes weapons/heals weapon wounds; Suvarṇakaraṇī restores complexion; Sandhānī joins fractures/severed parts.','6.74'],
 ['hanuman','HFH-02','Service under uncertainty','Unable to obtain the four herbs individually, Hanumān carries the peak, restores the army, and returns the mountain north.','6.74'],
 ['hanuman','HFH-03','Two distinct rescues','Jāmbavān directs the first mission for the army; Suṣeṇa directs the later mission after Rāvaṇa wounds Lakṣmaṇa.','6.74 and 6.101'],
 ['sushena','HFH-03','Name','Suṣeṇa — सुषेण.','6.101'],
 ['sushena','HFH-03','War context','The monkey-physician serves during the war at Laṅkā.','6.101'],
 ['sushena','HFH-03','Examination','Suṣeṇa examines Lakṣmaṇa after Rāvaṇa strikes him.','6.101'],
 ['sushena','HFH-03','Signs of life','Suṣeṇa recognizes that Lakṣmaṇa is still alive.','6.101'],
 ['sushena','HFH-03','Medicinal instructions','He directs Hanumān to retrieve the needed medicines from the mountain.','6.101'],
 ['sushena','HFH-03','Preparation','He selects and prepares the needed herb when Hanumān returns.','6.101'],
 ['sushena','HFH-03','Treatment','He administers the medicine to Lakṣmaṇa, who is restored.','6.101']
].map(([characterId,nodeId,label,value,range],i)=>({id:`herbs-knowledge-${i}`,characterId,section:characterId==='sushena'?'events':'journey',label,value,sources:[{source:'VR-GP',claimType:'textualFact',summary:`Vālmīki Rāmāyaṇa, Yuddha Kāṇḍa ${range}`,locator:`Yuddha ${range}; exact verses pending edition review`,verification:'pendingEditionAudit'}],sourceStatus:'Textual',unlock:{kind:'journey',nodeId}}));

export const characterProfileFields:CharacterProfileField[]=[...coreFields,...meetingMemories.map((value,i):CharacterProfileField=>({id:`hanuman-meeting-memory-${i+1}`,characterId:"hanuman",section:"journey",label:meetingMemoryNames[i],value,countsTowardCompletion:false,sources:[source("VR-GP","A reflective memory drawn from the completed Chapter I encounter.","learningInterpretation")],sourceStatus:"Textual",unlock:{kind:"achievement",achievement:meetingMemoryNames[i]}})),...finaleMemories.map((value,i):CharacterProfileField=>({id:`hanuman-finale-memory-${i+1}`,characterId:"hanuman",section:"journey",label:finaleMemoryNames[i],value,countsTowardCompletion:false,sources:[source("VR-GP","A reflective memory drawn from the completed Chapter VIII encounter.","learningInterpretation")],sourceStatus:"Textual",unlock:{kind:"achievement",achievement:finaleMemoryNames[i]}})),...conciseEncounterFields,...herbsKnowledge,...[
 ["rama","HFF-01","The final confrontation","Rāma defeats and kills Rāvaṇa; the decisive act belongs to him.","6.108"],
 ["hanuman","HFF-01","Service without owning the culmination","Hanumān serves within the allied campaign; Rāma performs the final act.","6.108"],
 ["sita","HFF-02","Compassion after victory","Sītā refuses retaliation against the rākṣasī attendants.","6.112–113"],
 ["hanuman","HFF-02","The grove revisited","Rāma sends Hanumān to bring Sītā news of victory; her response returns through him.","6.112–113"],
 ["bharata","HFF-03","Waiting and devotion","Bharata receives Hanumān’s message of Rāma’s safe return at Nandigrāma.","6.125–127"],
 ["hanuman","HFF-03","The messenger arc","Once Sugrīva’s envoy to Rāma, Hanumān now speaks for Rāma to Bharata.","6.125–127"],
 ["bharata","HFF-04","The kingdom restored","Bharata restores the kingdom to Rāma at the end of the exile.","6.127–128"],
 ["hanuman","HFF-04","Coronation gift","Sītā gives Hanumān a pearl necklace. This is a coronation story artifact, distinct from the earlier cūḍāmaṇi transmission.","6.127–128"],
 ["shatrughna","HFF-04","Homecoming","Śatrughna is present with the brothers in the homecoming and coronation context.","6.127–128"],
 ["hanuman","HFW-01","Reconnaissance, memory and strategic communication","What Hanumān personally observed becomes a reliable report for Rāma and the army.","6.3"],
 ["hanuman","HFW-02","Counsel and discernment","Hanumān gives a reasoned assessment of Vibhīṣaṇa. Rāma makes the decision to grant refuge.","6.17–18"],
 ["vibhishana","HFW-02","Seeking refuge","The Vālmīki refuge-and-counsel episode is distinct from the earlier Rāmacaritamānasa meeting in HJ-09.","6.17–18"],
 ["nala","HFW-03","Bridge-making service","Nala is identified as the bridge-maker. The army’s Setu crossing occurs later than Hanumān’s solitary leap.","6.22–26"],
 ["hanuman","HFW-04","Battlefield command","Hanumān is stationed as an army-chief at Laṅkā’s western gate.","6.51–52"],
 ["hanuman","HFW-05","Leadership and protection","The vānaras rally around Hanumān when he comes to their aid against Akampana.","6.55–56"],
 ["hanuman","HFW-06","Service in crisis","Hanumān and Vibhīṣaṇa search the wounded battlefield for Jāmbavān.","6.74"]
].map(([characterId,nodeId,label,value,range]):CharacterProfileField=>({id:`${characterId}-${nodeId}-knowledge`,characterId,section:"journey",label,value,sources:[{source:"VR-GP",claimType:"textualFact",summary:`Vālmīki Rāmāyaṇa, Yuddha Kāṇḍa ${range}`,verification:"pendingEditionAudit"}],sourceStatus:"Textual",unlock:{kind:"journey",nodeId}})),...["Eloquence","Learning","Restraint"].map((quality,index):CharacterProfileField=>({id:`hanuman-meeting-quality-${index}`,characterId:"hanuman",section:"overview",label:"Quality at the first meeting",value:quality,sources:[source("VR-GP","Kiṣkindhā Kāṇḍa 4.3–4; exact verses pending edition review")],sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HFM-02"}})),{id:"sita-meeting-mission",characterId:"sita",section:"journey",label:"The reason for the search",value:"Sītā’s absence gives the meeting its larger purpose: Rāma seeks her, and Hanumān sees how Sugrīva may help.",sources:[source("VR-GP","Kiṣkindhā Kāṇḍa 4.3–4; exact verses pending edition review")],sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HFM-03"}} satisfies CharacterProfileField,{id:"sita-dropped-ornaments",characterId:"sita",section:"events",label:"Story evidence",value:"Ornaments dropped by Sītā are shown to Rāma by Sugrīva. They are story artifacts, not Sacred Objects.",sources:[source("VR-GP","Kiṣkindhā Kāṇḍa 4.6; exact verses pending edition review")],sourceStatus:"Textual",unlock:{kind:"journey",nodeId:"HFM-05"}} satisfies CharacterProfileField].map(scoped);

export const characterKnowledgeProfiles:CharacterKnowledgeProfileDefinition[]=characters.map(character=>{
 const future=futureScopeByCharacter[character.id];
 return {characterId:character.id,depth:depthByCharacter[character.id]??"encounter",activeScope:"hanuman-v1",availableScopes:future?["hanuman-v1",future]:["hanuman-v1"],futureSupportedFacts:future?[`${future} can add verified facts without changing the completed Hanumān Journey knowledge record.`]:[]};
});
export const characterKnowledgeProfileFor=(characterId:string)=>characterKnowledgeProfiles.find(profile=>profile.characterId===characterId)??{characterId,depth:"encounter" as const,activeScope:"hanuman-v1" as const,availableScopes:["hanuman-v1" as const],futureSupportedFacts:[]};

const genericChallenges:CharacterChallenge[]=seeds.filter(seed=>seed.id!=="ravana").map(seed=>({id:`CK-${seed.id.toUpperCase()}`,characterId:seed.id,type:seed.challenge.type,prompt:seed.challenge.prompt,context:`Complete ${characterNameById[seed.id]??seed.id}’s dossier`,options:choice(...seed.challenge.options),answer:seed.challenge.answer,explanation:seed.challenge.explanation,unlockFieldIds:[`${seed.id}-event`],unlockRelationshipIds:seed.relationshipId?[seed.relationshipId]:[]}));
const ravanaChallenges:CharacterChallenge[]=[
 {id:"CK-RAVANA-SON",characterId:"ravana",type:"family-connection",prompt:"Which warrior in the grove battle is Rāvaṇa’s son?",context:"Complete Rāvaṇa’s family record",options:choice("Indrajit / Meghanāda","Jāmbavān","Sampāti","Maināka"),answer:"a",explanation:"Indrajit, also called Meghanāda, is Rāvaṇa’s son.",unlockFieldIds:["ravana-son-indrajit"],unlockRelationshipIds:["REL-RAVANA-INDRAJIT-FAMILY"]},
 {id:"CK-RAVANA-BROTHER",characterId:"ravana",type:"family-connection",prompt:"Who is Rāvaṇa’s brother and offers counsel in the court sequence?",context:"Complete Rāvaṇa’s sibling record",options:choice("Vibhīṣaṇa","Indrajit","Hanumān","Sugrīva"),answer:"a",explanation:"Vibhīṣaṇa is Rāvaṇa’s brother and a voice of dharma within Laṅkā.",unlockFieldIds:["ravana-brother-vibhishana"],unlockRelationshipIds:["REL-RAVANA-VIBHISHANA-FAMILY"]},
 {id:"CK-RAVANA-COURT",characterId:"ravana",type:"key-event",prompt:"What choice defines Rāvaṇa’s V1 court encounter?",context:"Complete Rāvaṇa’s key-event record",options:choice("He rejects the counsel to return Sītā","He accepts the warning and releases Sītā","He sends Hanumān back with gifts"),answer:"a",explanation:"Rāvaṇa rejects the offered path away from ruin, linking power and pride to the consequences that follow.",unlockFieldIds:["ravana-quality","ravana-rejects-warning"]},
];
const majorRelationshipChallenges:CharacterChallenge[]=[
 {id:"CK-RAMA-SPOUSE",characterId:"rama",type:"family-connection",prompt:"Who is Rāma’s spouse in the V1 journey record?",context:"Reveal Rāma’s spouse connection",options:choice("Sītā","Trijaṭā","Surasā","Laṅkinī"),answer:"a",explanation:"Rāma and Sītā are spouses; the connection is carried by the shared relationship record.",unlockFieldIds:["rama-relationship-rel-rama-sita-marriage"],unlockRelationshipIds:["REL-RAMA-SITA-MARRIAGE"]},
 {id:"CK-RAMA-BROTHER",characterId:"rama",type:"family-connection",prompt:"Which brother stands with Rāma when Hanumān returns?",context:"Reveal Rāma’s sibling connection",options:choice("Lakṣmaṇa","Indrajit","Sampāti","Maināka"),answer:"a",explanation:"Lakṣmaṇa is Rāma’s brother and is present in the return encounter.",unlockFieldIds:["rama-relationship-rel-rama-lakshmana-family"],unlockRelationshipIds:["REL-RAMA-LAKSHMANA-FAMILY"]},
 {id:"CK-SITA-SPOUSE",characterId:"sita",type:"family-connection",prompt:"Whose ring allows Sītā to recognize Hanumān’s message?",context:"Reveal Sītā’s spouse connection",options:choice("Rāma","Sugrīva","Jāmbavān","Vibhīṣaṇa"),answer:"a",explanation:"Rāma’s ring authenticates the messenger and confirms the spouse relationship already held in the network.",unlockFieldIds:["sita-relationship-rel-rama-sita-marriage"],unlockRelationshipIds:["REL-RAMA-SITA-MARRIAGE"]},
 {id:"CK-LAKSHMANA-BROTHER",characterId:"lakshmana",type:"family-connection",prompt:"How is Lakṣmaṇa connected to Rāma?",context:"Reveal Lakṣmaṇa’s family record",options:choice("Brother","Teacher","Messenger","Opponent"),answer:"a",explanation:"Lakṣmaṇa is Rāma’s brother and steadfast companion.",unlockFieldIds:["lakshmana-relationship-rel-rama-lakshmana-family"],unlockRelationshipIds:["REL-RAMA-LAKSHMANA-FAMILY"]},
 {id:"CK-VIBHISHANA-BROTHER",characterId:"vibhishana",type:"family-connection",prompt:"To whom does Vibhīṣaṇa offer counsel in the Laṅkā court sequence?",context:"Reveal Vibhīṣaṇa’s family record",options:choice("His brother Rāvaṇa","His son Indrajit","Rāma’s brother Lakṣmaṇa","The elder Jāmbavān"),answer:"a",explanation:"Vibhīṣaṇa is Rāvaṇa’s brother; the same relationship record feeds Family and Connections.",unlockFieldIds:["vibhishana-relationship-rel-ravana-vibhishana-family"],unlockRelationshipIds:["REL-RAVANA-VIBHISHANA-FAMILY"]},
 {id:"CK-INDRAJIT-FATHER",characterId:"indrajit",type:"family-connection",prompt:"Who is Indrajit / Meghanāda’s father?",context:"Reveal Indrajit’s family record",options:choice("Rāvaṇa","Rāma","Sugrīva","Sampāti"),answer:"a",explanation:"Indrajit is Rāvaṇa’s son, a relationship already represented in the shared network.",unlockFieldIds:["indrajit-relationship-rel-ravana-indrajit-family"],unlockRelationshipIds:["REL-RAVANA-INDRAJIT-FAMILY"]},
];
export const characterChallenges:CharacterChallenge[]=[...genericChallenges,...ravanaChallenges,...majorRelationshipChallenges];

export const characterSourceReviewGaps:Record<string,string[]>={
 rama:["Parents and wider Ayodhyā lineage await edition-level verification in the approved project sources.","Guru and teacher fields remain unavailable until the V1 source record includes verified passages."],
 hanuman:["Maternal lineage and additional family traditions remain withheld pending approved-source review.","Later devotional titles and expanded powers are not merged into the textual V1 profile."],
 sita:["Parents, siblings, and wider lineage remain unavailable pending edition-level verification.","Tradition-specific birthplace identifications remain separate from the textual journey record."],
 lakshmana:["Parents, spouse, and wider family details await approved-source verification for this V1 scope.","Guidance and teacher claims are withheld until supported by project references."],
 ravana:["Parents and lineage require an edition-level source audit.","Spouse, additional siblings, and additional children are withheld until verified against the approved editions.","Guru or teacher claims are withheld because the current V1 source record does not verify them.","Exact book, chapter, and verse locators remain pending for the approved source layers."],
 sugriva:["Family and lineage are not included because the current V1 journey record does not verify them.","Additional kingship events belong to future journey scope and do not count toward this profile."],
 vibhishana:["Additional family relations and later kingship events await approved-source review.","Tradition-specific details remain separated from the RCM-GP early-meeting layer."],
 jambavan:["Lineage and later-epic events are outside the verified Hanumān Journey V1 record.","Teacher or guru terminology is not applied beyond the supported guidance relationship."],
 indrajit:["Mother, spouse, siblings, and later battle traditions await approved-source verification.","Additional weapons and titles are withheld until supported by the approved edition record."],
};
export const characterAchievementDefinitions=[
 {name:"First Profile",description:"Complete a V1 character profile."},
 {name:"Family Ties",description:"Reveal supported family knowledge."},
 {name:"Know Your Guide",description:"Reveal a guidance relationship."},
 {name:"Character Scholar",description:"Answer ten character challenges correctly."},
 {name:"Complete Hanumān",description:"Reveal every supported field in Hanumān’s V1 profile."},
 {name:"Complete Rāvaṇa",description:"Reveal every supported field in Rāvaṇa’s V1 profile."},
 {name:"Complete 5 Character Profiles",description:"Complete five V1 character profiles."},
];
export const characterChallengeById=(id:string)=>characterChallenges.find(item=>item.id===id);
export const characterFieldsFor=(characterId:string,scope:CharacterKnowledgeScope="hanuman-v1")=>characterProfileFields.filter(field=>field.characterId===characterId&&field.scopes?.includes(scope));
export const characterChallengesFor=(characterId:string)=>characterChallenges.filter(challenge=>challenge.characterId===characterId);
export const characterAnswerIsCorrect=(progress:Pick<JourneyProgressState,"characterChallengeAnswers">,challengeId:string)=>{const challenge=characterChallengeById(challengeId);return Boolean(challenge&&progress.characterChallengeAnswers[challengeId]===challenge.answer);};
export function characterFieldIsUnlocked(field:CharacterProfileField,progress:JourneyProgressState){
 if(!progress.unlockedCharacters.includes(characterNameById[field.characterId]??""))return false;
 switch(field.unlock.kind){
  case "discovery":return true;
  case "journey":return [...progress.meetingCompletedNodes,...progress.completedNodes,...progress.warCompletedNodes,...progress.finaleCompletedNodes,...progress.herbsCompletedNodes].includes(field.unlock.nodeId);
  case "relationship":return progress.unlockedRelationships.includes(field.unlock.relationshipId);
  case "challenge":return characterAnswerIsCorrect(progress,field.unlock.challengeId);
  case "object":return progress.discoveredObjects.includes(field.unlock.objectId);
  case "achievement":return progress.achievements.includes(field.unlock.achievement);
  case "sourceExploration":return false;
  case "pendingReview":return false;
 }
}
export function characterKnowledgeProgress(characterId:string,progress:JourneyProgressState,scope:CharacterKnowledgeScope="hanuman-v1"):CharacterKnowledgeProgress{
 const profile=characterKnowledgeProfileFor(characterId),fields=characterFieldsFor(characterId,scope).filter(field=>field.countsTowardCompletion!==false),unlockedFields=fields.filter(field=>characterFieldIsUnlocked(field,progress));
 const sectionProgress=Object.fromEntries(sections.map(section=>{const group=fields.filter(field=>field.section===section);return [section,{unlocked:group.filter(field=>unlockedFields.includes(field)).length,total:group.length}];})) as CharacterKnowledgeProgress["sections"];
 const percentage=fields.length?Math.round(unlockedFields.length/fields.length*100):0;
 return {characterId,scope,depth:profile.depth,completionLabel:"Hanumān Journey knowledge",unlocked:unlockedFields.length,total:fields.length,percentage,state:percentage===100?"Complete":percentage>35?"Developing":"Discovered",sections:sectionProgress};
}
export function characterKnowledgeAchievementNames(progress:JourneyProgressState){
 const completed=seeds.filter(seed=>characterKnowledgeProgress(seed.id,progress).percentage===100);
 const correct=characterChallenges.filter(challenge=>characterAnswerIsCorrect(progress,challenge.id)).length;
 const unlockedFields=characterProfileFields.filter(field=>characterFieldIsUnlocked(field,progress));
 return [
  completed.length>0?"First Profile":null,
  unlockedFields.some(field=>field.section==="family")?"Family Ties":null,
  unlockedFields.some(field=>field.section==="guidance")?"Know Your Guide":null,
  correct>=10?"Character Scholar":null,
  completed.some(seed=>seed.id==="hanuman")?"Complete Hanumān":null,
  completed.some(seed=>seed.id==="ravana")?"Complete Rāvaṇa":null,
  completed.length>=5?"Complete 5 Character Profiles":null,
 ].filter((name):name is string=>Boolean(name));
}
