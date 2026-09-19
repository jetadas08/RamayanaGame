'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowLeft,Check,LockKeyhole,Star} from 'lucide-react';
import {warNodes} from '@/data/war';
import {journeyNodes} from '@/data/journey';
import {useProgress} from '@/components/progress-provider';
import {canEnterNode,nodeMastery} from '@/lib/progress';
import styles from './war-map.module.scss';

const positions=[[32,49],[44,34],[60,42],[76,49],[82,65],[73,81]];

export function WarMap({onBack}:{onBack:()=>void}){
 const {progress}=useProgress();
 const [selected,setSelected]=useState(Math.min(progress.warCompletedNodes.length,warNodes.length-1));
 const [accuracy,setAccuracy]=useState(false);
 const node=warNodes[selected],complete=progress.warCompletedNodes.includes(node.id);
 const stars=warNodes.reduce((sum,item)=>sum+nodeMastery(progress,item).filter(Boolean).length,0);
 const legacyChapterComplete=progress.completedNodes.length===journeyNodes.length;
 return <main className={`page-shell ${styles.page}`}>
  <button className={styles.back} onClick={onBack}><ArrowLeft size={16}/>Campaign Map</button>
  <header><p className="eyebrow">Chapter VI · Yuddha Kāṇḍa</p><h1 className="page-title">The War</h1><p>Service becomes responsibility for an entire army.</p><span>{progress.warCompletedNodes.length} / {warNodes.length} encounters · {stars} / {warNodes.length*3} stars</span></header>
  <section className={styles.atlas} aria-label="The War chapter map">
   <Image src="/images/atlas-base-v3.png" alt="Illustrated southern India and Laṅkā, used as a broad narrative setting" fill priority sizes="100vw"/><h2>From report to rescue</h2>
   <button className={styles.accuracy} aria-expanded={accuracy} onClick={()=>setAccuracy(value=>!value)}>Why here?</button>
   <svg viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true"><path className={styles.leap} d="M380 450 Q540 660 720 560"/><path className={styles.setu} d="M460 290 Q580 270 735 350"/><path className={styles.land} d="M760 370 Q875 500 730 615"/></svg>
   {warNodes.map((item,index)=><button key={item.id} className={styles.pin} style={{left:`${positions[index][0]}%`,top:`${positions[index][1]}%`}} aria-label={`${item.id}: ${item.title}${canEnterNode(progress,item)?'':' · Locked'}`} aria-pressed={selected===index} data-complete={progress.warCompletedNodes.includes(item.id)} onClick={()=>setSelected(index)}>{progress.warCompletedNodes.includes(item.id)?<Check/>:canEnterNode(progress,item)?index+1:<LockKeyhole/>}</button>)}
   {accuracy&&<aside className={styles.accuracyPanel}><h3>{node.title}</h3><p>{node.whyHere.textual}</p><p>{node.whyHere.modern}</p><p>{node.whyHere.tradition}</p><p>Markers indicate story regions and sequence, not surveyed positions.</p><button onClick={()=>setAccuracy(false)}>Close</button></aside>}
  </section>
  <div className={styles.legend}><span><i/>Earlier solitary leap · Sundara Kāṇḍa</span><span><b/>Later Setu / army crossing · Yuddha Kāṇḍa</span></div>
  <p className={styles.note}>Nala is the bridge-maker. Rāmeśvaram / Adam’s Bridge provides traditional and modern context, not proof of the textual route.</p>
  <nav className={styles.nodes} aria-label="The War encounters">{warNodes.map((item,index)=><button key={item.id} aria-pressed={selected===index} onClick={()=>setSelected(index)}><small>{item.id}</small><strong>{item.title}</strong><span>{nodeMastery(progress,item).map((earned,star)=><Star key={star} size={15} fill={earned?'currentColor':'none'}/>)}</span></button>)}</nav>
  <article className={styles.info}><Image src={complete?node.scene.imageRevealed:node.scene.imageLocked} width={240} height={135} alt=""/><div><p className="eyebrow">{node.id}</p><h2>{node.title}</h2><p>{node.excerpt}</p></div>{canEnterNode(progress,node)?<Link className="cta-primary" href={`/journey/hanuman/${node.slug}`}>{complete?'Review encounter':'Enter encounter'} →</Link>:<p>Complete {legacyChapterComplete?'the preceding encounter':'Chapter V'} to continue.</p>}</article>
  {progress.warCompletedNodes.length===warNodes.length&&<article className={styles.info}><div><p className="eyebrow">You completed Chapter VI</p><h2>The Mountain of Herbs is now unlocked</h2><p>Jāmbavān’s guidance opens the next lifesaving mission.</p></div><Link className="cta-primary" href="/journey/hanuman/chapters/mountain-of-herbs">Continue to Chapter VII →</Link></article>}
 </main>;
}
