"use client";
import {useEffect,useState} from "react";
import Image from "next/image";
import {LockKeyhole,Sparkles} from "lucide-react";
import type {NodeSceneDefinition} from "@/lib/types";
import styles from "@/components/journey.module.scss";

export function NodeSceneCard({scene,revealed,priority=false,animateReveal=false,observation=false}:{scene:NodeSceneDefinition;revealed:boolean;priority?:boolean;animateReveal?:boolean;observation?:boolean}){
 const [ready,setReady]=useState(!animateReveal);
 const [imageReady,setImageReady]=useState(false);
 useEffect(()=>{
  if(!animateReveal||!revealed||!imageReady)return;
  const timer=setTimeout(()=>setReady(true),window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:450);
  return()=>clearTimeout(timer);
 },[animateReveal,revealed,imageReady]);
 const visible=revealed&&(!animateReveal||ready);
 return <figure className={styles.sceneCard} data-revealed={visible} data-reveal-animation={animateReveal&&visible} data-observation={observation}>
  <div className={styles.sceneImages}>
   <Image className={styles.sceneImageLocked} src={scene.imageLocked} alt={visible?"":scene.altLocked} fill priority={priority} sizes="(max-width: 760px) calc(100vw - 3.4rem), (max-width: 1200px) 36vw, 430px" style={{objectPosition:scene.focalPosition??"center",objectFit:scene.imageFit??"cover"}}/>
   <Image className={styles.sceneImageRevealed} src={scene.imageRevealed} alt={visible?scene.altRevealed:""} fill priority={priority} onLoad={()=>setImageReady(true)} sizes="(max-width: 760px) calc(100vw - 3.4rem), (max-width: 1200px) 36vw, 430px" style={{objectPosition:scene.focalPosition??"center",objectFit:scene.imageFit??"cover"}}/>
   <span className={styles.sceneVeil} aria-hidden="true"/>
   <span className={styles.sceneState} aria-label={visible?"Scene revealed":"Scene locked"}>{visible?<Sparkles/>:<LockKeyhole/>}</span>
   <span className={styles.sceneType}>{scene.type}</span>
  </div>
  <figcaption><small>{visible?"Story moment revealed":"Story moment undiscovered"}</small><p>{visible?scene.captionRevealed:scene.captionLocked}</p></figcaption>
 </figure>;
}
