import {finaleNodes} from "@/data/finale";
import {herbsNodes} from "@/data/herbs";
import {warNodes} from "@/data/war";
import {meetingNodes} from "@/data/meeting";
import {searchNodes} from "@/data/search";
import { initialProgress, journeyNodes } from "@/data/journey";
import type { CharacterPortraitData, CharacterProfile } from "@/lib/types";
import {characterIdByName} from "@/data/character-ids";
import {relationships} from "@/data/relationships";
export {relationships} from "@/data/relationships";
export const areas = [
 {id:"shore", name:"Southern shore", from:1, through:3},
 {id:"mahendra", name:"Mahendra region", from:4, through:4},
 {id:"ocean", name:"Ocean passage", from:5, through:7},
 {id:"lanka", name:"Laṅkā", from:8, through:14},
 {id:"return", name:"Homeward passage", from:15, through:15},
];
export const achievements = [
 {name:"First Footsteps", node:1}, {name:"Remember Your Strength", node:3},
 {name:"Bala & Buddhi", node:6}, {name:"Ocean Explorer", node:7},
 {name:"Hope in Aśoka Vātikā", node:10}, {name:"Rāma’s Messenger", node:11},
 {name:"Battle Sequence Mastered", node:12, perfectNode:12}, {name:"Explorer of Laṅkā", node:14},
 {name:"Hanumān Journey Complete", node:15},
 {name:"Threefold Insight", node:1, perfectNode:1},
 {name:"Ocean Mastery", node:7, totalStars:15},
 {name:"Scholar of Laṅkā", node:14, totalStars:30},
 {name:"Perfect Journey", node:15, totalStars:45},
];
const roles: Record<string,string> = {
 "Bharata":"Rāma’s brother, who awaits his return at Nandigrāma and restores the kingdom to him.",
 "Śatrughna":"Rāma’s brother, present in the homecoming and coronation.",
 "Suṣeṇa":"The monkey-physician who diagnoses Lakṣmaṇa and directs the second medicinal rescue.",
 "Nala":"The bridge-maker identified in the Vālmīki Yuddha Kāṇḍa campaign.","Dhumrākṣa":"The commander advancing through Laṅkā’s western gate into Hanumān’s sector.","Akampana":"The warrior whose assault disrupts the vānar forces before Hanumān rallies them.","Kumuda":"A vānar warrior present in the Akampana battle episode.","Mainda":"A vānar leader in the council and campaign.",
 "Hanumān":"Rāma’s messenger; courage, discernment and devotion unite in his mission.",
 "Rāma":"Sītā’s husband, whose search gives the journey its purpose.",
 "Sītā":"The heart of the search, steadfast amid captivity in Laṅkā.",
 "Jāmbavān":"The elder who reminds Hanumān of his strength.",
 "Aṅgada":"A leader of the southern Vanara search party.",
 "Sampāti":"The aged vulture whose sight restores direction to the search.",
 "Maināka":"The mountain who offers hospitality during the crossing.",
 "Surasā":"The divine test answered through intelligence and agility.",
 "Siṃhikā":"The shadow-catching threat distinguished from Surasā’s test.",
 "Laṅkinī":"The guardian encountered at Laṅkā’s threshold.",
 "Vibhīṣaṇa":"Rāvaṇa’s brother, a voice of dharma; his early meeting with Hanumān belongs to the RCM telling.",
 "Trijaṭā":"A rākṣasī whose dream offers reassurance to Sītā.",
 "Indrajit":"Also Meghanāda; Rāvaṇa’s son, whose weapon leads to Hanumān’s capture.",
 "Akṣa Kumāra":"Prince Akṣa, killed in the fifth stage of the grove battle.",
 "Jambumālī":"The warrior sent after the Kiṅkaras in Vālmīki’s battle sequence.",
 "Rāvaṇa":"King of Laṅkā, who rejects the messenger’s counsel to return Sītā.",
 "Lakṣmaṇa":"Rāma’s brother, present when the mission’s news returns.",
 "Sugrīva":"The Vanara king allied with Rāma.",
};
const sanskrit:Record<string,string>={"Bharata":"भरत","Śatrughna":"शत्रुघ्न","Suṣeṇa":"सुषेण",
 "Nala":"नल","Dhumrākṣa":"धूम्राक्ष","Akampana":"अकम्पन","Kumuda":"कुमुद","Mainda":"मैन्द",
 "Hanumān":"हनुमान्","Rāma":"राम","Aṅgada":"अङ्गद","Jāmbavān":"जाम्बवान्","Vanara search party":"वानर अन्वेषण दल",
 "Sampāti":"सम्पाति","Maināka":"मैनाक","Surasā":"सुरसा","Siṃhikā":"सिंहिका","Laṅkinī":"लङ्किनी","Vibhīṣaṇa":"विभीषण",
 "Sītā":"सीता","Trijaṭā":"त्रिजटा","Rākṣasī guards":"राक्षसी रक्षिकाः","Kiṅkaras":"किङ्कराः","Jambumālī":"जम्बुमाली",
 "Seven Sons of the Ministers":"मन्त्रिपुत्राः सप्त","Virūpākṣa":"विरूपाक्ष","Yūpākṣa":"यूपाक्ष","Durdhara":"दुर्धर","Praghasa":"प्रघस",
 "Bhāsakarṇa":"भासकर्ण","Akṣa Kumāra":"अक्षकुमार","Indrajit":"इन्द्रजित्","Rāvaṇa":"रावण","Lakṣmaṇa":"लक्ष्मण","Sugrīva":"सुग्रीव",
};
const groups:Record<string,string>={"Suṣeṇa":"Vānar allies · Yuddha Kāṇḍa",
 "Hanumān":"Vanara allies","Rāma":"Ayodhyā","Aṅgada":"Vanara allies","Jāmbavān":"Vanara allies","Vanara search party":"Vanara allies",
 "Sampāti":"Winged elders","Maināka":"Sacred beings","Surasā":"Sacred beings","Siṃhikā":"Ocean adversaries","Laṅkinī":"Guardians of Laṅkā",
 "Vibhīṣaṇa":"Royal house of Laṅkā","Sītā":"Ayodhyā","Trijaṭā":"Aśoka Vātikā","Rākṣasī guards":"Aśoka Vātikā","Kiṅkaras":"Forces of Laṅkā",
 "Jambumālī":"Forces of Laṅkā","Seven Sons of the Ministers":"Forces of Laṅkā","Virūpākṣa":"Commanders of Laṅkā","Yūpākṣa":"Commanders of Laṅkā",
 "Durdhara":"Commanders of Laṅkā","Praghasa":"Commanders of Laṅkā","Bhāsakarṇa":"Commanders of Laṅkā","Akṣa Kumāra":"Royal house of Laṅkā",
 "Indrajit":"Royal house of Laṅkā","Rāvaṇa":"Royal house of Laṅkā","Lakṣmaṇa":"Ayodhyā","Sugrīva":"Vanara allies",
};
const qualities:Record<string,string[]>={"Suṣeṇa":["Medical knowledge","Care","Discernment"],
 "Hanumān":["Devotion","Courage","Discernment"],"Rāma":["Dharma","Compassion","Leadership"],"Aṅgada":["Leadership","Resolve"],
 "Jāmbavān":["Wisdom","Encouragement"],"Vanara search party":["Cooperation","Perseverance"],"Sampāti":["Vision","Service"],
 "Maināka":["Hospitality","Gratitude"],"Surasā":["Testing","Blessing"],"Siṃhikā":["Obstruction","Predation"],"Laṅkinī":["Guardianship","Omen"],
 "Vibhīṣaṇa":["Dharma","Moral courage"],"Sītā":["Steadfastness","Purity","Hope"],"Trijaṭā":["Compassion","Insight"],
 "Rākṣasī guards":["Pressure","Witness"],"Kiṅkaras":["Force","Obedience"],"Jambumālī":["Ferocity","Pride"],
 "Seven Sons of the Ministers":["Loyalty","Martial force"],"Virūpākṣa":["Command","Force"],"Yūpākṣa":["Command","Force"],
 "Durdhara":["Tenacity","Force"],"Praghasa":["Aggression","Force"],"Bhāsakarṇa":["Command","Force"],"Akṣa Kumāra":["Valor","Youth"],
 "Indrajit":["Strategy","Mastery of weapons"],"Rāvaṇa":["Power","Pride","Learning"],"Lakṣmaṇa":["Loyalty","Vigilance"],"Sugrīva":["Alliance","Kingship"],
};
const significance:Record<string,string>={"Suṣeṇa":"The rescue depends on skilled care as well as the strength that retrieves the medicine.",
 "Hanumān":"Embodies selfless service: immense power becomes sacred when directed by devotion.",
 "Rāma":"Represents dharma held through responsibility, compassion, and steadfast purpose.",
 "Sītā":"Her steadfastness makes hope, dignity, and inner freedom visible even in captivity.",
 "Jāmbavān":"Shows how wise companionship can awaken strength that has been forgotten.",
 "Aṅgada":"Models responsibility and persistence when a community faces uncertainty.",
 "Sampāti":"Shows that loss does not erase the capacity to serve a larger purpose.",
 "Maināka":"Represents hospitality offered without demanding that another abandon their calling.",
 "Surasā":"Her test reveals that intelligence and humility can accomplish what force cannot.",
 "Siṃhikā":"Represents the grasping obstacle that must be recognized and faced decisively.",
 "Laṅkinī":"Marks the threshold where an old order begins to yield to the movement of dharma.",
 "Vibhīṣaṇa":"Shows that conscience can remain awake even inside a corrupt court.",
 "Trijaṭā":"Represents compassion and truthful vision arising in an unlikely place.",
 "Indrajit":"His formidable skill shows the moral difference between power and the purpose guiding it.",
 "Akṣa Kumāra":"His courage and fall reveal the cost of pride-driven escalation.",
 "Rāvaṇa":"Represents the ruin that follows when learning and power are severed from humility.",
 "Lakṣmaṇa":"Embodies alert, steadfast companionship in service of a shared duty.",
 "Sugrīva":"Represents alliance, restored responsibility, and coordinated action.",
};
const portraits:Record<string,CharacterPortraitData>={"Suṣeṇa":{src:"/images/journey/hanuman/hfh-03-revealed-v1.png",position:"48% 48%"},
 "Nala":{src:"/images/journey/hanuman/hfw-03-revealed-v1.png",position:"95% 65%"},
 "Dhumrākṣa":{src:"/images/journey/hanuman/hfw-04-revealed-v1.png",position:"83% 49%"},
 "Akampana":{src:"/images/journey/hanuman/hfw-05-revealed-v1.png",position:"86% 38%"},
 "Kumuda":{src:"/images/journey/hanuman/hfw-05-revealed-v1.png",position:"14% 64%"},
 "Mainda":{src:"/images/journey/hanuman/hfw-02-revealed-v1.png",position:"8% 68%"},

 "Hanumān":{src:"/images/characters/hanuman.png",position:"50% 18%",thumbnailPosition:"50% 22%"},
 "Rāma":{src:"/images/characters/rama.png",position:"50% 18%",thumbnailPosition:"50% 24%"},
 "Aṅgada":{src:"/images/characters/angada.png",position:"50% 24%",thumbnailPosition:"50% 27%"},
 "Jāmbavān":{src:"/images/characters/jambavan.png",position:"50% 20%",thumbnailPosition:"50% 25%"},
 "Vanara search party":{src:"/images/characters/vanara-search-party.png",position:"50% 25%",thumbnailPosition:"50% 28%"},
 "Sampāti":{src:"/images/characters/sampati.png",position:"50% 24%",thumbnailPosition:"50% 28%"},
 "Maināka":{src:"/images/characters/mainaka.png",position:"50% 25%",thumbnailPosition:"50% 28%"},
 "Surasā":{src:"/images/characters/surasa.png",position:"50% 22%",thumbnailPosition:"50% 27%"},
 "Siṃhikā":{src:"/images/characters/simhika.png",position:"50% 22%",thumbnailPosition:"50% 27%"},
 ...Object.fromEntries([
  "Laṅkinī","Vibhīṣaṇa","Sītā","Trijaṭā","Rākṣasī guards","Kiṅkaras",
  "Jambumālī","Seven Sons of the Ministers","Virūpākṣa","Yūpākṣa","Durdhara","Praghasa",
  "Bhāsakarṇa","Akṣa Kumāra","Indrajit","Rāvaṇa","Lakṣmaṇa","Sugrīva",
 ].map((name,index)=>[name,{src:"/images/characters/lanka-sprite.png",position:"50% 35%",thumbnailPosition:"50% 34%",sprite:{column:index%6,row:Math.floor(index/6),columns:6,rows:3}}])),
 "Vibhīṣaṇa":{src:"/images/characters/lanka-sprite.png",position:"50% 34%",thumbnailPosition:"50% 35%",sprite:{column:1,row:0,columns:6,rows:3}},
 "Sītā":{src:"/images/characters/sita-v2.png",position:"50% 28%",thumbnailPosition:"50% 25%"},
 "Trijaṭā":{src:"/images/characters/trijata-v2.png",position:"50% 27%",thumbnailPosition:"50% 25%"},
 "Akṣa Kumāra":{src:"/images/characters/lanka-sprite.png",position:"50% 38%",thumbnailPosition:"50% 36%",sprite:{column:1,row:2,columns:6,rows:3}},
 "Indrajit":{src:"/images/characters/indrajit-v2.png",position:"50% 23%",thumbnailPosition:"50% 27%"},
 "Rāvaṇa":{src:"/images/characters/ravana-v3.png",position:"50% 25%",thumbnailPosition:"50% 28%"},
 "Bharata":{src:"/images/journey/hanuman/hff-03-revealed-v1.png",position:"65% 45%",thumbnailPosition:"65% 42%"},
 "Śatrughna":{src:"/images/journey/hanuman/hff-04-revealed-v1.png",position:"68% 30%",thumbnailPosition:"68% 30%"},
 "Lakṣmaṇa":{src:"/images/characters/lakshmana-v2.png",position:"50% 30%",thumbnailPosition:"50% 28%"},
 "Sugrīva":{src:"/images/characters/lanka-sprite.png",position:"50% 39%",thumbnailPosition:"50% 37%",sprite:{column:5,row:2,columns:6,rows:3}},
};
const storyNodes=[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes];
const characterNames=Array.from(new Set([...initialProgress.unlockedCharacters,...storyNodes.flatMap(n=>n.characters)]));
const sourceCodes=new Set(["VR-GP","VR-HPS","RCM-GP","TRAD"]);
export const characters:CharacterProfile[] = characterNames.map((name,i)=>{
 const appearanceNodes=storyNodes.filter(n=>n.characters.includes(name));
 const first=appearanceNodes[0];
 return {
  id:characterIdByName[name]??`character-${i+1}`,
  name,
  sanskrit:sanskrit[name] ?? name,
  transliteration:name,
  role:roles[name] ?? (name.includes("guards") ? "A group charged with guarding Sītā in the grove." : "A participant in the escalating Laṅkā battle sequence."),
  portrait:portraits[name],
  group:groups[name] ?? "Figures of the journey",
  qualities:qualities[name] ?? ["Courage","Story witness"],
  keyRelationships:relationships.filter(r=>r.fromCharacterId===(characterIdByName[name]??"")||r.toCharacterId===(characterIdByName[name]??"")).map(r=>r.id),
  appearances:appearanceNodes.map(n=>n.id),
  spiritualSignificance:significance[name] ?? "This figure helps reveal how courage, motive, and consequence shape the movement of the story.",
  sources:Array.from(new Set(appearanceNodes.flatMap(n=>n.sourceLabels).filter(source=>sourceCodes.has(source)))),
  unlockNode:first.number,
  unlockNodeId:first.id,
  unlockEncounter:first.title,
 };
});
