export type ConfidenceLevel = "A" | "B" | "C" | "D" | "E";
export type DisplayType = "point" | "region" | "route" | "narrative";
export type Difficulty = "explorer" | "seeker" | "scholar";
export type RelationshipType = "family" | "marriage" | "devotion" | "service" | "teacher" | "alliance" | "friendship" | "opposition" | "messenger" | "protector" | "guidance";
export type RelationshipChallengeType = "identify-type" | "complete-character" | "missing-network" | "connection-chain";

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
export interface SacredObject { id:string; name:string; image?:string; description:string; relatedCharacters:string[]; discoveryNode:string; sources:SourceReference[]; }

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
}

export interface JourneyProgressState {
  currentNode: string;
  completedNodes: string[];
  unlockedCharacters: string[];
  unlockedRelationships: string[];
  answeredChallenges: Record<string, string>;
  relationshipChallengeAnswers: Record<string, string>;
  sceneDiscoveries: string[];
  hiddenDiscoveries: string[];
  discoveredObjects: string[];
  predictionChoices: Record<string,string>;
  storyMemoryAnswers: Record<string,string>;
  nodeAttempts: Record<string,number>;
  achievements: string[];
  difficulty: Difficulty;
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
