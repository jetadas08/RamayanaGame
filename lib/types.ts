export type ConfidenceLevel = "A" | "B" | "C" | "D" | "E";
export type DisplayType = "point" | "region" | "route" | "narrative";
export type Difficulty = "explorer" | "seeker" | "scholar";
export type RelationshipType = "family" | "marriage" | "devotion" | "service" | "teacher" | "alliance" | "friendship" | "opposition" | "messenger" | "protector" | "guidance";
export type NarrativeContext = "hanuman" | "rama" | "sita" | "bharata" | "ravana";
export type RelationshipChallengeType = "identify-type" | "complete-character" | "missing-network" | "connection-chain";
export type CharacterProfileSection = "overview" | "family" | "guidance" | "connections" | "journey" | "events" | "objects" | "sources";
export type CharacterProfileDepth = "major" | "supporting" | "encounter";
export type CharacterKnowledgeScope = "hanuman-v1" | "rama-path-v1" | "sita-path-v1" | "bharata-path-v1" | "ravana-path-v1";
export type CharacterKnowledgeUnlockMethod = "autoOnCharacterDiscovery" | "autoOnJourneyNode" | "autoOnJourneyComplete" | "characterChallenge" | "connectionsChallenge" | "sacredObjectDiscovery" | "sourceExploration" | "unavailablePendingReview";
export type CharacterChallengeType = "family-connection" | "identify-guide" | "connected-character" | "key-event" | "character-quality" | "story-role" | "source-aware";
export type CharacterKnowledgeUnlock =
  | { kind: "discovery" }
  | { kind: "journey"; nodeId: string }
  | { kind: "relationship"; relationshipId: string }
  | { kind: "challenge"; challengeId: string }
  | { kind: "object"; objectId: string }
  | { kind: "achievement"; achievement: string }
  | { kind: "sourceExploration"; sourceId: SourceId }
  | { kind: "pendingReview" };

export interface Choice {
  id: string;
  label: string;
}

export interface Challenge {
  id?: string;
  prompt: string;
  choices: Choice[];
  answer: string;
  explanation: string;
}

export type MasteryActivityType="singleSelect"|"multiSelect"|"sequence"|"matching"|"sceneDiscovery"|"predictionChoice"|"connectionBuilder"|"objectMatch"|"whoAmI"|"missingStoryStep"|"sourceComparison"|"trueFalse";
interface MasteryActivityBase {id:string;eventId:string;stage:Difficulty;type:MasteryActivityType;prompt:string;hint:string;explanation:string;sourceRefs:string[];unlocks:string[];difficulty:Difficulty;replayable:boolean;perspectives:NarrativeContext[];claimType:"textual"|"interpretation"|"source-comparison";}
export interface SelectMasteryActivity extends MasteryActivityBase {type:"singleSelect"|"sceneDiscovery"|"predictionChoice";options:Choice[];correctAnswer:string;}
export interface MultiSelectMasteryActivity extends MasteryActivityBase {type:"multiSelect";options:Choice[];correctState:string[];}
export interface SequenceMasteryActivity extends MasteryActivityBase {type:"sequence";items:Choice[];correctState:string[];}
export interface MatchingMasteryActivity extends MasteryActivityBase {type:"matching";pairs:{id:string;left:string;correct:string}[];options:Choice[];correctState:Record<string,string>;}
export type MasteryActivity=SelectMasteryActivity|MultiSelectMasteryActivity|SequenceMasteryActivity|MatchingMasteryActivity;

export interface SubEncounter {
  id: string;
  title: string;
  opponent: string;
  outcome: string;
  decision: {
    prompt: string;
    options: { label: string; feedback: string }[];
  };
}

