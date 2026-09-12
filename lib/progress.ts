import type { Difficulty, JourneyProgressState, JourneyNode } from "@/lib/types";
import { initialProgress, journeyNodes } from "@/data/journey";
import { achievements, relationships } from "@/data/discoveries";
import { challengeFor, challengeKey, encodeChallengeAnswer, storedAnswerIsAnswered, storedAnswerIsCorrect } from "@/data/challenges";
import {relationshipAchievementNames,relationshipChallengeById} from "@/data/relationship-challenges";
import {activityById,activityUnlocks,discoveryKey,explorationAchievementNames,sacredObjects,validDiscoveryIds} from "@/data/encounter-activities";
const levels:Difficulty[]=["explorer","seeker","scholar"];
export function nodeMastery(progress:Pick<JourneyProgressState,"answeredChallenges">,node:JourneyNode){
 return levels.map(level=>storedAnswerIsCorrect(node,level,progress.answeredChallenges[challengeKey(node.id,level)]));
}
export function correctAnswerCount(progress:Pick<JourneyProgressState,"answeredChallenges">){
 return journeyNodes.reduce((total,node)=>total+nodeMastery(progress,node).filter(Boolean).length,0);
}
export function normalizeProgress(input: unknown): JourneyProgressState {
 const raw=(input && typeof input==="object"?input:{}) as Partial<JourneyProgressState>;
 const answers:Record<string,string>={};
 const supplied=raw.answeredChallenges && typeof raw.answeredChallenges==="object" ? raw.answeredChallenges : {};
 const relationshipAnswers:Record<string,string>={};
 if(raw.relationshipChallengeAnswers&&typeof raw.relationshipChallengeAnswers==="object") for(const [id,value] of Object.entries(raw.relationshipChallengeAnswers)) if(typeof value==="string"&&relationshipChallengeById(id)?.options.some(option=>option.id===value)) relationshipAnswers[id]=value;
 const sceneDiscoveries=Array.isArray(raw.sceneDiscoveries)?Array.from(new Set(raw.sceneDiscoveries.filter((id):id is string=>typeof id==="string"&&validDiscoveryIds.has(id)))):[];
 const hiddenDiscoveries=Array.isArray(raw.hiddenDiscoveries)?Array.from(new Set(raw.hiddenDiscoveries.filter((id):id is string=>typeof id==="string"&&sceneDiscoveries.includes(id)))):[];
 const discoveredObjects=Array.isArray(raw.discoveredObjects)?Array.from(new Set(raw.discoveredObjects.filter((id):id is string=>typeof id==="string"&&sacredObjects.some(object=>object.id===id)))):[];
 const predictionChoices:Record<string,string>={};if(raw.predictionChoices&&typeof raw.predictionChoices==="object")for(const [id,value] of Object.entries(raw.predictionChoices)){const activity=activityById(id);if(activity?.type==="predictionChoice"&&typeof value==="string"&&activity.choices.some(choice=>choice.id===value))predictionChoices[id]=value;}
 const storyMemoryAnswers:Record<string,string>={};if(raw.storyMemoryAnswers&&typeof raw.storyMemoryAnswers==="object")for(const [id,value] of Object.entries(raw.storyMemoryAnswers)){const activity=activityById(id);if(activity?.type==="storyMemory"&&typeof value==="string")storyMemoryAnswers[id]=value;}
 const nodeAttempts:Record<string,number>={};if(raw.nodeAttempts&&typeof raw.nodeAttempts==="object")for(const [id,value] of Object.entries(raw.nodeAttempts))if(journeyNodes.some(node=>node.id===id)&&typeof value==="number"&&value>=0)nodeAttempts[id]=Math.floor(value);
 let count=0;
 for(const node of journeyNodes){
  const wasCompleted=Array.isArray(raw.completedNodes)&&raw.completedNodes.includes(node.id);
  if(node.number>count+1)break;
  for(const level of levels){
   const key=challengeKey(node.id,level);
   const value=supplied[key] ?? (level==="explorer"?supplied[node.id]:undefined);
   if(storedAnswerIsAnswered(node,level,value)) answers[key]=value!.includes("|")?value!:encodeChallengeAnswer(challengeFor(node,level),value!);
  }
  const recapAnswered=levels.every(level=>answers[challengeKey(node.id,level)]);
  if(wasCompleted||recapAnswered)count++; else break;
 }
 const completed=journeyNodes.slice(0,count);
 const progressForMastery={answeredChallenges:answers};
 const activityRewards=activityUnlocks(sceneDiscoveries);
 return {currentNode:journeyNodes[Math.min(count,14)].id,completedNodes:completed.map(n=>n.id),
 unlockedCharacters:Array.from(new Set([...initialProgress.unlockedCharacters,...completed.flatMap(n=>n.characters),...activityRewards.characters])),
 unlockedRelationships:Array.from(new Set([...relationships.filter(r=>r.unlockAt<=count).map(r=>r.id),...activityRewards.relationships])),
 answeredChallenges:answers,relationshipChallengeAnswers:relationshipAnswers,sceneDiscoveries,hiddenDiscoveries,discoveredObjects,predictionChoices,storyMemoryAnswers,nodeAttempts,achievements:Array.from(new Set([...achievements.filter(a=>a.node<=count&&(!a.perfectNode||nodeMastery(progressForMastery,journeyNodes[a.perfectNode-1]).every(Boolean))&&(!a.totalStars||correctAnswerCount(progressForMastery)>=a.totalStars)).map(a=>a.name),...relationshipAchievementNames(relationshipAnswers),...explorationAchievementNames(sceneDiscoveries,discoveredObjects)])),
 difficulty:levels.includes(raw.difficulty as Difficulty)?raw.difficulty!:"explorer"};
}
export function discoverSceneItem(current:JourneyProgressState,activityId:string,hotspotId?:string){const safe=normalizeProgress(current),activity=activityById(activityId),key=discoveryKey(activityId,hotspotId);if(!activity||!validDiscoveryIds.has(key))return safe;const hidden=Boolean(activity.hidden);return normalizeProgress({...safe,sceneDiscoveries:[...safe.sceneDiscoveries,key],hiddenDiscoveries:hidden?[...safe.hiddenDiscoveries,key]:safe.hiddenDiscoveries});}
export function choosePrediction(current:JourneyProgressState,activityId:string,choiceId:string){const safe=normalizeProgress(current),activity=activityById(activityId);if(activity?.type!=="predictionChoice"||!activity.choices.some(choice=>choice.id===choiceId))return safe;return normalizeProgress({...safe,predictionChoices:{...safe.predictionChoices,[activityId]:choiceId}});}
export function discoverObject(current:JourneyProgressState,objectId:string){const safe=normalizeProgress(current);if(!sacredObjects.some(object=>object.id===objectId))return safe;return normalizeProgress({...safe,discoveredObjects:[...safe.discoveredObjects,objectId]});}
export function recordStoryMemory(current:JourneyProgressState,activityId:string,orderedIds:string[]){const safe=normalizeProgress(current),activity=activityById(activityId);if(activity?.type!=="storyMemory"||orderedIds.some(id=>!activity.items.some(item=>item.id===id)))return safe;return normalizeProgress({...safe,storyMemoryAnswers:{...safe.storyMemoryAnswers,[activityId]:orderedIds.join(",")}});}
export function answerRelationshipChallenge(current:JourneyProgressState,challengeId:string,answer:string){
 const safe=normalizeProgress(current),challenge=relationshipChallengeById(challengeId);
 if(!challenge||!challenge.options.some(option=>option.id===answer)||!challenge.relationshipIds.every(id=>safe.unlockedRelationships.includes(id)))return safe;
 return normalizeProgress({...safe,relationshipChallengeAnswers:{...safe.relationshipChallengeAnswers,[challengeId]:answer}});
}
export function completeChallenge(current:JourneyProgressState,node:JourneyNode,level:Difficulty,challengeId:string,answer:string):JourneyProgressState {
 const safe=normalizeProgress(current);
 const challenge=[0,1,2].map(index=>challengeFor(node,level,index)).find(item=>item.id===challengeId);
 const levelIndex=levels.indexOf(level);
 const key=challengeKey(node.id,level);
 const earlierAnswered=levels.slice(0,levelIndex).every(previous=>safe.answeredChallenges[challengeKey(node.id,previous)]);
 if(node.number>safe.completedNodes.length+1 || !earlierAnswered || safe.answeredChallenges[key] || !challenge || !challenge.choices.some(choice=>choice.id===answer)) return safe;
 const answeredChallenges={...safe.answeredChallenges,[key]:encodeChallengeAnswer(challenge,answer)};
 const completedNodes=level==="scholar"?Array.from(new Set([...safe.completedNodes,node.id])):safe.completedNodes;
 const nodeAttempts=level==="explorer"?{...safe.nodeAttempts,[node.id]:(safe.nodeAttempts[node.id]??0)+1}:safe.nodeAttempts;
 return normalizeProgress({...safe,completedNodes,answeredChallenges,nodeAttempts});
}
export function mergeProgress(a:unknown,b:unknown){
 const left=normalizeProgress(a),right=normalizeProgress(b);
 return normalizeProgress({...right,completedNodes:Array.from(new Set([...left.completedNodes,...right.completedNodes])),answeredChallenges:{...left.answeredChallenges,...right.answeredChallenges},relationshipChallengeAnswers:{...left.relationshipChallengeAnswers,...right.relationshipChallengeAnswers},sceneDiscoveries:Array.from(new Set([...left.sceneDiscoveries,...right.sceneDiscoveries])),hiddenDiscoveries:Array.from(new Set([...left.hiddenDiscoveries,...right.hiddenDiscoveries])),discoveredObjects:Array.from(new Set([...left.discoveredObjects,...right.discoveredObjects])),predictionChoices:{...left.predictionChoices,...right.predictionChoices},storyMemoryAnswers:{...left.storyMemoryAnswers,...right.storyMemoryAnswers},nodeAttempts:Object.fromEntries(journeyNodes.map(node=>[node.id,Math.max(left.nodeAttempts[node.id]??0,right.nodeAttempts[node.id]??0)]))});
}
