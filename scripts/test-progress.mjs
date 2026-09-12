import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import ts from 'typescript'; import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const cache={};
function load(file){const filename=path.join(root,file+'.ts');if(cache[filename])return cache[filename].exports;const record={exports:{}};cache[filename]=record;const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;new Function('require','module','exports',js)(name=>name.startsWith('@/')?load(name.slice(2)):(()=>{throw new Error(name)})(),record,record.exports);return record.exports;}
const {journeyNodes}=load('data/journey');const {normalizeProgress,completeChallenge,answerRelationshipChallenge,choosePrediction,discoverObject,discoverSceneItem,recordStoryMemory,mergeProgress,correctAnswerCount,nodeMastery}=load('lib/progress');const {challengeFor,challengePoolFor,encodeChallengeAnswer}=load('data/challenges');const {relationships,characters}=load('data/discoveries');const {availableRelationshipChallenges}=load('data/relationship-challenges');const {activitiesByNode,sacredObjects}=load('data/encounter-activities');
assert.equal(journeyNodes.length,15);assert.equal(journeyNodes[11].subEncounters.length,6);
assert.equal(journeyNodes[9].title,'Aśoka Vātikā — Sītā Found');assert.equal(journeyNodes[9].place,'Aśoka Vātikā');assert.equal(journeyNodes[11].title,'Battle in Aśoka Vātikā');assert.equal(journeyNodes[11].place,'Aśoka Vātikā');
let p=normalizeProgress(null);assert.equal(p.currentNode,'HJ-01');
assert.equal(completeChallenge(p,journeyNodes[11],'explorer','HJ-12-explorer-0','c').completedNodes.length,0);
assert.equal(completeChallenge(p,journeyNodes[0],'explorer','HJ-01-explorer-0','wrong').completedNodes.length,0);
let nonblocking=normalizeProgress(null);
for(const level of ['explorer','seeker','scholar']){const challenge=challengeFor(journeyNodes[0],level,0);const wrong=challenge.choices.find(choice=>choice.id!==challenge.answer).id;nonblocking=completeChallenge(nonblocking,journeyNodes[0],level,challenge.id,wrong);}
assert.equal(nonblocking.completedNodes.length,1);assert.equal(Object.keys(nonblocking.answeredChallenges).length,3);assert.equal(correctAnswerCount(nonblocking),0);assert.deepEqual(nodeMastery(nonblocking,journeyNodes[0]),[false,false,false]);
const battleAnswers={};for(const level of ['explorer','seeker','scholar']){const challenge=challengeFor(journeyNodes[11],level,0);const wrong=challenge.choices.find(choice=>choice.id!==challenge.answer).id;battleAnswers[`HJ-12:${level}`]=encodeChallengeAnswer(challenge,wrong);}const battleProgress=normalizeProgress({completedNodes:journeyNodes.slice(0,12).map(node=>node.id),answeredChallenges:battleAnswers});assert.equal(battleProgress.completedNodes.length,12);assert.ok(!battleProgress.achievements.includes('Battle Sequence Mastered'));
p=normalizeProgress(null);
for(const node of journeyNodes){
 for(const level of ['explorer','seeker','scholar']){
  const challenge=challengeFor(node,level,(node.number+level.length)%3);
  p=completeChallenge(p,node,level,challenge.id,challenge.answer);
  if(level!=='scholar')assert.equal(p.completedNodes.length,node.number-1);
 }
 assert.equal(p.completedNodes.length,node.number);
}
assert.equal(p.unlockedRelationships.length,relationships.length);assert.equal(p.unlockedCharacters.length,characters.length);assert.ok(p.achievements.includes('Bala & Buddhi'));
assert.equal(correctAnswerCount(p),45);assert.ok(p.achievements.includes('Perfect Journey'));
assert.deepEqual(characters.slice(0,2).map(character=>character.name),['Hanumān','Rāma']);
for(const character of characters){for(const field of ['name','sanskrit','transliteration','group','role','spiritualSignificance','unlockEncounter'])assert.ok(character[field],`${character.name}: ${field}`);assert.ok(character.qualities.length);assert.ok(character.appearances.length);assert.ok(character.sources.length);assert.ok(character.portrait?.position,`${character.name}: portrait focal position`);if(character.portrait?.sprite){const {column,row,columns,rows}=character.portrait.sprite;assert.ok(column>=0&&column<columns,`${character.name}: sprite column`);assert.ok(row>=0&&row<rows,`${character.name}: sprite row`);}}
const legacyAshokaPrimary=/^(?:Aśoka Grove|Ashoka Grove|Ashoka Vatika|Asoka Vatika)(?:\b|\s|—)/i;for(const node of journeyNodes){assert.ok(!legacyAshokaPrimary.test(node.title),node.title);assert.ok(!legacyAshokaPrimary.test(node.place),node.place);}for(const character of characters)assert.ok(!legacyAshokaPrimary.test(character.group),character.group);
for(const name of ['Jambumālī','Akṣa Kumāra','Indrajit','Kiṅkaras','Seven Sons of the Ministers','Virūpākṣa','Yūpākṣa','Durdhara','Praghasa','Bhāsakarṇa'])assert.ok(p.unlockedCharacters.includes(name),name);
const finished=p;
p=completeChallenge(p,journeyNodes[0],'explorer','HJ-01-explorer-0','a');assert.equal(p.currentNode,'HJ-15');assert.equal(p.completedNodes.length,15);
assert.equal(Object.keys(p.answeredChallenges).length,45);
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
assert.equal(normalizeProgress({completedNodes:['HJ-15'],currentNode:'HJ-15',achievements:['forged']}).completedNodes.length,0);
assert.equal(normalizeProgress({answeredChallenges:{'HJ-15:explorer':'a'}}).completedNodes.length,0);
assert.equal(mergeProgress(finished,p).completedNodes.length,15);
assert.equal(normalizeProgress({answeredChallenges:{'HJ-01':'a'}}).completedNodes.length,0);
assert.equal(normalizeProgress({completedNodes:['HJ-01'],answeredChallenges:{'HJ-01':'a'}}).completedNodes.length,1);
for(const edge of relationships){assert.ok(characters.some(c=>c.id===edge.fromCharacterId),edge.fromCharacterId);assert.ok(characters.some(c=>c.id===edge.toCharacterId),edge.toCharacterId);assert.ok(edge.eventId);assert.ok(edge.sources.length);}
const connectionChallenge=availableRelationshipChallenges(p.unlockedRelationships)[0];p=answerRelationshipChallenge(p,connectionChallenge.id,connectionChallenge.answer);assert.equal(p.relationshipChallengeAnswers[connectionChallenge.id],connectionChallenge.answer);assert.ok(p.achievements.includes('First Connection'));
let exploration=normalizeProgress(null);const starsBefore=correctAnswerCount(exploration);exploration=choosePrediction(exploration,'HJ05-PREDICT','honor');assert.equal(correctAnswerCount(exploration),starsBefore);assert.equal(exploration.predictionChoices['HJ05-PREDICT'],'honor');exploration=discoverSceneItem(exploration,'HJ05-SCENE','mainaka');assert.ok(exploration.sceneDiscoveries.includes('HJ05-SCENE:mainaka'));assert.ok(exploration.unlockedCharacters.includes('Maināka'));assert.ok(exploration.achievements.includes('First Discovery'));exploration=discoverSceneItem(exploration,'HJ10-HIDDEN-TRIJATA','trijata');assert.ok(exploration.hiddenDiscoveries.includes('HJ10-HIDDEN-TRIJATA:trijata'));exploration=discoverObject(exploration,'ramas-ring');assert.ok(exploration.discoveredObjects.includes('ramas-ring'));exploration=recordStoryMemory(exploration,'HJ11-RING-JOURNEY',['rama','hanuman','sita']);assert.equal(exploration.storyMemoryAnswers['HJ11-RING-JOURNEY'],'rama,hanuman,sita');assert.equal(sacredObjects.length,2);assert.ok(Object.keys(activitiesByNode).length>=8);
for(const stage of journeyNodes[11].subEncounters){assert.ok(stage.decision.prompt);assert.equal(stage.decision.options.length,2);for(const option of stage.decision.options){assert.ok(option.label);assert.ok(option.feedback);}}
const internalMasteryTerms=/why does the atlas|geograph(?:y|ic)|confidence level|level [a-e]|display type|story map|map classification|source code|\bVR-GP\b|\bVR-HPS\b|\bRCM-GP\b|\bTRAD\b/i;
for(const node of journeyNodes)for(const level of ['explorer','seeker','scholar']){const pool=challengePoolFor(node,level);assert.equal(pool.length,3);assert.equal(new Set(pool.map(q=>q.id)).size,3);for(const q of pool){assert.equal(new Set(q.choices.map(c=>c.label)).size,q.choices.length);const masteryCopy=[q.prompt,q.explanation,...q.choices.map(choice=>choice.label)].join(' ');assert.ok(!internalMasteryTerms.test(masteryCopy),`${node.id} ${level} uses internal atlas terminology: ${masteryCopy}`);}}
console.log('Passed: journey progression, 45 mastery stars, data-driven activities, predictions, discoveries, sacred objects, HJ-12 recap, relationship challenges, achievements and persistence.');
