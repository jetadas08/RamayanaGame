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

const playableEvents:RamayanaEvent[]=journeyNodes.map(node=>{
 const characterIds=Array.from(new Set(node.characters.map(name=>characterIdByName[name]).filter((id):id is string=>Boolean(id))));
 return {
  id:node.id,title:node.title,canonicalOrder:node.number,kanda:kandaForNode(node.number),chapterId:chapterForNode(node.number),
  placeIds:[node.id],characterIds,primaryCharacterIds:["hanuman"],supportingCharacterIds:characterIds.filter(id=>id!=="hanuman"),
  relationshipIds:relationships.filter(item=>item.eventId===node.id).map(item=>item.id),
  sacredObjectIds:sacredObjects.filter(item=>item.discoveryNode===node.id).map(item=>item.id),
  sourceRefs:node.sourceLabels.filter((id):id is SourceId=>sourceIds.includes(id as SourceId)).map(id=>sourceRef(id,node.title)),
  activityIds:(node.activities??[]).map(item=>item.id),sceneArtwork:{locked:node.scene.imageLocked,revealed:node.scene.imageRevealed,assetStatus:node.scene.assetStatus},characterPaths:pathsFor(characterIds),narrativeContexts:pathsFor(characterIds).map(item=>item.pathId),
  unlocks:node.unlocks,completionTakeaway:node.completionTakeaway,contentStatus:"playable",sourceReviewRequired:false,playableNodeId:node.id,
 };
});

const pending="Planning placeholder only. Exact sequence, claims, activities, and scene content require approved-source review.";
const planned=(id:string,title:string,canonicalOrder:number,kanda:"kiskindha"|"yuddha",chapterId:string,characterIds:string[]):RamayanaEvent=>({
 id,title,canonicalOrder,kanda,chapterId,placeIds:[],characterIds,primaryCharacterIds:["hanuman"],supportingCharacterIds:characterIds.filter(item=>item!=="hanuman"),
 relationshipIds:[],sacredObjectIds:[],sourceRefs:[],activityIds:[],characterPaths:pathsFor(characterIds),narrativeContexts:pathsFor(characterIds).map(item=>item.pathId),
 unlocks:[],completionTakeaway:"",contentStatus:"sourceReviewRequired",sourceReviewRequired:true,planningNote:pending,
});

const plannedEvents:RamayanaEvent[]=[
 planned("HE-KK-01","Visitors observed near Kiṣkindhā",-5,"kiskindha","HC-01",["hanuman","rama","lakshmana","sugriva"]),
 planned("HE-KK-02","Hanumān approaches Rāma and Lakṣmaṇa",-4,"kiskindha","HC-01",["hanuman","rama","lakshmana"]),
 planned("HE-KK-03","The meeting of Hanumān and Rāma",-3,"kiskindha","HC-01",["hanuman","rama"]),
 planned("HE-KK-04","Rāma is brought to Sugrīva",-2,"kiskindha","HC-01",["hanuman","rama","lakshmana","sugriva"]),
 planned("HE-KK-05","The alliance at Kiṣkindhā",-1,"kiskindha","HC-01",["hanuman","rama","sugriva"]),
 planned("HE-KK-06","The southern search is commissioned",0.1,"kiskindha","HC-02",["hanuman","sugriva","angada","jambavan"]),
 planned("HE-KK-07","The search party journeys south",0.2,"kiskindha","HC-02",["hanuman","angada","jambavan","vanara-search-party"]),
 planned("HE-YK-01","The alliance prepares for war",16,"yuddha","HC-06",["hanuman","rama","lakshmana","sugriva"]),
 planned("HE-YK-02","The allied host reaches Laṅkā",17,"yuddha","HC-06",["hanuman","rama","lakshmana","sugriva","vibhishana"]),
 planned("HE-YK-03","Hanumān serves through the war",18,"yuddha","HC-06",["hanuman","rama","ravana"]),
 planned("HE-YK-04","Hanumān protects the mission’s allies",19,"yuddha","HC-06",["hanuman","rama","lakshmana"]),
 planned("HE-YK-05","A battlefield crisis calls for healing",20,"yuddha","HC-07",["hanuman","rama","lakshmana"]),
 planned("HE-YK-06","Hanumān journeys for medicinal herbs",21,"yuddha","HC-07",["hanuman","lakshmana"]),
 planned("HE-YK-07","The mountain is carried to the battlefield",22,"yuddha","HC-07",["hanuman","lakshmana"]),
 planned("HE-YK-08","The mission is restored",23,"yuddha","HC-07",["hanuman","rama","lakshmana"]),
 planned("HE-YK-09","Victory and its aftermath",24,"yuddha","HC-08",["hanuman","rama","sita","ravana"]),
 planned("HE-YK-10","News is carried after the victory",25,"yuddha","HC-08",["hanuman","rama","sita"]),
 planned("HE-YK-11","The return toward Ayodhyā",26,"yuddha","HC-08",["hanuman","rama","sita","lakshmana"]),
 planned("HE-YK-12","Service after the mission",27,"yuddha","HC-08",["hanuman","rama","sita","bharata"]),
];

