import type {Difficulty,JourneyNode,MasteryActivity} from "@/lib/types";

export const crossingNodeIds=["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"] as const;
export const crossingNodes=(nodes:JourneyNode[])=>nodes.filter(node=>crossingNodeIds.includes(node.id as typeof crossingNodeIds[number]));

export const crossingMemoryNames=[
 "Commitment Becomes Motion",
 "Respect Without Delay",
 "Intelligence Preserves Strength",
 "Discernment Recognizes Danger",
 "Strength Joins Discernment",
];
export const crossingMemories=[
 "Hanumān commits the Search Board’s evidence, destination, token, and purpose to the leap toward Laṅkā.",
 "Hanumān honors Maināka’s hospitality without abandoning the urgency of Rāma’s mission.",
 "Hanumān answers Surasā’s escalating challenge with adaptability rather than wasted force.",
 "Hanumān distinguishes Siṃhikā’s predatory seizure from an offer or test and confronts the threat directly.",
 "Hanumān crosses Laṅkā’s guarded threshold with measured force, ready to exchange movement for concealment.",
];

const options=(...labels:string[])=>labels.map((label,index)=>({id:String.fromCharCode(97+index),label}));
// Keep the original mastery IDs stable so existing Chapter III saves retain their
// answered state while the activity content evolves.
const base=(node:JourneyNode,stage:Difficulty,prompt:string,explanation:string)=>({id:`MA-${node.id}-${stage}`,eventId:node.id,stage,prompt,hint:stage==="explorer"?"Identify the situation before choosing a response.":stage==="seeker"?"Explain which evidence makes the response fit.":"Transfer the response principle to a new situation.",explanation,sourceRefs:node.sourceLabels,unlocks:stage==="scholar"?[crossingMemoryNames[node.number-4]]:[],difficulty:stage,replayable:true,perspectives:["hanuman" as const],claimType:(stage==="scholar"?"interpretation":"textual") as "textual"|"interpretation"});

