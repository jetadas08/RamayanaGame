import {journeyNodes} from "@/data/journey";
import {achievements,characters,relationships} from "@/data/discoveries";
import {relationshipAchievementDefinitions} from "@/data/relationships";
import {explorationAchievementDefinitions,sacredObjects,validDiscoveryIds} from "@/data/encounter-activities";
import {characterAchievementDefinitions} from "@/data/character-knowledge";
import {correctAnswerCount} from "@/lib/progress";
import type {JourneyProgressState} from "@/lib/types";

export type AchievementDisplay={name:string;description:string;category:string};
export const achievementDefinitions=Array.from(new Map<string,AchievementDisplay>([
 ...achievements.map(item=>[item.name,{name:item.name,description:`Milestone reached through ${journeyNodes[item.node-1]?.title||`HJ-${String(item.node).padStart(2,"0")}`}.`,category:`HJ-${String(item.node).padStart(2,"0")}`}] as [string,AchievementDisplay]),
 ...relationshipAchievementDefinitions.map(item=>[item.name,{...item,category:"Connections"}] as [string,AchievementDisplay]),
 ...explorationAchievementDefinitions.map(item=>[item.name,{...item,category:"Discovery"}] as [string,AchievementDisplay]),
 ...characterAchievementDefinitions.map(item=>[item.name,{...item,category:"Characters"}] as [string,AchievementDisplay]),
]).values());

export const progressTotals={
 encounters:journeyNodes.length,
 masteryStars:journeyNodes.length*3,
 characters:characters.length,
 connections:relationships.length,
 discoveries:validDiscoveryIds.size,
 sacredObjects:sacredObjects.length,
 achievements:achievementDefinitions.length,
};

export function progressCounts(progress:JourneyProgressState){
 const registeredAchievements=new Set(achievementDefinitions.map(item=>item.name));
 return {
  encounters:progress.completedNodes.filter(id=>journeyNodes.some(node=>node.id===id)).length,
  masteryStars:correctAnswerCount(progress),
  characters:progress.unlockedCharacters.filter(name=>characters.some(character=>character.name===name)).length,
  connections:progress.unlockedRelationships.filter(id=>relationships.some(relationship=>relationship.id===id)).length,
  discoveries:progress.sceneDiscoveries.filter(id=>validDiscoveryIds.has(id)).length,
  sacredObjects:progress.discoveredObjects.filter(id=>sacredObjects.some(object=>object.id===id)).length,
  achievements:progress.achievements.filter(name=>registeredAchievements.has(name)).length,
 };
}
