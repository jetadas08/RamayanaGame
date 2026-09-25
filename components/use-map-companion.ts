"use client";
import {useCallback,useEffect} from "react";
import {useProgress,type MapUnlockEvent} from "@/components/progress-provider";
import {allCompletedNodeIds} from "@/lib/progress";
import {hanumanCompanionRoutes,resolveCompanionSnapshot,shouldAnimateCompanion,type CompanionProgressionEvent} from "@/lib/journey-companion";

export function useMapCompanion(chapterId:string){
 const {progress,pendingMapUnlocks,acknowledgeMapUnlock}=useProgress();
 const route=hanumanCompanionRoutes.find(item=>item.chapterId===chapterId)!;
 const completed=allCompletedNodeIds(progress);
 const snapshot=resolveCompanionSnapshot(route,completed,progress.campaignComplete);
 const pending=pendingMapUnlocks.find(event=>event.kind==="progression"&&event.chapterId===chapterId) as (MapUnlockEvent&CompanionProgressionEvent)|undefined;
 const animate=shouldAnimateCompanion(pending,route,snapshot);
 const settle=useCallback(()=>{if(pending)acknowledgeMapUnlock(pending.id);},[pending,acknowledgeMapUnlock]);
 useEffect(()=>{if(!pending||animate)return;const timer=window.setTimeout(settle,250);return()=>window.clearTimeout(timer);},[pending,animate,settle]);
 return{route,snapshot,pending,animate,settle};
}
