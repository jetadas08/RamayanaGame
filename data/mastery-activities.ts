import {finaleMastery} from "@/data/finale";
import {herbsMastery} from "@/data/herbs";
import {warMastery} from "@/data/war";
import {meetingMastery} from "@/data/meeting";
import {searchMastery,searchNodes} from "@/data/search";
import {crossingMastery,crossingNodeIds} from "@/data/crossing";
import {challengeFor,storedAnswerIsAnswered,storedAnswerIsCorrect} from "@/data/challenges";
import {journeyNodes} from "@/data/journey";
import type {Difficulty,JourneyNode,MasteryActivity,MasteryActivityType,NarrativeContext} from "@/lib/types";

const stages:Difficulty[]=["explorer","seeker","scholar"];
export const masteryFormatPlan:Record<string,Record<Difficulty,MasteryActivityType>>={
 "HJ-01":{explorer:"singleSelect",seeker:"sequence",scholar:"multiSelect"},
 "HJ-02":{explorer:"sceneDiscovery",seeker:"matching",scholar:"multiSelect"},
 "HJ-03":{explorer:"singleSelect",seeker:"matching",scholar:"predictionChoice"},
 "HJ-04":{explorer:"sceneDiscovery",seeker:"sequence",scholar:"multiSelect"},
 "HJ-05":{explorer:"singleSelect",seeker:"predictionChoice",scholar:"matching"},
 "HJ-06":{explorer:"singleSelect",seeker:"predictionChoice",scholar:"multiSelect"},
 "HJ-07":{explorer:"sceneDiscovery",seeker:"matching",scholar:"multiSelect"},
 "HJ-08":{explorer:"singleSelect",seeker:"sequence",scholar:"matching"},
 "HJ-09":{explorer:"sceneDiscovery",seeker:"matching",scholar:"multiSelect"},
 "HJ-10":{explorer:"sceneDiscovery",seeker:"matching",scholar:"multiSelect"},
 "HJ-11":{explorer:"singleSelect",seeker:"sequence",scholar:"multiSelect"},
 "HJ-12":{explorer:"sequence",seeker:"matching",scholar:"multiSelect"},
 "HJ-13":{explorer:"sceneDiscovery",seeker:"predictionChoice",scholar:"multiSelect"},
 "HJ-14":{explorer:"singleSelect",seeker:"sequence",scholar:"matching"},
 "HJ-15":{explorer:"singleSelect",seeker:"matching",scholar:"multiSelect"},
};

function perspectives(node:JourneyNode){const values:NarrativeContext[]=["hanuman"];for(const [name,id] of [["Rāma","rama"],["Sītā","sita"],["Bharata","bharata"],["Rāvaṇa","ravana"]] as const)if(node.characters.includes(name))values.push(id);return values;}
function sequenceNodes(node:JourneyNode){const start=node.number===1?0:node.number===15?12:node.number-2;return journeyNodes.slice(start,start+3);}
function shuffled<T>(items:T[]){return items.length<3?items:[items[1],items[2],items[0]];}
const encounterDistractors:Record<string,string>={
 "HJ-01":"The party has already received news from Sītā",
 "HJ-02":"He asks the search party to abandon the southern route",
 "HJ-03":"He offers Hanumān a weapon for the crossing",
 "HJ-04":"He waits for a bridge to be built before leaving",
 "HJ-05":"He mistakes Maināka for the guardian of Laṅkā",
 "HJ-06":"He accepts the test by turning back toward Bhārata",
 "HJ-07":"She offers safe passage in exchange for Rāma’s ring",
 "HJ-08":"She welcomes Hanumān openly into Rāvaṇa’s court",
 "HJ-09":"Their meeting causes Hanumān to abandon his disguise",
 "HJ-10":"He announces himself before observing Sītā’s condition",
 "HJ-11":"The ring gives Hanumān authority to rule Laṅkā",
 "HJ-12":"The battle ends before any prince enters the conflict",
 "HJ-13":"Hanumān asks Rāvaṇa for permission to end the search",
 "HJ-14":"The fire prevents Hanumān from completing his return",
 "HJ-15":"Hanumān keeps Sītā’s news from Rāma",
};
function fourOptions(node:JourneyNode,choices:{id:string;label:string}[]){
 const labels=new Set(choices.map(choice=>choice.label)),result=[...choices],specific=encounterDistractors[node.id];
 if(specific&&!labels.has(specific)){labels.add(specific);result.push({id:String.fromCharCode(97+result.length),label:specific});}
 const rotated=[...journeyNodes.slice(node.number),...journeyNodes.slice(0,node.number)];
 for(const candidate of rotated.flatMap(item=>item.challenge.choices)){if(result.length>=4)break;if(!labels.has(candidate.label)){labels.add(candidate.label);result.push({id:String.fromCharCode(97+result.length),label:candidate.label});}}
 return result;
}
function variedMultiSelectOrder(node:JourneyNode,options:{id:string;label:string}[]){
 const patterns=[[0,2,1,3],[2,0,3,1],[1,2,3,0],[2,1,0,3]];
 return patterns[(node.number-1)%patterns.length].map(index=>options[index]);
}

