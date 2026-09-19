import type {Difficulty,JourneyNode,MasteryActivity} from "@/lib/types";

const choice=(...labels:string[])=>labels.map((label,index)=>({id:String.fromCharCode(97+index),label}));

const scene=(id:string,image:string,caption:string,alt:string):JourneyNode["scene"]=>({
 imageLocked:image,imageRevealed:image,captionLocked:"The next responsibility is still taking shape.",captionRevealed:caption,
 altLocked:`Veiled scene: ${alt}`,altRevealed:alt,type:"Guidance",revealTrigger:{kind:"nodeComplete"},
 focalPosition:"center",imageFit:"cover",assetStatus:"final",replacementBasePath:`/images/journey/hanuman/${id}`,
});

export const searchNodes:JourneyNode[]=[
 {
  id:"HFS-01",slug:"southern-search-begins",number:1,title:"The Southern Search Begins",eyebrow:"A mission becomes a search plan",place:"Kiṣkindhā and the southern route",coordinates:{x:20,y:31},mapPosition:[76.2,14.1],confidence:"E",displayType:"route",
  excerpt:"Sugrīva sends the southern party to search for Sītā within a fixed time.",
  story:"Sugrīva organizes the search and sends Aṅgada, Jāmbavān, Hanumān, and the southern party toward the lands and coasts ahead. They know whom they seek and why. They do not yet know where Sītā is held or which witness will give the mission direction.",
  teaching:"A responsible search begins by separating evidence from assumption and naming what remains unknown.",
  characters:["Hanumān","Aṅgada","Jāmbavān","Sugrīva","Vanara search party"],unlocks:["Southern search route"],sourceLabels:["VR-GP","VR-HPS"],
  whyHere:{textual:"The southern party is commissioned to search the southern quarter.",modern:"The route spans a broad narrative region rather than one modern coordinate.",tradition:"Shown as a southward campaign route from Kiṣkindhā.",reason:"The story establishes direction and task; it does not establish a single defensible point."},
  challenge:{prompt:"What should the party distinguish before beginning its search?",choices:choice("What is known, assumed, and still unknown","Which warrior deserves the most praise","How a bridge will later be built"),answer:"a",explanation:"A sound search plan separates evidence from assumptions and open questions."},
  scene:scene("hfs-01","/images/campaign-map-atlas-v1.png","The search is organized toward the south.","An illustrated atlas of the southern route toward the coast."),
  completionTakeaway:"The search becomes a disciplined responsibility: carry what is known, question assumptions, and pursue what remains unknown.",nextNodeTeaser:"Rāma entrusts Hanumān with a sign that can make a future message recognizable.",
 },
 {
  id:"HFS-02",slug:"rama-entrusts-the-ring",number:2,title:"Rāma Entrusts the Ring",eyebrow:"Trust is made portable",place:"The southern search assembly",coordinates:{x:27,y:38},mapPosition:[76.8,12.7],confidence:"E",displayType:"narrative",
  excerpt:"Rāma gives Hanumān his ring so that Sītā can recognize the messenger and the message.",
  story:"Before the party departs, Rāma entrusts Hanumān with his ring. The object does not complete the search or reveal Sītā’s location. It carries identity and trust forward: if Hanumān reaches her, the ring can help his words become recognizable as Rāma’s message.",
  teaching:"A trusted object matters because of the relationship and purpose it carries, not because it acts by itself.",
  characters:["Hanumān","Rāma","Sugrīva","Aṅgada","Jāmbavān"],unlocks:["Rāma’s ring","Rāma entrusts Hanumān"],sourceLabels:["VR-GP","VR-HPS"],
  whyHere:{textual:"Rāma entrusts the token before the southern search proceeds.",modern:"The precise physical point is not asserted.",tradition:"Presented within the southern search commissioning sequence.",reason:"The narrative function of the token is strong; exact geography remains broad."},
  challenge:{prompt:"What does Rāma’s ring allow Hanumān to do?",choices:choice("Make his future message recognizable to Sītā","Know Sītā’s location immediately","Command every member of the search party"),answer:"a",explanation:"The ring carries identity and trust; it does not solve the search by itself."},
  activities:[{id:"HFS02-RING",type:"objectDiscovery",title:"A token of trust",objectId:"ramas-ring",prompt:"Reveal the object only after understanding why Rāma entrusts it to Hanumān.",sources:["VR-GP","VR-HPS"],claimType:"textualFact"}],
  scene:scene("hfs-02","/images/objects/ramas-ring.png","Rāma’s ring enters Hanumān’s care.","Rāma’s gold signet ring, entrusted to Hanumān as a token of identity and trust."),
  completionTakeaway:"The ring begins its journey from Rāma to Hanumān; its next recipient remains unknown until the search succeeds.",nextNodeTeaser:"The southern party reaches a shore where the search seems to have failed.",
 }
];

export const searchChapterNodes=(journeyNodes:JourneyNode[])=>[...searchNodes,...journeyNodes.slice(0,3)];
export const searchMemoryNames=["Evidence Before Assumption","Trust Made Portable","The Limit Named Clearly","Testimony Restores Direction","Capacity Becomes Commitment"];
export const searchMemories=[
 "The southern search begins by distinguishing what is known, assumed, and still unknown.",
 "Rāma’s ring carries identity and trust from Rāma to Hanumān before its destination is known.",
 "At the shore, the party names both the physical barrier and the loss of hope that blocks the mission.",
 "Sampāti’s testimony provides a source, a claim, and a new direction toward Laṅkā.",
 "Jāmbavān matches the mission’s needs with Hanumān’s remembered capacities, turning knowledge into a launch plan.",
];

