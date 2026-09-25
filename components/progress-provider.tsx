"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from "react";
import {normalizeProgress,mergeProgress,recordProgressChanges,recordEncounterPhase,revealStoryScene,completeChallenge,answerRelationshipChallenge,answerCharacterChallenge,choosePrediction,discoverObject as addDiscoveredObject,discoverSceneItem,recordStoryMemory,recordSearchBoardAnswer,recordCrossingTrailAnswer,allCompletedNodeIds} from "@/lib/progress";
import {progressionEventForNode,type CompanionId,type CompanionMotionPreset} from "@/lib/journey-companion";
import type {JourneyNode,JourneyProgressState} from "@/lib/types";
type User={id:string;name:string;email:string}|null;
export type MapUnlockEvent={id:string;kind:"progression"|"discovery";nodeId:string;nextNodeId?:string;characterNames:string[];relationshipIds:string[];campaignId?:string;chapterId?:string;companionId?:CompanionId;movementPreset?:CompanionMotionPreset};
type ContextValue={revealScene:(nodeId:string)=>void;saveEncounterPhase:(nodeId:string,phase:JourneyProgressState["encounterPhases"][string])=>void;progress:JourneyProgressState;user:User;hydrated:boolean;saving:boolean;error:string;recentRelationshipUnlocks:string[];pendingMapUnlocks:MapUnlockEvent[];completeNode:(node:JourneyNode,level:JourneyProgressState["difficulty"],challengeId:string,answer:string)=>void;answerConnection:(challengeId:string,answer:string)=>void;answerCharacter:(challengeId:string,answer:string)=>void;discoverScene:(activityId:string,hotspotId?:string)=>void;selectPrediction:(activityId:string,choiceId:string)=>void;discoverSacredObject:(objectId:string)=>void;saveStoryMemory:(activityId:string,orderedIds:string[])=>void;saveSearchBoardAnswer:(nodeId:string,value:string)=>void;saveCrossingTrailAnswer:(nodeId:string,value:string)=>void;acknowledgeRelationshipUnlocks:()=>void;acknowledgeMapUnlock:(id:string)=>void;resetProgress:()=>void;setDifficulty:(difficulty:JourneyProgressState["difficulty"])=>void;refreshAccount:()=>Promise<void>;logout:()=>Promise<void>};
const STORAGE_KEY="ramayana-journey-progress-v1";
const Context=createContext<ContextValue|null>(null);
export function getGuestProgress(){try{return normalizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY)??"null"));}catch{return normalizeProgress(null);}}
export function ProgressProvider({children}:{children:React.ReactNode}){
 const [progress,setProgress]=useState(()=>normalizeProgress(null));
 const progressRef=useRef(progress),resetEpoch=useRef("");
 const [user,setUser]=useState<User>(null),[hydrated,setHydrated]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState("");
 const [recentRelationshipUnlocks,setRecentRelationshipUnlocks]=useState<string[]>([]);
 const [pendingMapUnlocks,setPendingMapUnlocks]=useState<MapUnlockEvent[]>([]);
 useEffect(()=>{progressRef.current=progress;},[progress]);
 const refreshAccount=useCallback(async()=>{
  const response=await fetch("/api/auth/me",{cache:"no-store"});
  if(!response.ok)throw new Error("Account unavailable");
  const me=await response.json();
  if(me.user){
   const saved=await fetch("/api/progress",{cache:"no-store"});
   if(!saved.ok)throw new Error("Saved progress unavailable");
   const result=await saved.json();
   resetEpoch.current=result.resetEpoch??"";
   const merged=mergeProgress(mergeProgress(getGuestProgress(),progressRef.current),result.progress);
   const response=await fetch("/api/progress",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({progress:merged,resetEpoch:resetEpoch.current})});
   if(!response.ok)throw new Error("Saved progress could not be merged");
   const canonical=await response.json();
   resetEpoch.current=canonical.resetEpoch??"";
   progressRef.current=normalizeProgress(canonical.progress);
   setProgress(progressRef.current);
  }
  setUser(me.user??null);
 },[]);
 useEffect(()=>{setProgress(getGuestProgress());refreshAccount().catch(()=>setError("Account sync unavailable. You can continue on this device.")).finally(()=>setHydrated(true));},[refreshAccount]);
 useEffect(()=>{
  if(!hydrated)return;
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));}catch{setError("Browser storage unavailable. Keep this page open to retain your progress.");}
  if(!user)return;
  const controller=new AbortController();
  const timer=setTimeout(async()=>{setSaving(true);try{const r=await fetch("/api/progress",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({progress,resetEpoch:resetEpoch.current}),signal:controller.signal});const result=await r.json();if(r.status===409){resetEpoch.current=result.resetEpoch??"";setProgress(normalizeProgress(result.progress));setError("This journey was reset in another session. The current account record has been restored.");return;}if(!r.ok)throw new Error();setProgress(current=>{const next=current===progress?normalizeProgress(result.progress):mergeProgress(result.progress,current);return JSON.stringify(next)===JSON.stringify(current)?current:next;});setError("");}catch{if(!controller.signal.aborted)setError("Account sync failed. Your progress remains on this device.");}finally{if(!controller.signal.aborted)setSaving(false);}},350);
  return()=>{clearTimeout(timer);controller.abort();};
 },[progress,user,hydrated]);
 const completeNode=useCallback((node:JourneyNode,level:JourneyProgressState["difficulty"],challengeId:string,answer:string)=>setProgress(p=>{const next=completeChallenge(p,node,level,challengeId,answer),newlyCompleted=!allCompletedNodeIds(p).includes(node.id)&&allCompletedNodeIds(next).includes(node.id),addedRelationships=next.unlockedRelationships.filter(id=>!p.unlockedRelationships.includes(id)),addedCharacters=next.unlockedCharacters.filter(name=>!p.unlockedCharacters.includes(name)),movement=progressionEventForNode(node.id);if(addedRelationships.length)setRecentRelationshipUnlocks(addedRelationships);if(newlyCompleted&&movement)setPendingMapUnlocks(items=>[...items,{...movement,id:`${node.id}-${challengeId}`,characterNames:addedCharacters,relationshipIds:addedRelationships}]);return recordProgressChanges(p,next);}),[]);
 const answerConnection=useCallback((challengeId:string,answer:string)=>setProgress(p=>{const next=answerRelationshipChallenge(p,challengeId,answer),added=next.unlockedRelationships.filter(id=>!p.unlockedRelationships.includes(id));if(added.length)setRecentRelationshipUnlocks(added);return recordProgressChanges(p,next);}),[]);
 const answerCharacter=useCallback((challengeId:string,answer:string)=>setProgress(p=>{const next=answerCharacterChallenge(p,challengeId,answer),added=next.unlockedRelationships.filter(id=>!p.unlockedRelationships.includes(id));if(added.length)setRecentRelationshipUnlocks(added);return recordProgressChanges(p,next);}),[]);
 const discoverScene=useCallback((activityId:string,hotspotId?:string)=>setProgress(p=>{const next=discoverSceneItem(p,activityId,hotspotId),addedCharacters=next.unlockedCharacters.filter(name=>!p.unlockedCharacters.includes(name)),addedRelationships=next.unlockedRelationships.filter(id=>!p.unlockedRelationships.includes(id));if(addedRelationships.length)setRecentRelationshipUnlocks(addedRelationships);if(addedCharacters.length||addedRelationships.length){const nodeId=activityId.match(/^HJ(\d{2})/)?.[1];if(nodeId)setPendingMapUnlocks(items=>[...items,{id:`HJ-${nodeId}-${activityId}-${hotspotId??"activity"}`,kind:"discovery",nodeId:`HJ-${nodeId}`,characterNames:addedCharacters,relationshipIds:addedRelationships}]);}return recordProgressChanges(p,next);}),[]);
 const revealScene=useCallback((nodeId:string)=>setProgress(p=>recordProgressChanges(p,revealStoryScene(p,nodeId))),[]);
 const saveEncounterPhase=useCallback((nodeId:string,phase:JourneyProgressState["encounterPhases"][string])=>setProgress(p=>recordEncounterPhase(p,nodeId,phase)),[]);
 const selectPrediction=useCallback((activityId:string,choiceId:string)=>setProgress(p=>choosePrediction(p,activityId,choiceId)),[]);
 const discoverSacredObject=useCallback((objectId:string)=>setProgress(p=>recordProgressChanges(p,addDiscoveredObject(p,objectId))),[]);
 const saveStoryMemory=useCallback((activityId:string,orderedIds:string[])=>setProgress(p=>recordProgressChanges(p,recordStoryMemory(p,activityId,orderedIds))),[]);
 const saveSearchBoardAnswer=useCallback((nodeId:string,value:string)=>setProgress(p=>recordSearchBoardAnswer(p,nodeId,value)),[]);
 const saveCrossingTrailAnswer=useCallback((nodeId:string,value:string)=>setProgress(p=>recordCrossingTrailAnswer(p,nodeId,value)),[]);
 const acknowledgeRelationshipUnlocks=useCallback(()=>setRecentRelationshipUnlocks([]),[]);
 const acknowledgeMapUnlock=useCallback((id:string)=>setPendingMapUnlocks(items=>items.filter(item=>item.id!==id)),[]);
 const resetProgress=useCallback(async()=>{if(user){try{const response=await fetch("/api/progress",{method:"DELETE"});if(!response.ok)throw new Error();const result=await response.json();resetEpoch.current=result.resetEpoch??"";setProgress(normalizeProgress(result.progress));}catch{setError("Account reset failed. Your saved journey has not been cleared.");return;}}else setProgress(normalizeProgress(null));setRecentRelationshipUnlocks([]);setPendingMapUnlocks([]);setError("");},[user]);
 const logout=useCallback(async()=>{const response=await fetch("/api/auth/logout",{method:"POST"});if(!response.ok){setError("Could not sign out. Please try again.");return;}resetEpoch.current="";setUser(null);setProgress(normalizeProgress(null));setSaving(false);setError("");},[]);
 const value=useMemo(()=>({progress,user,hydrated,saving,error,recentRelationshipUnlocks,pendingMapUnlocks,revealScene,saveEncounterPhase,completeNode,answerConnection,answerCharacter,discoverScene,selectPrediction,discoverSacredObject,saveStoryMemory,saveSearchBoardAnswer,saveCrossingTrailAnswer,acknowledgeRelationshipUnlocks,acknowledgeMapUnlock,resetProgress,setDifficulty:(difficulty:JourneyProgressState["difficulty"])=>setProgress(p=>({...p,difficulty})),refreshAccount,logout}),[progress,user,hydrated,saving,error,recentRelationshipUnlocks,pendingMapUnlocks,revealScene,saveEncounterPhase,completeNode,answerConnection,answerCharacter,discoverScene,selectPrediction,discoverSacredObject,saveStoryMemory,saveSearchBoardAnswer,saveCrossingTrailAnswer,acknowledgeRelationshipUnlocks,acknowledgeMapUnlock,resetProgress,refreshAccount,logout]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useProgress(){const value=useContext(Context);if(!value)throw new Error("Missing ProgressProvider");return value;}
