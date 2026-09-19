import {finaleMemoryNames,finaleNodes} from "@/data/finale";
import {herbsNodes} from "@/data/herbs";
import {warNodes} from "@/data/war";
import {meetingMemoryNames,meetingNodes} from "@/data/meeting";
import {searchMemoryNames,searchNodes} from "@/data/search";
import {crossingMemoryNames,crossingNodeIds} from "@/data/crossing";
import type { CharacterJourneyProgress, Difficulty, JourneyProgressState, JourneyNode, SourceId } from "@/lib/types";
import { initialProgress, journeyNodes } from "@/data/journey";
import {legacyNodeSceneIsRevealed} from "@/data/node-scenes";
import { achievements, relationships } from "@/data/discoveries";
import { challengeFor, challengeKey, encodeChallengeAnswer } from "@/data/challenges";
import {encodeMasteryResponse,masteryActivityFor,masteryResponseIsCorrect,storedMasteryIsAnswered,storedMasteryIsCorrect} from "@/data/mastery-activities";
import {relationshipAchievementNames,relationshipChallengeById} from "@/data/relationship-challenges";
import {availableRelationshipIds} from "@/data/relationships";
import {activityById,activityUnlocks,discoveryKey,explorationAchievementNames,sacredObjects,validDiscoveryIds} from "@/data/encounter-activities";
import {characterChallengeById,characterChallenges,characterKnowledgeAchievementNames} from "@/data/character-knowledge";
import {characterIdByName,characterNameById} from "@/data/character-ids";
import {hanumanCampaignChapters,ramayanaEventById} from "@/data/hanuman-campaign";
const levels:Difficulty[]=["explorer","seeker","scholar"];
const allNodes=[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes];
export function nodeMastery(progress:Pick<JourneyProgressState,"answeredChallenges">,node:JourneyNode){
 return levels.map(level=>storedMasteryIsCorrect(node,level,progress.answeredChallenges[challengeKey(node.id,level)]));
}
export function correctAnswerCount(progress:Pick<JourneyProgressState,"answeredChallenges">){
 return allNodes.reduce((total,node)=>total+nodeMastery(progress,node).filter(Boolean).length,0);
}
export function normalizeProgress(input: unknown): JourneyProgressState {
 const raw=(input && typeof input==="object"?input:{}) as Partial<JourneyProgressState>;
 const answers:Record<string,string>={};
 const supplied=raw.answeredChallenges && typeof raw.answeredChallenges==="object" ? raw.answeredChallenges : {};
 const relationshipAnswers:Record<string,string>={};
 if(raw.relationshipChallengeAnswers&&typeof raw.relationshipChallengeAnswers==="object") for(const [id,value] of Object.entries(raw.relationshipChallengeAnswers)) if(typeof value==="string"&&relationshipChallengeById(id)?.options.some(option=>option.id===value)) relationshipAnswers[id]=value;
 const characterAnswers:Record<string,string>={};
 if(raw.characterChallengeAnswers&&typeof raw.characterChallengeAnswers==="object")for(const [id,value] of Object.entries(raw.characterChallengeAnswers)){const challenge=characterChallengeById(id);if(challenge&&typeof value==="string"&&challenge.options.some(option=>option.id===value))characterAnswers[id]=value;}
 const sceneDiscoveries=Array.isArray(raw.sceneDiscoveries)?Array.from(new Set(raw.sceneDiscoveries.filter((id):id is string=>typeof id==="string"&&validDiscoveryIds.has(id)))):[];
 const hiddenDiscoveries=Array.isArray(raw.hiddenDiscoveries)?Array.from(new Set(raw.hiddenDiscoveries.filter((id):id is string=>typeof id==="string"&&sceneDiscoveries.includes(id)))):[];
 const discoveredObjects=Array.isArray(raw.discoveredObjects)?Array.from(new Set(raw.discoveredObjects.filter((id):id is string=>typeof id==="string"&&sacredObjects.some(object=>object.id===id)))):[];
 const predictionChoices:Record<string,string>={};if(raw.predictionChoices&&typeof raw.predictionChoices==="object")for(const [id,value] of Object.entries(raw.predictionChoices)){const activity=activityById(id);if(activity?.type==="predictionChoice"&&typeof value==="string"&&activity.choices.some(choice=>choice.id===value))predictionChoices[id]=value;}
 const storyMemoryAnswers:Record<string,string>={};if(raw.storyMemoryAnswers&&typeof raw.storyMemoryAnswers==="object")for(const [id,value] of Object.entries(raw.storyMemoryAnswers)){const activity=activityById(id);if((activity?.type==="storyMemory"||activity?.type==="connectionBuilder"||activity?.type==="evidenceSort")&&typeof value==="string"&&(activity.type!=="connectionBuilder"||value===activity.correct.join(","))&&(activity.type!=="evidenceSort"||(value.split(",").length===activity.statements.length&&value.split(",").every(id=>activity.categories.some(category=>category.id===id)))))storyMemoryAnswers[id]=value;}
 const searchBoardAnswers:Record<string,string>={};if(raw.searchBoardAnswers&&typeof raw.searchBoardAnswers==="object")for(const [id,value] of Object.entries(raw.searchBoardAnswers))if(["HFS-01","HFS-02","HJ-01","HJ-02","HJ-03"].includes(id)&&typeof value==="string")searchBoardAnswers[id]=value;
 const crossingTrailAnswers:Record<string,string>={};if(raw.crossingTrailAnswers&&typeof raw.crossingTrailAnswers==="object")for(const [id,value] of Object.entries(raw.crossingTrailAnswers))if(crossingNodeIds.includes(id as typeof crossingNodeIds[number])&&typeof value==="string")crossingTrailAnswers[id]=value;
 const nodeAttempts:Record<string,number>={};if(raw.nodeAttempts&&typeof raw.nodeAttempts==="object")for(const [id,value] of Object.entries(raw.nodeAttempts))if(allNodes.some(node=>node.id===id)&&typeof value==="number"&&value>=0)nodeAttempts[id]=Math.floor(value);
 let count=0;
 for(const node of journeyNodes){
  const wasCompleted=Array.isArray(raw.completedNodes)&&raw.completedNodes.includes(node.id);
  if(node.number>count+1)break;
  for(const level of levels){
   const key=challengeKey(node.id,level);
   const value=supplied[key] ?? (level==="explorer"?supplied[node.id]:undefined);
   if(storedMasteryIsAnswered(node,level,value)) answers[key]=value!.includes("|")?value!:encodeChallengeAnswer(challengeFor(node,level),value!);
  }
  const recapAnswered=levels.every(level=>answers[challengeKey(node.id,level)]);
  if(wasCompleted||recapAnswered)count++; else break;
 }
 const meetingCompletedNodes:string[]=[];
 for(const node of meetingNodes){
  if(node.number>meetingCompletedNodes.length+1)break;
  for(const level of levels){const key=challengeKey(node.id,level),value=supplied[key];if(storedMasteryIsAnswered(node,level,value))answers[key]=value;}
  if(raw.meetingCompletedNodes?.includes(node.id)||levels.every(level=>answers[challengeKey(node.id,level)]))meetingCompletedNodes.push(node.id);else break;
 }
 const searchCompletedNodes:string[]=[];
 if(meetingCompletedNodes.length===meetingNodes.length)for(const node of searchNodes){
  for(const level of levels){const key=challengeKey(node.id,level),value=supplied[key];if(storedMasteryIsAnswered(node,level,value))answers[key]=value;}
  if(raw.searchCompletedNodes?.includes(node.id)||levels.every(level=>answers[challengeKey(node.id,level)]))searchCompletedNodes.push(node.id);else break;
 }
 const warCompletedNodes:string[]=[];
 if(count===journeyNodes.length)for(const node of warNodes){
  for(const level of levels){const key=challengeKey(node.id,level),value=supplied[key];if(storedMasteryIsAnswered(node,level,value))answers[key]=value;}
  if(raw.warCompletedNodes?.includes(node.id)||levels.every(level=>answers[challengeKey(node.id,level)]))warCompletedNodes.push(node.id);else break;
 }
 const herbsCompletedNodes:string[]=[];
 if(warCompletedNodes.length===warNodes.length)for(const node of herbsNodes){
  for(const level of levels){const key=challengeKey(node.id,level),value=supplied[key];if(storedMasteryIsAnswered(node,level,value))answers[key]=value;}
  if(raw.herbsCompletedNodes?.includes(node.id)||levels.every(level=>answers[challengeKey(node.id,level)]))herbsCompletedNodes.push(node.id);else break;
 }
 const finaleCompletedNodes:string[]=[];
 if(herbsCompletedNodes.length===herbsNodes.length)for(const node of finaleNodes){
  for(const level of levels){const key=challengeKey(node.id,level),value=supplied[key];if(storedMasteryIsAnswered(node,level,value))answers[key]=value;}
  if(raw.finaleCompletedNodes?.includes(node.id)||levels.every(level=>answers[challengeKey(node.id,level)]))finaleCompletedNodes.push(node.id);else break;
 }
 const legacySearchAccess=raw.legacySearchAccess??Boolean(raw.currentNode?.startsWith('HJ-')||raw.completedNodes?.length||Object.keys(supplied).some(id=>id.startsWith('HJ-')));
 const completed=journeyNodes.slice(0,count);
 const progressForMastery={answeredChallenges:answers};
 const activityRewards=activityUnlocks(sceneDiscoveries);
 const availableRelationships=new Set(availableRelationshipIds(count,meetingCompletedNodes.length,warCompletedNodes.length,herbsCompletedNodes.length,finaleCompletedNodes.length));
 const finaleRelationships=[...(finaleCompletedNodes.includes("HFF-02")?["REL-HANUMAN-SITA-MESSENGER","REL-HANUMAN-RAMA-SERVICE"]:[]),...(finaleCompletedNodes.includes("HFF-03")?["REL-BHARATA-RAMA-FAMILY"]:[]),...(finaleCompletedNodes.includes("HFF-04")?["REL-BHARATA-RAMA-DEVOTION","REL-RAMA-SITA-MARRIAGE","REL-HANUMAN-RAMA-DEVOTION"]:[])];
 const suppliedRelationships=Array.isArray(raw.unlockedRelationships)?raw.unlockedRelationships.filter((id):id is string=>typeof id==="string"&&relationships.some(relationship=>relationship.id===id)):[];
 const relationshipChallengeRewards=Object.entries(relationshipAnswers).filter(([id,answer])=>relationshipChallengeById(id)?.answer===answer).flatMap(([id])=>relationshipChallengeById(id)?.relationshipIds??[]);
 const characterRelationshipRewards=characterChallenges.filter(challenge=>characterAnswers[challenge.id]===challenge.answer).flatMap(challenge=>challenge.unlockRelationshipIds??[]).filter(id=>availableRelationships.has(id));
 const completedIds=completed.map(n=>n.id),allCompletedIds=[...meetingCompletedNodes,...searchCompletedNodes,...completedIds,...warCompletedNodes,...herbsCompletedNodes,...finaleCompletedNodes],masteryStars=correctAnswerCount(progressForMastery);
 const rawGlobal=raw.globalKnowledge&&typeof raw.globalKnowledge==="object"?raw.globalKnowledge:initialProgress.globalKnowledge;
 const sourceIds=new Set<SourceId>(["VR-GP","VR-HPS","RCM-GP","TRAD"]);
 const unionStrings=(...values:unknown[])=>Array.from(new Set(values.flatMap(value=>Array.isArray(value)?value.filter((item):item is string=>typeof item==="string"):[])));
 const rawJourneys=raw.characterJourneys&&typeof raw.characterJourneys==="object"?raw.characterJourneys:{};
 const preservedJourneys:Partial<Record<"hanuman"|"rama"|"sita"|"bharata"|"ravana",CharacterJourneyProgress>>={};
 for(const pathId of ["rama","sita","bharata","ravana"] as const){const value=rawJourneys[pathId];if(value&&typeof value==="object"&&value.campaignId==="hanuman")preservedJourneys[pathId]=value;}
 const revealedScenes=allNodes.filter(node=>allCompletedIds.includes(node.id)||levels.some(level=>answers[challengeKey(node.id,level)])||(Array.isArray(raw.revealedScenes)?raw.revealedScenes.includes(node.id):legacyNodeSceneIsRevealed(node.scene,node.id,{...initialProgress,...raw,sceneDiscoveries,discoveredObjects,completedNodes:completedIds,unlockedCharacters:raw.unlockedCharacters??[]}))).map(node=>node.id);
 const normalized:JourneyProgressState={schemaVersion:2,finaleCompletedNodes,campaignComplete:finaleCompletedNodes.includes("HFF-04"),revealedScenes,meetingCompletedNodes,searchCompletedNodes,warCompletedNodes,herbsCompletedNodes,legacySearchAccess,
 globalKnowledge:{
  characterIds:unionStrings(rawGlobal.characterIds,[...initialProgress.unlockedCharacters,...completed.flatMap(n=>n.characters),...meetingNodes.filter(n=>meetingCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...searchNodes.filter(n=>searchCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...warNodes.filter(n=>warCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...herbsNodes.filter(n=>herbsCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...finaleNodes.filter(n=>finaleCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...activityRewards.characters].map(name=>characterIdByName[name]).filter(Boolean)),
  relationshipIds:unionStrings(rawGlobal.relationshipIds,finaleRelationships,suppliedRelationships,activityRewards.relationships.filter(id=>availableRelationships.has(id)),relationshipChallengeRewards,characterRelationshipRewards),
  placeIds:unionStrings(rawGlobal.placeIds,allCompletedIds.flatMap(id=>ramayanaEventById[id]?.placeIds??[])),
  sacredObjectIds:unionStrings(rawGlobal.sacredObjectIds,discoveredObjects),discoveryIds:unionStrings(rawGlobal.discoveryIds,sceneDiscoveries),
  sourceIds:unionStrings(rawGlobal.sourceIds,[...completed,...meetingNodes.filter(node=>meetingCompletedNodes.includes(node.id)),...searchNodes.filter(node=>searchCompletedNodes.includes(node.id)),...warNodes.filter(node=>warCompletedNodes.includes(node.id)),...herbsNodes.filter(node=>herbsCompletedNodes.includes(node.id)),...finaleNodes.filter(node=>finaleCompletedNodes.includes(node.id))].flatMap(node=>node.sourceLabels)).filter((id):id is SourceId=>sourceIds.has(id as SourceId)),
 },
 characterJourneys:{...preservedJourneys,hanuman:{campaignId:"hanuman",completedEventIds:allCompletedIds,answeredActivityIds:Object.keys(answers),masteryStars,completedChapterIds:hanumanCampaignChapters.filter(chapter=>chapter.playableNodeIds.length>0&&chapter.playableNodeIds.every(id=>allCompletedIds.includes(id))).map(chapter=>chapter.id)}},
 currentNode:herbsCompletedNodes.length===herbsNodes.length?finaleNodes[Math.min(finaleCompletedNodes.length,finaleNodes.length-1)].id:!legacySearchAccess&&meetingCompletedNodes.length<meetingNodes.length?meetingNodes[meetingCompletedNodes.length].id:!legacySearchAccess&&searchCompletedNodes.length<searchNodes.length?searchNodes[searchCompletedNodes.length].id:warCompletedNodes.length===warNodes.length?herbsNodes[Math.min(herbsCompletedNodes.length,herbsNodes.length-1)].id:count===journeyNodes.length?warNodes[Math.min(warCompletedNodes.length,warNodes.length-1)].id:journeyNodes[Math.min(count,journeyNodes.length-1)].id,completedNodes:completedIds,
 unlockedCharacters:Array.from(new Set([...initialProgress.unlockedCharacters,...completed.flatMap(n=>n.characters),...meetingNodes.filter(n=>meetingCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...searchNodes.filter(n=>searchCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...warNodes.filter(n=>warCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...herbsNodes.filter(n=>herbsCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...finaleNodes.filter(n=>finaleCompletedNodes.includes(n.id)).flatMap(n=>n.characters),...activityRewards.characters])),
 unlockedRelationships:Array.from(new Set([...finaleRelationships,...suppliedRelationships,...activityRewards.relationships.filter(id=>availableRelationships.has(id)),...relationshipChallengeRewards.filter(id=>availableRelationships.has(id)),...characterRelationshipRewards])),
 answeredChallenges:answers,relationshipChallengeAnswers:relationshipAnswers,characterChallengeAnswers:characterAnswers,sceneDiscoveries,hiddenDiscoveries,discoveredObjects,predictionChoices,storyMemoryAnswers,searchBoardAnswers,crossingTrailAnswers,nodeAttempts,
 achievements:Array.from(new Set([
  ...achievements.filter(a=>a.node<=count&&(!a.perfectNode||nodeMastery(progressForMastery,journeyNodes[a.perfectNode-1]).every(Boolean))&&(!a.totalStars||correctAnswerCount(progressForMastery)>=a.totalStars)).map(a=>a.name),
  ...meetingNodes.filter(n=>nodeMastery(progressForMastery,n).every(Boolean)).map(n=>meetingMemoryNames[n.number-1]),
  ...searchNodes.filter(n=>nodeMastery(progressForMastery,n).every(Boolean)).map(n=>searchMemoryNames[n.number-1]),
  ...journeyNodes.slice(0,3).filter(n=>nodeMastery(progressForMastery,n).every(Boolean)).map(n=>searchMemoryNames[n.number+1]),
  ...journeyNodes.slice(3,8).filter(n=>nodeMastery(progressForMastery,n).every(Boolean)).map(n=>crossingMemoryNames[n.number-4]),
  ...finaleNodes.filter(n=>nodeMastery(progressForMastery,n).every(Boolean)).map(n=>finaleMemoryNames[n.number-1]),
  ...(finaleCompletedNodes.includes("HFF-04")?["Follow Hanumān Complete"]:[]),...relationshipAchievementNames(relationshipAnswers),...explorationAchievementNames(sceneDiscoveries,discoveredObjects)
 ])),
 difficulty:levels.includes(raw.difficulty as Difficulty)?raw.difficulty!:"explorer"};
 normalized.achievements=Array.from(new Set([...normalized.achievements,...characterKnowledgeAchievementNames(normalized)]));
 return normalized;
}
export function discoverSceneItem(current:JourneyProgressState,activityId:string,hotspotId?:string){const safe=normalizeProgress(current),activity=activityById(activityId),key=discoveryKey(activityId,hotspotId);if(!activity||!validDiscoveryIds.has(key))return safe;const hidden=Boolean(activity.hidden);return normalizeProgress({...safe,sceneDiscoveries:[...safe.sceneDiscoveries,key],hiddenDiscoveries:hidden?[...safe.hiddenDiscoveries,key]:safe.hiddenDiscoveries});}
export function choosePrediction(current:JourneyProgressState,activityId:string,choiceId:string){const safe=normalizeProgress(current),activity=activityById(activityId);if(activity?.type!=="predictionChoice"||!activity.choices.some(choice=>choice.id===choiceId))return safe;return normalizeProgress({...safe,predictionChoices:{...safe.predictionChoices,[activityId]:choiceId}});}
export function discoverObject(current:JourneyProgressState,objectId:string){const safe=normalizeProgress(current);if(!sacredObjects.some(object=>object.id===objectId))return safe;return normalizeProgress({...safe,discoveredObjects:[...safe.discoveredObjects,objectId]});}
export function recordStoryMemory(current:JourneyProgressState,activityId:string,orderedIds:string[]){const safe=normalizeProgress(current),activity=activityById(activityId);if(!activity||(activity.type!=="storyMemory"&&activity.type!=="connectionBuilder"&&activity.type!=="evidenceSort")||(activity.type==="storyMemory"&&orderedIds.some(id=>!activity.items.some(item=>item.id===id))))return safe;if(activity.type==="connectionBuilder"&&orderedIds.join(",")!==activity.correct.join(","))return safe;return normalizeProgress({...safe,unlockedRelationships:activity.type==="connectionBuilder"?[...safe.unlockedRelationships,activity.relationshipId]:safe.unlockedRelationships,storyMemoryAnswers:{...safe.storyMemoryAnswers,[activityId]:orderedIds.join(",")}});}
export function recordSearchBoardAnswer(current:JourneyProgressState,nodeId:string,value:string){const safe=normalizeProgress(current);if(!["HFS-01","HFS-02","HJ-01","HJ-02","HJ-03"].includes(nodeId)||!value)return safe;return normalizeProgress({...safe,searchBoardAnswers:{...safe.searchBoardAnswers,[nodeId]:value}});}
export function recordCrossingTrailAnswer(current:JourneyProgressState,nodeId:string,value:string){const safe=normalizeProgress(current);if(!crossingNodeIds.includes(nodeId as typeof crossingNodeIds[number])||!value)return safe;return normalizeProgress({...safe,crossingTrailAnswers:{...safe.crossingTrailAnswers,[nodeId]:value}});}
export function answerRelationshipChallenge(current:JourneyProgressState,challengeId:string,answer:string){
 const safe=normalizeProgress(current),challenge=relationshipChallengeById(challengeId);
 const available=new Set(availableRelationshipIds(safe.completedNodes.length,safe.meetingCompletedNodes.length,safe.warCompletedNodes.length,safe.herbsCompletedNodes.length,safe.finaleCompletedNodes.length));
 if(!challenge||!challenge.options.some(option=>option.id===answer)||!challenge.relationshipIds.every(id=>available.has(id)))return safe;
 const discovered=answer===challenge.answer?[...safe.unlockedRelationships,...challenge.relationshipIds]:safe.unlockedRelationships;
 return normalizeProgress({...safe,unlockedRelationships:discovered,relationshipChallengeAnswers:{...safe.relationshipChallengeAnswers,[challengeId]:answer}});
}
export function answerCharacterChallenge(current:JourneyProgressState,challengeId:string,answer:string){
 const safe=normalizeProgress(current),challenge=characterChallengeById(challengeId);
 if(!challenge||!safe.unlockedCharacters.includes(characterNameById[challenge.characterId]??"")||!challenge.options.some(option=>option.id===answer))return safe;
 return normalizeProgress({...safe,characterChallengeAnswers:{...safe.characterChallengeAnswers,[challengeId]:answer}});
}
export function completeChallenge(current:JourneyProgressState,node:JourneyNode,level:Difficulty,challengeId:string,answer:string):JourneyProgressState {
 const safe=normalizeProgress(current);
 const activity=masteryActivityFor(node,level);
 const levelIndex=levels.indexOf(level);
 const key=challengeKey(node.id,level);
 const earlierAnswered=levels.slice(0,levelIndex).every(previous=>safe.answeredChallenges[challengeKey(node.id,previous)]);
 if(!canEnterNode(safe,node) || !earlierAnswered || challengeId!==activity.id || !answer || storedMasteryIsCorrect(node,level,safe.answeredChallenges[key])) return safe;
 const answeredChallenges={...safe.answeredChallenges,[key]:encodeMasteryResponse(activity,answer)};
 const completedNodes=level==="scholar"?Array.from(new Set([...safe.completedNodes,node.id])):safe.completedNodes;
 const nodeAttempts=level==="explorer"?{...safe.nodeAttempts,[node.id]:(safe.nodeAttempts[node.id]??0)+1}:safe.nodeAttempts;
 if(!masteryResponseIsCorrect(activity,answer)&&safe.answeredChallenges[key])answeredChallenges[key]=safe.answeredChallenges[key];
 return normalizeProgress({...safe,finaleCompletedNodes:node.id.startsWith("HFF-")&&level==="scholar"?[...safe.finaleCompletedNodes,node.id]:safe.finaleCompletedNodes,completedNodes:!node.id.startsWith("HJ-")?safe.completedNodes:completedNodes,meetingCompletedNodes:node.id.startsWith("HFM-")&&level==="scholar"?[...safe.meetingCompletedNodes,node.id]:safe.meetingCompletedNodes,searchCompletedNodes:node.id.startsWith("HFS-")&&level==="scholar"?[...safe.searchCompletedNodes,node.id]:safe.searchCompletedNodes,herbsCompletedNodes:node.id.startsWith("HFH-")&&level==="scholar"?[...safe.herbsCompletedNodes,node.id]:safe.herbsCompletedNodes,warCompletedNodes:node.id.startsWith("HFW-")&&level==="scholar"?[...safe.warCompletedNodes,node.id]:safe.warCompletedNodes,unlockedRelationships:activity.type==="connectionBuilder"&&masteryResponseIsCorrect(activity,answer)?[...safe.unlockedRelationships,...activity.unlocks]:safe.unlockedRelationships,answeredChallenges,nodeAttempts});
}
export function mergeProgress(a:unknown,b:unknown){
 const left=normalizeProgress(a),right=normalizeProgress(b);
 const bestAnswers={...left.answeredChallenges,...right.answeredChallenges};
 for(const node of allNodes)for(const level of levels){const key=challengeKey(node.id,level);if(storedMasteryIsCorrect(node,level,left.answeredChallenges[key]))bestAnswers[key]=left.answeredChallenges[key];}
 return normalizeProgress({...right,finaleCompletedNodes:Array.from(new Set([...left.finaleCompletedNodes,...right.finaleCompletedNodes])),legacySearchAccess:left.legacySearchAccess||right.legacySearchAccess,meetingCompletedNodes:Array.from(new Set([...left.meetingCompletedNodes,...right.meetingCompletedNodes])),searchCompletedNodes:Array.from(new Set([...left.searchCompletedNodes,...right.searchCompletedNodes])),herbsCompletedNodes:Array.from(new Set([...left.herbsCompletedNodes,...right.herbsCompletedNodes])),warCompletedNodes:Array.from(new Set([...left.warCompletedNodes,...right.warCompletedNodes])),globalKnowledge:{characterIds:[...left.globalKnowledge.characterIds,...right.globalKnowledge.characterIds],relationshipIds:[...left.globalKnowledge.relationshipIds,...right.globalKnowledge.relationshipIds],placeIds:[...left.globalKnowledge.placeIds,...right.globalKnowledge.placeIds],sacredObjectIds:[...left.globalKnowledge.sacredObjectIds,...right.globalKnowledge.sacredObjectIds],discoveryIds:[...left.globalKnowledge.discoveryIds,...right.globalKnowledge.discoveryIds],sourceIds:[...left.globalKnowledge.sourceIds,...right.globalKnowledge.sourceIds]},revealedScenes:Array.from(new Set([...left.revealedScenes,...right.revealedScenes])),completedNodes:Array.from(new Set([...left.completedNodes,...right.completedNodes])),unlockedRelationships:Array.from(new Set([...left.unlockedRelationships,...right.unlockedRelationships])),answeredChallenges:bestAnswers,relationshipChallengeAnswers:{...left.relationshipChallengeAnswers,...right.relationshipChallengeAnswers},characterChallengeAnswers:{...left.characterChallengeAnswers,...right.characterChallengeAnswers},sceneDiscoveries:Array.from(new Set([...left.sceneDiscoveries,...right.sceneDiscoveries])),hiddenDiscoveries:Array.from(new Set([...left.hiddenDiscoveries,...right.hiddenDiscoveries])),discoveredObjects:Array.from(new Set([...left.discoveredObjects,...right.discoveredObjects])),predictionChoices:{...left.predictionChoices,...right.predictionChoices},storyMemoryAnswers:{...left.storyMemoryAnswers,...right.storyMemoryAnswers},searchBoardAnswers:{...left.searchBoardAnswers,...right.searchBoardAnswers},crossingTrailAnswers:{...left.crossingTrailAnswers,...right.crossingTrailAnswers},nodeAttempts:Object.fromEntries(allNodes.map(node=>[node.id,Math.max(left.nodeAttempts[node.id]??0,right.nodeAttempts[node.id]??0)]))});
}

export function revealStoryScene(current:JourneyProgressState,nodeId:string){const safe=normalizeProgress(current);const node=allNodes.find(item=>item.id===nodeId);if(!node||!canEnterNode(safe,node))return safe;return normalizeProgress({...safe,revealedScenes:[...safe.revealedScenes,nodeId]});}

export function canEnterNode(progress:JourneyProgressState,node:JourneyNode){return node.id.startsWith('HFF-')?progress.herbsCompletedNodes.length===herbsNodes.length&&node.number<=progress.finaleCompletedNodes.length+1:node.id.startsWith('HFH-')?progress.warCompletedNodes.length===6&&node.number<=progress.herbsCompletedNodes.length+1:node.id.startsWith('HFW-')?progress.completedNodes.length===15&&node.number<=progress.warCompletedNodes.length+1:node.id.startsWith('HFM-')?node.number<=progress.meetingCompletedNodes.length+1:node.id.startsWith('HFS-')?progress.meetingCompletedNodes.length===meetingNodes.length&&node.number<=progress.searchCompletedNodes.length+1:(progress.legacySearchAccess||progress.searchCompletedNodes.length===searchNodes.length)&&node.number<=progress.completedNodes.length+1;}
export function allCompletedNodeIds(progress:JourneyProgressState){return [...progress.meetingCompletedNodes,...progress.searchCompletedNodes,...progress.completedNodes,...progress.warCompletedNodes,...progress.finaleCompletedNodes,...progress.herbsCompletedNodes];}
