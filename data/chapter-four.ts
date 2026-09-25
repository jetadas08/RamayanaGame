import type {Difficulty,JourneyNode,MasteryActivity,NarrativeContext} from "@/lib/types";

export const chapterFourNodeIds=["HJ-09","HJ-10","HJ-11"] as const;

export const trustThread=[
 {nodeId:"HJ-09",verb:"Assess",question:"Who in Laṅkā may be trustworthy?",resolution:"Signs become reliable through verification."},
 {nodeId:"HJ-10",verb:"Verify",question:"Is this truly Sītā?",resolution:"Converging evidence makes recognition credible."},
 {nodeId:"HJ-11",verb:"Prove",question:"How can Hanumān become trustworthy to Sītā?",resolution:"Object, message, and relationship agree."},
] as const;

export const chapterFourDesign={
 "HJ-09":{
  verb:"Assess",evidenceActivityId:"HJ09-EVIDENCE",minimumEvidence:2,
  decisionActivityId:"C4-HJ09-DECISION",correctDecision:"observe",
  prompt:"What should Hanumān do with these unusual signs?",
  feedback:{
   reveal:"You have noticed a positive sign, but is one sign enough to reveal the mission?",
   withdraw:"What evidence distinguishes him from the hostile figures Hanumān has already encountered?",
   approach:"A cautious approach may become appropriate, but first test whether the signs agree.",
   observe:"Patient observation protects the mission while allowing trust to become evidence-based.",
  },
  repairActivityId:"C4-HJ09-REPAIR",correctRepair:"second-sign",
  repairPrompt:"What would make the judgment safer?",
  verifiedTitle:"A possible ally—not an assumption",
  verifiedText:"The signs agree strongly enough for a cautious approach. In this Rāmacaritamānasa layer, Hanumān recognizes Vibhīṣaṇa as a dharmic presence within Laṅkā.",
 },
 "HJ-10":{
  verb:"Verify",evidenceActivityId:"HJ10-EVIDENCE",minimumEvidence:3,
  prelude:{hypothesisActivityId:"C4-HJ10-FIRST-HYPOTHESIS",evidenceSortActivityId:"C4-HJ10-MANDODARI-EVIDENCE",revisionActivityId:"C4-HJ10-REVISE-HYPOTHESIS"},
  decisionActivityId:"C4-HJ10-DECISION",correctDecision:"wait",
  prompt:"The clues point toward Sītā. Should Hanumān reveal himself immediately?",
  feedback:{
   immediate:"Hanumān may know his own intentions, but Sītā does not yet know who he is. What must he consider before approaching?",
   leave:"Uncertainty calls for more evidence, not abandonment of the person he has crossed the ocean to find.",
   wait:"He observes until identity and a safe approach are both credible. Patience protects the person he came to serve.",
  },
  repairActivityId:"C4-HJ10-REPAIR",correctRepair:"sita-perspective",
  repairPrompt:"From Sītā’s perspective, what is still unknown?",
  verifiedTitle:"The clues converge",
  verifiedText:"Condition, captivity, steadfast remembrance, and prior knowledge converge. Hanumān can recognize Sītā while still remaining hidden long enough to choose a safe approach.",
 },
 "HJ-11":{
  verb:"Prove",evidenceActivityId:null,minimumEvidence:0,
  decisionActivityId:"C4-HJ11-DECISION",correctDecision:"combined",
  prompt:"What makes an unknown messenger credible inside enemy territory?",
  feedback:{
   words:"What would make those words safer to trust in enemy territory?",
   ring:"The token is powerful, but what gives it meaning beyond the object itself?",
   combined:"A trusted source, recognizable sign, and consistent message reinforce one another.",
  },
  repairActivityId:null,correctRepair:null,repairPrompt:"",
  recallActivityId:"C4-HJ11-RECALL",correctRecall:"recognition",
  proofActivityId:"C4-HJ11-PROOF",
  verifiedTitle:"Carried trust becomes recognized proof",
  verifiedText:"Rāma’s ring, Hanumān’s consistent knowledge, and his careful message agree. Sītā can recognize the messenger and receive hope without being asked for blind trust.",
 },
} as const;

const options=(labels:string[])=>labels.map((label,index)=>({id:String.fromCharCode(97+index),label}));
const base=(node:JourneyNode,stage:Difficulty,prompt:string,explanation:string)=>({id:`MA-${node.id}-${stage}`,eventId:node.id,stage,prompt,hint:stage==="explorer"?"Recall the evidence you observed.":stage==="seeker"?"Consider what the other person knows at this moment.":"Transfer the chapter principle to a new situation.",explanation,sourceRefs:node.sourceLabels,unlocks:[],difficulty:stage,replayable:true,perspectives:["hanuman",...(node.characters.includes("Sītā")?["sita" as NarrativeContext]:[])] as NarrativeContext[],claimType:stage==="scholar"?"interpretation" as const:"textual" as const});