export function masteryActivityFor(node:JourneyNode,stage:Difficulty):MasteryActivity{
 if(node.id.startsWith("HFF-"))return finaleMastery(node,stage);
 if(node.id.startsWith("HFH-"))return herbsMastery(node,stage);
 if(node.id.startsWith("HFW-"))return warMastery(node,stage);
 if(node.id.startsWith("HFM-"))return meetingMastery(node,stage);
 if(node.id.startsWith("HFS-")||["HJ-01","HJ-02","HJ-03"].includes(node.id))return searchMastery(node,stage);
 if(crossingNodeIds.includes(node.id as typeof crossingNodeIds[number]))return crossingMastery(node,stage);
 const type=masteryFormatPlan[node.id][stage],challenge=challengeFor(node,stage,0),claimType=stage==="scholar"&&(node.id==="HJ-09"||node.id==="HJ-12")?"source-comparison":stage==="scholar"?"interpretation":"textual",base={id:`MA-${node.id}-${stage}`,eventId:node.id,stage,prompt:challenge.prompt,hint:stage==="explorer"?"Recall the people, place, or action you just encountered.":stage==="seeker"?"Follow the cause, relationship, or story order.":"Connect the event with its purpose and meaning.",explanation:challenge.explanation,sourceRefs:node.sourceLabels,unlocks:[],difficulty:stage,replayable:true,perspectives:perspectives(node),claimType:claimType as "textual"|"interpretation"|"source-comparison"};
 if(type==="singleSelect"||type==="sceneDiscovery"||type==="predictionChoice")return{...base,type,prompt:type==="sceneDiscovery"?`Find the detail that belongs in ${node.title} at ${node.place}.`:type==="predictionChoice"?`Before ${node.title} resolves: ${challenge.prompt}`:challenge.prompt,options:fourOptions(node,challenge.choices),correctAnswer:challenge.answer};
 if(type==="multiSelect"){
  const right=challenge.choices.find(choice=>choice.id===challenge.answer)!,wrong=challenge.choices.filter(choice=>choice.id!==challenge.answer).slice(0,2),options=variedMultiSelectOrder(node,[{id:"answer",label:right.label},{id:"reflection",label:node.teaching},...wrong.map((choice,index)=>({id:`distractor-${index}`,label:choice.label}))]);
  return{...base,type,prompt:`${challenge.prompt} Select every statement that supports the answer.`,options,correctState:["answer","reflection"]};
 }
 if(type==="sequence"){
  const ordered=sequenceNodes(node),items=shuffled(ordered.map(item=>({id:item.id,label:item.title})));
  return{...base,type,prompt:`Place the events around ${node.title} in their correct story order.`,explanation:`The journey moves from ${ordered[0].title}, through ${ordered[1].title}, to ${ordered[2].title}.`,items,correctState:ordered.map(item=>item.id)};
 }
 const pairs=[{id:"place",left:"Where it happens",correct:node.place},{id:"event",left:"What happens",correct:node.excerpt},{id:"meaning",left:"What it teaches",correct:node.teaching}];
 return{...base,type:"matching",prompt:`Match each story element for ${node.title}.`,explanation:`The event at ${node.place} joins a canonical story action with an explicitly labeled learning reflection.`,pairs,options:shuffled(pairs.map(pair=>({id:pair.correct,label:pair.correct}))),correctState:Object.fromEntries(pairs.map(pair=>[pair.id,pair.correct]))};
}

