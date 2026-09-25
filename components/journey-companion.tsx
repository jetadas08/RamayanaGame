"use client";
import {useEffect,useRef,useState,type CSSProperties} from "react";
import Image from "next/image";
import {Footprints} from "lucide-react";
import {companionVisuals,resolveRouteCompanionPlacement,type CompanionFacing,type CompanionId,type CompanionMotionPreset,type CompanionPoint,type CompanionPose,type CompanionVisualState} from "@/lib/journey-companion";
import styles from "@/components/journey-companion.module.scss";

const travelDuration:Record<CompanionMotionPreset,number>={standard:1850,leap:2350,crossing:2350,stealth:2050,"emergency-flight":2200,return:2550,"ceremonial-arrival":2600};
const easeJourney=(value:number)=>(1-Math.cos(Math.PI*value))/2;
const curvePoint=(from:CompanionPoint,controlA:CompanionPoint,controlB:CompanionPoint,to:CompanionPoint,progress:number)=>{
 const inverse=1-progress;
 return{x:inverse**3*from.x+3*inverse*inverse*progress*controlA.x+3*inverse*progress*progress*controlB.x+progress**3*to.x,y:inverse**3*from.y+3*inverse*inverse*progress*controlA.y+3*inverse*progress*progress*controlB.y+progress**3*to.y};
};

type GroundTreatment={width:number;rotation:number;opacity:number};

export function JourneyCompanion({companionId,current,previous,next,travelControl,arrivalOffset={x:0,y:0},restingFacing,ground,animate=false,eventKey,movementPreset="standard",restingState="resting",compact=false,macro=false,routeOffset=.5,onSettled}:{companionId:CompanionId;current:CompanionPoint;previous?:CompanionPoint;next?:CompanionPoint;travelControl?:CompanionPoint;arrivalOffset?:CompanionPoint;restingFacing?:CompanionFacing;ground?:GroundTreatment;animate?:boolean;eventKey?:string;movementPreset?:CompanionMotionPreset;restingState?:CompanionVisualState;compact?:boolean;macro?:boolean;routeOffset?:number;onSettled?:()=>void}){
 const visual=companionVisuals[companionId],name=visual?.accessibleName??"Journey companion";
 const target=resolveRouteCompanionPlacement(current,previous,next,routeOffset),source=previous?resolveRouteCompanionPlacement(previous,undefined,current,routeOffset):target;
 const currentX=target.point.x,currentY=target.point.y,previousX=previous?source.point.x:undefined,previousY=previous?source.point.y:undefined,controlX=travelControl?.x,controlY=travelControl?.y;
 const [point,setPoint]=useState(animate&&previous?source.point:target.point),[state,setState]=useState<CompanionVisualState>(animate&&previous?"departing":restingState),settledRef=useRef(onSettled);
 useEffect(()=>{settledRef.current=onSettled;},[onSettled]);
 useEffect(()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!animate||previousX===undefined||previousY===undefined||reduced){setPoint({x:currentX,y:currentY});setState(restingState);if(animate)settledRef.current?.();return;}
  const from={x:previousX,y:previousY},to={x:currentX,y:currentY};
  const controlA=controlX===undefined||controlY===undefined?{x:from.x+(to.x-from.x)*.42,y:from.y+(to.y-from.y)*.42}:{x:controlX,y:controlY};
  const controlB={x:to.x+arrivalOffset.x,y:to.y+arrivalOffset.y};
  const distance=Math.hypot(to.x-from.x,to.y-from.y),duration=Math.max(1600,Math.min(2600,travelDuration[movementPreset]+(distance-22)*10));
  setPoint(from);setState("departing");
  let frame=0,departTimer=0,settleTimer=0,start=0;
  const travel=(time:number)=>{
   if(!start)start=time;
   const linear=Math.min(1,(time-start)/duration),eased=Math.min(1,easeJourney(linear));
   setPoint(curvePoint(from,controlA,controlB,to,eased));
   if(linear<1){frame=window.requestAnimationFrame(travel);return;}
   setPoint(to);setState("arriving");
   settleTimer=window.setTimeout(()=>{setState(restingState);settledRef.current?.();},420);
  };
  departTimer=window.setTimeout(()=>{setState("moving");frame=window.requestAnimationFrame(travel);},180);
  return()=>{window.cancelAnimationFrame(frame);window.clearTimeout(departTimer);window.clearTimeout(settleTimer);};
 },[eventKey,animate,currentX,currentY,previousX,previousY,controlX,controlY,arrivalOffset.x,arrivalOffset.y,movementPreset,restingState]);
 const pose:CompanionPose=state==="moving"||state==="departing"?"moving":state==="arriving"?"arriving":"idle";
 const facing=state==="moving"||state==="departing"?target.facing:restingFacing??target.facing,status=state==="moving"||state==="departing"?"is traveling toward the next journey position":"is at the current journey position";
 const customStyle={left:`${point.x}%`,top:`${point.y}%`,"--ground-width":`${ground?.width??24}px`,"--ground-rotation":`${ground?.rotation??0}deg`,"--ground-opacity":ground?.opacity??.32} as CSSProperties;
 return <div className={styles.companion} data-state={state} data-pose={pose} data-motion={movementPreset} data-facing={facing} data-compact={compact} data-macro={macro} data-path-motion={macro&&animate} style={customStyle} role="img" aria-label={`${name} ${status}, facing ${facing}`} aria-live={animate?"polite":"off"}>
  <span className={styles.ground} aria-hidden="true"/>
  <span className={styles.figure}>{visual?(Object.entries(visual.poses) as [CompanionPose,string][]).map(([layerPose,asset])=><Image key={layerPose} src={asset} alt="" width={720} height={768} sizes="96px" priority={false} data-pose-layer={layerPose}/>):<Footprints aria-hidden="true"/>}</span>
 </div>;
}
