import {journeyNodes} from "@/data/journey";
import type {Location} from "@/lib/types";
// Narrative layout coordinates are not surveyed modern locations.
export const locations:Location[]=journeyNodes.map(node=>({id:node.id,name:node.place,confidenceLevel:node.confidence,displayType:node.displayType,
 ...(node.confidence==="B"?{modernCoordinates:[80.804,6.936] as [number,number]}:{}),
 sources:[{source:"TRAD",claimType:"traditionalIdentification",summary:node.whyHere.tradition,verification:"planningReference"}],
}));
export const modernReferences:Location[]=[{id:"rameswaram",name:"Rāmeśvaram",confidenceLevel:"A",displayType:"point",modernCoordinates:[79.313,9.288],sources:[{source:"TRAD",claimType:"gameAdaptation",summary:"Modern geographic orientation point; this does not establish an epic encounter at the coordinate.",verification:"planningReference"}]}];
