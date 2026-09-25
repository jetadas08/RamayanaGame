import type {SourceId,SourceReference} from "@/lib/types";

export type SourceReadiness="verified"|"pendingEditionAudit"|"planningReference"|"unverified";

export const sourceOrder:readonly SourceId[]=["VR-GP","RCM-GP","VR-HPS","TRAD"];

export function orderedSourceIds(ids:readonly string[]):string[]{
 return [...ids].sort((a,b)=>{
  const ai=sourceOrder.indexOf(a as SourceId),bi=sourceOrder.indexOf(b as SourceId);
  return (ai<0?sourceOrder.length:ai)-(bi<0?sourceOrder.length:bi);
 });
}

export function orderedSourceRefs<T extends Pick<SourceReference,"source">>(refs:readonly T[]):T[]{
 const rank=(id:SourceId)=>sourceOrder.indexOf(id);
 return [...refs].sort((a,b)=>rank(a.source)-rank(b.source));
}

export function sourceReadiness(refs:readonly SourceReference[]):SourceReadiness{
 if(!refs.length)return "unverified";
 if(refs.some(ref=>ref.verification==="planningReference"))return "planningReference";
 if(refs.some(ref=>ref.verification==="pendingEditionAudit"))return "pendingEditionAudit";
 return "verified";
}

export function publicSourceState(state:SourceReadiness):string{
 if(state==="verified")return "Source verified";
 if(state==="pendingEditionAudit")return "Edition verification pending";
 if(state==="planningReference")return "Source comparison in review";
 return "Source review pending";
}