const base=(node:JourneyNode,stage:Difficulty,prompt:string,explanation:string)=>({id:`MA-${node.id}-${stage}`,eventId:node.id,stage,prompt,hint:stage==="explorer"?"Begin with the evidence visible in this encounter.":stage==="seeker"?"Connect the evidence to the mission decision.":"Transfer the reasoning to a new search situation.",explanation,sourceRefs:node.sourceLabels,unlocks:stage==="scholar"?[searchMemoryNames[[...searchNodes.map(n=>n.id),"HJ-01","HJ-02","HJ-03"].indexOf(node.id)]]:[],difficulty:stage,replayable:true,perspectives:["hanuman" as const],claimType:(stage==="scholar"?"interpretation":"textual") as "textual"|"interpretation"});

export function searchMastery(node:JourneyNode,stage:Difficulty):MasteryActivity{
 const b=base(node,stage,"","");
 const single=(prompt:string,options:{id:string;label:string}[],answer:string,explanation:string):MasteryActivity=>({...b,prompt,explanation,type:"singleSelect",options,correctAnswer:answer});
 if(node.id==="HFS-01"){
  if(stage==="explorer")return single("Which statement is established when the southern search begins?",choice("Sītā is missing and must be found","Sītā is already known to be in Laṅkā","Hanumān must cross the ocean alone"),"a","The mission is known; the location and later means are not yet known.");
  if(stage==="seeker")return {...b,prompt:"Match each planning statement to its evidence status.",explanation:"The board distinguishes facts, working assumptions, and open questions.",type:"matching",pairs:[{id:"known",left:"Known",correct:"Sītā is missing"},{id:"assumed",left:"Assumed",correct:"The southern route may hold a clue"},{id:"unknown",left:"Unknown",correct:"Where Sītā is held"}],options:choice("Sītā is missing","The southern route may hold a clue","Where Sītā is held").map((v,i)=>({...v,id:["Sītā is missing","The southern route may hold a clue","Where Sītā is held"][i]})),correctState:{known:"Sītā is missing",assumed:"The southern route may hold a clue",unknown:"Where Sītā is held"}};
  return {...b,prompt:"Which habits make a search plan trustworthy? Select all that apply.",explanation:"A trustworthy search marks assumptions and preserves open questions while acting on evidence.",type:"multiSelect",options:choice("State what the evidence establishes","Mark assumptions as assumptions","Invent certainty to keep morale high","Name the unanswered question"),correctState:["a","b","d"]};
 }
 if(node.id==="HFS-02"){
  if(stage==="explorer")return {...b,prompt:"What functions can Rāma’s ring serve? Select all that apply.",explanation:"It authenticates Hanumān and carries trust; it neither locates Sītā nor guarantees the outcome.",type:"multiSelect",options:choice("Identify the messenger as Rāma’s envoy","Carry trust into a future meeting","Reveal Sītā’s location","Guarantee the mission succeeds"),correctState:["a","b"]};
  if(stage==="seeker")return single("Why is the ring meaningful before Sītā receives it?",choice("Rāma entrusts Hanumān to carry identity and proof","Its metal reveals a hidden route","It gives Hanumān royal command over Sugrīva"),"a","The object’s force is relational: Rāma entrusts Hanumān with recognizable proof.");
  return single("A messenger receives a sealed token. What should the learner infer first?",choice("The token authenticates a relationship or message","The token solves every obstacle ahead","The token proves the destination has already been reached"),"a","A token can authenticate a message without determining the entire journey.");
 }
 if(node.id==="HJ-01")return stage==="explorer"?single("What two barriers must the party name at the shore?",choice("The ocean and their loss of hope","A royal command and a hidden weapon","A storm and an enemy fleet"),"a","The shore reveals a physical barrier and a failure of confidence."):stage==="seeker"?single("What must the party learn before it can choose a route?",choice("Where Sītā is and what lies beyond the sea","How Rāma Setu will later be built","Who will rule Laṅkā after the war"),"a","A responsible next step needs direction and evidence, not a later solution imported into this moment."):single("When a team reaches a hard limit, what is the strongest first move?",choice("Name the barrier and identify the missing evidence","Pretend the barrier is unimportant","Choose a route without new information"),"a","Clear problem framing turns discouragement into a question that evidence can answer.");
 if(node.id==="HJ-02")return stage==="explorer"?single("What makes Sampāti’s statement actionable?",choice("He identifies Sītā in Laṅkā from far-reaching sight","He promises to carry the party across","He gives the party Rāma’s ring"),"a","His testimony supplies a claim, a basis, and a direction."):stage==="seeker"?single("How should the Search Board change after Sampāti speaks?",choice("Add testimony as evidence and direct the search toward Laṅkā","Replace every unknown with certainty","Remove the ocean as a physical barrier"),"a","Evidence updates direction while leaving the crossing problem open."):single("What is the best way to use a witness report in another search?",choice("Record the claim, its basis, and what decision it changes","Accept every detail without checking its basis","Ignore it unless it solves every remaining problem"),"a","Testimony becomes useful when its source and decision impact remain visible.");
 return stage==="explorer"?single("Which capacities match the mission at this moment?",choice("Reach, courage, judgment, and devotion","Royal birth, wealth, and an army","A bridge already built across the sea"),"a","Jāmbavān recalls the qualities the mission actually requires."):stage==="seeker"?single("What changes when Jāmbavān speaks to Hanumān?",choice("The party matches a known need with a capable messenger","The ocean disappears","Sītā’s exact condition becomes known"),"a","Guidance connects the mission’s needs to Hanumān’s remembered ability."):single("What makes a launch plan responsible?",choice("Evidence, direction, assigned capability, and a clear next action","Confidence without evidence","A destination without a messenger"),"a","The search becomes responsibility when the board supports a person and a next action.");
}

