import type { JourneyNode, JourneyProgressState } from "@/lib/types";
import {activitiesByNode,rewardsByNode} from "@/data/encounter-activities";
import {hanumanNodeScenes} from "@/data/node-scenes";
import {hanumanNodeCompletion} from "@/data/node-completion";

const choices = (...labels: string[]) =>
  labels.map((label, index) => ({ id: String.fromCharCode(97 + index), label }));

export const initialProgress: JourneyProgressState = {
  schemaVersion: 2,
  globalKnowledge: {characterIds:["hanuman","rama"],relationshipIds:[],placeIds:[],sacredObjectIds:[],discoveryIds:[],sourceIds:[]},
  characterJourneys: {hanuman:{campaignId:"hanuman",completedEventIds:[],answeredActivityIds:[],masteryStars:0,completedChapterIds:[]}},
  currentNode: "HJ-01",
  completedNodes: [],
  unlockedCharacters: ["Hanumān", "Rāma"],
  unlockedRelationships: [],
  answeredChallenges: {},
  relationshipChallengeAnswers: {},
  characterChallengeAnswers: {},
  sceneDiscoveries: [],
  hiddenDiscoveries: [],
  discoveredObjects: [],
  predictionChoices: {},
  storyMemoryAnswers: {},
  nodeAttempts: {},
  achievements: [],
  difficulty: "explorer",
};

