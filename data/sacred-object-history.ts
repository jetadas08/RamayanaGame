import type {JourneyProgressState} from "@/lib/types";
import {sacredObjects} from "@/data/encounter-activities";

export type ObjectJourneyStep={title:string;detail:string;slug:string;nodeId:string};
const steps:Record<string,ObjectJourneyStep[]>={
 "ramas-ring":[
  {title:"Rāma entrusts the Ring",detail:"Rāma → Hanumān",slug:"rama-entrusts-the-ring",nodeId:"HFS-02"},
  {title:"Hanumān carries the sign of trust",detail:"Across the ocean toward Sītā",slug:"the-leap",nodeId:"HJ-04"},
  {title:"Sītā receives the Ring",detail:"Hanumān → Sītā",slug:"ring-and-message",nodeId:"HJ-11"},
 ],
 "sitas-cudamani":[
  {title:"Sītā entrusts the Cūḍāmaṇi",detail:"Sītā → Hanumān",slug:"ring-and-message",nodeId:"HJ-11"},
  {title:"Hanumān carries the return token",detail:"Laṅkā → the waiting alliance",slug:"return-to-rama",nodeId:"HJ-15"},
  {title:"Rāma receives proof and message",detail:"Hanumān → Rāma",slug:"return-to-rama",nodeId:"HJ-15"},
 ],
};

export function knownObjectJourneySteps(objectId:string,progress:JourneyProgressState){
 const discoveryNode=sacredObjects.find(object=>object.id===objectId)?.discoveryNode;
 return (steps[objectId]??[]).filter(step=>progress.revealedScenes.includes(step.nodeId)||progress.completedNodes.includes(step.nodeId)||progress.searchCompletedNodes.includes(step.nodeId)||(step.nodeId===discoveryNode&&progress.discoveredObjects.includes(objectId)));
}
