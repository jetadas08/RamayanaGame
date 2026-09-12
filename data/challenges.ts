import {journeyNodes} from "@/data/journey";
import type { Challenge, Difficulty, JourneyNode } from "@/lib/types";

const reasons = [
 ["What restores direction after the shore of decision?","Sampāti’s information about Sītā","A new army from Laṅkā","Knowledge creates a concrete next step when hope has failed."],
 ["Why is Sampāti important despite his age?","His sight supplies knowledge the searchers lack","He carries the entire army across the sea","Capacity can remain useful even when bodily strength has diminished."],
 ["How does guidance change Hanumān’s response?","He recognizes his existing capacity","He receives a new magical weapon","Jāmbavān recalls Hanumān’s powers rather than creating them."],
 ["Why is Hanumān’s leap more than a display of physical strength?","It directs his recovered power toward Rāma’s purpose","It is performed to win praise from the Vanaras","His strength matters because it is gathered and offered in service of the mission."],
 ["How does Hanumān combine courtesy and resolve?","He acknowledges Maināka and continues","He treats every offer as an attack","Respect need not mean abandoning a commitment."],
 ["What distinguishes Surasā from Siṃhikā?","Surasā tests; Siṃhikā attacks","Both must be answered in the same way","The same response does not suit a divine test and a predatory threat."],
 ["Why does Hanumān act firmly here?","The shadow-catching is a hostile threat","Siṃhikā offers him rest","Discernment recognizes the encounter’s nature before selecting a response."],
 ["What does the guardian encounter signal?","The mission has crossed into Laṅkā","The search for Sītā is already complete","Entry opens a new search phase; it does not finish the mission."],
 ["What does Hanumān’s meeting with Vibhīṣaṇa show in the Rāmacaritamānasa telling?","Dharma can remain alive within a corrupted kingdom","Everyone within Laṅkā shares Rāvaṇa’s choices","The tradition-specific meeting presents Vibhīṣaṇa as evidence that surroundings do not determine the heart."],
 ["Why does Hanumān initially remain hidden after finding Sītā?","To observe carefully and avoid frightening her","Because he has forgotten Rāma’s mission","Hanumān must confirm what he sees and choose a sensitive approach before speaking to Sītā."],
 ["Why does recognition matter to the message?","The ring establishes personal trust","The ring grants Hanumān political authority","A token connects the messenger’s words to the person who sent him."],
 ["How do the battle accounts differ?","Vālmīki expands the sequence; RCM condenses it","RCM lists every commander in the same sequence","Keep the full six-stage escalation within the Vālmīki layer."],
 ["What alternative does the messenger offer?","Return Sītā and avoid ruin","A contest for Rāvaṇa’s crown","The counsel offers a way to avert the conflict."],
 ["What is the causal reversal in the burning?","Punishment becomes a means of warning","A voluntary gift becomes a reward","The fire intended to humiliate the messenger is turned upon the city."],
 ["When is the messenger’s mission complete?","When Sītā’s news is carried faithfully to Rāma","As soon as he leaves the island","The return and report complete the transmission of knowledge and hope."],
] as const;

const missionInsights=[
 ["The crisis at the shore establishes why reliable knowledge and renewed resolve are needed.","The stalled search becomes the threshold for the discoveries and courage that follow."],
 ["Sampāti changes a directionless search into a mission with a known destination.","His information about Sītā in Laṅkā gives the Vanaras a concrete purpose."],
 ["Jāmbavān’s guidance prepares Hanumān to undertake the crossing that no one else can complete.","Remembered capacity becomes the means by which the search can continue."],
 ["The leap begins the direct passage from searching in Bhārata to seeking Sītā in Laṅkā.","Hanumān turns renewed confidence into purposeful action."],
 ["Hanumān protects the mission’s urgency while still honoring Maināka’s hospitality.","His response shows that courtesy can strengthen resolve instead of delaying it."],
 ["Passing Surasā’s test proves that intelligence and flexibility are essential to the mission.","The journey requires discernment as well as physical power."],
 ["Overcoming Siṃhikā removes a genuine threat after Hanumān recognizes that this encounter is not a test.","His changed response shows that wise action depends on understanding the obstacle."],
 ["The encounter with Laṅkinī marks the passage from the ocean crossing into the hidden search within Laṅkā.","Crossing the guarded threshold begins a new phase of the mission."],
 ["The meeting reveals a potential ally guided by dharma within Rāvaṇa’s kingdom.","In the Rāmacaritamānasa sequence, the encounter shows that moral clarity survives inside Laṅkā."],
 ["Finding Sītā confirms the goal of the search and begins the careful work of approaching her.","Recognition is the turning point between searching for Sītā and serving her as Rāma’s messenger."],
 ["The ring allows Hanumān to establish trust and carry a reliable message in both directions.","The token connects Rāma, Hanumān, and Sītā through recognition and faithful speech."],
 ["The escalating battle leads to Hanumān’s capture and creates the opportunity to address Rāvaṇa’s court.","What looks like confinement advances the messenger’s larger purpose."],
 ["Hanumān gives Rāvaṇa a final opportunity to return Sītā and avoid destruction.","Speaking as Rāma’s messenger makes the moral choice and its consequence explicit."],
 ["Hanumān turns the punishment of his burning tail into a warning across Laṅkā.","The reversal makes the consequence of Rāvaṇa’s refusal visible to the city."],
 ["Hanumān’s faithful report gives Rāma the knowledge and token needed to begin the work of rescue.","The search ends only when Sītā’s message and proof return to Rāma."],
] as const;

