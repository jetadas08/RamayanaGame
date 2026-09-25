import {hanumanCampaignChapters,hanumanCampaignCompanionStoryStates,type CampaignStoryAnchor} from "@/data/hanuman-campaign";

export type CompanionId="hanuman"|"rama"|"sita"|"lakshmana"|"bharata"|"ravana";
export type CompanionMotionPreset="standard"|"leap"|"crossing"|"stealth"|"emergency-flight"|"return"|"ceremonial-arrival";
export type CompanionVisualState="resting"|"departing"|"moving"|"arriving"|"chapter-complete"|"campaign-complete";
export type CompanionPose="idle"|"moving"|"arriving";
export type CompanionFacing="left"|"right";
export interface CompanionPoint{x:number;y:number}

export interface CompanionVisualDefinition{
 id:CompanionId;
 accessibleName:string;
 poses:Partial<Record<CompanionPose,string>> & {idle:string};
}

export interface CompanionRouteDefinition{
 campaignId:string;
 chapterId:string;
 companionId:CompanionId;
 nodeIds:string[];
 movementPreset:CompanionMotionPreset;
}

export interface CompanionProgressionEvent{
 kind:"progression";
 id:string;
 campaignId:string;
 chapterId:string;
 companionId:CompanionId;
 nodeId:string;
 nextNodeId?:string;
 movementPreset:CompanionMotionPreset;
}

export interface CompanionSnapshot{
 currentNodeId:string;
 previousNodeId?:string;
 visualState:CompanionVisualState;
 chapterComplete:boolean;
 campaignComplete:boolean;
}

export const companionVisuals:Partial<Record<CompanionId,CompanionVisualDefinition>>={
 hanuman:{
  id:"hanuman",
  accessibleName:"Hanumān",
  poses:{
   idle:"/images/companions/hanuman-map-idle-v3.png",
   moving:"/images/companions/hanuman-map-travel-v3.png",
   arriving:"/images/companions/hanuman-map-arrive-v3.png",
  },
 },
};

const chapterPreset:Record<string,CompanionMotionPreset>={
 "HC-03":"crossing","HC-04":"stealth","HC-07":"emergency-flight","HC-08":"ceremonial-arrival",
};

export const hanumanCompanionRoutes:CompanionRouteDefinition[]=hanumanCampaignChapters
 .filter(chapter=>chapter.playableNodeIds.length>0)
 .map(chapter=>({campaignId:"hanuman",chapterId:chapter.id,companionId:"hanuman",nodeIds:[...chapter.playableNodeIds],movementPreset:chapterPreset[chapter.id]??"standard"}));

export function companionRouteForNode(nodeId:string){return hanumanCompanionRoutes.find(route=>route.nodeIds.includes(nodeId));}

export function resolveCompanionSnapshot(route:CompanionRouteDefinition,completedNodeIds:string[],campaignComplete=false):CompanionSnapshot{
 const completed=new Set(completedNodeIds);
 const firstIncomplete=route.nodeIds.findIndex(id=>!completed.has(id));
 const chapterComplete=firstIncomplete===-1;
 const currentIndex=chapterComplete?route.nodeIds.length-1:Math.max(0,firstIncomplete);
 const currentNodeId=route.nodeIds[currentIndex];
 const previousNodeId=currentIndex>0?route.nodeIds[currentIndex-1]:undefined;
 return{currentNodeId,previousNodeId,chapterComplete,campaignComplete,visualState:campaignComplete?"campaign-complete":chapterComplete?"chapter-complete":"resting"};
}

export function progressionEventForNode(nodeId:string):Omit<CompanionProgressionEvent,"id">|undefined{
 const route=companionRouteForNode(nodeId);if(!route)return;
 const index=route.nodeIds.indexOf(nodeId),nextNodeId=route.nodeIds[index+1];
 const movementPreset=nodeId==="HJ-14"?"return":route.movementPreset;
 return{kind:"progression",campaignId:route.campaignId,chapterId:route.chapterId,companionId:route.companionId,nodeId,nextNodeId,movementPreset};
}

export function shouldAnimateCompanion(event:CompanionProgressionEvent|undefined,route:CompanionRouteDefinition,snapshot:CompanionSnapshot){
 return Boolean(event&&event.campaignId===route.campaignId&&event.chapterId===route.chapterId&&event.companionId===route.companionId&&event.nextNodeId===snapshot.currentNodeId&&route.nodeIds.includes(event.nodeId));
}

export function resolveCampaignCompanionState(completedNodeIds:string[]):CampaignStoryAnchor{
 const completed=new Set(completedNodeIds);
 return hanumanCampaignCompanionStoryStates.reduce((current,state)=>!state.triggerEncounterId||completed.has(state.triggerEncounterId)?state:current,hanumanCampaignCompanionStoryStates[0]);
}

export function previousCampaignCompanionState(state:CampaignStoryAnchor){
 const index=hanumanCampaignCompanionStoryStates.findIndex(item=>item.stateId===state.stateId);
 return index>0?hanumanCampaignCompanionStoryStates[index-1]:undefined;
}

export function nextCampaignCompanionState(state:CampaignStoryAnchor){
 const index=hanumanCampaignCompanionStoryStates.findIndex(item=>item.stateId===state.stateId);
 return hanumanCampaignCompanionStoryStates[index+1];
}

export function shouldAnimateCampaignCompanion(event:CompanionProgressionEvent|undefined,currentState:CampaignStoryAnchor){
 return Boolean(event&&currentState.triggerEncounterId===event.nodeId);
}

export function resolveRouteCompanionPlacement(current:CompanionPoint,previous?:CompanionPoint,next?:CompanionPoint,offset=.5){
 const direction=next?{x:next.x-current.x,y:next.y-current.y}:previous?{x:current.x-previous.x,y:current.y-previous.y}:{x:1,y:0};
 return{point:{x:current.x+direction.x*offset,y:current.y+direction.y*offset},facing:(direction.x<0?"left":"right") as CompanionFacing};
}