export const ramayanaEvents:RamayanaEvent[]=[...playableEvents,...plannedEvents].sort((a,b)=>a.canonicalOrder-b.canonicalOrder);
export const ramayanaEventById=Object.fromEntries(ramayanaEvents.map(event=>[event.id,event])) as Record<string,RamayanaEvent>;

export const hanumanCampaignChapters:CampaignChapter[]=[
 {id:"HC-01",number:1,title:"The Meeting",kanda:"kiskindha",theme:"earth",status:"planned",description:"Hanumān’s first meeting with Rāma and the alliance around Sugrīva will open the campaign after source review.",eventIds:["HE-KK-01","HE-KK-02","HE-KK-03","HE-KK-04","HE-KK-05"],playableNodeIds:[],completionCopy:"Purpose recognizes purpose."},
 {id:"HC-02",number:2,title:"The Search",kanda:"kiskindha",theme:"earth",status:"mixed",description:"The search reaches the southern sea, where knowledge and remembered strength turn despair into a mission.",eventIds:["HE-KK-06","HE-KK-07","HJ-01","HJ-02","HJ-03"],playableNodeIds:["HJ-01","HJ-02","HJ-03"],completionCopy:"The way across the ocean is found."},
 {id:"HC-03",number:3,title:"Across the Ocean",kanda:"sundara",theme:"ocean",status:"available",description:"Hanumān crosses the sea through welcome, testing, danger, and the guarded threshold of Laṅkā.",eventIds:["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"],playableNodeIds:["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"],completionCopy:"The messenger enters Laṅkā."},
 {id:"HC-04",number:4,title:"Sītā in Laṅkā",kanda:"sundara",theme:"lanka",status:"available",description:"Within Laṅkā, the hidden search becomes recognition, trust, and the exchange of a faithful message.",eventIds:["HJ-09","HJ-10","HJ-11"],playableNodeIds:["HJ-09","HJ-10","HJ-11"],completionCopy:"Hope is made recognizable."},
 {id:"HC-05",number:5,title:"Messenger and Warrior",kanda:"sundara",theme:"lanka",status:"available",description:"Hanumān carries warning through conflict and returns with the knowledge Rāma has awaited.",eventIds:["HJ-12","HJ-13","HJ-14","HJ-15"],playableNodeIds:["HJ-12","HJ-13","HJ-14","HJ-15"],completionCopy:"The mission to Laṅkā is complete."},
 {id:"HC-06",number:6,title:"The War",kanda:"yuddha",theme:"lanka",status:"planned",description:"A future source-reviewed chapter will follow Hanumān’s service during the war in Laṅkā.",eventIds:["HE-YK-01","HE-YK-02","HE-YK-03","HE-YK-04"],playableNodeIds:[],completionCopy:"Courage remains in service."},
 {id:"HC-07",number:7,title:"The Mountain of Herbs",kanda:"yuddha",theme:"ocean",status:"planned",description:"A future source-reviewed chapter will develop the healing mission associated with the mountain of herbs.",eventIds:["HE-YK-05","HE-YK-06","HE-YK-07","HE-YK-08"],playableNodeIds:[],completionCopy:"Strength becomes healing service."},
 {id:"HC-08",number:8,title:"Mission Fulfilled",kanda:"yuddha",theme:"return",status:"planned",description:"The campaign’s final chapter will follow the return, victory, and Hanumān’s continuing service after source review.",eventIds:["HE-YK-09","HE-YK-10","HE-YK-11","HE-YK-12"],playableNodeIds:[],completionCopy:"The mission ends; devotion continues."},
];

export const hanumanCampaign:CharacterCampaign={id:"hanuman",characterId:"hanuman",title:"Follow Hanumān",subtitle:"A path of courage, wisdom, and service",description:"An eight-chapter campaign whose current playable center is the fifteen-encounter mission to Laṅkā.",chapterIds:hanumanCampaignChapters.map(item=>item.id),playableNodeIds:journeyNodes.map(item=>item.id),status:"active",completionTitle:"Mission Fulfilled",completionCopy:"The mission ends; devotion continues.",futurePathIds:["rama","sita","bharata","ravana"]};

