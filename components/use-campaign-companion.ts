"use client";
import {useCallback,useEffect} from "react";
import {useProgress,type MapUnlockEvent} from "@/components/progress-provider";
import {allCompletedNodeIds} from "@/lib/progress";
import {nextCampaignCompanionState,previousCampaignCompanionState,resolveCampaignCompanionState,shouldAnimateCampaignCompanion,type CompanionProgressionEvent} from "@/lib/journey-companion";

export function useCampaignCompanion(){
 const {progress,pendingMapUnlocks,acknowledgeMapUnlock}=useProgress();
 const currentState=resolveCampaignCompanionState(allCompletedNodeIds(progress));
 const pending=pendingMapUnlocks.find(event=>event.kind==="progression"&&shouldAnimateCampaignCompanion(event as MapUnlockEvent&CompanionProgressionEvent,currentState)) as (MapUnlockEvent&CompanionProgressionEvent)|undefined;
 const previousState=pending?previousCampaignCompanionState(currentState):undefined;
 const nextState=nextCampaignCompanionState(currentState);
 const settle=useCallback(()=>{if(pending)acknowledgeMapUnlock(pending.id);},[pending,acknowledgeMapUnlock]);
 useEffect(()=>{if(pending)return;const stale=pendingMapUnlocks.find(event=>event.kind==="progression");if(!stale)return;const timer=window.setTimeout(()=>acknowledgeMapUnlock(stale.id),250);return()=>window.clearTimeout(timer);},[pending,pendingMapUnlocks,acknowledgeMapUnlock]);
 return{pending,animate:Boolean(pending),currentState,previousState,nextState,settle};
}
