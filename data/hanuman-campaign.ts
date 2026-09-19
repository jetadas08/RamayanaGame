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

const sourceIds:SourceId[]=["VR-GP","VR-HPS","RCM-GP","TRAD"];
const sourceRef=(source:SourceId,title:string):SourceReference=>({source,claimType:"textualFact",summary:`Approved source attached to the existing playable event “${title}”.`,verification:"planningReference"});
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
  sourceRefs:node.sourceLabels.filter((id):id is SourceId=>sourceIds.includes(id as SourceId)).map(id=>node.id.startsWith("HFF-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Yuddha Kāṇḍa ${finaleSourceRanges[node.number-1]}`,verification:"pendingEditionAudit" as const}:node.id.startsWith("HFH-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Yuddha Kāṇḍa ${herbsSourceRanges[node.number-1]}; exact verses pending Gita Press edition review`,verification:"pendingEditionAudit" as const}:node.id.startsWith("HFW-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Yuddha Kāṇḍa ${warSourceRanges[node.number-1]}; exact verses pending Gita Press edition review`,verification:"pendingEditionAudit" as const}:node.id.startsWith("HFM-")?{source:id,claimType:"textualFact" as const,summary:node.whyHere.textual,locator:`Kiṣkindhā Kāṇḍa ${meetingSourceRanges[node.number-1]}; exact verses pending Gita Press edition review`,verification:"pendingEditionAudit" as const}:sourceRef(id,node.title)),
  activityIds:(node.activities??[]).map(item=>item.id),sceneArtwork:{locked:node.scene.imageLocked,revealed:node.scene.imageRevealed,assetStatus:node.scene.assetStatus},characterPaths:pathsFor(characterIds).map(path=>node.id==="HFF-01"?{...path,perspective:path.pathId==="rama"?"primary" as const:"secondary" as const}:path),narrativeContexts:pathsFor(characterIds).map(item=>item.pathId),
  unlocks:node.unlocks,completionTakeaway:node.completionTakeaway,contentStatus:"playable",sourceReviewRequired:false,playableNodeId:node.id,
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
 {id:"HC-04",number:4,title:"Sītā in Laṅkā",kanda:"sundara",theme:"lanka",status:"available",description:"Within Laṅkā, the hidden search becomes recognition, trust, and the exchange of a faithful message.",eventIds:["HJ-09","HJ-10","HJ-11"],playableNodeIds:["HJ-09","HJ-10","HJ-11"],completionCopy:"Hope is made recognizable."},
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
 {id:"rameswaram",name:"Rāmeśvaram",x:54,y:71,kind:"coast",confidence:"B",description:"A major traditional landmark between southern India, the Setu context, and Laṅkā."},
 {id:"palk-strait",name:"Palk Strait",x:66,y:66,kind:"strait",confidence:"A",description:"A modern geographic orientation label used without assigning every epic event to a precise coordinate."},
 {id:"lanka",name:"Laṅkā",x:82,y:73,kind:"island",confidence:"B",description:"Sri Lanka is shown as the broad traditional macro-identification; individual epic sites remain narrative or debated."},
];

export const hanumanCampaignChapterPositions:Record<string,{x:number;y:number;label:string}>={
 "HC-01":{x:41,y:39,label:"I"},"HC-02":{x:45,y:54,label:"II"},"HC-03":{x:59,y:51,label:"III"},"HC-04":{x:75,y:55,label:"IV"},
 "HC-05":{x:85,y:63,label:"V"},"HC-06":{x:70,y:78,label:"VI"},"HC-07":{x:70,y:20,label:"VII"},"HC-08":{x:52,y:21,label:"VIII"},
};

export const hanumanCampaignRoutes:CampaignRouteSegment[]=[
 {id:"route-meeting",chapterId:"HC-01",from:[51,12],to:[41,43],control:[46,24],routeType:"narrative",label:"The meeting and alliance"},
 {id:"route-search",chapterId:"HC-02",from:[41,43],to:[57.5,69],control:[45,60],routeType:"land",label:"The southern search"},
 {id:"route-leap",chapterId:"HC-03",from:[57.5,69],to:[75.5,73],control:[66,53],routeType:"leap",label:"Hanumān’s Sundara Kāṇḍa leap"},
 {id:"route-lanka-search",chapterId:"HC-04",from:[75.5,73],to:[72,63],control:[80,64],routeType:"narrative",label:"The search within Laṅkā"},
 {id:"route-messenger",chapterId:"HC-05",from:[72,63],to:[75.5,73],control:[82,69],routeType:"narrative",label:"Messenger and warrior"},
 {id:"route-setu",chapterId:"HC-06",from:[57.5,69],to:[75.5,73],control:[66,76],routeType:"setu",label:"Later Yuddha Kāṇḍa Setu route"},
 {id:"route-herbs-out",chapterId:"HC-07",from:[75.5,73],to:[70,16],control:[92,42],routeType:"return",label:"Medicinal mountain journeys · narrative route"},
 {id:"route-fulfilled",chapterId:"HC-08",from:[75.5,73],to:[51,12],control:[90,28],routeType:"return",label:"Return toward Ayodhyā"},
];