const journeyNodeRecords: Omit<JourneyNode,"scene"|"completionTakeaway"|"nextNodeTeaser">[] = [
  {
    id: "HJ-01", slug: "shore-of-decision", number: 1, title: "The Shore of Decision", eyebrow: "The search reaches its limit", place: "Southern seashore", coordinates: { x: 31, y: 56 }, mapPosition: [77.55, 8.3], confidence: "E", displayType: "region",
    excerpt: "At the edge of the sea, the search party must choose between despair and resolve.",
    story: "The southern search party reaches the ocean without finding Sītā. Time has run out, hope has thinned, and the seemingly endless sea now stands between them and Laṅkā.",
    teaching: "A limit can become a threshold when purpose is remembered.", characters: ["Hanumān", "Aṅgada", "Jāmbavān", "Vanara search party"], unlocks: ["Southern Search Party", "The Ocean Threshold"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "The search party reaches the southern sea while seeking Sītā.", modern: "No precise modern point is established.", tradition: "Shown as a broad southern coastal region.", reason: "The text establishes a coastal threshold, not a defensible coordinate." },
    challenge: { prompt: "What is the search party's greatest obstacle here?", choices: choices("The ocean and loss of hope", "Rāvaṇa's army", "A mountain storm"), answer: "a", explanation: "The sea is both the physical barrier and the visible form of their discouragement." },
  },
  {
    id: "HJ-02", slug: "sampati", number: 2, title: "Sampāti", eyebrow: "A distant truth is revealed", place: "Southern coast", coordinates: { x: 24, y: 63 }, mapPosition: [77.8, 8.05], confidence: "E", displayType: "narrative",
    excerpt: "The aged vulture Sampāti reveals where Sītā is held.", story: "Hearing the Vanaras speak of Jaṭāyu, Sampāti tells his own story and uses his far-reaching sight to identify Sītā in Laṅkā. Knowledge restores direction to the mission.", teaching: "What appears broken may still carry the vision others need.", characters: ["Sampāti", "Aṅgada", "Hanumān"], unlocks: ["Sampāti", "Sampāti informs the search party"], sourceLabels: ["VR-HPS"],
    whyHere: { textual: "Sampāti meets the search party near the southern sea.", modern: "Unknown.", tradition: "Kept within the southern-shore narrative zone.", reason: "The encounter's sequence is strong; its coordinate is not." },
    challenge: { prompt: "What decisive gift does Sampāti offer?", choices: choices("A weapon", "Knowledge of Sītā's location", "A boat"), answer: "b", explanation: "Sampāti's sight turns a hopeless search into a directed mission." },
  },
  {
    id: "HJ-03", slug: "jambavan-reminds-hanuman", number: 3, title: "Jāmbavān Reminds Hanumān", eyebrow: "Strength remembered", place: "Ocean assembly", coordinates: { x: 36, y: 53 }, mapPosition: [78.05, 8.35], confidence: "E", displayType: "narrative",
    excerpt: "Jāmbavān awakens Hanumān to the power he had forgotten.", story: "As the Vanaras measure their ability against the crossing, Jāmbavān speaks to Hanumān. His words do not create strength; they uncover the strength that was already there.", teaching: "Wise guidance helps us remember our deepest capacity.", characters: ["Jāmbavān", "Hanumān", "Aṅgada"], unlocks: ["Jāmbavān", "Jāmbavān awakens Hanumān"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "The encouragement occurs before the leap from the southern shore.", modern: "Unknown.", tradition: "Placed beside the launch region as a narrative moment.", reason: "This is a human and spiritual turning point rather than a mapped site." },
    challenge: { prompt: "What does Jāmbavān give Hanumān?", choices: choices("New powers", "Permission to leave", "Remembrance of his own powers"), answer: "c", explanation: "Jāmbavān's role is remembrance: he calls forth what Hanumān already possesses." },
  },
  {
    id: "HJ-04", slug: "the-leap", number: 4, title: "The Leap", eyebrow: "The mission takes flight", place: "Mahendra candidate region", coordinates: { x: 42, y: 59 }, mapPosition: [77.9, 8.2], confidence: "D", displayType: "region",
    excerpt: "Hanumān expands his form and launches across the ocean.", story: "Standing upon Mahendra, Hanumān gathers body, mind, and devotion into one act. He leaps toward Laṅkā carrying Rāma's purpose over the sea.", teaching: "Courage is focused devotion in motion.", characters: ["Hanumān"], unlocks: ["Mahendra Region", "Remember Your Strength"], sourceLabels: ["VR-HPS", "TRAD"],
    whyHere: { textual: "Vālmīki names Mount Mahendra as the departure point.", modern: "A Mahendragiri candidate in far-southern Tamil Nadu is shown as a region.", tradition: "Multiple identifications exist.", reason: "The ancient name is secure, but its modern identification remains debated." },
    challenge: { prompt: "What powers Hanumān's leap?", choices: choices("A magical vehicle", "Remembered strength in service of Rāma", "A command from the ocean"), answer: "b", explanation: "His recovered strength becomes purposeful because it is offered in service." },
  },
  {
    id: "HJ-05", slug: "mainaka", number: 5, title: "Maināka", eyebrow: "Rest offered", place: "Ocean crossing", coordinates: { x: 48, y: 66 }, mapPosition: [78.65, 8.05], confidence: "E", displayType: "narrative",
    excerpt: "The golden mountain rises from the sea and offers Hanumān rest.", story: "Maināka rises to honor Hanumān and invites him to pause. Hanumān receives the kindness with respect but continues, unwilling to rest before Rāma's work is done.", teaching: "Courtesy and unwavering purpose can live together.", characters: ["Hanumān", "Maināka"], unlocks: ["Maināka", "Bala & Buddhi"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "Maināka appears during the ocean crossing.", modern: "No known coordinate.", tradition: "Shown symbolically along the journey route.", reason: "The narrative sequence is clear; a precise modern pin would be misleading." },
    challenge: { prompt: "Why does Hanumān decline Maināka's invitation?", choices: choices("He distrusts Maināka", "He cannot swim", "He will not rest until Rāma's work is done"), answer: "c", explanation: "Hanumān honors Maināka, then continues without losing sight of his vow." },
  },
  {
    id: "HJ-06", slug: "surasa", number: 6, title: "Surasā", eyebrow: "Power meets intelligence", place: "Ocean crossing", coordinates: { x: 55, y: 70 }, mapPosition: [79.25, 7.9], confidence: "E", displayType: "narrative",
    excerpt: "A divine test cannot be passed by force alone.", story: "Surasā blocks the way and widens her mouth as Hanumān enlarges himself. He suddenly becomes tiny, enters and exits her mouth, satisfying her demand without abandoning the mission.", teaching: "True strength includes flexibility and intelligence.", characters: ["Hanumān", "Surasā"], unlocks: ["Surasā", "Wisdom over force"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "Surasā tests Hanumān during the crossing.", modern: "Unknown.", tradition: "Rendered as a symbolic ocean encounter.", reason: "Her role is narratively located but not geographically recoverable." },
    challenge: { prompt: "How does Hanumān pass Surasā's test?", choices: choices("By defeating her", "By becoming tiny and fulfilling her condition", "By turning back"), answer: "b", explanation: "He answers expansion with agility, proving intelligence alongside power." },
  },
  {
    id: "HJ-07", slug: "simhika", number: 7, title: "Siṃhikā", eyebrow: "The shadow is seized", place: "Ocean crossing", coordinates: { x: 62, y: 66 }, mapPosition: [79.8, 7.75], confidence: "E", displayType: "narrative",
    excerpt: "A shadow-catching demoness drags Hanumān toward danger.", story: "Hanumān feels his speed fail and discovers Siṃhikā grasping his shadow below. Unlike Surasā's test, this threat must be decisively overcome before he can continue.", teaching: "Discernment knows when to adapt and when to act firmly.", characters: ["Hanumān", "Siṃhikā"], unlocks: ["Siṃhikā", "Test and threat distinguished"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "The encounter occurs after Surasā and before Laṅkā.", modern: "Unknown.", tradition: "Shown symbolically on the sea route.", reason: "Only the narrative order—not a physical coordinate—is supported." },
    challenge: { prompt: "How is Siṃhikā different from Surasā?", choices: choices("She is a genuine threat, not a divine test", "She helps Hanumān rest", "She guards Aśoka Vātikā"), answer: "a", explanation: "Hanumān's different response shows discernment: Surasā tests him; Siṃhikā seeks to consume him." },
  },
  {
    id: "HJ-08", slug: "lankini", number: 8, title: "Laṅkinī", eyebrow: "At the threshold of Laṅkā", place: "Laṅkā threshold", coordinates: { x: 65, y: 55 }, mapPosition: [80.05, 8.35], confidence: "E", displayType: "narrative",
    excerpt: "The guardian of Laṅkā confronts the unseen messenger.", story: "At the city's edge, Laṅkinī bars Hanumān's way. Her defeat fulfills an omen: the arrival of a Vanara signals that Laṅkā's downfall has begun.", teaching: "A threshold often reveals the deeper meaning of arrival.", characters: ["Hanumān", "Laṅkinī"], unlocks: ["Laṅkinī", "Laṅkā Threshold"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "Laṅkinī personifies or guards the entrance to Laṅkā.", modern: "No coordinate can be defended.", tradition: "Placed at the narrative edge of the island.", reason: "The app distinguishes a story threshold from a modern location." },
    challenge: { prompt: "What does Laṅkinī recognize after her defeat?", choices: choices("An omen of Laṅkā's fall", "Hanumān as king", "The end of the ocean"), answer: "a", explanation: "The encounter marks the moment Rāma's mission enters Laṅkā." },
  },
  {
    id: "HJ-09", slug: "vibhishana", number: 9, title: "Vibhīṣaṇa", eyebrow: "Dharma within Laṅkā", place: "Laṅkā", coordinates: { x: 73, y: 58 }, mapPosition: [80.35, 7.85], confidence: "E", displayType: "narrative",
    excerpt: "Within the enemy's city, Hanumān discovers a heart devoted to dharma.", story: "In the Rāmacaritamānasa telling, Hanumān encounters Vibhīṣaṇa before finding Sītā. Their meeting reveals that goodness can remain alive even within a corrupted kingdom.", teaching: "Do not mistake a person's surroundings for the nature of their heart.", characters: ["Hanumān", "Vibhīṣaṇa"], unlocks: ["Vibhīṣaṇa", "Hanumān recognizes an ally"], sourceLabels: ["RCM-GP", "Compare Traditions"],
    whyHere: { textual: "The RCM locates the meeting within Laṅkā; Vālmīki structures this portion differently.", modern: "Unknown.", tradition: "Displayed as a tradition-specific narrative event.", reason: "The comparison layer preserves the distinction between tellings." },
    challenge: { prompt: "What does Vibhīṣaṇa represent within Laṅkā?", choices: choices("Hidden loyalty to dharma", "Rāvaṇa's greatest weapon", "A commander who shares Rāvaṇa’s choices"), answer: "a", explanation: "He shows that moral clarity may survive even inside an unjust order." },
  },
  {
    id: "HJ-10", slug: "sita-found", number: 10, title: "Aśoka Vātikā — Sītā Found", eyebrow: "The mission's heart", place: "Aśoka Vātikā", coordinates: { x: 70, y: 77 }, mapPosition: [80.77, 6.98], confidence: "B", displayType: "region",
    excerpt: "After searching Laṅkā, Hanumān finally sees Sītā beneath the trees.", story: "Hidden among the branches, Hanumān recognizes Sītā—steadfast in grief and surrounded by hostile watchers. The long search reaches the person at its center.", teaching: "Hope first asks to be witnessed faithfully.", characters: ["Hanumān", "Sītā", "Trijaṭā", "Rākṣasī guards"], unlocks: ["Sītā", "Aśoka Vātikā", "Hanumān finds Sītā"], sourceLabels: ["VR-HPS", "RCM-GP", "TRAD"],
    whyHere: { textual: "Sītā is held in an Aśoka grove in Laṅkā.", modern: "Seetha Eliya / Hakgala is shown as a traditional candidate region.", tradition: "A strong and living Sri Lankan Ramayana-trail identification.", reason: "The association is significant but is not presented as archaeological proof." },
    challenge: { prompt: "Why does Hanumān initially remain hidden?", choices: choices("To observe carefully and avoid frightening Sītā", "Because he has forgotten his mission", "To wait for Rāvaṇa"), answer: "a", explanation: "Finding Sītā is not enough; Hanumān must approach with discernment and care." },
  },
  {
    id: "HJ-11", slug: "ring-and-message", number: 11, title: "The Ring and the Message", eyebrow: "Trust carried in a small sign", place: "Aśoka Vātikā", coordinates: { x: 78, y: 82 }, mapPosition: [80.72, 6.82], confidence: "B", displayType: "region",
    excerpt: "Rāma's ring turns a stranger's words into recognizable hope.", story: "Hanumān speaks of Rāma and presents his ring. Sītā recognizes the sign and entrusts Hanumān with her message and token for the return.", teaching: "A true messenger carries trust in both directions.", characters: ["Hanumān", "Sītā", "Rāma"], unlocks: ["Rāma's Ring", "Rāma's Messenger", "Hanumān carries Sītā's message"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "The exchange follows the discovery of Sītā in the grove.", modern: "Linked to the same traditional Aśoka Vātikā region.", tradition: "Seetha Eliya / Hakgala remains a traditional association.", reason: "The event is textually established; the modern setting retains B confidence." },
    challenge: { prompt: "What is the ring's essential function?", choices: choices("It proves Hanumān is Rāma's trusted messenger", "It opens the city gates", "It grants invisibility"), answer: "a", explanation: "The ring makes Hanumān's message personally recognizable to Sītā." },
  },
  {
    id: "HJ-12", slug: "ashoka-grove-battle", number: 12, title: "Battle in Aśoka Vātikā", eyebrow: "Resistance escalates", place: "Aśoka Vātikā", coordinates: { x: 62, y: 79 }, mapPosition: [80.58, 7.08], confidence: "E", displayType: "narrative",
    excerpt: "One messenger becomes the measure of Laṅkā's assembled force.", story: "After meeting Sītā, Hanumān makes his presence impossible to ignore. Rāvaṇa sends force after force, and the conflict escalates from massed guards to princes of Laṅkā.", teaching: "Power is clearest when governed by purpose rather than pride.", characters: ["Hanumān", "Kiṅkaras", "Jambumālī", "Seven Sons of the Ministers", "Virūpākṣa", "Yūpākṣa", "Durdhara", "Praghasa", "Bhāsakarṇa", "Akṣa Kumāra", "Indrajit", "Rāvaṇa"], unlocks: ["Jambumālī", "Akṣa Kumāra", "Indrajit", "Battle Sequence Mastered"], sourceLabels: ["VR-HPS", "RCM-GP", "Compare Traditions"],
    whyHere: { textual: "The battle occurs after Hanumān's actions in the grove and before his appearance in court.", modern: "No battlefield coordinate is known.", tradition: "Kept within the Laṅkā narrative area.", reason: "This node maps story sequence, not an archaeological site." },
    challenge: { prompt: "Who is the final opponent in the battle sequence?", choices: choices("Jambumālī", "Prince Akṣa", "Indrajit / Meghanāda"), answer: "c", explanation: "Indrajit is the final escalation; the encounter leads to Hanumān's capture and appearance before Rāvaṇa." },
    subEncounters: [
      { id: "12.1", title: "The first wave", opponent: "The Kiṅkaras", outcome: "Hanumān destroys the massed guards.", decision:{prompt:"What does this first massed assault reveal?",options:[{label:"Laṅkā first answers with overwhelming numbers",feedback:"Yes. The escalation begins with a massed force before named warriors enter."},{label:"The conflict has already reached its final opponent",feedback:"The sequence is only beginning; the Kiṅkaras establish its scale before the named champions."}]} },
      { id: "12.2", title: "The named warrior", opponent: "Jambumālī", outcome: "Jambumālī is defeated.", decision:{prompt:"Why does naming Jambumālī matter here?",options:[{label:"The response shifts from a crowd to an individual champion",feedback:"Exactly. The narrative narrows from massed guards to a recognized warrior."},{label:"He ends the entire battle sequence",feedback:"Jambumālī is a serious escalation, but several stronger responses still follow."}]} },
      { id: "12.3", title: "The ministers' heirs", opponent: "Seven Sons of the Ministers", outcome: "The group is defeated in battle.", decision:{prompt:"What changes with the ministers’ sons?",options:[{label:"Political rank joins military force",feedback:"Yes. Laṅkā’s leadership now commits its own heirs to the confrontation."},{label:"The battle returns to anonymous guards",feedback:"These are high-status named participants, showing that the stakes are rising."}]} },
      { id: "12.4", title: "The command", opponent: "Virūpākṣa, Yūpākṣa, Durdhara, Praghasa & Bhāsakarṇa", outcome: "All five commanders fall.", decision:{prompt:"How should this stage be read?",options:[{label:"As an organized command response",feedback:"Right. Five commanders represent a deliberate military escalation."},{label:"As an unrelated interruption",feedback:"The commanders belong to the same rising chain of responses ordered from Laṅkā."}]} },
      { id: "12.5", title: "The prince", opponent: "Akṣa Kumāra", outcome: "Akṣa is killed after a serious duel.", decision:{prompt:"What makes Prince Akṣa’s arrival different?",options:[{label:"The royal house now enters the battle directly",feedback:"Yes. Sending the young prince raises both the power and the personal cost of the conflict."},{label:"The encounter becomes less consequential",feedback:"Akṣa’s royal status makes this one of the sequence’s most consequential turns."}]} },
      { id: "12.6", title: "The captor", opponent: "Indrajit / Meghanāda", outcome: "The encounter carries Hanumān into Rāvaṇa's court.", decision:{prompt:"What is the narrative purpose of this final encounter?",options:[{label:"It carries Hanumān into Rāvaṇa’s court",feedback:"Exactly. Capture advances the messenger’s mission by bringing him before the king."},{label:"It prevents Hanumān from delivering any message",feedback:"Although bound, Hanumān gains the opportunity to address Rāvaṇa directly."}]} },
    ],
  },
  {
    id: "HJ-13", slug: "ravanas-court", number: 13, title: "Rāvaṇa's Court", eyebrow: "The messenger speaks", place: "Rāvaṇa's city", coordinates: { x: 78, y: 66 }, mapPosition: [80.45, 7.35], confidence: "E", displayType: "narrative",
    excerpt: "Bound before the king of Laṅkā, Hanumān delivers warning without fear.", story: "Hanumān stands in Rāvaṇa's court not as a defeated prisoner, but as Rāma's messenger. He counsels the return of Sītā. Rāvaṇa rejects the warning and orders punishment.", teaching: "Courage speaks truth even when power refuses to hear it.", characters: ["Hanumān", "Rāvaṇa", "Indrajit", "Vibhīṣaṇa"], unlocks: ["Rāvaṇa", "Hanumān warns Rāvaṇa"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "Vālmīki places Rāvaṇa's city upon Trikūṭa in Laṅkā.", modern: "Its precise modern coordinate is unresolved.", tradition: "Modern Sri Lanka is the broad traditional macro-identification.", reason: "Island, epic city, and mountain are deliberately not collapsed into one precise pin." },
    challenge: { prompt: "What is Hanumān's central message to Rāvaṇa?", choices: choices("Return Sītā and avoid destruction", "Surrender the throne to Hanumān", "Meet Rāma at the seashore"), answer: "a", explanation: "Even in court, Hanumān offers a path away from ruin." },
  },
  {
    id: "HJ-14", slug: "burning-of-lanka", number: 14, title: "Burning of Laṅkā", eyebrow: "Punishment becomes a warning", place: "Laṅkā", coordinates: { x: 75, y: 72 }, mapPosition: [80.2, 7.4], confidence: "E", displayType: "narrative",
    excerpt: "The fire meant to humiliate the messenger sweeps through Laṅkā.", story: "Rāvaṇa orders Hanumān's tail wrapped and burned. Hanumān turns the punishment back upon the city, moving across its roofs as flames announce the consequence of Rāvaṇa's refusal.", teaching: "Cruelty can ignite the very consequence it hoped to control.", characters: ["Hanumān", "Rāvaṇa", "Sītā"], unlocks: ["Laṅkā Aflame", "Explorer of Laṅkā"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "The burning takes place across Rāvaṇa's city in Laṅkā.", modern: "No precise urban footprint is known.", tradition: "Represented as a narrative region on the island.", reason: "The app honors the epic geography without inventing a city boundary." },
    challenge: { prompt: "What causes the burning of Laṅkā?", choices: choices("Hanumān transforms a punishment into action", "Sītā lights a beacon", "Maināka erupts"), answer: "a", explanation: "The fire attached to Hanumān's tail becomes the means by which Laṅkā is warned." },
  },
  {
    id: "HJ-15", slug: "return-to-rama", number: 15, title: "Return to Rāma", eyebrow: "The message comes home", place: "Return crossing", coordinates: { x: 49, y: 84 }, mapPosition: [78.9, 7.3], confidence: "E", displayType: "route",
    excerpt: "Hanumān crosses back with the news Rāma has awaited.", story: "After returning to Sītā and receiving her token, Hanumān crosses the ocean, rejoins the Vanaras, and comes before Rāma. The search is complete; the larger work of rescue can begin.", teaching: "A mission is fulfilled when truth is carried faithfully home.", characters: ["Hanumān", "Rāma", "Lakṣmaṇa", "Sugrīva", "Aṅgada", "Jāmbavān"], unlocks: ["Hanumān Journey Complete", "Sītā's Token", "Hanumān reports to Rāma"], sourceLabels: ["VR-HPS", "RCM-GP"],
    whyHere: { textual: "The return retraces the sea crossing and ends with Hanumān reporting to Rāma.", modern: "Shown as a route rather than a precise endpoint.", tradition: "The journey layer emphasizes movement back to the waiting alliance.", reason: "The textual sequence is clear, while exact modern endpoints are not." },
    challenge: { prompt: "What does Hanumān bring back most importantly?", choices: choices("Proof, Sītā's message, and renewed hope", "A crown from Laṅkā", "A map drawn by Rāvaṇa"), answer: "a", explanation: "He returns with knowledge, recognition, and the trust needed for the next stage of the epic." },
  },
];

export const journeyNodes:JourneyNode[]=journeyNodeRecords.map(node=>({...node,scene:hanumanNodeScenes[node.id],...hanumanNodeCompletion[node.id]}));

for(const node of journeyNodes){node.activities=activitiesByNode[node.id]??[];node.rewards=rewardsByNode[node.id]??[];}

export const journeyNodeBySlug = (slug: string) => journeyNodes.find((node) => node.slug === slug);

export const confidenceCopy = {
  A: "Strongly anchored",
  B: "Traditional identification",
  C: "Plausible identification",
  D: "Debated location",
  E: "Narrative / unknown",
} as const;
