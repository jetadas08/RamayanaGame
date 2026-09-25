import type {JourneyProgressState,SourceId} from "@/lib/types";

// Editorial reflections on experienced story events, not quotations or new source claims.
// Citation readiness mirrors the current encounter catalog and must not be upgraded here.
export type BhaktiPassOneItem={
 id:string;
 encounterId:string;
 chapterId:string;
 placement:"sacredObject"|"storyClosing"|"finale";
 unlock:"objectDiscovered"|"storyComplete"|"encounterComplete";
 claimType:"learningInterpretation";
 source:SourceId;
 verification:"planningReference"|"pendingEditionAudit";
 edition:"Gita Press — passage check pending";
 locator:string;
 spoilerGate:string;
 editorialOwner:"Bhakti Pass 1";
 exactQuote:false;
 text:string;
};

export const bhaktiPassOne={
 ringEntrusted:{id:"ring-entrusted",encounterId:"HFS-02",chapterId:"HC-02",placement:"sacredObject",unlock:"objectDiscovered",claimType:"learningInterpretation",source:"VR-GP",verification:"planningReference",edition:"Gita Press — passage check pending",locator:"Kiṣkindhā 44, provisional",spoilerGate:"HFS-02 object discovery",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"Before Hanumān knows where Sītā is, Rāma trusts him to carry a sign she may recognize."},
 strengthRemembered:{id:"strength-remembered",encounterId:"HJ-03",chapterId:"HC-02",placement:"storyClosing",unlock:"encounterComplete",claimType:"learningInterpretation",source:"VR-GP",verification:"planningReference",edition:"Gita Press — passage check pending",locator:"Kiṣkindhā 65–67, provisional",spoilerGate:"HJ-03 completion",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"Jāmbavān’s words turn Hanumān’s remembered strength toward someone else’s need."},
 purposefulLeap:{id:"purposeful-leap",encounterId:"HJ-04",chapterId:"HC-03",placement:"storyClosing",unlock:"encounterComplete",claimType:"learningInterpretation",source:"VR-GP",verification:"planningReference",edition:"Gita Press — passage check pending",locator:"Sundara 1, provisional",spoilerGate:"HJ-04 completion",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"Hanumān crosses not to display his strength, but to answer the need waiting beyond the sea."},
 sitaFound:{id:"sita-found",encounterId:"HJ-10",chapterId:"HC-04",placement:"storyClosing",unlock:"encounterComplete",claimType:"learningInterpretation",source:"VR-GP",verification:"planningReference",edition:"Gita Press — passage check pending",locator:"Sundara 10, 14–17, provisional",spoilerGate:"HJ-10 completion",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"He has found Sītā. His first service to her is patience: he waits until his presence can bring hope rather than fear."},
 ringReceived:{id:"ring-received",encounterId:"HJ-11",chapterId:"HC-04",placement:"sacredObject",unlock:"storyComplete",claimType:"learningInterpretation",source:"VR-GP",verification:"planningReference",edition:"Gita Press — passage check pending",locator:"Sundara 35–40, provisional",spoilerGate:"HJ-11 story revealed",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"The ring is no longer only a promise carried forward; in Sītā’s hands it helps her recognize Rāma’s messenger."},
 cudamaniEntrusted:{id:"cudamani-entrusted",encounterId:"HJ-11",chapterId:"HC-04",placement:"storyClosing",unlock:"storyComplete",claimType:"learningInterpretation",source:"VR-GP",verification:"planningReference",edition:"Gita Press — passage check pending",locator:"Sundara 35–40, provisional",spoilerGate:"HJ-11 story interaction complete",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"Sītā entrusts Hanumān with her answer. The jewel carries her own voice into the return journey."},
 missionFulfilled:{id:"mission-fulfilled",encounterId:"HFF-04",chapterId:"HC-08",placement:"finale",unlock:"encounterComplete",claimType:"learningInterpretation",source:"VR-GP",verification:"pendingEditionAudit",edition:"Gita Press — passage check pending",locator:"Yuddha 127–128, provisional",spoilerGate:"HFF-04 completion",editorialOwner:"Bhakti Pass 1",exactQuote:false,text:"Hanumān has served as envoy, seeker, warrior, and rescuer. The journey is whole without claiming Rāma’s victory as his own."},
} as const satisfies Record<string,BhaktiPassOneItem>;

export function ringBhaktiReflection(progress:Pick<JourneyProgressState,"completedNodes"|"revealedScenes">,discovered:boolean){
 if(!discovered)return null;
 return progress.revealedScenes.includes("HJ-11")||progress.completedNodes.includes("HJ-11")?bhaktiPassOne.ringReceived:bhaktiPassOne.ringEntrusted;
}