function make(id:string,prompt:string,correct:string,distractors:string[],explanation:string,slot:number):Challenge{
 const labels=Array.from(new Set([...distractors.filter(label=>label!==correct),"A different encounter","None of these"])).slice(0,2);
 labels.splice(slot%3,0,correct);
 const choices=labels.map((label,index)=>({id:String.fromCharCode(97+index),label}));
 return {id,prompt,choices,answer:choices.find(choice=>choice.label===correct)!.id,explanation};
}

function otherNodes(node:JourneyNode){
 return [journeyNodes[(node.number+3)%15],journeyNodes[(node.number+8)%15]];
}

export function challengePoolFor(node:JourneyNode,level:Difficulty):Challenge[]{
 const others=otherNodes(node);
 if(level==="explorer"){
  const present=node.characters[0];
  const people=Array.from(new Set(journeyNodes.flatMap(item=>item.characters).filter(name=>!node.characters.includes(name)))).slice(node.number,node.number+2);
 return [
   {...node.challenge,id:`${node.id}-explorer-0`},
   make(`${node.id}-explorer-1`,"What central event happens in this encounter?",node.excerpt,others.map(item=>item.excerpt),node.story,node.number),
   make(`${node.id}-explorer-2`,"Who is present in this encounter?",present,people,`${present} is part of this moment in the journey.`,node.number+1),
  ];
 }
 if(level==="seeker"){
  const next=journeyNodes[node.number];
  const nextTitle=next?.title ?? "The mission’s report to Rāma";
  return [
   make(`${node.id}-seeker-0`,"What follows this encounter in the journey’s story order?",nextTitle,others.map(item=>item.title),`The next step is ${nextTitle}.`,node.number+1),
   make(`${node.id}-seeker-1`,"Which consequence or purpose best explains this moment?",missionInsights[node.number-1][0],otherNodes(node).map(item=>missionInsights[item.number-1][0]),missionInsights[node.number-1][1],node.number+2),
   make(`${node.id}-seeker-2`,"Which description best captures what changes here?",node.excerpt,others.map(item=>item.excerpt),node.story,node.number),
  ];
 }
 const [prompt,right,wrong,explanation]=reasons[node.number-1];
 const explanationLabel=node.id==="HJ-09"||node.id==="HJ-12"?"Source comparison":"Learning interpretation";
 return [
  make(`${node.id}-scholar-0`,prompt,right,[wrong,others[0].teaching],`${explanationLabel}: ${explanation}`,node.number),
  make(`${node.id}-scholar-1`,"Which spiritual reflection best grows from this encounter?",node.teaching,others.map(item=>item.teaching),`Spiritual reflection: ${node.teaching}`,node.number+1),
  make(`${node.id}-scholar-2`,"Why does this encounter matter to Hanumān’s larger mission?",missionInsights[node.number-1][0],otherNodes(node).map(item=>missionInsights[item.number-1][0]),`Learning interpretation: ${missionInsights[node.number-1][1]}`,node.number+2),
 ];
}

export function challengeFor(node:JourneyNode,level:Difficulty,variant=0){
 const pool=challengePoolFor(node,level);
 return pool[((variant%pool.length)+pool.length)%pool.length];
}

export const challengeKey=(id:string,level:Difficulty)=>`${id}:${level}`;
export const encodeChallengeAnswer=(challenge:Challenge,answer:string)=>`${challenge.id}|${answer}`;

export function storedAnswerIsAnswered(node:JourneyNode,level:Difficulty,value:string|undefined){
 if(!value)return false;
 if(!value.includes("|"))return challengeFor(node,level,0).choices.some(choice=>choice.id===value);
 const [id,answer]=value.split("|");
 const challenge=challengePoolFor(node,level).find(item=>item.id===id);
 return Boolean(challenge&&challenge.choices.some(choice=>choice.id===answer));
}

export function storedAnswerIsCorrect(node:JourneyNode,level:Difficulty,value:string|undefined){
 if(!storedAnswerIsAnswered(node,level,value))return false;
 if(!value)return false;
 if(!value.includes("|"))return value===challengeFor(node,level,0).answer;
 const [id,answer]=value.split("|");
 const challenge=challengePoolFor(node,level).find(item=>item.id===id);
 return Boolean(challenge&&challenge.answer===answer);
}
