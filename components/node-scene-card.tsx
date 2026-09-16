import Image from "next/image";
import {LockKeyhole,Sparkles} from "lucide-react";
import type {NodeSceneDefinition} from "@/lib/types";
import styles from "@/components/journey.module.scss";

export function NodeSceneCard({scene,revealed,priority=false}:{scene:NodeSceneDefinition;revealed:boolean;priority?:boolean}){
 return <figure className={styles.sceneCard} data-revealed={revealed}>
  <div className={styles.sceneImages}>
   <Image className={styles.sceneImageLocked} src={scene.imageLocked} alt={revealed?"":scene.altLocked} fill priority={priority} sizes="(max-width: 760px) calc(100vw - 3.4rem), (max-width: 1200px) 36vw, 430px" style={{objectPosition:scene.focalPosition??"center",objectFit:scene.imageFit??"cover"}}/>
   <Image className={styles.sceneImageRevealed} src={scene.imageRevealed} alt={revealed?scene.altRevealed:""} fill priority={priority} sizes="(max-width: 760px) calc(100vw - 3.4rem), (max-width: 1200px) 36vw, 430px" style={{objectPosition:scene.focalPosition??"center",objectFit:scene.imageFit??"cover"}}/>
   <span className={styles.sceneVeil} aria-hidden="true"/>
   <span className={styles.sceneState} aria-label={revealed?"Scene revealed":"Scene locked"}>{revealed?<Sparkles/>:<LockKeyhole/>}</span>
   <span className={styles.sceneType}>{scene.type}</span>
  </div>
  <figcaption><small>{revealed?"Story moment revealed":"Story moment undiscovered"}</small><p>{revealed?scene.captionRevealed:scene.captionLocked}</p></figcaption>
 </figure>;
}
