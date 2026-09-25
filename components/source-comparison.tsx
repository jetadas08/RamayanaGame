import type {JourneyNode} from "@/lib/types";
import styles from "@/components/journey.module.scss";
import {ramayanaEventById} from "@/data/hanuman-campaign";
import {approvedSetuQuotes,mandodariSourceContext} from "@/data/bhakti-pass-two";
import {publicSourceState,sourceReadiness} from "@/lib/source-readiness";
export function SourceStatusLine({node}:{node:JourneyNode}){
 const readiness=sourceReadiness(ramayanaEventById[node.id]?.sourceRefs??[]);
 return <p>Primary narrative: Vālmīki Rāmāyaṇa. {publicSourceState(readiness)}. Commentary and later devotional recognition accounts are kept separate from the playable factual spine.</p>;
}
export function SourceComparison({node,compact=false}:{node:JourneyNode;compact?:boolean}){
 if(node.id==="HFW-03")return <details className={styles.setuComparison}>
  <summary>Compare traditions · the Setu</summary>
  <div className={styles.setuComparisonBody}>
   <p>Two Gita Press tellings of the later army crossing place emphasis differently.</p>
   {approvedSetuQuotes.map(quote=><section key={quote.source} className={styles.setuSource} aria-label={quote.tradition}>
    <h3>{quote.tradition}</h3>
    <p lang={quote.source==="VR-GP"?"sa":"awa"} className={styles.setuOriginal}>{quote.original}</p>
    {quote.romanization&&<p lang="awa-Latn" className={styles.setuRomanization}>{quote.romanization}</p>}
    <blockquote lang="en">{quote.english}</blockquote>
    <cite>{quote.edition} · {quote.locator}</cite>
   </section>)}
   <p className={styles.setuContext}>Nala’s bridge-making and Rāma’s glory are distinct emphases. Both passages concern the army’s later crossing; Hanumān’s earlier solitary leap is separate. Neither approved passage says Rāma’s name was written on the stones.</p>
  </div>
 </details>;
 if(node.id==="HJ-10")return <section className={styles.compactSources}>
  <h3>Source context · the first inference</h3>
  <p>{mandodariSourceContext.paraphrase}</p>
  <p className={styles.note}>Vālmīki Rāmāyaṇa · {mandodariSourceContext.edition} · {mandodariSourceContext.locator}. This is a paraphrase of the verified passage.</p>
 </section>;
 const refs=ramayanaEventById[node.id]?.sourceRefs??[];
 const readiness=sourceReadiness(refs);
 const vrVerified=refs.find(ref=>ref.source==="VR-GP")?.verification==="verifiedPassage";
 const special=node.id==="HJ-09"?"This early meeting with Vibhīṣaṇa belongs to Rāmacaritamānasa. Do not read it as the same sequence in Vālmīki.":node.id==="HJ-12"?"Vālmīki gives the six-stage battle escalation. Rāmacaritamānasa condenses the action, emphasizing Akṣaya and Meghanāda.":node.id==="HJ-08"?"Both tellings present Hanumān reducing his form before entering Laṅkā. Rāmacaritamānasa adds the specific image of a form as small as a gnat; Vālmīki describes a reduced form suited to concealed entry at night.":node.id==="HJ-07"?"The RCM passage describes a shadow-catching demoness; the Vālmīki layer supplies the name Siṃhikā.":"Read the textual event separately from the learning interpretation and the modern place association.";
 const content=<><p>{special}</p><p className={styles.note}>{publicSourceState(readiness)}. Story can be explored while edition-level citations are reviewed.</p><div className={styles.grid}>
 <section><h3>Vālmīki Rāmāyaṇa · Preferred edition</h3><p>{vrVerified?"Gita Press Vālmīki Rāmāyaṇa. This passage has been checked against the approved edition.":"Gita Press Vālmīki Rāmāyaṇa. Edition-specific page and verse matching remains pending; no exact quotation is claimed."}</p><a href="https://archive.org/details/valmiki-ramayana-part-2" target="_blank" rel="noreferrer">Open Part 2 ↗</a></section>
 <section><h3>Rāmacaritamānasa · Devotional telling</h3><p>{node.id==="HJ-10"?"The Mandodarī false-positive sequence is not attributed to the current RCM source layer. The later Sītā encounter retains its existing cross-tradition record.":node.id==="HJ-08"?"Rāmacaritamānasa describes Hanumān assuming a form ‘as small as a gnat’ — masaka samāna rūpa kapi dharī — before approaching Laṅkā and meeting Laṅkinī.":node.sourceLabels.includes("RCM-GP")?"Included in the approved RCM comparison layer. Exact uploaded-edition locator is pending recovery of the source artifact.":"Not attributed to RCM in this node’s current source record."}</p></section>
 <section><h3>Vālmīki Rāmāyaṇa · English comparison</h3><p>{node.id==="HJ-09"?"This early meeting is not treated as a shared Vālmīki event.":node.id==="HJ-08"?"Before entering Laṅkā at night, Hanumān reduces his size to a form suited to concealment. The current record does not impose the RCM’s exact gnat comparison on this layer.":`Working episode: ${node.title}. ${node.number<4?"Kiṣkindhā Kāṇḍa":"Sundara Kāṇḍa"}; passage reference awaiting edition audit.`}</p><a href="https://archive.org/details/ssvm_ramayana-of-valmiki-translated-by-hari-prasad-shastri-english-1952" target="_blank" rel="noreferrer">Open Shastri edition ↗</a></section>
 <section><h3>Later place tradition</h3><p>{node.whyHere.tradition} {node.whyHere.reason}</p></section></div><p className={styles.note}>Story: narrative paraphrase · Deeper meaning: learning interpretation · Challenges and map layout: game adaptation. Source badges identify editorial layers, not completed verse-level verification.</p><a href="#encounter-title">Return to {node.title} ↑</a></>;
 return compact?<section className={styles.compactSources}><h3>Compare traditions</h3>{content}</section>:<details className={styles.panel}><summary>Compare traditions</summary>{content}</details>;
}
