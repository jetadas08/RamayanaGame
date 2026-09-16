"use client";
import {useMemo,useState} from "react";
import {Minus,Plus} from "lucide-react";
import {CharacterPortrait} from "@/components/character-portrait";
import {characters} from "@/data/discoveries";
import {relationshipTypeLabels,relationships as allRelationships} from "@/data/relationships";
import type {Relationship,RelationshipType} from "@/lib/types";
import styles from "@/app/connections/connections.module.scss";

export type NetworkDepth="first"|"expanded"|"whole";
type ConnectionGroup={key:string;from:string;to:string;directional:boolean;relationships:Relationship[]};
const typeFamily:Record<RelationshipType,string>={family:"bond",marriage:"bond",friendship:"bond",devotion:"duty",service:"duty",protector:"duty",teacher:"mission",guidance:"mission",messenger:"mission",alliance:"political",opposition:"political"};
function connectionKey(edge:Relationship){return edge.directional?`${edge.fromCharacterId}>${edge.toCharacterId}`:[edge.fromCharacterId,edge.toCharacterId].sort().join("=");}
function groupConnections(edges:Relationship[]){return Array.from(edges.reduce((map,edge)=>{const key=connectionKey(edge),current=map.get(key);if(current)current.relationships.push(edge);else map.set(key,{key,from:edge.fromCharacterId,to:edge.toCharacterId,directional:edge.directional,relationships:[edge]});return map;},new Map<string,ConnectionGroup>()).values());}

export function RelationshipGraph({relationships,focusId,depth,unlockedCharacterNames,unlockedRelationshipIds,availableRelationshipIds,selectedIds,onSelect,onFocus}:{relationships:Relationship[];focusId:string;depth:NetworkDepth;unlockedCharacterNames:string[];unlockedRelationshipIds:string[];availableRelationshipIds:string[];selectedIds:string[];onSelect:(relationships:Relationship[])=>void;onFocus:(id:string)=>void}){
 const [zoom,setZoom]=useState(depth==="whole"?.86:1);const groups=useMemo(()=>groupConnections(relationships),[relationships]);
 const ids=Array.from(new Set([focusId,...groups.flatMap(group=>[group.from,group.to])])).filter(Boolean);const firstIds=new Set(groups.filter(g=>g.from===focusId||g.to===focusId).flatMap(g=>[g.from,g.to]));
 const positions=Object.fromEntries(ids.map(id=>{if(depth!=="whole"&&id===focusId)return[id,[450,300]];const ring=ids.filter(item=>item!==focusId);let radiusX=330,radiusY=220;if(depth==="expanded"&&!firstIds.has(id)){radiusX=405;radiusY=265;}if(depth==="whole"){radiusX=385;radiusY=245;}const i=ring.indexOf(id),angle=(i/Math.max(ring.length,1))*Math.PI*2-Math.PI/2;return[id,[450+radiusX*Math.cos(angle),300+radiusY*Math.sin(angle)]];})) as Record<string,[number,number]>;
 return <div className={styles.graphStage}>
  <div className={styles.graphViewport}><div className={`${styles.graphCanvas} ${depth==="whole"?styles.wholeCanvas:""}`} style={{transform:`scale(${zoom})`}}>
   <svg viewBox="0 0 900 600" className={styles.graphLines} role="img" aria-label="Discovered relationship lines"><defs><marker id="connection-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z"/></marker></defs>{groups.map(group=>{const a=positions[group.from],b=positions[group.to],selected=group.relationships.some(item=>selectedIds.includes(item.id)),family=typeFamily[group.relationships[0].type],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;return <g key={group.key} className={`${styles.connectionEdge} ${selected?styles.selectedEdge:""}`} data-family={family}><path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} markerEnd={group.directional?"url(#connection-arrow)":undefined}/><path className={styles.edgeHit} d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} onClick={()=>onSelect(group.relationships)}/><foreignObject x={mx-70} y={my-18} width="140" height="36"><button className={styles.edgeChip} onClick={()=>onSelect(group.relationships)}>{group.relationships.map(item=>relationshipTypeLabels[item.type]).join(" + ")}</button></foreignObject></g>;})}</svg>
   {ids.map(id=>{const [x,y]=positions[id],character=characters.find(item=>item.id===id),unlocked=Boolean(character&&unlockedCharacterNames.includes(character.name)),available=allRelationships.filter(edge=>availableRelationshipIds.includes(edge.id)&&(edge.fromCharacterId===id||edge.toCharacterId===id)),mastered=unlocked&&available.length>0&&available.every(edge=>unlockedRelationshipIds.includes(edge.id));return <button key={id} className={`${styles.portraitNode} ${id===focusId?styles.focusNode:""} ${depth==="whole"?styles.smallNode:""} ${mastered?styles.masteredNode:""}`} style={{left:`${x/9}%`,top:`${y/6}%`}} onClick={()=>unlocked&&onFocus(id)} aria-label={unlocked?`Focus ${character!.name}`:"Undiscovered character"}><span className={styles.medallion}>{unlocked&&character?.portrait?<CharacterPortrait name={character.name} portrait={character.portrait} usage="medallion"/>:<span className={styles.lockedPortrait}>?</span>}</span><strong>{unlocked?character!.name:"Undiscovered"}</strong></button>;})}
  </div></div>
  <div className={styles.zoomControls}><button onClick={()=>setZoom(value=>Math.max(.72,value-.12))} aria-label="Zoom out"><Minus/></button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(value=>Math.min(1.3,value+.12))} aria-label="Zoom in"><Plus/></button></div>
  <div className={styles.mobileConnectionList}>
   {groups.map(group=>{
     const fromChar=characters.find(c=>c.id===group.from);
     const toChar=characters.find(c=>c.id===group.to);
     const fromUnlocked=Boolean(fromChar&&unlockedCharacterNames.includes(fromChar.name));
     const toUnlocked=Boolean(toChar&&unlockedCharacterNames.includes(toChar.name));
     return <button key={group.key} onClick={()=>onSelect(group.relationships)}>
       <div className={styles.mobileAvatars}>
         <span className={styles.miniMedallion}>
           {fromUnlocked&&fromChar?.portrait?<CharacterPortrait name={fromChar.name} portrait={fromChar.portrait} usage="medallion"/>:<span className={styles.lockedPortrait}>?</span>}
         </span>
         <span className={styles.mobileArrow}>{group.directional?"→":"↔"}</span>
         <span className={styles.miniMedallion}>
           {toUnlocked&&toChar?.portrait?<CharacterPortrait name={toChar.name} portrait={toChar.portrait} usage="medallion"/>:<span className={styles.lockedPortrait}>?</span>}
         </span>
       </div>
       <div className={styles.mobileConnectionCopy}>
         <strong>{fromUnlocked?fromChar?.name:"Undiscovered"} {group.directional?"→":"↔"} {toUnlocked?toChar?.name:"Undiscovered"}</strong>
         <small>{group.relationships.map(item=>relationshipTypeLabels[item.type]).join(" + ")}</small>
       </div>
     </button>;
   })}
  </div>
 </div>;
}