interface ActivityBase { id:string; title:string; optional?:boolean; hidden?:boolean; sources:SourceId[]; claimType:ClaimType; }
export interface DiscoveryHotspot { id:string; label:string; detail:string; kind:"character"|"object"|"place"|"insight"; unlockCharacter?:string; unlockRelationship?:string; }
export interface SceneDiscoveryActivity extends ActivityBase { type:"sceneDiscovery"; sceneTitle:string; prompt:string; hotspots:DiscoveryHotspot[]; embedded?:boolean; }
export interface PredictionChoiceActivity extends ActivityBase { type:"predictionChoice"; prompt:string; choices:Choice[]; canonicalAnswer:string; canonicalReveal:string; explanation:string; }
export interface CharacterUnlockActivity extends ActivityBase { type:"characterUnlock"; characterNames:string[]; description:string; }
export interface RelationshipUnlockActivity extends ActivityBase { type:"relationshipUnlock"; relationshipIds:string[]; description:string; }
export interface ObjectDiscoveryActivity extends ActivityBase { type:"objectDiscovery"; objectId:string; prompt:string; }
export interface StoryMemoryActivity extends ActivityBase { type:"storyMemory"; mode:"sequence"|"object-journey"|"relationship-match"; prompt:string; items:Choice[]; correctOrder:string[]; explanation:string; }
export interface MasteryQuestionActivity extends ActivityBase { type:"masteryQuestion"; challenge:Challenge; }
export type EncounterActivity=SceneDiscoveryActivity|PredictionChoiceActivity|CharacterUnlockActivity|RelationshipUnlockActivity|ObjectDiscoveryActivity|StoryMemoryActivity|MasteryQuestionActivity;
export interface EncounterReward { id:string; type:"character"|"relationship"|"object"|"insight"|"achievement"; label:string; }
export type SacredObjectType="signet-ring"|"crest-jewel"|"ornament"|"token"|"weapon"|"emblem"|"ritual-object";
export interface SacredObject {
  id:string;
  slug:string;
  name:string;
  sanskritName:string;
  objectType:SacredObjectType;
  thumbnailImage:string;
  iconImage:string;
  previewImage?:string;
  altText:string;
  caption:string;
  description:string;
  meaning:string;
  transmissionChain:string[];
  relatedCharacters:string[];
  relatedRelationshipIds:string[];
  discoveryNode:string;
  unlockSource:string;
  scope:string;
  significanceLabel?:string;
  assetStatus:"final"|"placeholder";
  sources:SourceReference[];
}

export type NodeSceneType = "Decision" | "Revelation" | "Guidance" | "Journey" | "Encounter" | "Threshold" | "Discovery" | "Message" | "Battle" | "Court" | "Transformation" | "Return";
export type NodeSceneRevealTrigger =
  | {kind:"nodeComplete"}
  | {kind:"sceneDiscovery";discoveryId:string}
  | {kind:"characterDiscovery";characterName:string}
  | {kind:"sacredObjectDiscovery";objectId:string};
export interface NodeSceneDefinition {
  imageLocked:string;
  imageRevealed:string;
  captionLocked:string;
  captionRevealed:string;
  altLocked:string;
  altRevealed:string;
  type:NodeSceneType;
  revealTrigger:NodeSceneRevealTrigger;
  focalPosition?:string;
  imageFit?:"cover"|"contain";
  assetStatus:"final"|"placeholder";
  replacementBasePath:string;
}

export interface JourneyNode {
  id: string;
  slug: string;
  number: number;
  title: string;
  eyebrow: string;
  place: string;
  coordinates: { x: number; y: number };
  mapPosition: [longitude: number, latitude: number];
  confidence: ConfidenceLevel;
  displayType: DisplayType;
  excerpt: string;
  story: string;
  teaching: string;
  characters: string[];
  unlocks: string[];
  sourceLabels: string[];
  whyHere: {
    textual: string;
    modern: string;
    tradition: string;
    reason: string;
  };
  challenge: Challenge;
  activities?: EncounterActivity[];
  masteryQuestions?: Challenge[];
  rewards?: EncounterReward[];
  subEncounters?: SubEncounter[];
  scene: NodeSceneDefinition;
  completionTakeaway: string;
  nextNodeTeaser?: string;
}