export function crossingMastery(node:JourneyNode,stage:Difficulty):MasteryActivity{
 const single=(prompt:string,labels:string[],answer:string,explanation:string):MasteryActivity=>({...base(node,stage,prompt,explanation),type:"singleSelect",options:options(...labels),correctAnswer:answer});
 if(node.id==="HJ-04"){
  if(stage==="explorer")return single("What begins when Hanumān leaves the southern shore?",["The committed mission toward Laṅkā","The later construction of Rāma Setu","A return journey to Kiṣkindhā"],"a","The leap begins the committed crossing toward the destination identified in the search.");
  if(stage==="seeker")return {...base(node,stage,"Match each launch condition to the role it serves.","Evidence gives direction, the ring carries trust, and Hanumān carries the mission."),type:"matching",pairs:[{id:"direction",left:"Sampāti’s testimony",correct:"Direction"},{id:"token",left:"Rāma’s ring",correct:"Trust"},{id:"messenger",left:"Hanumān",correct:"Capability"}],options:options("Direction","Trust","Capability").map((item,index)=>({...item,id:["Direction","Trust","Capability"][index]})),correctState:{direction:"Direction",token:"Trust",messenger:"Capability"}};
  return single("A courier must travel far, deliver a trusted message, adapt en route, and return. Which preparation matters most?",["Hold destination, purpose, proof, and return together","Prepare only for maximum speed","Assume every interruption is hostile","Leave the proof behind to travel lightly"],"a","Readiness joins purpose, evidence, trust, adaptability, and the responsibility to return.");
 }
 if(node.id==="HJ-05"){
  if(stage==="explorer")return single("What kind of interruption does Maināka’s behavior support?",["An offer of hospitality","A predatory attack","A demand to abandon Rāma"],"a","The interruption includes welcome and rest rather than predatory force.");
  if(stage==="seeker")return single("Why does Hanumān acknowledge Maināka without stopping?",["He preserves both respect and mission urgency","He believes every offer is a trap","He has forgotten the destination"],"a","Acknowledgement honors hospitality while continued movement protects the mission.");
  return single("A helper offers a long ceremony during an urgent rescue. Which response preserves respect and urgency?",["Thank them, accept the essential aid, and continue","Ignore them without explanation","Remain until every ceremony is complete","Treat the offer as an attack"],"a","Respect can be expressed without surrendering an urgent responsibility.");
 }
 if(node.id==="HJ-06"){
  if(stage==="explorer")return single("What does Surasā’s matching escalation reveal?",["Growing larger will not end the challenge","She is offering a place to rest","The destination has changed"],"a","Each increase is met by another increase, so escalation alone cannot resolve the test.");
  if(stage==="seeker")return single("Why does becoming small succeed where becoming larger does not?",["It fulfills the condition without wasting strength","It defeats Surasā through greater violence","It ends the mission and returns home"],"a","Adaptability satisfies the demand and preserves energy for the mission.");
  return single("A locked passage grows harder each time force is applied, but a narrow opening remains. What principle should guide the response?",["Change scale or method instead of escalating force","Apply the same force for longer","Abandon the destination","Assume the opening is irrelevant"],"a","When the obstacle mirrors escalation, adaptation can preserve strength and purpose.");
 }
 if(node.id==="HJ-07"){
  if(stage==="explorer")return single("Which evidence most clearly distinguishes Siṃhikā from the earlier encounters?",["She seizes movement through Hanumān’s shadow","She offers rest with welcoming signs","She matches growth as part of a test"],"a","The involuntary loss of movement and predatory seizure identify a direct threat.");
  if(stage==="seeker")return {...base(node,stage,"Match each ocean encounter to the response its evidence required.","The same traveler responds differently because the situations are different."),type:"matching",pairs:[{id:"mainaka",left:"Maināka",correct:"Acknowledge"},{id:"surasa",left:"Surasā",correct:"Adapt"},{id:"simhika",left:"Siṃhikā",correct:"Confront"}],options:options("Acknowledge","Adapt","Confront").map((item,index)=>({...item,id:["Acknowledge","Adapt","Confront"][index]})),correctState:{mainaka:"Acknowledge",surasa:"Adapt",simhika:"Confront"}};
  return single("Which new obstacle most clearly justifies direct confrontation?",["A predator forcibly drags the traveler away from the mission","A host offers optional shelter","A gate presents a solvable riddle","A witness asks for clarification"],"a","Direct confrontation is justified by active predatory harm, not mere interruption or difficulty.");
 }
 if(stage==="explorer")return single("What must Hanumān preserve at Laṅkā’s guarded threshold?",["Entry, secrecy, and proportionate force","Maximum destruction before entering","A public announcement of his arrival"],"a","The next phase requires entry without sacrificing the hidden search.");
 if(stage==="seeker")return {...base(node,stage,"Place the crossing responses in the order Hanumān demonstrates them.","Commitment is refined by acknowledgement, adaptation, confrontation, and measured entry."),type:"sequence",items:[{id:"adapt",label:"Adapt to the test"},{id:"commit",label:"Commit to the leap"},{id:"measure",label:"Use measured force at the threshold"},{id:"acknowledge",label:"Acknowledge hospitality"},{id:"confront",label:"Confront the predatory threat"}],correctState:["commit","acknowledge","adapt","confront","measure"]};
 return {...base(node,stage,"Which qualities complete the crossing? Select all that apply.","Strength succeeds because mission focus, adaptability, discernment, and proportionate response tell it how to act."),type:"multiSelect",options:options("Strength","Mission focus","Adaptability","Discernment","Maximum force in every encounter"),correctState:["a","b","c","d"]};
}

export const crossingTrailEntries=[
 {id:"HJ-04",title:"The Leap",appears:"An impossible distance",requires:"Commitment built from evidence, trust, and capability",response:"Commit",principle:"Purpose turns strength into movement"},
 {id:"HJ-05",title:"Maināka",appears:"An interruption in the route",requires:"Recognition of hospitality without delay",response:"Acknowledge",principle:"Respect without losing momentum"},
 {id:"HJ-06",title:"Surasā",appears:"A blocking escalation",requires:"A change of scale and method",response:"Adapt",principle:"Intelligence preserves strength"},
 {id:"HJ-07",title:"Siṃhikā",appears:"A loss of speed",requires:"Recognition of a predatory threat",response:"Confront",principle:"Some dangers must be overcome"},
 {id:"HJ-08",title:"Laṅkinī",appears:"A guardian at the threshold",requires:"Entry, secrecy, and proportionality",response:"Interpret",principle:"Measured force opens the hidden mission"},
];
