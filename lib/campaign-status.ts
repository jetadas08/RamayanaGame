import {hanumanCampaign} from '@/data/hanuman-campaign';
import {journeyNodes} from '@/data/journey';
import {meetingNodes} from '@/data/meeting';
import {searchNodes} from '@/data/search';
import {warNodes} from '@/data/war';
import {herbsNodes} from '@/data/herbs';
import {finaleNodes} from '@/data/finale';
import {allCompletedNodeIds,canEnterNode,nodeMastery} from '@/lib/progress';
import type {JourneyNode,JourneyProgressState,CampaignChapter} from '@/lib/types';
export type GameplayStatus='Locked'|'Available'|'Current'|'In Progress'|'Complete'|'Mastered';
const nodes=[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes];
export function encounterStatus(node:JourneyNode,progress:JourneyProgressState):GameplayStatus{
 if(allCompletedNodeIds(progress).includes(node.id))return nodeMastery(progress,node).every(Boolean)?'Mastered':'Complete';
 if(!canEnterNode(progress,node))return 'Locked';
 const activityIds=(node.activities??[]).map(a=>a.id);
 return progress.revealedScenes.includes(node.id)||Object.keys(progress.answeredChallenges).some(key=>key.startsWith(`${node.id}:`))||activityIds.some(id=>progress.predictionChoices[id]||progress.storyMemoryAnswers[id]||progress.sceneDiscoveries.some(key=>key===id||key.startsWith(`${id}:`)))?'In Progress':'Available';
}
export function chapterStatus(chapter:CampaignChapter,progress:JourneyProgressState):GameplayStatus{
 const statuses=chapter.playableNodeIds.map(id=>nodes.find(n=>n.id===id)).filter((n):n is JourneyNode=>Boolean(n)).map(n=>encounterStatus(n,progress));
 if(!statuses.length)return 'Locked';
 if(statuses.every(s=>s==='Mastered'))return 'Mastered';
 if(statuses.every(s=>s==='Mastered'||s==='Complete'))return 'Complete';
 if(chapter.playableNodeIds.includes(progress.currentNode))return 'Current';
 if(statuses.some(s=>s==='Complete'||s==='Mastered'||s==='In Progress'))return 'In Progress';
 return statuses.some(s=>s==='Available')?'Available':'Locked';
}
export const campaignPlayableTotals={encounters:hanumanCampaign.playableNodeIds.length,masteryStars:hanumanCampaign.playableNodeIds.length*3};
