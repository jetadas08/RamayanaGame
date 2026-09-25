import type {RowDataPacket} from "mysql2";
import type {JourneyProgressState} from "@/lib/types";
import {normalizeProgress} from "@/lib/progress";

export type ProgressRow=RowDataPacket & {
 current_node:string;completed_nodes:string;unlocked_characters:string;unlocked_relationships:string;
 answered_challenges:string;relationship_challenges:string|null;encounter_progress:string|null;
 achievements:string;difficulty:JourneyProgressState["difficulty"];reset_epoch:string;
};

const parse=(value:string|null,fallback:unknown)=>{try{return value?JSON.parse(value):fallback;}catch{return fallback;}};

export function progressFromRow(row:ProgressRow|undefined){
 if(!row)return normalizeProgress(null);
 return normalizeProgress({
  currentNode:row.current_node,completedNodes:parse(row.completed_nodes,[]),
  unlockedCharacters:parse(row.unlocked_characters,[]),unlockedRelationships:parse(row.unlocked_relationships,[]),
  answeredChallenges:parse(row.answered_challenges,{}),relationshipChallengeAnswers:parse(row.relationship_challenges,{}),
  ...parse(row.encounter_progress,{}),achievements:parse(row.achievements,[]),difficulty:row.difficulty,
 });
}

export function progressValues(progress:JourneyProgressState){
 return [progress.currentNode,JSON.stringify(progress.completedNodes),JSON.stringify(progress.unlockedCharacters),
  JSON.stringify(progress.unlockedRelationships),JSON.stringify(progress.answeredChallenges),
  JSON.stringify(progress.relationshipChallengeAnswers),JSON.stringify({
   schemaVersion:progress.schemaVersion,finaleCompletedNodes:progress.finaleCompletedNodes,
   campaignComplete:progress.campaignComplete,herbsCompletedNodes:progress.herbsCompletedNodes,
   warCompletedNodes:progress.warCompletedNodes,meetingCompletedNodes:progress.meetingCompletedNodes,
   searchCompletedNodes:progress.searchCompletedNodes,legacySearchAccess:progress.legacySearchAccess,
   revealedScenes:progress.revealedScenes,characterChallengeAnswers:progress.characterChallengeAnswers,
   sceneDiscoveries:progress.sceneDiscoveries,hiddenDiscoveries:progress.hiddenDiscoveries,
   discoveredObjects:progress.discoveredObjects,predictionChoices:progress.predictionChoices,
   storyMemoryAnswers:progress.storyMemoryAnswers,searchBoardAnswers:progress.searchBoardAnswers,
   crossingTrailAnswers:progress.crossingTrailAnswers,nodeAttempts:progress.nodeAttempts,encounterPhases:progress.encounterPhases,
   recentChanges:progress.recentChanges,characterJourneys:progress.characterJourneys,
  }),JSON.stringify(progress.achievements),progress.difficulty] as const;
}

export const progressColumns="current_node, completed_nodes, unlocked_characters, unlocked_relationships, answered_challenges, relationship_challenges, encounter_progress, achievements, difficulty, reset_epoch";
