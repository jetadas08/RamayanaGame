'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,Check,LockKeyhole,Star} from 'lucide-react';
import {herbsNodes} from '@/data/herbs';
import {warNodes} from '@/data/war';
import {useProgress} from '@/components/progress-provider';
import {canEnterNode,nodeMastery} from '@/lib/progress';
import {encounterHref} from '@/lib/journey-navigation';
import styles from './herbs-map.module.scss';
import {MobileEncounterShortcut} from "@/components/mobile-encounter-shortcut";

const positions=[[74,72],[67,18],[85,77]];

export function HerbsMap({onBack}:{onBack:()=>void}){
 const {progress}=useProgress();
 const [selected,setSelected]=useState(Math.min(progress.herbsCompletedNodes.length,herbsNodes.length-1));
 const [accuracy,setAccuracy]=useState(false);
 const accuracyTriggerRef=useRef<HTMLButtonElement>(null),accuracyHeadingRef=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(accuracy)requestAnimationFrame(()=>accuracyHeadingRef.current?.focus());},[accuracy]);
 function closeAccuracy(){setAccuracy(false);requestAnimationFrame(()=>accuracyTriggerRef.current?.focus());}
 const node=herbsNodes[selected],complete=progress.herbsCompletedNodes.includes(node.id);
 const stars=herbsNodes.reduce((sum,item)=>sum+nodeMastery(progress,item).filter(Boolean).length,0);
 const priorChapterComplete=progress.warCompletedNodes.length===warNodes.length;
 return <main className={`page-shell ${styles.page}`}>
  <button className={styles.back} onClick={onBack}><ArrowLeft size={16}/>Campaign Map</button>
  <header><p className="eyebrow">Chapter VII · Yuddha Kāṇḍa</p><h1 className="page-title">The Mountain of Herbs</h1><p>Strength becomes lifesaving service.</p><span>{progress.herbsCompletedNodes.length} / {herbsNodes.length} encounters · {stars} / {herbsNodes.length*3} stars</span></header>
  <MobileEncounterShortcut id={herbsNodes[Math.min(progress.herbsCompletedNodes.length,herbsNodes.length-1)].id} title={herbsNodes[Math.min(progress.herbsCompletedNodes.length,herbsNodes.length-1)].title} href={canEnterNode(progress,herbsNodes[Math.min(progress.herbsCompletedNodes.length,herbsNodes.length-1)])?encounterHref(herbsNodes[Math.min(progress.herbsCompletedNodes.length,herbsNodes.length-1)].slug,"chapter","HC-07"):undefined}/><section className={styles.atlas} aria-label="The Mountain of Herbs chapter map">
   <Image src="/images/campaign-map-atlas-v1.png" alt="Painted India and Laṅkā with a broad northern mountain region" fill priority sizes="100vw"/><p className={styles.north}>Northern medicinal mountain<br/><small>Narrative destination</small></p><p className={styles.south}>Laṅkā · battlefield</p>
   <button className={styles.accuracy} ref={accuracyTriggerRef} aria-expanded={accuracy} onClick={()=>setAccuracy(value=>!value)}>Why here?</button>
   <svg viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true"><path className={styles.firstRoute} d="M740 547 Q930 305 670 137 Q510 310 740 547"/><path className={styles.secondRoute} d="M850 585 Q1030 320 690 150 Q600 370 850 585"/></svg>
   {herbsNodes.map((item,index)=>{const available=canEnterNode(progress,item),content=progress.herbsCompletedNodes.includes(item.id)?<Check/>:available?index+1:<LockKeyhole/>,style={left:`${positions[index][0]}%`,top:`${positions[index][1]}%`};return available?<Link key={item.id} className={styles.pin} style={style} href={encounterHref(item.slug,'chapter','HC-07')} aria-label={`Enter ${item.title}`} data-complete={progress.herbsCompletedNodes.includes(item.id)}>{content}</Link>:<button key={item.id} className={styles.pin} style={style} aria-label={`${item.id}: ${item.title} · Locked`} aria-pressed={selected===index} onClick={()=>setSelected(index)}>{content}</button>;})}
   {accuracy&&<aside className={styles.accuracyPanel}><button onClick={closeAccuracy}>Close</button><h3 ref={accuracyHeadingRef} tabIndex={-1}>{node.title}</h3><p>{node.whyHere.textual}</p><p>{node.whyHere.modern}</p><p>{node.whyHere.tradition}</p></aside>}
  </section>
  <div className={styles.legend}><span><i/>First mission · Jāmbavān · Yuddha 74</span><span><b/>Second mission · Suṣeṇa · Yuddha 101</span></div>
  <p className={styles.note}>These routes convey two story journeys, not surveyed flight paths. No modern medicinal peak is asserted.</p>
  <nav className={styles.nodes} aria-label="The Mountain of Herbs encounters">{herbsNodes.map((item,index)=><button key={item.id} aria-pressed={selected===index} onClick={()=>setSelected(index)}><small>{item.id} · {index<2?'First medicinal mission':'Later, second medicinal mission'}</small><strong>{item.title}</strong><span>{nodeMastery(progress,item).map((earned,star)=><Star key={star} size={15} fill={earned?'currentColor':'none'}/>)}</span></button>)}</nav>
  <article className={styles.info}><Image src={complete?node.scene.imageRevealed:node.scene.imageLocked} width={240} height={135} alt=""/><div><p className="eyebrow">{node.id}</p><h2>{node.title}</h2><p>{node.excerpt}</p></div>{canEnterNode(progress,node)?<Link className="cta-primary" href={encounterHref(node.slug,"chapter","HC-07")}>{complete?'Review encounter':'Enter encounter'} →</Link>:<p>Complete {priorChapterComplete?'the preceding encounter':'Chapter VI'} to continue.</p>}</article>
  {progress.herbsCompletedNodes.length===herbsNodes.length&&<article className={styles.info}><div><p className="eyebrow">You completed Chapter VII</p><h2>Mission Fulfilled is now unlocked</h2><p>Strength becomes lifesaving service.</p></div><Link className="cta-primary" href="/journey/hanuman/chapters/mission-fulfilled">Continue to Chapter VIII →</Link></article>}
 </main>;
}