export const hanumanOriginsKnowledge={id:"hanuman-origins",title:"Origins and remembered strength",delivery:"retrospective-character-knowledge" as const,unlockEventId:"HJ-03",contentStatus:"sourceReviewRequired" as const,sourceReviewRequired:true,categories:["family","childhood","powers","remembrance"],planningNote:"Origin and childhood traditions must be presented retrospectively and added only after each claim is reviewed against an approved source."};
export const laterTraditionsExpansion={id:"hanuman-later-traditions",status:"planned" as const,separateFromCoreCampaign:true,sourceReviewRequired:true,excludedFromCurrentCampaign:["later devotional biographies","regional childhood cycles","post-epic miracle traditions"],planningNote:"Later traditions belong in a separately labeled expansion and must not be silently merged into the core campaign."};
export const futureCharacterCampaigns=["rama","sita","bharata","ravana"].map(characterId=>({characterId,status:"planned" as const,reusesEventModel:true}));

export const hanumanCampaignLandmarks:CampaignMapLandmark[]=[
 {id:"ayodhya",name:"Ayodhyā",x:51,y:12,kind:"city",confidence:"B",description:"A traditional campaign landmark in the northern plains; the campaign uses it as a broad narrative anchor."},
 {id:"himalaya",name:"Himalaya",x:72,y:9,kind:"mountain",confidence:"E",description:"A broad northern mountain region reserved for the future medicinal-herb chapter; no single peak is asserted."},
 {id:"kishkindha",name:"Kiṣkindhā",x:43,y:47,kind:"region",confidence:"D",description:"Shown as a traditional southern interior region. Proposed modern identifications remain debated."},
 {id:"south-india",name:"Southern India",x:46,y:61,kind:"region",confidence:"E",description:"A broad narrative region for the southern search, rather than a precise archaeological point."},
 {id:"rameswaram",name:"Rāmeśvaram",x:54,y:71,kind:"coast",confidence:"B",description:"A major traditional landmark between southern India, the Setu context, and Laṅkā."},
 {id:"palk-strait",name:"Palk Strait",x:66,y:66,kind:"strait",confidence:"A",description:"A modern geographic orientation label used without assigning every epic event to a precise coordinate."},
 {id:"lanka",name:"Laṅkā",x:82,y:73,kind:"island",confidence:"B",description:"Sri Lanka is shown as the broad traditional macro-identification; individual epic sites remain narrative or debated."},
];

export const hanumanCampaignChapterPositions:Record<string,{x:number;y:number;label:string}>={
 "HC-01":{x:41,y:43,label:"I"},"HC-02":{x:45,y:52,label:"II"},"HC-03":{x:59,y:56,label:"III"},"HC-04":{x:75,y:55,label:"IV"},
 "HC-05":{x:85,y:63,label:"V"},"HC-06":{x:70,y:78,label:"VI"},"HC-07":{x:70,y:16,label:"VII"},"HC-08":{x:52,y:16,label:"VIII"},
};

export const hanumanCampaignRoutes:CampaignRouteSegment[]=[
 {id:"route-meeting",chapterId:"HC-01",from:[51,12],to:[41,43],control:[46,24],routeType:"narrative",label:"The meeting and alliance"},
 {id:"route-search",chapterId:"HC-02",from:[41,43],to:[57.5,69],control:[45,60],routeType:"land",label:"The southern search"},
 {id:"route-leap",chapterId:"HC-03",from:[57.5,69],to:[75.5,73],control:[66,53],routeType:"leap",label:"Hanumān’s Sundara Kāṇḍa leap"},
 {id:"route-lanka-search",chapterId:"HC-04",from:[75.5,73],to:[72,63],control:[80,64],routeType:"narrative",label:"The search within Laṅkā"},
 {id:"route-messenger",chapterId:"HC-05",from:[72,63],to:[75.5,73],control:[82,69],routeType:"narrative",label:"Messenger and warrior"},
 {id:"route-setu",chapterId:"HC-06",from:[57.5,69],to:[75.5,73],control:[66,76],routeType:"setu",label:"Later Yuddha Kāṇḍa Setu route"},
 {id:"route-herbs-out",chapterId:"HC-07",from:[75.5,73],to:[70,16],control:[92,42],routeType:"return",label:"Future mountain-of-herbs journey"},
 {id:"route-fulfilled",chapterId:"HC-08",from:[75.5,73],to:[51,12],control:[90,28],routeType:"return",label:"Future return toward Ayodhyā"},
];
