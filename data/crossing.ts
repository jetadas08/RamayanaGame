import type {Difficulty,JourneyNode,MasteryActivity} from "@/lib/types";

export const crossingNodeIds=["HJ-04","HJ-05","HJ-06","HJ-07","HJ-08"] as const;
export const crossingNodes=(nodes:JourneyNode[])=>nodes.filter(node=>crossingNodeIds.includes(node.id as typeof crossingNodeIds[number]));

export const crossingMemoryNames=[
 "Commitment Becomes Motion",
 "Respect Without Delay",
 "Intelligence Preserves Strength",
 "Discernment Recognizes Danger",
 "Strength Becomes What Service Requires",
];
export const crossingMemories=[
 "Hanumān carries the Search Compass’s evidence, destination, token, and purpose into the leap toward Laṅkā.",
 "Hanumān honors Maināka’s hospitality without abandoning the urgency of Rāma’s mission.",
 "Hanumān answers Surasā’s escalating challenge with adaptability rather than wasted force.",
 "Hanumān distinguishes Siṃhikā’s predatory seizure from an offer or test and confronts the threat directly.",
 "Hanumān enters Laṅkā in a reduced form, showing that disciplined strength becomes exactly what the mission requires.",
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
 if(stage==="explorer")return single("What change prepares Hanumān to enter guarded Laṅkā?",["He deliberately reduces his form","He remains in the immense form used for the leap","He abandons concealment and summons the army"],"a","The crossing displayed immense power; entry begins with a smaller form suited to concealment.");
 if(stage==="seeker")return single("Why does Hanumān choose a reduced form before entering Laṅkā?",["To preserve secrecy and adapt his strength to the hidden search","Because crossing the ocean has left him powerless","To make Laṅkinī underestimate him before an open battle"],"a","His capability remains; restraint makes it fit a mission that now depends on secrecy and careful movement.");
 return single("A powerful rescuer can force a guarded entrance or use a quiet route that protects the people inside. Which principle best guides the choice?",["Use the least conspicuous and least forceful response that still fulfills the mission","Display maximum power so no one questions the rescuer’s strength","Choose the most dramatic route even if it exposes the mission","Avoid acting because restraint and capability cannot coexist"],"a","Proportionate power chooses the smallest effective response. Strength is disciplined when it becomes exactly what the mission requires.");
}

export const crossingTrailEntries=[
 {id:"HJ-04",title:"The Leap",appears:"An impossible distance",requires:"Commitment built from evidence, trust, and capability",response:"Commit",principle:"Purpose turns strength into movement"},
 {id:"HJ-05",title:"Maināka",appears:"An interruption in the route",requires:"Recognition of hospitality without delay",response:"Acknowledge",principle:"Respect without losing momentum"},
 {id:"HJ-06",title:"Surasā",appears:"A blocking escalation",requires:"A change of scale and method",response:"Adapt",principle:"Intelligence preserves strength"},
 {id:"HJ-07",title:"Siṃhikā",appears:"A loss of speed",requires:"Recognition of a predatory threat",response:"Confront",principle:"Some dangers must be overcome"},
 {id:"HJ-08",title:"Laṅkinī",appears:"A monumental gate guarded against a small messenger",requires:"Stealth, entry, and proportionality",response:"Reduce and enter",principle:"Small form, great capability"},
];
