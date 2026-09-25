import {finaleNodes,finaleSourceRanges} from "@/data/finale";
import {herbsNodes,herbsSourceRanges} from "@/data/herbs";
import {warNodes,warSourceRanges} from "@/data/war";
import {meetingNodes,meetingSourceRanges} from "@/data/meeting";
import {searchNodes} from "@/data/search";
import masterContent from "@/data/hanuman-master-content.json";
import {characterIdByName} from "@/data/character-ids";
import {journeyNodes} from "@/data/journey";
import {sacredObjects} from "@/data/encounter-activities";
import {relationships} from "@/data/relationships";
import type {CampaignChapter,CampaignMapLandmark,CampaignRouteSegment,CharacterCampaign,CharacterPathId,RamayanaEvent,SourceId,SourceReference} from "@/lib/types";
import {orderedSourceIds,sourceReadiness,sourceOrder} from "@/lib/source-readiness";

const sourceIds:SourceId[]=[...sourceOrder];
const sourceRef=(source:SourceId,title:string):SourceReference=>({source,claimType:"textualFact",summary:`Working source layer for the playable event “${title}”; edition citation awaits audit.`,verification:"planningReference"});
const chapterForNode=(number:number)=>number<=3?"HC-02":number<=8?"HC-03":number<=11?"HC-04":"HC-05";
const kandaForNode=(number:number)=>number<=3?"kiskindha" as const:"sundara" as const;

const pathsFor=(characterIds:string[])=>{
 const pathIds:CharacterPathId[]=["hanuman",...(["rama","sita","bharata","ravana"] as const).filter(id=>characterIds.includes(id))];
 return Array.from(new Set(pathIds)).map(pathId=>({pathId,characterId:pathId,importance:pathId==="hanuman"?"major" as const:"contextual" as const,perspective:pathId==="hanuman"?"primary" as const:"secondary" as const}));
};