export function encodeMasteryResponse(activity:MasteryActivity,response:string){return `${activity.id}|${response}`;}
export function defaultMasteryResponse(activity:MasteryActivity){return activity.type==="sequence"?activity.items.map(item=>item.id).join(","):"";}
export function masteryResponseIsCorrect(activity:MasteryActivity,response:string){if(activity.type==="multiSelect")return response.split(",").filter(Boolean).sort().join(",")===activity.correctState.slice().sort().join(",");if(activity.type==="sequence")return response===activity.correctState.join(",");if(activity.type==="matching")return response===activity.pairs.map(pair=>`${pair.id}=${pair.correct}`).join(";");return response===activity.correctAnswer;}
function legacyCrossingResponseIsCorrect(node:JourneyNode,stage:Difficulty,response:string){
 const type=masteryFormatPlan[node.id]?.[stage],challenge=challengeFor(node,stage,0);
 if(type==="singleSelect"||type==="sceneDiscovery"||type==="predictionChoice")return response===challenge.answer;
 if(type==="multiSelect")return response.split(",").filter(Boolean).sort().join(",")===["answer","reflection"].sort().join(",");
 if(type==="sequence")return response===sequenceNodes(node).map(item=>item.id).join(",");
 if(type==="matching")return response===[`place=${node.place}`,`event=${node.excerpt}`,`meaning=${node.teaching}`].join(";");
 return false;
}
export function storedMasteryIsAnswered(node:JourneyNode,stage:Difficulty,value:string|undefined){if(!value)return false;const [id,response]=value.includes("|")?value.split(/\|([\s\S]+)/):["",value];if(id.startsWith("MA-"))return Boolean(response&&masteryActivityFor(node,stage).id===id);return storedAnswerIsAnswered(node,stage,value);}
export function storedMasteryIsCorrect(node:JourneyNode,stage:Difficulty,value:string|undefined){if(!storedMasteryIsAnswered(node,stage,value)||!value)return false;const [id,response]=value.includes("|")?value.split(/\|([\s\S]+)/):["",value];if(id.startsWith("MA-")){const current=masteryResponseIsCorrect(masteryActivityFor(node,stage),response);return current||(crossingNodeIds.includes(node.id as typeof crossingNodeIds[number])&&legacyCrossingResponseIsCorrect(node,stage,response));}return storedAnswerIsCorrect(node,stage,value);}

export function masteryAudit(){const audited=[...searchNodes,...journeyNodes],activities=audited.flatMap(node=>stages.map(stage=>masteryActivityFor(node,stage))),distribution=activities.reduce((counts,activity)=>({...counts,[activity.type]:(counts[activity.type]??0)+1}),{} as Record<string,number>);return{activities,distribution,singleOnlyNodes:journeyNodes.filter(node=>masteryFormatPlan[node.id]&&stages.every(stage=>masteryFormatPlan[node.id][stage]==="singleSelect")).map(node=>node.id),unsupportedSourceRefs:activities.filter(activity=>!activity.sourceRefs.length).map(activity=>activity.id),missingFeedback:activities.filter(activity=>!activity.explanation||!activity.hint).map(activity=>activity.id),duplicatePrompts:Array.from(new Set(activities.filter((activity,index)=>activities.findIndex(item=>item.prompt===activity.prompt)!==index).map(activity=>activity.prompt)))};}
