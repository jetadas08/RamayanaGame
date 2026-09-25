import type {SourceId,SourceReference} from "@/lib/types";

type ApprovedSetuQuote={
 source:SourceId;
 tradition:string;
 edition:string;
 locator:string;
 original:string;
 romanization?:string;
 english:string;
 reference:SourceReference;
};

// Only these short excerpts passed the original-page, line-level proof in Bhakti Pass 2C.
export const approvedSetuQuotes:readonly ApprovedSetuQuote[]=[
 {
  source:"VR-GP",
  tradition:"Vālmīki Rāmāyaṇa",
  edition:"Gita Press · Part II",
  locator:"Yuddha Kāṇḍa 22:48 · printed p. 369",
  original:"अहं सेतुं करिष्यामि विस्तीर्णे मकरालये।",
  english:"I shall build a bridge over the extensive deep (the abode of alligators).",
  reference:{source:"VR-GP",claimType:"textualFact",summary:"Nala offers to build the bridge; this is a short excerpt, not the full verse or translation.",locator:"Yuddha Kāṇḍa 22:48, printed p. 369",verification:"verifiedPassage"},
 },
 {
  source:"RCM-GP",
  tradition:"Rāmacaritamānasa",
  edition:"Gita Press · Romanized English edition",
  locator:"Laṅkā Kāṇḍa, doha 3, first line · printed p. 827",
  original:"श्री रघुबीर प्रताप ते सिंधु तरे पाषान।",
  romanization:"śrī raghubīra pratāpa te siṁdhu tare pāṣāna,",
  english:"It was by the glory of Śrī Rāma (the Hero of Raghu’s line) that rocks floated on the ocean.",
  reference:{source:"RCM-GP",claimType:"textualFact",summary:"The doha attributes the floating rocks to Rāma's glory; this is its first line only.",locator:"Laṅkā Kāṇḍa, doha 3, first line, printed p. 827",verification:"verifiedPassage"},
 },
];

export const mandodariSourceContext={
 source:"VR-GP" as const,
 edition:"Gita Press · Part II",
 locator:"Sundara Kāṇḍa 10:50–54, printed pp. 78–79; 11:1–4, printed p. 79",
 claimType:"textualFact" as const,
 verification:"verifiedPassage" as const,
 paraphrase:"Hanumān first considers whether the adorned woman asleep in Rāvaṇa’s palace is Sītā. He reconsiders when her circumstances do not fit, then continues the search. The woman is Mandodarī.",
};