export function chapterFourMastery(node:JourneyNode,stage:Difficulty):MasteryActivity{
 if(node.id==="HJ-09"){
  if(stage==="explorer")return {...base(node,stage,"Which observation most clearly makes this figure worth assessing further?","Devotional conduct and speech associated with Rāma distinguish the figure from the hostile surroundings."),type:"singleSelect",options:options(["Conduct and speech associated with devotion to Rāma","Residence somewhere inside Laṅkā","Outward resemblance to the surrounding rākṣasas","Silence without any other sign"]),correctAnswer:"a"};
  if(stage==="seeker")return {...base(node,stage,"Why is one positive sign still not enough to reveal the full mission?","Trust begins with signs, but caution asks whether independent evidence supports the same reading."),type:"singleSelect",options:options(["A single sign may be misunderstood or imitated","No one in Laṅkā can ever be trustworthy","Hanumān has forgotten whom he serves","The mission requires open battle first"]),correctAnswer:"a"};
  return {...base(node,stage,"In hostile surroundings, one person behaves with unusual compassion. What should you seek before trusting them with vulnerable information?","Trust begins with signs, but becomes reliable through verification."),type:"multiSelect",options:[{id:"pattern",label:"A second independent action consistent with compassion"},{id:"cost",label:"Evidence that the person keeps that conduct when it carries a cost"},{id:"location",label:"Proof that the person lives in a friendly place"},{id:"appearance",label:"A reassuring appearance alone"}],correctState:["pattern","cost"]};
 }
 if(node.id==="HJ-10"){
  if(stage==="explorer")return {...base(node,stage,"What best describes Hanumān’s response to the first plausible candidate in the palace?","He treats the first impression as a hypothesis, checks it against the circumstances, and continues when the evidence does not fit."),type:"singleSelect",options:options(["He announces that the search is complete","He dismisses her without looking at the context","He briefly considers the possibility and continues checking","He decides appearance can never be useful evidence"]),correctAnswer:"c"};
  if(stage==="seeker")return {...base(node,stage,"Why does context outweigh the first resemblance?","A visible resemblance suggests a possibility, while the woman’s royal comfort and place within Rāvaṇa’s household contradict what Hanumān knows of Sītā’s captivity."),type:"singleSelect",options:options(["Several circumstances conflict with what Hanumān knows of Sītā","Beauty is never relevant to recognition","Anyone in a palace must belong to Rāvaṇa","The first impression is always wrong"]),correctAnswer:"a"};
  return {...base(node,stage,"A traveler recognizes a missing sacred object by its shape, but finds it in a workshop beside unfinished replicas. What is the sound next step?","The shape supports a hypothesis; the workshop context contradicts immediate certainty. Good judgment checks another independent feature and revises if needed."),type:"singleSelect",options:options(["Claim it immediately because the shape matches","Reject every similar object without inspection","Check an independent identifying mark and revise the conclusion if it conflicts","Ignore the workshop context because first impressions are strongest"]),correctAnswer:"c"};
 }
 if(stage==="explorer")return {...base(node,stage,"What was Rāma’s ring meant to do when Hanumān reached Sītā?","The ring carries a recognizable sign of Rāma and authenticates Hanumān’s role as messenger."),type:"singleSelect",options:options(["Make Rāma’s trust recognizable to Sītā","Grant Hanumān authority over Laṅkā","Open the gates of the city","Replace the need for a message"]),correctAnswer:"a"};
 if(stage==="seeker")return {...base(node,stage,"Arrange the proof so trust can grow rather than be demanded.","Hanumān approaches cautiously, establishes his connection to Rāma, presents the recognizable ring, and delivers the message of hope."),type:"sequence",items:[{id:"ring",label:"Present Rāma’s recognizable ring"},{id:"approach",label:"Speak cautiously from Sītā’s perspective"},{id:"message",label:"Deliver Rāma’s message and the next hope"},{id:"connection",label:"Establish knowledge consistent with Rāma and the mission"}],correctState:["approach","connection","ring","message"]};
 return {...base(node,stage,"A messenger arrives in dangerous territory. What makes the carried token credible?","Proof becomes trustworthy when object, message, and relationship agree."),type:"singleSelect",options:options(["Trusted source, recognizable sign, and a consistent message together","The object alone, without explanation","Confidence in the messenger’s voice alone","Secret knowledge alone, without a trusted relationship"]),correctAnswer:"a"};
}

export const chapterFourBasicMemories:Record<string,string>={
 "HJ-09":"Recognized a possible ally in Laṅkā",
 "HJ-10":"Found Sītā in Aśoka Vātikā",
 "HJ-11":"Gave Sītā Rāma’s Ring and carried her message onward",
};
export const chapterFourDeepMemories:Record<string,string>={
 "HJ-09":"Trust Requires Verification",
 "HJ-10":"Recognition Requires Patience",
 "HJ-11":"Proof Aligns Object, Message, and Relationship",
};