const playableEvents:RamayanaEvent[]= [...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map(node=>{
 const characterIds=Array.from(new Set(node.characters.map(name=>characterIdByName[name]).filter((id):id is string=>Boolean(id))));
 return {
  id:node.id,title:node.title,canonicalOrder:node.id.startsWith("HFF-")?31+node.number:node.id.startsWith("HFH-")?28+node.number:node.id.startsWith("HFW-")?22+node.number:node.number,kanda:node.id.startsWith("HFF-")?"yuddha":node.id.startsWith("HFH-")?"yuddha":node.id.startsWith("HFW-")?"yuddha":node.id.startsWith("HFM-")||node.id.startsWith("HFS-")?"kiskindha":kandaForNode(node.number),chapterId:node.id.startsWith("HFF-")?"HC-08":node.id.startsWith("HFH-")?"HC-07":node.id.startsWith("HFW-")?"HC-06":node.id.startsWith("HFM-")?"HC-01":node.id.startsWith("HFS-")?"HC-02":chapterForNode(node.number),
  placeIds:[node.id],characterIds,primaryCharacterIds:node.id==="HFF-01"?["rama"]:["hanuman"],supportingCharacterIds:characterIds.filter(id=>id!==(node.id==="HFF-01"?"rama":"hanuman")),
  relationshipIds:relationships.filter(item=>item.eventId===node.id).map(item=>item.id),
  sacredObjectIds:sacredObjects.filter(item=>item.discoveryNode===node.id).map(item=>item.id),
  sourceRefs:orderedSourceIds(node.sourceLabels).filter((id):id is SourceId=>sourceIds.includes(id as SourceId)).map(id=>node.id.startsWith("HFF-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Yuddha Kāṇḍa ${finaleSourceRanges[node.number-1]}`,verification:"pendingEditionAudit" as const}:node.id.startsWith("HFH-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Yuddha Kāṇḍa ${herbsSourceRanges[node.number-1]}; exact verses pending Gita Press edition review`,verification:"pendingEditionAudit" as const}:node.id.startsWith("HFW-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Yuddha Kāṇḍa ${warSourceRanges[node.number-1]}; exact verses pending Gita Press edition review`,verification:"pendingEditionAudit" as const}:node.id.startsWith("HFM-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Kiṣkindhā Kāṇḍa ${meetingSourceRanges[node.number-1]}; exact verses pending Gita Press edition review`,verification:"pendingEditionAudit" as const}:sourceRef(id,node.title)),
  activityIds:(node.activities??[]).map(item=>item.id),sceneArtwork:{locked:node.scene.imageLocked,revealed:node.scene.imageRevealed,assetStatus:node.scene.assetStatus},characterPaths:pathsFor(characterIds).map(path=>node.id==="HFF-01"?{...path,perspective:path.pathId==="rama"?"primary" as const:"secondary" as const}:path),narrativeContexts:pathsFor(characterIds).map(item=>item.pathId),
  unlocks:node.unlocks,completionTakeaway:node.completionTakeaway,contentStatus:"playable",get sourceReviewRequired(){return sourceReadiness(this.sourceRefs)!=="verified";},playableNodeId:node.id,
 };
});

const pending="Planning placeholder only. Exact sequence, claims, activities, and scene content require approved-source review.";
const planned=(id:string,title:string,canonicalOrder:number,kanda:"kiskindha"|"yuddha",chapterId:string,characterIds:string[]):RamayanaEvent=>({
 id,title,canonicalOrder,kanda,chapterId,placeIds:[],characterIds,primaryCharacterIds:["hanuman"],supportingCharacterIds:characterIds.filter(item=>item!=="hanuman"),
 relationshipIds:[],sacredObjectIds:[],sourceRefs:[],activityIds:[],characterPaths:pathsFor(characterIds),narrativeContexts:pathsFor(characterIds).map(item=>item.pathId),
 unlocks:[],completionTakeaway:"",contentStatus:"sourceReviewRequired",sourceReviewRequired:true,planningNote:pending,
});

// Workbook verification flags are editorial claims, retained in the catalog for review.
export const hanumanMasterContent = masterContent;
const plannedEvents:RamayanaEvent[]=masterContent.nodes.filter(node=>node.buildStatus==="NEW"&&node.chapterId!=="HC-01"&&node.chapterId!=="HC-02"&&node.chapterId!=="HC-06"&&node.chapterId!=="HC-07"&&node.chapterId!=="HC-08").map(node=>{
 const characterIds=node.characters.split(";").map(name=>characterIdByName[name.trim()]).filter((id):id is string=>Boolean(id));
 const event=planned(node.id,node.title,node.order,node.kanda==="Yuddha Kāṇḍa"?"yuddha":"kiskindha",node.chapterId,Array.from(new Set(["hanuman",...characterIds])));
 return {...event,planningNote:pending+" "+node.notes};
});
for(const event of playableEvents){
 const record=masterContent.nodes.find(node=>node.id===event.id);
 if(record) event.canonicalOrder=record.order;
}

export const ramayanaEvents:RamayanaEvent[]=[...playableEvents,...plannedEvents].sort((a,b)=>a.canonicalOrder-b.canonicalOrder);
export const ramayanaEventById=Object.fromEntries(ramayanaEvents.map(event=>[event.id,event])) as Record<string,RamayanaEvent>;

export const hanumanCampaignChapters:CampaignChapter[]=[
 {id:"HC-01",number:1,title:"The Meeting",kanda:"kiskindha",theme:"earth",status:"available",description:"Recognition becomes service: Hanumān meets Rāma, understands the search, and brings two future allies together.",eventIds:meetingNodes.map(n=>n.id),playableNodeIds:meetingNodes.map(n=>n.id),completionCopy:"The meeting becomes a mission."},
 {id:"HC-02",number:2,title:"The Search",kanda:"kiskindha",theme:"earth",status:"available",description:"Evidence becomes direction: the southern search is commissioned, trust is carried forward, testimony updates the route, and remembered capacity becomes a launch plan.",eventIds:["HFS-01","HFS-02","HJ-01","HJ-02","HJ-03"],playableNodeIds:["HFS-01","HFS-02","HJ-01","HJ-02","HJ-03"],completionCopy:"The search becomes responsibility."},
 {id:"HC-03",number:3,title:"Across the Ocean",kanda:"sundara",theme:"ocean",status:"available",description:"Hanumān reads each obstacle before choosing whether to acknowledge, adapt, confront, or enter with measured force.",eventIds:["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"],playableNodeIds:["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"],completionCopy:"Strength joins discernment."},
 {id:"HC-04",number:4,title:"Sītā in Laṅkā",kanda:"sundara",theme:"lanka",status:"available",description:"Verify before revealing yourself: signs become trust, converging evidence becomes recognition, and Rāma’s Ring makes the message credible.",eventIds:["HJ-09","HJ-10","HJ-11"],playableNodeIds:["HJ-09","HJ-10","HJ-11"],completionCopy:"The search becomes hope."},
 {id:"HC-05",number:5,title:"Messenger and Warrior",kanda:"sundara",theme:"lanka",status:"available",description:"Hanumān carries warning through conflict and returns with the knowledge Rāma has awaited.",eventIds:["HJ-12","HJ-13","HJ-14","HJ-15"],playableNodeIds:["HJ-12","HJ-13","HJ-14","HJ-15"],completionCopy:"The mission to Laṅkā is complete."},
 {id:"HC-06",number:6,title:"The War",kanda:"yuddha",theme:"lanka",status:"available",description:"Hanumān’s service grows through reconnaissance, counsel, command, protection and rescue preparation.",eventIds:warNodes.map(n=>n.id),playableNodeIds:warNodes.map(n=>n.id),completionCopy:"Service becomes responsibility for an entire army."},
 {id:"HC-07",number:7,title:"The Mountain of Herbs",kanda:"yuddha",theme:"ocean",status:"available",description:"Two distinct medicinal missions: Jāmbavān’s call for the army, then Suṣeṇa’s physician-led rescue of Lakṣmaṇa.",eventIds:herbsNodes.map(n=>n.id),playableNodeIds:herbsNodes.map(n=>n.id),completionCopy:"Strength becomes lifesaving service."},
 {id:"HC-08",number:8,title:"Mission Fulfilled",kanda:"yuddha",theme:"return",status:"available",description:"Victory, message, return, fulfillment. The mission is fulfilled. Service continues.",eventIds:finaleNodes.map(n=>n.id),playableNodeIds:finaleNodes.map(n=>n.id),completionCopy:"The mission is fulfilled. Service continues."},
];

for(const chapter of hanumanCampaignChapters){
 if(chapter.id!=="HC-01"&&chapter.id!=="HC-06"&&chapter.id!=="HC-07"&&chapter.id!=="HC-08")chapter.eventIds=masterContent.nodes.filter(node=>node.chapterId===chapter.id).map(node=>node.id);
}

export const hanumanCampaign:CharacterCampaign={id:"hanuman",characterId:"hanuman",title:"Follow Hanumān",subtitle:"A path of courage, wisdom, and service",description:"An eight-chapter journey from the first meeting to the return to Ayodhyā.",chapterIds:hanumanCampaignChapters.map(item=>item.id),playableNodeIds:[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map(item=>item.id),status:"active",completionTitle:"Mission Fulfilled",completionCopy:"The mission ends; devotion continues.",futurePathIds:["rama","sita","bharata","ravana"]};

export const hanumanOriginsKnowledge={id:"hanuman-origins",title:"Origins and remembered strength",delivery:"retrospective-character-knowledge" as const,unlockEventId:"HJ-03",contentStatus:"sourceReviewRequired" as const,sourceReviewRequired:true,categories:["family","childhood","powers","remembrance"],planningNote:"Origin and childhood traditions must be presented retrospectively and added only after each claim is reviewed against an approved source."};
export const laterTraditionsExpansion={id:"hanuman-later-traditions",status:"planned" as const,separateFromCoreCampaign:true,sourceReviewRequired:true,excludedFromCurrentCampaign:["later devotional biographies","regional childhood cycles","post-epic miracle traditions"],planningNote:"Later traditions belong in a separately labeled expansion and must not be silently merged into the core campaign."};
export const futureCharacterCampaigns=["rama","sita","bharata","ravana"].map(characterId=>({characterId,status:"planned" as const,reusesEventModel:true}));

export const hanumanCampaignLandmarks:CampaignMapLandmark[]=[
 {id:"ayodhya",name:"Ayodhyā",x:51,y:12,kind:"city",confidence:"B",description:"A traditional campaign landmark in the northern plains; the campaign uses it as a broad narrative anchor."},
 {id:"himalaya",name:"Himalaya",x:72,y:9,kind:"mountain",confidence:"E",description:"A broad northern mountain region associated with the medicinal journeys; no single peak is asserted."},
 {id:"kishkindha",name:"Kiṣkindhā",x:43,y:47,kind:"region",confidence:"D",description:"Shown as a traditional southern interior region. Proposed modern identifications remain debated."},
 {id:"south-india",name:"Southern India",x:46,y:61,kind:"region",confidence:"E",description:"A broad narrative region for the southern search, rather than a precise archaeological point."},
 {id:"rameswaram",name:"Rāmeśvaram",x:54,y:71,kind:"coast",confidence:"B",description:"A major traditional landmark between southern India, the later Setu context, and Laṅkā. It is not used as the route of Hanumān’s earlier solitary leap."},
 {id:"lanka",name:"Laṅkā",x:82,y:73,kind:"island",confidence:"B",description:"Sri Lanka is shown as the broad traditional macro-identification; individual epic sites remain narrative or debated."},
];

export const hanumanCampaignChapterPositions:Record<string,{x:number;y:number;label:string}>={
 "HC-01":{x:41,y:39,label:"I"},"HC-02":{x:45,y:54,label:"II"},"HC-03":{x:59,y:51,label:"III"},"HC-04":{x:75,y:55,label:"IV"},
 "HC-05":{x:85,y:63,label:"V"},"HC-06":{x:70,y:78,label:"VI"},"HC-07":{x:70,y:20,label:"VII"},"HC-08":{x:52,y:21,label:"VIII"},
};

export type CampaignLandingAnchor={
 stateId:string;
 point:{x:number;y:number};
 mobilePoint?:{x:number;y:number};
 approachControl:{x:number;y:number};
 arrivalOffset:{x:number;y:number};
 facing:"left"|"right";
 movementPreset:"standard"|"leap"|"crossing"|"stealth"|"emergency-flight"|"return"|"ceremonial-arrival";
 ground:{width:number;rotation:number;opacity:number};
 terrain:string;
};

export type CampaignStoryAnchor=CampaignLandingAnchor&{
 chapterId:string;
 triggerEncounterId?:string;
};

// Each resting point is authored against the painted terrain. These are places to stand, not offsets from chapter controls.
export const hanumanCampaignCompanionPositions:Record<string,CampaignLandingAnchor>={
 "HC-01":{stateId:"kishkindha-meeting",point:{x:37.4,y:43.8},mobilePoint:{x:37.1,y:44.4},approachControl:{x:43,y:30},arrivalOffset:{x:4,y:-2},facing:"right",movementPreset:"standard",ground:{width:24,rotation:-8,opacity:.34},terrain:"Forest path below the Kiṣkindhā foothills"},
 "HC-02":{stateId:"southern-search",point:{x:47.6,y:61.8},mobilePoint:{x:48.1,y:62.4},approachControl:{x:43,y:54},arrivalOffset:{x:-3,y:-2},facing:"right",movementPreset:"standard",ground:{width:25,rotation:5,opacity:.32},terrain:"Open ground on the southern route"},
 "HC-03":{stateId:"ocean-approach",point:{x:64,y:64},mobilePoint:{x:65,y:63.3},approachControl:{x:54,y:65},arrivalOffset:{x:-5,y:1},facing:"right",movementPreset:"crossing",ground:{width:23,rotation:2,opacity:.3},terrain:"Southern shoreline at the beginning of the leap"},
 "HC-04":{stateId:"lanka-arrival",point:{x:78.8,y:66.8},mobilePoint:{x:79.4,y:67.3},approachControl:{x:68,y:54},arrivalOffset:{x:-4,y:-3},facing:"right",movementPreset:"stealth",ground:{width:22,rotation:-11,opacity:.36},terrain:"Rocky threshold at the edge of Laṅkā"},
 "HC-05":{stateId:"lanka-messenger",point:{x:84.2,y:75.8},mobilePoint:{x:84.7,y:76.3},approachControl:{x:84,y:68},arrivalOffset:{x:0,y:-4},facing:"left",movementPreset:"standard",ground:{width:24,rotation:7,opacity:.36},terrain:"Clear ground below the city of Laṅkā"},
 "HC-06":{stateId:"lanka-war",point:{x:78.2,y:79},mobilePoint:{x:78.7,y:79.5},approachControl:{x:80,y:78},arrivalOffset:{x:3,y:0},facing:"left",movementPreset:"standard",ground:{width:25,rotation:4,opacity:.38},terrain:"Campaign ground on Laṅkā’s western side"},
 "HC-07":{stateId:"mountain-mission",point:{x:68.2,y:18.4},mobilePoint:{x:68.8,y:19.1},approachControl:{x:91,y:44},arrivalOffset:{x:6,y:5},facing:"left",movementPreset:"emergency-flight",ground:{width:22,rotation:-6,opacity:.3},terrain:"Green foothill below the northern mountains"},
 "HC-08":{stateId:"ayodhya-return",point:{x:48,y:18.8},mobilePoint:{x:48.5,y:19.4},approachControl:{x:86,y:30},arrivalOffset:{x:6,y:2},facing:"left",movementPreset:"ceremonial-arrival",ground:{width:25,rotation:-3,opacity:.3},terrain:"Approach road below Ayodhyā"},
};

// Authored story positions are tied to canonical encounter completions, never to a generic percentage.
// The first state is the restored/default position; every later state is reached only once, when its
// trigger encounter is first completed. Coordinates are hand placed against the painted atlas.
export const hanumanCampaignCompanionStoryStates:CampaignStoryAnchor[]=[
 {...hanumanCampaignCompanionPositions["HC-01"],chapterId:"HC-01"},

 {chapterId:"HC-02",stateId:"search-departs-kishkindha",triggerEncounterId:"HFM-05",point:{x:43.5,y:50.5},mobilePoint:{x:43.8,y:51},approachControl:{x:41,y:47},arrivalOffset:{x:-1,y:-1},facing:"right",movementPreset:"standard",ground:{width:24,rotation:-3,opacity:.32},terrain:"Southbound path below Kiṣkindhā"},
 {chapterId:"HC-02",stateId:"southern-search-assembly",triggerEncounterId:"HFS-02",point:{x:46.2,y:56.2},mobilePoint:{x:46.7,y:56.8},approachControl:{x:44,y:53},arrivalOffset:{x:-1,y:-1},facing:"right",movementPreset:"standard",ground:{width:24,rotation:4,opacity:.32},terrain:"Open ground on the southern search route"},
 {chapterId:"HC-02",stateId:"shore-of-decision",triggerEncounterId:"HJ-01",point:{x:50.5,y:63.5},mobilePoint:{x:51,y:64},approachControl:{x:48,y:59},arrivalOffset:{x:-2,y:-1},facing:"right",movementPreset:"standard",ground:{width:23,rotation:6,opacity:.3},terrain:"Southern coastal ground before the leap"},

 {chapterId:"HC-03",stateId:"leap-prepared",triggerEncounterId:"HJ-03",point:{x:64.5,y:67.5},mobilePoint:{x:65,y:68},approachControl:{x:57,y:66},arrivalOffset:{x:-2,y:0},facing:"right",movementPreset:"standard",ground:{width:23,rotation:2,opacity:.3},terrain:"Launch ground at the southern coast"},
 {chapterId:"HC-03",stateId:"ocean-leap",triggerEncounterId:"HJ-04",point:{x:67.5,y:60},mobilePoint:{x:68.1,y:60.5},approachControl:{x:65,y:56},arrivalOffset:{x:-2,y:2},facing:"right",movementPreset:"leap",ground:{width:20,rotation:0,opacity:.18},terrain:"Narrative route above the western crossing"},
 {chapterId:"HC-03",stateId:"mid-ocean-crossing",triggerEncounterId:"HJ-06",point:{x:68.4,y:57},mobilePoint:{x:69,y:57.6},approachControl:{x:65,y:51},arrivalOffset:{x:-2,y:2},facing:"right",movementPreset:"crossing",ground:{width:19,rotation:0,opacity:.16},terrain:"Narrative midpoint of Hanumān’s ocean crossing"},
 {chapterId:"HC-03",stateId:"lanka-threshold",triggerEncounterId:"HJ-08",point:{x:76.8,y:64.5},mobilePoint:{x:77.4,y:65},approachControl:{x:72,y:57},arrivalOffset:{x:-3,y:-2},facing:"right",movementPreset:"stealth",ground:{width:22,rotation:-9,opacity:.34},terrain:"Rocky threshold at the edge of Laṅkā"},

 {chapterId:"HC-04",stateId:"within-lanka",triggerEncounterId:"HJ-09",point:{x:78.4,y:59.5},mobilePoint:{x:79,y:60},approachControl:{x:77,y:62},arrivalOffset:{x:-1,y:2},facing:"right",movementPreset:"stealth",ground:{width:22,rotation:-7,opacity:.34},terrain:"Sheltered route within Laṅkā"},
 {chapterId:"HC-04",stateId:"ashoka-vatika",triggerEncounterId:"HJ-10",point:{x:81.4,y:64.5},mobilePoint:{x:82,y:65},approachControl:{x:80,y:61},arrivalOffset:{x:-1,y:1},facing:"right",movementPreset:"stealth",ground:{width:22,rotation:5,opacity:.34},terrain:"Garden ground near Aśoka Vātikā"},
 {chapterId:"HC-04",stateId:"message-entrusted",triggerEncounterId:"HJ-11",point:{x:83.2,y:69.2},mobilePoint:{x:83.8,y:69.7},approachControl:{x:82,y:67},arrivalOffset:{x:-1,y:0},facing:"left",movementPreset:"stealth",ground:{width:23,rotation:7,opacity:.34},terrain:"Aśoka grove after Sītā entrusts her message"},

 {chapterId:"HC-05",stateId:"grove-battle",triggerEncounterId:"HJ-12",point:{x:84.3,y:74},mobilePoint:{x:84.9,y:74.5},approachControl:{x:84,y:72},arrivalOffset:{x:0,y:-1},facing:"left",movementPreset:"standard",ground:{width:24,rotation:6,opacity:.36},terrain:"Battle ground below Laṅkā’s city"},
 {chapterId:"HC-05",stateId:"ravana-court",triggerEncounterId:"HJ-13",point:{x:86,y:69.5},mobilePoint:{x:86.5,y:70},approachControl:{x:86,y:72},arrivalOffset:{x:0,y:1},facing:"left",movementPreset:"standard",ground:{width:23,rotation:-4,opacity:.34},terrain:"City ground outside Rāvaṇa’s court"},
 {chapterId:"HC-05",stateId:"lanka-warning",triggerEncounterId:"HJ-14",point:{x:87.2,y:75.5},mobilePoint:{x:87.6,y:76},approachControl:{x:88,y:72},arrivalOffset:{x:1,y:-1},facing:"left",movementPreset:"standard",ground:{width:23,rotation:7,opacity:.34},terrain:"Southern edge of the burning city"},

 {chapterId:"HC-06",stateId:"returned-to-rama",triggerEncounterId:"HJ-15",point:{x:60.5,y:67},mobilePoint:{x:61.2,y:67.6},approachControl:{x:73,y:51},arrivalOffset:{x:5,y:2},facing:"left",movementPreset:"return",ground:{width:24,rotation:3,opacity:.31},terrain:"Mainland campaign ground after the return crossing"},
 {chapterId:"HC-06",stateId:"setu-crossing",triggerEncounterId:"HFW-03",point:{x:68.2,y:74.2},mobilePoint:{x:68.8,y:74.7},approachControl:{x:64,y:76},arrivalOffset:{x:-2,y:0},facing:"right",movementPreset:"crossing",ground:{width:21,rotation:0,opacity:.2},terrain:"Later Yuddha Kāṇḍa route across the Setu"},
 {chapterId:"HC-06",stateId:"lanka-battlefield",triggerEncounterId:"HFW-05",point:{x:78.5,y:78.5},mobilePoint:{x:79.1,y:79},approachControl:{x:74,y:78},arrivalOffset:{x:-2,y:0},facing:"right",movementPreset:"standard",ground:{width:25,rotation:4,opacity:.38},terrain:"Battlefield ground on Laṅkā"},
 {chapterId:"HC-06",stateId:"night-of-crisis",triggerEncounterId:"HFW-06",point:{x:74.2,y:75.2},mobilePoint:{x:74.8,y:75.8},approachControl:{x:77,y:77},arrivalOffset:{x:1,y:1},facing:"left",movementPreset:"standard",ground:{width:24,rotation:-4,opacity:.37},terrain:"Night battlefield where the rescue becomes urgent"},

 {chapterId:"HC-07",stateId:"herb-mission-launch",triggerEncounterId:"HFH-01",point:{x:75.5,y:71.5},mobilePoint:{x:76.1,y:72},approachControl:{x:75,y:74},arrivalOffset:{x:0,y:1},facing:"left",movementPreset:"emergency-flight",ground:{width:21,rotation:-4,opacity:.25},terrain:"Laṅkā launch point for the northern rescue"},
 {chapterId:"HC-07",stateId:"medicinal-mountain",triggerEncounterId:"HFH-02",point:{x:68.2,y:18.4},mobilePoint:{x:68.8,y:19.1},approachControl:{x:91,y:44},arrivalOffset:{x:6,y:5},facing:"left",movementPreset:"emergency-flight",ground:{width:22,rotation:-6,opacity:.3},terrain:"Green foothill below the northern medicinal mountains"},
 {chapterId:"HC-07",stateId:"medicine-returned",triggerEncounterId:"HFH-03",point:{x:76.2,y:74.2},mobilePoint:{x:76.8,y:74.8},approachControl:{x:91,y:45},arrivalOffset:{x:5,y:-3},facing:"left",movementPreset:"return",ground:{width:24,rotation:3,opacity:.37},terrain:"Laṅkā battlefield after the medicine returns"},

 {chapterId:"HC-08",stateId:"victory-in-lanka",triggerEncounterId:"HFF-01",point:{x:79.4,y:71.5},mobilePoint:{x:80,y:72},approachControl:{x:78,y:73},arrivalOffset:{x:-1,y:1},facing:"right",movementPreset:"standard",ground:{width:24,rotation:3,opacity:.36},terrain:"Laṅkā after Rāvaṇa’s fall"},
 {chapterId:"HC-08",stateId:"news-for-sita",triggerEncounterId:"HFF-02",point:{x:82.5,y:66.8},mobilePoint:{x:83.1,y:67.3},approachControl:{x:81,y:69},arrivalOffset:{x:-1,y:1},facing:"left",movementPreset:"standard",ground:{width:23,rotation:5,opacity:.34},terrain:"Aśoka Vātikā as victory is announced"},
 {chapterId:"HC-08",stateId:"nandigrama-herald",triggerEncounterId:"HFF-03",point:{x:56.5,y:17.2},mobilePoint:{x:57.1,y:17.8},approachControl:{x:86,y:28},arrivalOffset:{x:6,y:2},facing:"left",movementPreset:"return",ground:{width:24,rotation:-2,opacity:.3},terrain:"Nandigrāma approach on the return north"},
 {chapterId:"HC-08",stateId:"ayodhya-service",triggerEncounterId:"HFF-04",point:{x:48,y:18.8},mobilePoint:{x:48.5,y:19.4},approachControl:{x:52,y:17},arrivalOffset:{x:2,y:0},facing:"left",movementPreset:"ceremonial-arrival",ground:{width:25,rotation:-3,opacity:.3},terrain:"Approach road below Ayodhyā"},
];

export const hanumanCampaignRoutes:CampaignRouteSegment[]=[
 {id:"route-meeting",chapterId:"HC-01",from:[51,12],to:[41,39],control:[46,24],routeType:"narrative",label:"The meeting and alliance"},
 {id:"route-search-entry",chapterId:"HC-01",from:[41,39],to:[45,54],control:[40,46],routeType:"land",label:"The journey turns south toward the search"},
 {id:"route-search",chapterId:"HC-02",from:[45,54],to:[57.5,69],control:[49,60],routeType:"land",label:"The southern search"},
 {id:"route-leap",chapterId:"HC-03",from:[57.5,69],to:[75.5,73],control:[66,53],routeType:"leap",label:"Hanumān’s Sundara Kāṇḍa leap"},
 {id:"route-lanka-search",chapterId:"HC-04",from:[75.5,73],to:[82,68],control:[78.5,65],routeType:"narrative",label:"The search continues into Laṅkā"},
 {id:"route-messenger",chapterId:"HC-05",from:[72,63],to:[75.5,73],control:[82,69],routeType:"narrative",label:"Messenger and warrior"},
 {id:"route-setu",chapterId:"HC-06",from:[57.5,69],to:[75.5,73],control:[66,76],routeType:"setu",label:"Later Yuddha Kāṇḍa Setu route"},
 {id:"route-herbs-out",chapterId:"HC-07",from:[75.5,73],to:[70,16],control:[92,42],routeType:"return",label:"Medicinal mountain journeys · narrative route"},
 {id:"route-fulfilled",chapterId:"HC-08",from:[75.5,73],to:[51,12],control:[90,28],routeType:"return",label:"Return toward Ayodhyā"},
];