export interface JourneyProgressState {
  currentNode: string;
  completedNodes: string[];
  unlockedCharacters: string[];
  unlockedRelationships: string[];
  answeredChallenges: Record<string, string>;
  relationshipChallengeAnswers: Record<string, string>;
  characterChallengeAnswers: Record<string, string>;
  sceneDiscoveries: string[];
  hiddenDiscoveries: string[];
  discoveredObjects: string[];
  predictionChoices: Record<string,string>;
  storyMemoryAnswers: Record<string,string>;
  nodeAttempts: Record<string,number>;
  achievements: string[];
  difficulty: Difficulty;
}

export interface CharacterProfileField {
  id: string;
  characterId: string;
  section: CharacterProfileSection;
  label: string;
  value: string;
  relatedCharacterId?: string;
  relationshipId?: string;
  familyGroup?: "Parents" | "Siblings" | "Spouse" | "Children";
  sources: SourceReference[];
  sourceStatus: "Textual" | "Traditional" | "Later devotional tradition" | "Debated / multiple traditions";
  unlock: CharacterKnowledgeUnlock;
  /** Content packs reuse the same fact instead of creating parallel profile records. */
  scopes?: CharacterKnowledgeScope[];
  unlockMethod?: CharacterKnowledgeUnlockMethod;
  countsTowardCompletion?: boolean;
  claimType?: ClaimType;
}

export interface CharacterKnowledgeProfileDefinition {
  characterId: string;
  depth: CharacterProfileDepth;
  activeScope: CharacterKnowledgeScope;
  availableScopes: CharacterKnowledgeScope[];
  futureSupportedFacts: string[];
}

export interface CharacterChallenge {
  id: string;
  characterId: string;
  type: CharacterChallengeType;
  prompt: string;
  context: string;
  options: Choice[];
  answer: string;
  explanation: string;
  unlockFieldIds: string[];
  unlockRelationshipIds?: string[];
}

export interface CharacterKnowledgeProgress {
  characterId: string;
  scope: CharacterKnowledgeScope;
  depth: CharacterProfileDepth;
  completionLabel: string;
  unlocked: number;
  total: number;
  percentage: number;
  state: "Discovered" | "Developing" | "Complete";
  sections: Record<CharacterProfileSection, { unlocked: number; total: number }>;
}

export interface Relationship {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  type: RelationshipType;
  label: string;
  eventId: string;
  sources: SourceId[];
  unlocked: boolean;
  directional: boolean;
  unlockAt: number;
  clue: string;
  discoverableFrom: string[];
  narrativeContexts: NarrativeContext[];
}

export interface RelationshipChallengeOption { id: string; label: string; }
export interface RelationshipChallenge {
  id: string;
  type: RelationshipChallengeType;
  difficulty: Difficulty;
  prompt: string;
  context: string;
  relationshipIds: string[];
  options: RelationshipChallengeOption[];
  answer: string;
  explanation: string;
}
export interface RelationshipUnlock { eventId: string; relationshipIds: string[]; }
export type CharacterConnectionMap = Record<string, Relationship[]>;

export interface CharacterPortraitData {
  src: string;
  /** Focal point used by rectangular portrait surfaces. */
  position?: string;
  /** Optional tighter focal point for circular and compact portraits. */
  thumbnailPosition?: string;
  /** Coordinates for legacy artwork stored in a sprite sheet. */
  sprite?: { column: number; row: number; columns: number; rows: number };
}

export interface CharacterProfile {
  id: string;
  name: string;
  sanskrit: string;
  transliteration: string;
  portrait?: CharacterPortraitData;
  group: string;
  role: string;
  qualities: string[];
  keyRelationships: string[];
  appearances: string[];
  spiritualSignificance: string;
  sources: string[];
  unlockNode: number;
  unlockEncounter: string;
}

export type ClaimType = "textualFact" | "traditionalIdentification" | "commentaryInsight" | "learningInterpretation" | "gameAdaptation";
export type SourceId = "VR-GP" | "VR-HPS" | "RCM-GP" | "TRAD";
export interface SourceReference { source: SourceId; claimType: ClaimType; summary: string; locator?: string; verification: "planningReference" | "verifiedPassage" | "pendingEditionAudit"; }
export interface Location { id:string; name:string; confidenceLevel:ConfidenceLevel; displayType:DisplayType; modernCoordinates?:[number,number]; sources:SourceReference[]; }
