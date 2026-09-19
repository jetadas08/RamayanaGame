import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import ts from 'typescript'; import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const cache={};
function load(file){if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));const filename=path.join(root,file+'.ts');if(cache[filename])return cache[filename].exports;const record={exports:{}};cache[filename]=record;const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;new Function('require','module','exports',js)(name=>name.startsWith('@/')?load(name.slice(2)):(()=>{throw new Error(name)})(),record,record.exports);return record.exports;}
const {journeyNodes,meetingNodes}=load('data/journey');const {normalizeProgress,revealStoryScene,completeChallenge,answerRelationshipChallenge,answerCharacterChallenge,choosePrediction,discoverObject,discoverSceneItem,recordStoryMemory,mergeProgress,correctAnswerCount,nodeMastery}=load('lib/progress');const {challengeFor,challengePoolFor,encodeChallengeAnswer}=load('data/challenges');const {masteryActivityFor,masteryAudit,storedMasteryIsCorrect}=load('data/mastery-activities');const {relationships,characters}=load('data/discoveries');const {availableRelationshipIds}=load('data/relationships');const {availableRelationshipChallenges}=load('data/relationship-challenges');const {activitiesByNode,sacredObjects}=load('data/encounter-activities');const {characterChallenges,characterProfileFields,characterKnowledgeProfiles,characterKnowledgeProgress,characterFieldIsUnlocked}=load('data/character-knowledge');
const {warNodes}=load('data/war');
const {recordCrossingTrailAnswer}=load('lib/progress');
const {searchNodes}=load('data/search');
const {crossingNodeIds,crossingMemoryNames}=load('data/crossing');
const {finaleNodes,finaleMemories}=load('data/finale');
const {herbsNodes,medicinalHerbs,rescueComparisons}=load('data/herbs');
const {progressCounts,progressTotals,achievementDefinitions}=load('data/progress-metrics');
const {nodeSceneIsRevealed}=load('data/node-scenes');
const {completionMasteryCopy,encounterCompletionRewards}=load('data/encounter-completion');
const {hanumanCampaign,hanumanCampaignChapters,hanumanCampaignLandmarks,hanumanCampaignRoutes,ramayanaEvents,ramayanaEventById,hanumanOriginsKnowledge,laterTraditionsExpansion,futureCharacterCampaigns}=load('data/hanuman-campaign');
assert.equal(journeyNodes.length,15);assert.equal(journeyNodes[11].subEncounters.length,6);
assert.equal(ramayanaEvents.length,35);
assert.deepEqual(hanumanCampaignChapters.map(chapter=>chapter.eventIds.length),[5,5,5,3,4,6,3,4]);
assert.deepEqual(ramayanaEvents.map(event=>event.canonicalOrder),Array.from({length:35},(_,i)=>i+1));
assert.equal(hanumanCampaignChapters.length,8);assert.deepEqual(hanumanCampaignChapters.map(chapter=>chapter.title),['The Meeting','The Search','Across the Ocean','Sītā in Laṅkā','Messenger and Warrior','The War','The Mountain of Herbs','Mission Fulfilled']);assert.deepEqual(hanumanCampaign.playableNodeIds,[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map(node=>node.id));assert.deepEqual(hanumanCampaignChapters.flatMap(chapter=>chapter.playableNodeIds),[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map(node=>node.id));assert.equal(new Set(ramayanaEvents.map(event=>event.id)).size,ramayanaEvents.length);
assert.ok(hanumanCampaignLandmarks.some(item=>item.id==='rameswaram'&&item.name==='Rāmeśvaram'));assert.ok(hanumanCampaignLandmarks.some(item=>item.id==='ayodhya'));assert.ok(hanumanCampaignLandmarks.some(item=>item.id==='himalaya'));const leapRoute=hanumanCampaignRoutes.find(item=>item.routeType==='leap'),setuRoute=hanumanCampaignRoutes.find(item=>item.routeType==='setu');assert.equal(leapRoute.chapterId,'HC-03');assert.equal(setuRoute.chapterId,'HC-06');assert.notEqual(leapRoute.id,setuRoute.id);assert.equal(new Set(hanumanCampaignRoutes.map(item=>item.chapterId)).size,8);
for(const node of journeyNodes){const event=ramayanaEventById[node.id];assert.ok(event,`${node.id} missing shared event`);assert.equal(event.playableNodeId,node.id);assert.equal(event.contentStatus,'playable');assert.equal(event.sourceReviewRequired,false);assert.equal(event.sceneArtwork.revealed,node.scene.imageRevealed);assert.ok(event.characterPaths.some(path=>path.pathId==='hanuman'&&path.perspective==='primary'));}
const plannedEvents=ramayanaEvents.filter(event=>event.sourceReviewRequired);for(const event of plannedEvents){assert.equal(event.contentStatus,'sourceReviewRequired');assert.equal(event.sourceRefs.length,0);assert.equal(event.activityIds.length,0);assert.equal(event.completionTakeaway,'');assert.match(event.planningNote,/approved-source review/);}assert.equal(ramayanaEvents.filter(event=>event.contentStatus==='playable').length,35);
assert.equal(hanumanOriginsKnowledge.unlockEventId,'HJ-03');assert.equal(hanumanOriginsKnowledge.delivery,'retrospective-character-knowledge');assert.equal(hanumanOriginsKnowledge.sourceReviewRequired,true);assert.equal(laterTraditionsExpansion.separateFromCoreCampaign,true);assert.equal(laterTraditionsExpansion.sourceReviewRequired,true);assert.deepEqual(futureCharacterCampaigns.map(item=>item.characterId),['rama','sita','bharata','ravana']);
assert.ok(journeyNodes.every(node=>node.scene?.imageLocked&&node.scene?.imageRevealed&&node.scene?.captionLocked&&node.scene?.captionRevealed&&node.scene?.altLocked&&node.scene?.altRevealed&&node.scene?.replacementBasePath));assert.equal(new Set(journeyNodes.map(node=>node.scene.replacementBasePath)).size,15);for(const id of ['HJ-08','HJ-09','HJ-10','HJ-14'])assert.equal(journeyNodes.find(node=>node.id===id).scene.assetStatus,'final');assert.equal(journeyNodes.filter(node=>node.scene.assetStatus==='placeholder').length,0);
for(const node of journeyNodes){for(const asset of [node.scene.imageLocked,node.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)),`Missing scene asset ${asset}`);assert.ok(!node.scene.imageRevealed.includes('/characters/'));}
assert.ok(journeyNodes.every(node=>node.completionTakeaway));assert.ok(journeyNodes.slice(0,-1).every(node=>node.nextNodeTeaser));assert.equal(journeyNodes[14].nextNodeTeaser,undefined);
assert.equal(completionMasteryCopy(3),'3 of 3 mastery stars earned.');assert.match(completionMasteryCopy(2),/continue now or replay/);
const sitaScene=journeyNodes.find(node=>node.id==='HJ-10').scene;assert.equal(nodeSceneIsRevealed(sitaScene,'HJ-10',normalizeProgress({legacySearchAccess:true})),false);assert.equal(nodeSceneIsRevealed(sitaScene,'HJ-10',normalizeProgress({sceneDiscoveries:['HJ10-GROVE:sita']})),true);
const sitaCompletionProgress=normalizeProgress({completedNodes:journeyNodes.slice(0,10).map(node=>node.id),sceneDiscoveries:['HJ10-GROVE:sita']});const sitaCompletionRewards=encounterCompletionRewards(journeyNodes[9],sitaCompletionProgress,{earned:1,total:4});assert.ok(sitaCompletionRewards.some(reward=>reward.type==='sceneDiscovery'&&reward.detail==='1 of 4 revealed'));assert.ok(!sitaCompletionRewards.some(reward=>reward.type==='connectionClue'||reward.type==='relationship'));assert.ok(!sitaCompletionRewards.some(reward=>reward.detail.includes('Trijaṭā')));const trijataProgress=normalizeProgress({...sitaCompletionProgress,sceneDiscoveries:[...sitaCompletionProgress.sceneDiscoveries,'HJ10-HIDDEN-TRIJATA:trijata']});assert.ok(encounterCompletionRewards(journeyNodes[9],trijataProgress,{earned:2,total:4}).some(reward=>reward.type==='connectionClue'));const discoveredSitaConnection=encounterCompletionRewards(journeyNodes[9],normalizeProgress({...trijataProgress,unlockedRelationships:['REL-TRIJATA-SITA-PROTECTOR']}),{earned:0,total:0});assert.ok(discoveredSitaConnection.some(reward=>reward.type==='relationship'));assert.ok(!discoveredSitaConnection.some(reward=>reward.type==='sceneDiscovery'));
assert.equal(journeyNodes[9].title,'Aśoka Vātikā — Sītā Found');assert.equal(journeyNodes[9].place,'Aśoka Vātikā');assert.equal(journeyNodes[11].title,'Battle in Aśoka Vātikā');assert.equal(journeyNodes[11].place,'Aśoka Vātikā');
let p=normalizeProgress({legacySearchAccess:true});assert.equal(p.currentNode,'HJ-01');assert.equal(p.schemaVersion,2);assert.deepEqual(p.characterJourneys.hanuman.completedEventIds,[]);assert.ok(p.globalKnowledge.characterIds.includes('hanuman'));
const legacyMigrated=normalizeProgress({completedNodes:['HJ-01','HJ-02'],unlockedCharacters:['Hanumān','Rāma','Sampāti'],unlockedRelationships:['REL-RAMA-HANUMAN-SERVICE']});assert.deepEqual(legacyMigrated.completedNodes,['HJ-01','HJ-02']);assert.deepEqual(legacyMigrated.characterJourneys.hanuman.completedEventIds,['HJ-01','HJ-02']);assert.ok(legacyMigrated.globalKnowledge.characterIds.includes('sampati'));assert.ok(legacyMigrated.globalKnowledge.relationshipIds.includes('REL-RAMA-HANUMAN-SERVICE'));
function correctResponse(activity){if(activity.type==='multiSelect')return activity.correctState.join(',');if(activity.type==='sequence')return activity.correctState.join(',');if(activity.type==='matching')return activity.pairs.map(pair=>`${pair.id}=${pair.correct}`).join(';');return activity.correctAnswer;}
function wrongResponse(activity){if(activity.type==='multiSelect')return activity.correctState[0];if(activity.type==='sequence')return activity.correctState.slice().reverse().join(',');if(activity.type==='matching')return `${activity.pairs[0].id}=${activity.options.find(option=>option.id!==activity.pairs[0].correct).id}`;return activity.options.find(option=>option.id!==activity.correctAnswer).id;}
assert.equal(completeChallenge(p,journeyNodes[11],'explorer','HJ-12-explorer-0','c').completedNodes.length,0);
assert.equal(completeChallenge(p,journeyNodes[0],'explorer','HJ-01-explorer-0','wrong').completedNodes.length,0);
let nonblocking=normalizeProgress({legacySearchAccess:true});
for(const level of ['explorer','seeker','scholar']){const activity=masteryActivityFor(journeyNodes[0],level);nonblocking=completeChallenge(nonblocking,journeyNodes[0],level,activity.id,wrongResponse(activity));}
assert.equal(nonblocking.completedNodes.length,1);assert.equal(Object.keys(nonblocking.answeredChallenges).length,3);assert.equal(correctAnswerCount(nonblocking),0);assert.deepEqual(nodeMastery(nonblocking,journeyNodes[0]),[false,false,false]);
const retryActivity=masteryActivityFor(journeyNodes[0],'explorer');nonblocking=completeChallenge(nonblocking,journeyNodes[0],'explorer',retryActivity.id,correctResponse(retryActivity));assert.deepEqual(nodeMastery(nonblocking,journeyNodes[0]),[true,false,false]);nonblocking=completeChallenge(nonblocking,journeyNodes[0],'explorer',retryActivity.id,wrongResponse(retryActivity));assert.deepEqual(nodeMastery(nonblocking,journeyNodes[0]),[true,false,false]);
const masteryReport=masteryAudit();assert.equal(masteryReport.activities.length,51);assert.deepEqual(new Set(masteryReport.activities.map(activity=>activity.type)),new Set(['singleSelect','multiSelect','sequence','matching','sceneDiscovery','predictionChoice']));assert.equal(masteryReport.singleOnlyNodes.length,0);assert.equal(masteryReport.unsupportedSourceRefs.length,0);assert.equal(masteryReport.missingFeedback.length,0);assert.equal(masteryReport.duplicatePrompts.length,0);for(const activity of masteryReport.activities){if(activity.options){assert.ok(activity.options.length>=3,`${activity.id} option count`);assert.equal(new Set(activity.options.map(option=>option.label)).size,activity.options.length,`${activity.id} duplicate option`);}}assert.equal(masteryReport.activities.flatMap(activity=>activity.options??[]).filter(option=>option.label==='The ocean and loss of hope').length,0);
const multiSelectPositions=masteryReport.activities.filter(activity=>activity.type==='multiSelect').map(activity=>activity.options.map((option,index)=>activity.correctState.includes(option.id)?index+1:null).filter(Boolean).join(','));assert.ok(new Set(multiSelectPositions).size>=4);assert.ok(multiSelectPositions.some(positions=>positions!=='1,2'));
const battleAnswers={};for(const level of ['explorer','seeker','scholar']){const challenge=challengeFor(journeyNodes[11],level,0);const wrong=challenge.choices.find(choice=>choice.id!==challenge.answer).id;battleAnswers[`HJ-12:${level}`]=encodeChallengeAnswer(challenge,wrong);}const battleProgress=normalizeProgress({completedNodes:journeyNodes.slice(0,12).map(node=>node.id),answeredChallenges:battleAnswers});assert.equal(battleProgress.completedNodes.length,12);assert.ok(!battleProgress.achievements.includes('Battle Sequence Mastered'));
p=normalizeProgress({legacySearchAccess:true});
for(const node of journeyNodes){
 for(const level of ['explorer','seeker','scholar']){
  const activity=masteryActivityFor(node,level);
  p=completeChallenge(p,node,level,activity.id,correctResponse(activity));
  if(level!=='scholar')assert.equal(p.completedNodes.length,node.number-1);
 }
 assert.equal(p.completedNodes.length,node.number);
}
assert.equal(p.unlockedRelationships.length,0);assert.equal(p.unlockedCharacters.length,new Set(journeyNodes.flatMap(n=>n.characters)).size);assert.ok(p.achievements.includes('Bala & Buddhi'));
assert.equal(correctAnswerCount(p),45);assert.ok(p.achievements.includes('Perfect Journey'));
assert.deepEqual(p.characterJourneys.hanuman.completedEventIds,journeyNodes.map(node=>node.id));assert.deepEqual(p.characterJourneys.hanuman.completedChapterIds,['HC-03','HC-04','HC-05']);assert.equal(p.characterJourneys.hanuman.masteryStars,45);
assert.deepEqual(characters.slice(0,2).map(character=>character.name),['Hanumān','Rāma']);
assert.equal(new Set(characterChallenges.map(challenge=>challenge.type)).size,7);assert.equal(new Set(characterChallenges.map(challenge=>challenge.characterId)).size,16);assert.equal(new Set(characterChallenges.map(challenge=>challenge.prompt)).size,characterChallenges.length,'duplicate character challenge prompts');assert.ok(characterProfileFields.every(field=>field.sources.length&&field.sourceStatus&&field.scopes.includes('hanuman-v1')&&field.unlockMethod));assert.equal(characterKnowledgeProfiles.length,characters.length);assert.equal(characterKnowledgeProfiles.find(profile=>profile.characterId==='hanuman').depth,'major');assert.equal(characterKnowledgeProfiles.find(profile=>profile.characterId==='mainaka').depth,'encounter');
const ravanaFields=characterProfileFields.filter(field=>field.characterId==='ravana');assert.equal(ravanaFields.length,20);assert.deepEqual(new Set(ravanaFields.map(field=>field.section)),new Set(['overview','family','guidance','connections','journey','events','sources']));assert.equal(new Set(ravanaFields.map(field=>field.id)).size,20);
for(const id of ['rama','hanuman','sita','lakshmana','ravana','sugriva','vibhishana','jambavan','indrajit']){const fields=characterProfileFields.filter(field=>field.characterId===id);assert.ok(fields.length>=15,`${id} has only ${fields.length} supported fields`);assert.equal(new Set(fields.map(field=>field.id)).size,fields.length,`${id} has duplicate profile fields`);}
function discoverEveryAvailable(progress){let result=progress;for(const relationship of relationships){const challenge=availableRelationshipChallenges(availableRelationshipIds(result.completedNodes.length,result.meetingCompletedNodes.length,result.warCompletedNodes.length,result.herbsCompletedNodes.length,result.finaleCompletedNodes.length)).find(item=>item.id===`RC-TYPE-${relationship.id}`);if(challenge)result=answerRelationshipChallenge(result,challenge.id,challenge.answer);}return result;}
let ravanaProgress=discoverEveryAvailable(p);const ravanaBefore=characterKnowledgeProgress('ravana',ravanaProgress);assert.equal(ravanaBefore.total,20);assert.ok(ravanaBefore.percentage<100);for(const challenge of characterChallenges.filter(item=>item.characterId==='ravana'))ravanaProgress=answerCharacterChallenge(ravanaProgress,challenge.id,challenge.answer);const ravanaComplete=characterKnowledgeProgress('ravana',ravanaProgress);assert.equal(ravanaComplete.unlocked,20);assert.equal(ravanaComplete.percentage,100);assert.ok(ravanaProgress.achievements.includes('Complete Rāvaṇa'));assert.ok(ravanaProgress.unlockedRelationships.includes('REL-RAVANA-VIBHISHANA-FAMILY'));
let allKnowledge=discoverEveryAvailable(normalizeProgress({...p,meetingCompletedNodes:meetingNodes.map(n=>n.id),warCompletedNodes:warNodes.map(n=>n.id),herbsCompletedNodes:herbsNodes.map(n=>n.id),finaleCompletedNodes:finaleNodes.map(n=>n.id)}));for(const challenge of characterChallenges)allKnowledge=answerCharacterChallenge(allKnowledge,challenge.id,challenge.answer);for(const object of sacredObjects)allKnowledge=discoverObject(allKnowledge,object.id);assert.deepEqual(allKnowledge.finaleCompletedNodes,finaleNodes.map(node=>node.id));for(const field of characterProfileFields.filter(field=>field.unlock.kind==='journey'&&field.unlock.nodeId.startsWith('HFF-')))assert.ok(characterFieldIsUnlocked(field,allKnowledge),`${field.id} did not unlock`);for(const id of ['rama','hanuman','sita','lakshmana','ravana','sugriva','vibhishana','jambavan','indrajit']){const knowledge=characterKnowledgeProgress(id,allKnowledge),locked=characterProfileFields.filter(field=>field.characterId===id&&field.scopes?.includes('hanuman-v1')&&field.countsTowardCompletion!==false&&!characterFieldIsUnlocked(field,allKnowledge)).map(field=>field.id);assert.equal(knowledge.percentage,100,`${id} cannot complete its supported profile (${knowledge.unlocked}/${knowledge.total}); locked: ${locked.join(', ')}`);}
for(const object of sacredObjects){for(const field of ['slug','sanskritName','objectType','thumbnailImage','iconImage','altText','caption','meaning','unlockSource','scope','assetStatus'])assert.ok(object[field],`${object.id} missing ${field}`);assert.ok(object.transmissionChain.length>=2);assert.ok(object.relatedCharacters.length>=2);assert.ok(object.relatedRelationshipIds.length);assert.ok(fs.existsSync(path.join(root,'public',object.thumbnailImage)));}assert.equal(sacredObjects.every(object=>object.assetStatus==='final'),true);
const auditedCounts=progressCounts(ravanaProgress);for(const key of Object.keys(progressTotals))assert.ok(auditedCounts[key]<=progressTotals[key],`${key} exceeds its registered total`);assert.equal(progressTotals.encounters,journeyNodes.length+meetingNodes.length+searchNodes.length+warNodes.length+herbsNodes.length+finaleNodes.length);assert.equal(progressTotals.masteryStars,(journeyNodes.length+meetingNodes.length+searchNodes.length+warNodes.length+herbsNodes.length+finaleNodes.length)*3);assert.equal(progressTotals.achievements,achievementDefinitions.length);
let characterProgress=normalizeProgress({legacySearchAccess:true});const hanumanBefore=characterKnowledgeProgress('hanuman',characterProgress);assert.ok(hanumanBefore.percentage>0&&hanumanBefore.percentage<100);const hanumanChallenge=characterChallenges.find(challenge=>challenge.characterId==='hanuman');characterProgress=answerCharacterChallenge(characterProgress,hanumanChallenge.id,hanumanChallenge.answer);assert.equal(characterProgress.characterChallengeAnswers[hanumanChallenge.id],hanumanChallenge.answer);assert.ok(characterKnowledgeProgress('hanuman',characterProgress).percentage>hanumanBefore.percentage);assert.ok(!characterProgress.unlockedRelationships.includes('REL-HANUMAN-RAMA-DEVOTION'));
for(const character of characters){for(const field of ['name','sanskrit','transliteration','group','role','spiritualSignificance','unlockEncounter'])assert.ok(character[field],`${character.name}: ${field}`);assert.ok(character.qualities.length);assert.ok(character.appearances.length);assert.ok(character.sources.length);assert.ok(character.portrait?.position,`${character.name}: portrait focal position`);if(character.portrait?.sprite){const {column,row,columns,rows}=character.portrait.sprite;assert.ok(column>=0&&column<columns,`${character.name}: sprite column`);assert.ok(row>=0&&row<rows,`${character.name}: sprite row`);}}
const legacyAshokaPrimary=/^(?:Aśoka Grove|Ashoka Grove|Ashoka Vatika|Asoka Vatika)(?:\b|\s|—)/i;for(const node of journeyNodes){assert.ok(!legacyAshokaPrimary.test(node.title),node.title);assert.ok(!legacyAshokaPrimary.test(node.place),node.place);}for(const character of characters)assert.ok(!legacyAshokaPrimary.test(character.group),character.group);
for(const name of ['Jambumālī','Akṣa Kumāra','Indrajit','Kiṅkaras','Seven Sons of the Ministers','Virūpākṣa','Yūpākṣa','Durdhara','Praghasa','Bhāsakarṇa'])assert.ok(p.unlockedCharacters.includes(name),name);
const finished=p;
const finalRewards=encounterCompletionRewards(journeyNodes[14],discoverObject(p,'sitas-cudamani'),{earned:0,total:0});assert.ok(finalRewards.some(reward=>reward.type==='sacredObject'));assert.ok(finalRewards.some(reward=>reward.type==='achievement'&&reward.detail==='Hanumān Journey Complete'));
p=completeChallenge(p,journeyNodes[0],'explorer','HJ-01-explorer-0','a');assert.equal(p.currentNode,'HFW-01');assert.equal(p.completedNodes.length,15);
assert.equal(Object.keys(p.answeredChallenges).length,45);
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(p))),p);
assert.equal(normalizeProgress({completedNodes:['HJ-15'],currentNode:'HJ-15',achievements:['forged']}).completedNodes.length,0);
assert.equal(normalizeProgress({answeredChallenges:{'HJ-15:explorer':'a'}}).completedNodes.length,0);
assert.equal(mergeProgress(finished,p).completedNodes.length,15);
assert.equal(normalizeProgress({answeredChallenges:{'HJ-01':'a'}}).completedNodes.length,0);
assert.equal(normalizeProgress({completedNodes:['HJ-01'],answeredChallenges:{'HJ-01':'a'}}).completedNodes.length,1);
assert.deepEqual(normalizeProgress({unlockedRelationships:['REL-RAMA-HANUMAN-SERVICE']}).unlockedRelationships,['REL-RAMA-HANUMAN-SERVICE']);
for(const edge of relationships){assert.ok(characters.some(c=>c.id===edge.fromCharacterId),edge.fromCharacterId);assert.ok(characters.some(c=>c.id===edge.toCharacterId),edge.toCharacterId);assert.ok(edge.eventId);assert.ok(edge.sources.length);assert.ok(edge.clue);assert.ok(edge.discoverableFrom.includes(edge.eventId));assert.ok(edge.narrativeContexts.length);}
const connectionChallenge=availableRelationshipChallenges(availableRelationshipIds(p.completedNodes.length))[0],wrongConnectionAnswer=connectionChallenge.options.find(option=>option.id!==connectionChallenge.answer).id;p=answerRelationshipChallenge(p,connectionChallenge.id,wrongConnectionAnswer);assert.ok(!p.unlockedRelationships.includes(connectionChallenge.relationshipIds[0]));p=answerRelationshipChallenge(p,connectionChallenge.id,connectionChallenge.answer);assert.equal(p.relationshipChallengeAnswers[connectionChallenge.id],connectionChallenge.answer);assert.ok(p.unlockedRelationships.includes(connectionChallenge.relationshipIds[0]));assert.ok(p.achievements.includes('First Connection'));
let layered=normalizeProgress({completedNodes:journeyNodes.map(node=>node.id)});for(const id of ['REL-HANUMAN-RAMA-DEVOTION','REL-HANUMAN-RAMA-SERVICE']){const challenge=availableRelationshipChallenges(availableRelationshipIds(layered.completedNodes.length)).find(item=>item.id===`RC-TYPE-${id}`);layered=answerRelationshipChallenge(layered,challenge.id,challenge.answer);assert.ok(layered.unlockedRelationships.includes(id));}assert.equal(layered.unlockedRelationships.filter(id=>id==='REL-HANUMAN-RAMA-DEVOTION'||id==='REL-HANUMAN-RAMA-SERVICE').length,2);
let exploration=normalizeProgress({legacySearchAccess:true});const starsBefore=correctAnswerCount(exploration);exploration=choosePrediction(exploration,'HJ05-PREDICT','honor');assert.equal(correctAnswerCount(exploration),starsBefore);assert.equal(exploration.predictionChoices['HJ05-PREDICT'],'honor');exploration=discoverSceneItem(exploration,'HJ05-SCENE','mainaka');assert.ok(exploration.sceneDiscoveries.includes('HJ05-SCENE:mainaka'));assert.ok(exploration.unlockedCharacters.includes('Maināka'));assert.ok(exploration.achievements.includes('First Discovery'));exploration=discoverSceneItem(exploration,'HJ10-HIDDEN-TRIJATA','trijata');assert.ok(exploration.hiddenDiscoveries.includes('HJ10-HIDDEN-TRIJATA:trijata'));exploration=discoverObject(exploration,'ramas-ring');assert.ok(exploration.discoveredObjects.includes('ramas-ring'));exploration=recordStoryMemory(exploration,'HJ11-RING-JOURNEY',['rama','hanuman','sita']);assert.equal(exploration.storyMemoryAnswers['HJ11-RING-JOURNEY'],'rama,hanuman,sita');assert.equal(sacredObjects.length,2);assert.ok(Object.keys(activitiesByNode).length>=8);
for(const stage of journeyNodes[11].subEncounters){assert.ok(stage.decision.prompt);assert.equal(stage.decision.options.length,2);for(const option of stage.decision.options){assert.ok(option.label);assert.ok(option.feedback);}}
const internalMasteryTerms=/why does the atlas|geograph(?:y|ic)|confidence level|level [a-e]|display type|story map|map classification|source code|\bVR-GP\b|\bVR-HPS\b|\bRCM-GP\b|\bTRAD\b/i;
for(const node of journeyNodes)for(const level of ['explorer','seeker','scholar']){const pool=challengePoolFor(node,level);assert.equal(pool.length,3);assert.equal(new Set(pool.map(q=>q.id)).size,3);for(const q of pool){assert.equal(new Set(q.choices.map(c=>c.label)).size,q.choices.length);const masteryCopy=[q.prompt,q.explanation,...q.choices.map(choice=>choice.label)].join(' ');assert.ok(!internalMasteryTerms.test(masteryCopy),`${node.id} ${level} uses internal atlas terminology: ${masteryCopy}`);}}
const ringUnderstand=challengePoolFor(journeyNodes[10],'seeker');assert.ok(ringUnderstand.some(q=>q.prompt.includes('carry back to Rāma')));assert.ok(!ringUnderstand.some(q=>q.prompt==='Which description best captures what changes here?'));const ringDeeper=challengePoolFor(journeyNodes[10],'scholar');assert.ok(ringDeeper.some(q=>q.prompt.includes('immense strength')));assert.ok(!ringDeeper.some(q=>q.prompt==='Why does this encounter matter to Hanumān’s larger mission?'));
console.log('Passed: eight-chapter campaign architecture, legacy progress migration, journey progression, 45 mastery stars, activities, discoveries, sacred objects, relationships, achievements and persistence.');

// Story artwork uses one reveal step, independently of exploration rewards.
let sceneProgress=normalizeProgress({legacySearchAccess:true});
sceneProgress=discoverSceneItem(sceneProgress,'HJ05-SCENE','mainaka');
assert.equal(sceneProgress.revealedScenes.includes('HJ-05'),false);
assert.equal(revealStoryScene(sceneProgress,'HJ-15').revealedScenes.includes('HJ-15'),false);
for(const node of journeyNodes){
 const before=normalizeProgress({legacySearchAccess:true,completedNodes:journeyNodes.slice(0,node.number-1).map(n=>n.id),revealedScenes:[]});
 assert.equal(nodeSceneIsRevealed(node.scene,node.id,before),false);
 const after=revealStoryScene(before,node.id);
 assert.equal(nodeSceneIsRevealed(node.scene,node.id,after),true);
 assert.deepEqual(after.completedNodes,before.completedNodes);
 assert.equal(correctAnswerCount(after),correctAnswerCount(before));
 assert.ok(normalizeProgress(JSON.parse(JSON.stringify(after))).revealedScenes.includes(node.id));
 assert.ok(mergeProgress(after,before).revealedScenes.includes(node.id));
}
assert.ok(normalizeProgress({sceneDiscoveries:['HJ10-GROVE:sita']}).revealedScenes.includes('HJ-10'));

// Chapter I expansion: independent progress, all activity formats, and old-save compatibility.
const {canEnterNode}=load('lib/progress');
let meeting=normalizeProgress(null);
assert.equal(meeting.currentNode,'HFM-01');assert.equal(meeting.legacySearchAccess,false);
assert.equal(canEnterNode(meeting,journeyNodes[0]),false);
assert.equal(canEnterNode(meeting,meetingNodes[1]),false);
assert.equal(progressTotals.encounters,35);assert.equal(progressTotals.masteryStars,105);
const earlyClueIds=['REL-HANUMAN-SUGRIVA-SERVICE','REL-HANUMAN-RAMA-SERVICE','REL-RAMA-SITA-MARRIAGE','REL-SUGRIVA-RAMA-ALLIANCE'];
for(const node of meetingNodes){
 assert.equal(canEnterNode(meeting,node),true);
 assert.equal(nodeSceneIsRevealed(node.scene,node.id,meeting),false);
 for(const asset of [node.scene.imageLocked,node.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)));
 assert.notEqual(node.scene.imageLocked,node.scene.imageRevealed);
 const explore=node.activities.find(a=>a.type==='sceneDiscovery');
 const stars=correctAnswerCount(meeting);
 for(const spot of explore.hotspots)meeting=discoverSceneItem(meeting,explore.id,spot.id);
 const story=node.activities[1];
 if(story.type==='predictionChoice')meeting=choosePrediction(meeting,story.id,story.choices[0].id);
 if(story.type==='storyMemory')meeting=recordStoryMemory(meeting,story.id,story.correctOrder);
 if(story.type==='connectionBuilder'){
  assert.equal(recordStoryMemory(meeting,story.id,['b','b','b']).storyMemoryAnswers[story.id],undefined);
  meeting=recordStoryMemory(meeting,story.id,story.correct);
  assert.ok(meeting.unlockedRelationships.includes(story.relationshipId));
 }
 assert.equal(correctAnswerCount(meeting),stars,'Exploration must not award mastery stars');
 meeting=revealStoryScene(meeting,node.id);assert.equal(nodeSceneIsRevealed(node.scene,node.id,meeting),true);
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);meeting=completeChallenge(meeting,node,level,a.id,wrongResponse(a));}
 assert.ok(meeting.meetingCompletedNodes.includes(node.id),'Wrong mastery responses must not block completion');
 const beforeRetry=meeting;
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);meeting=completeChallenge(meeting,node,level,a.id,correctResponse(a));meeting=completeChallenge(meeting,node,level,a.id,wrongResponse(a));}
 assert.deepEqual(nodeMastery(meeting,node),[true,true,true]);
 assert.deepEqual(nodeMastery(mergeProgress(meeting,beforeRetry),node),[true,true,true],'Account merge must preserve best stars');
 assert.deepEqual(meeting.completedNodes,[],'Chapter I must not mutate legacy encounter completion');
 assert.equal(meeting.discoveredObjects.length,0,'Dropped ornaments are not a sacred collectible');
}
assert.equal(correctAnswerCount(meeting),15);assert.equal(meeting.currentNode,'HFS-01');
assert.equal(canEnterNode(meeting,journeyNodes[0]),false);
for(const node of searchNodes){assert.equal(canEnterNode(meeting,node),true);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);meeting=completeChallenge(meeting,node,level,a.id,correctResponse(a));}assert.ok(meeting.searchCompletedNodes.includes(node.id));}
assert.equal(meeting.currentNode,'HJ-01');assert.equal(canEnterNode(meeting,journeyNodes[0]),true);assert.equal(correctAnswerCount(meeting),21);
assert.ok(meeting.characterJourneys.hanuman.completedChapterIds.includes('HC-01'));
assert.ok(earlyClueIds.every(id=>availableRelationshipIds(0,5).includes(id)));
assert.deepEqual(new Set(meeting.unlockedRelationships),new Set(['REL-HANUMAN-SUGRIVA-SERVICE','REL-HANUMAN-RAMA-DEVOTION','REL-SUGRIVA-RAMA-ALLIANCE']),'Chapter I resolves only its contextual service, devotion, and alliance connections');
assert.ok(meetingNodes.every((node,index)=>meeting.achievements.includes(load('data/meeting').meetingMemoryNames[index])),'Perfect Chapter I mastery reveals all five memories');
assert.ok(characterProfileFields.filter(f=>f.id.startsWith('hanuman-meeting-quality')).every(f=>load('data/character-knowledge').characterFieldIsUnlocked(f,meeting)));
assert.ok(load('data/character-knowledge').characterFieldIsUnlocked(characterProfileFields.find(f=>f.id==='sita-dropped-ornaments'),meeting));
const oldSave={currentNode:'HJ-15',completedNodes:journeyNodes.map(n=>n.id),answeredChallenges:p.answeredChallenges,discoveredObjects:['ramas-ring','sitas-chudamani']};
const migrated=normalizeProgress(oldSave);assert.equal(migrated.legacySearchAccess,true);assert.equal(canEnterNode(migrated,journeyNodes[14]),true);assert.deepEqual(migrated.completedNodes,oldSave.completedNodes);
const combined=mergeProgress(migrated,meeting);assert.equal(combined.completedNodes.length,15);assert.equal(combined.meetingCompletedNodes.length,5);assert.equal(combined.searchCompletedNodes.length,2);assert.equal(correctAnswerCount(combined),66);
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(combined))),combined);
console.log('Passed: Chapter I and Chapter II handoff, new search encounters, best-score merge, scene reveals, clues, and preserved HJ progress.');

// Chapter III: the Crossing Trail persists authored reasoning while mastery tests recognition, explanation, and transfer.
let crossing=normalizeProgress(meeting);
for(const node of journeyNodes.slice(0,3))for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);crossing=completeChallenge(crossing,node,level,a.id,correctResponse(a));}
assert.equal(crossing.completedNodes.length,3);assert.equal(canEnterNode(crossing,journeyNodes[3]),true);assert.equal(canEnterNode(crossing,journeyNodes[8]),false);
for(const [index,node] of journeyNodes.slice(3,8).entries()){
 assert.equal(node.id,crossingNodeIds[index]);assert.equal(canEnterNode(crossing,node),true);
 crossing=recordCrossingTrailAnswer(crossing,node.id,`reasoned-${index}`);assert.equal(crossing.crossingTrailAnswers[node.id],`reasoned-${index}`);
 const wrongSave=crossing;
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);assert.equal(a.id,`MA-${node.id}-${level}`);assert.ok(a.hint&&a.explanation);crossing=completeChallenge(crossing,node,level,a.id,wrongResponse(a));}
 assert.ok(crossing.completedNodes.includes(node.id),'Wrong answers remain nonblocking in Chapter III');
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);crossing=completeChallenge(crossing,node,level,a.id,correctResponse(a));crossing=completeChallenge(crossing,node,level,a.id,wrongResponse(a));}
 assert.deepEqual(nodeMastery(crossing,node),[true,true,true]);assert.deepEqual(nodeMastery(mergeProgress(crossing,wrongSave),node),[true,true,true]);
 assert.ok(crossing.achievements.includes(crossingMemoryNames[index]));
}
assert.equal(crossing.completedNodes.length,8);assert.equal(canEnterNode(crossing,journeyNodes[8]),true,'Chapter IV unlocks after Laṅkinī');
assert.equal(Object.keys(crossing.crossingTrailAnswers).length,5);assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(crossing))),crossing);
assert.deepEqual(mergeProgress(normalizeProgress(null),crossing).crossingTrailAnswers,crossing.crossingTrailAnswers);
assert.deepEqual(normalizeProgress({completedNodes:journeyNodes.slice(0,8).map(node=>node.id)}).completedNodes,journeyNodes.slice(0,8).map(node=>node.id),'Old saves preserve Chapter III completion');
const legacyCrossingAnswer=`MA-HJ-04-explorer|${challengeFor(journeyNodes[3],'explorer',0).answer}`;
assert.equal(storedMasteryIsCorrect(journeyNodes[3],'explorer',legacyCrossingAnswer),true,'Pre-redesign Chapter III mastery stars remain valid');
const crossingUi=fs.readFileSync(path.join(root,'components/crossing-experience.tsx'),'utf8');
assert.match(crossingUi,/Revise using evidence/);assert.match(crossingUi,/role="status"/);assert.match(crossingUi,/secondStep/);
console.log('Passed: Chapter III — five authored obstacle-reading interactions, Crossing Trail persistence, nonblocking repair, transfer mastery, best-score preservation, old saves, and Chapter IV handoff.');

// Chapter VI: all six encounters, nonblocking answers, persistent best scores and chapter handoff.
let war=combined;
assert.equal(canEnterNode(normalizeProgress(null),warNodes[0]),false);
assert.equal(canEnterNode(war,warNodes[1]),false);
assert.equal(normalizeProgress({...war,warCompletedNodes:['HFW-06']}).warCompletedNodes.length,0);
assert.equal(normalizeProgress({warCompletedNodes:warNodes.map(n=>n.id),herbsCompletedNodes:herbsNodes.map(n=>n.id)}).warCompletedNodes.length,0);
const previousObjects=war.discoveredObjects.slice(),previousKnowledge=war.characterChallengeAnswers;
for(const node of warNodes){
 assert.ok(canEnterNode(war,node));
 assert.equal(nodeSceneIsRevealed(node.scene,node.id,war),false);
 assert.notEqual(node.scene.imageLocked,node.scene.imageRevealed);
 for(const asset of [node.scene.imageLocked,node.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)),asset);
 const stars=correctAnswerCount(war),explore=node.activities[0],story=node.activities[1];
 for(const spot of explore.hotspots)war=discoverSceneItem(war,explore.id,spot.id);
 if(story.type==='evidenceSort'){
  assert.equal(recordStoryMemory(war,story.id,['invalid']).storyMemoryAnswers[story.id],undefined);
  war=recordStoryMemory(war,story.id,story.statements.map(()=>story.categories[0].id));
  assert.ok(war.storyMemoryAnswers[story.id],'An incorrect interpretation must still be saved');
  war=recordStoryMemory(war,story.id,story.statements.map(s=>s.correct));
 } else if(story.type==='storyMemory')war=recordStoryMemory(war,story.id,story.correctOrder);
 else if(story.type==='predictionChoice')war=choosePrediction(war,story.id,story.canonicalAnswer);
 assert.equal(correctAnswerCount(war),stars);
 war=revealStoryScene(war,node.id);assert.ok(nodeSceneIsRevealed(node.scene,node.id,war));
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);war=completeChallenge(war,node,level,a.id,wrongResponse(a));}
 assert.ok(war.warCompletedNodes.includes(node.id),'Wrong answers must not block the war campaign');
 const beforeRetry=war;
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);assert.ok(a.prompt&&a.explanation);assert.ok(!/\bnode\b/i.test(a.prompt));war=completeChallenge(war,node,level,a.id,correctResponse(a));war=completeChallenge(war,node,level,a.id,wrongResponse(a));if(a.type==='connectionBuilder')assert.ok(a.unlocks.every(id=>war.unlockedRelationships.includes(id)));}
 assert.deepEqual(nodeMastery(war,node),[true,true,true]);
 assert.deepEqual(nodeMastery(mergeProgress(war,beforeRetry),node),[true,true,true]);
 assert.deepEqual(war.completedNodes,combined.completedNodes);
 assert.deepEqual(war.meetingCompletedNodes,combined.meetingCompletedNodes);
 assert.deepEqual(war.discoveredObjects,previousObjects);
 assert.deepEqual(war.characterChallengeAnswers,previousKnowledge);
 assert.equal(ramayanaEventById[node.id].chapterId,'HC-06');
 assert.ok(ramayanaEventById[node.id].sourceRefs.every(s=>s.source==='VR-GP'&&s.verification==='pendingEditionAudit'));
}
assert.equal(war.warCompletedNodes.length,6);assert.equal(correctAnswerCount(war),84);
assert.ok(war.characterJourneys.hanuman.completedChapterIds.includes('HC-06'));
assert.ok(war.characterJourneys.hanuman.completedEventIds.includes('HFW-06'));
assert.equal(hanumanCampaignChapters.find(c=>c.id==='HC-07').playableNodeIds.length,3);
for(const name of ['Nala','Dhumrākṣa','Akampana','Kumuda','Mainda'])assert.ok(war.unlockedCharacters.includes(name),name);
assert.ok(availableRelationshipIds(15,5,6).includes('REL-JAMBAVAN-HANUMAN-RESCUE'));
assert.equal(sacredObjects.length,2);
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(war))),war);
assert.deepEqual(mergeProgress(combined,war).warCompletedNodes,war.warCompletedNodes);
assert.match(meetingNodes[3].challenge.prompt,/in this encounter/);
console.log('Passed: Chapter VI — six encounters, eighteen mastery activities, evidence sorting, source separation, scene pairs/reveals, wrong-answer progression, best-score retakes/merge, relationships, preserved legacy progress, and Chapter VII handoff.');

// Chapter VII keeps both medicinal missions separate and preserves every earlier save field.
let herbs=normalizeProgress(war);
assert.equal(herbs.currentNode,'HFH-01');
assert.equal(canEnterNode(combined,herbsNodes[0]),false);
assert.equal(canEnterNode(herbs,herbsNodes[1]),false);
assert.equal(normalizeProgress({...herbs,herbsCompletedNodes:['HFH-03']}).herbsCompletedNodes.length,0);
assert.equal(normalizeProgress({herbsCompletedNodes:herbsNodes.map(n=>n.id)}).herbsCompletedNodes.length,0);
assert.deepEqual(medicinalHerbs.map(h=>h[0]),['Mṛta Sañjīvanī','Viśalyakaraṇī','Suvarṇakaraṇī','Sandhānī']);
assert.equal(ramayanaEvents.length,35);
assert.equal(hanumanCampaignChapters.find(c=>c.id==='HC-07').eventIds.length,3);
assert.equal(ramayanaEventById['HFH-03'].title,'Suṣeṇa and the Second Rescue');
assert.equal(ramayanaEventById['HFH-01'].sourceRefs[0].locator.includes('6.74'),true);
assert.equal(ramayanaEventById['HFH-03'].sourceRefs[0].locator.includes('6.101'),true);
assert.equal(rescueComparisons.length,3);
const newFormats=[];
for(const node of herbsNodes){
 assert.ok(canEnterNode(herbs,node));
 assert.equal(nodeSceneIsRevealed(node.scene,node.id,herbs),false);
 for(const asset of [node.scene.imageLocked,node.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)),asset);
 assert.notDeepEqual(fs.readFileSync(path.join(root,'public',node.scene.imageLocked)),fs.readFileSync(path.join(root,'public',node.scene.imageRevealed)));
 const beforeStars=correctAnswerCount(herbs);
 for(const spot of node.activities[0].hotspots)herbs=discoverSceneItem(herbs,node.activities[0].id,spot.id);
 const story=node.activities[1];
 if(story.type==='predictionChoice')herbs=choosePrediction(herbs,story.id,story.canonicalAnswer);
 if(story.type==='evidenceSort'){herbs=recordStoryMemory(herbs,story.id,story.statements.map(()=>story.categories[0].id));assert.ok(herbs.storyMemoryAnswers[story.id]);herbs=recordStoryMemory(herbs,story.id,story.statements.map(s=>s.correct));}
 assert.equal(correctAnswerCount(herbs),beforeStars);
 herbs=revealStoryScene(herbs,node.id);assert.ok(nodeSceneIsRevealed(node.scene,node.id,herbs));
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);newFormats.push(a.type);assert.ok(a.explanation&&a.hint);herbs=completeChallenge(herbs,node,level,a.id,wrongResponse(a));}
 assert.ok(herbs.herbsCompletedNodes.includes(node.id));
 const wrongSave=herbs;
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);herbs=completeChallenge(herbs,node,level,a.id,correctResponse(a));herbs=completeChallenge(herbs,node,level,a.id,wrongResponse(a));}
 assert.deepEqual(nodeMastery(herbs,node),[true,true,true]);assert.deepEqual(nodeMastery(mergeProgress(herbs,wrongSave),node),[true,true,true]);
 for(const key of ['completedNodes','meetingCompletedNodes','warCompletedNodes','discoveredObjects','characterChallengeAnswers'])assert.deepEqual(herbs[key],war[key],`Preserve ${key}`);
}
assert.equal(newFormats.length,9);assert.deepEqual(new Set(newFormats),new Set(['singleSelect','multiSelect','matching','sequence','sourceComparison']));
assert.equal(correctAnswerCount(herbs),93);assert.equal(progressCounts(herbs).encounters,31);
assert.ok(herbs.characterJourneys.hanuman.completedChapterIds.includes('HC-07'));
assert.ok(herbs.unlockedCharacters.includes('Suṣeṇa'));
assert.equal(characterKnowledgeProfiles.find(p=>p.characterId==='sushena').depth,'supporting');
const sushenaFields=characterProfileFields.filter(f=>f.characterId==='sushena');assert.ok(sushenaFields.length>=8);assert.ok(!sushenaFields.some(f=>f.section==='family'));assert.equal(characterKnowledgeProgress('sushena',herbs).percentage,100);
assert.equal(sacredObjects.length,2);assert.deepEqual(herbs.discoveredObjects,war.discoveredObjects);
assert.equal(hanumanCampaignChapters.find(c=>c.id==='HC-08').playableNodeIds.length,4);
for(const id of ['REL-SUSHENA-LAKSHMANA-PROTECTOR','REL-SUSHENA-HANUMAN-GUIDANCE']){
 assert.ok(!war.unlockedRelationships.includes(id));assert.ok(!herbs.unlockedRelationships.includes(id),'Clues do not automatically reveal the network');
 assert.ok(!availableRelationshipIds(15,5,6,2).includes(id));assert.ok(availableRelationshipIds(15,5,6,3).includes(id));
 const edge=relationships.find(r=>r.id===id);assert.ok(edge.roleContext);assert.ok(['protector','guidance'].includes(edge.type));
 const challenge=availableRelationshipChallenges(availableRelationshipIds(15,5,6,3)).find(q=>q.relationshipIds.includes(id));assert.ok(challenge);herbs=answerRelationshipChallenge(herbs,challenge.id,challenge.answer);assert.ok(herbs.unlockedRelationships.includes(id));
}
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(herbs))),herbs);
assert.deepEqual(mergeProgress(war,herbs).herbsCompletedNodes,herbs.herbsCompletedNodes);
console.log('Passed: Chapter VII — three encounters, nine varied masteries, four-herb knowledge, separate rescues, Suṣeṇa profile, relationship clues, scene pairs/reveals, sequential unlocks, retakes, merge, and old-save preservation.');

// Chapter VIII: the narrative ending is independent of perfect mastery.
const {chapterStatus,encounterStatus}=load('lib/campaign-status');
let finale=normalizeProgress(herbs);
assert.equal(finale.currentNode,'HFF-01');
assert.equal(finale.campaignComplete,false);
assert.deepEqual(finale.finaleCompletedNodes,[]);
assert.equal(canEnterNode(war,finaleNodes[0]),false);
assert.equal(canEnterNode(finale,finaleNodes[1]),false);
assert.equal(normalizeProgress({finaleCompletedNodes:['HFF-04'],campaignComplete:true}).campaignComplete,false);
assert.equal(normalizeProgress({...herbs,finaleCompletedNodes:['HFF-04']}).finaleCompletedNodes.length,0);
assert.equal(ramayanaEventById['HFF-01'].primaryCharacterIds[0],'rama');
assert.ok(!ramayanaEventById['HFF-01'].primaryCharacterIds.includes('hanuman'));
assert.deepEqual(finaleNodes.map(n=>n.id),['HFF-01','HFF-02','HFF-03','HFF-04']);
assert.equal(new Set(finaleNodes.flatMap(n=>[n.scene.imageLocked,n.scene.imageRevealed])).size,8);
const finaleChapter=hanumanCampaignChapters.find(c=>c.id==='HC-08');
assert.equal(chapterStatus(finaleChapter,finale),'Available');
const finaleFormats=[];
for(const node of finaleNodes){
 assert.equal(canEnterNode(finale,node),true);
 assert.equal(nodeSceneIsRevealed(node.scene,node.id,finale),false);
 for(const asset of [node.scene.imageLocked,node.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)),asset);
 assert.notDeepEqual(fs.readFileSync(path.join(root,'public',node.scene.imageLocked)),fs.readFileSync(path.join(root,'public',node.scene.imageRevealed)));
 const starsBefore=correctAnswerCount(finale);
 for(const a of node.activities){
  if(a.type==='predictionChoice')finale=choosePrediction(finale,a.id,a.choices.find(c=>c.id!==a.canonicalAnswer).id);
  if(a.type==='evidenceSort')finale=recordStoryMemory(finale,a.id,a.statements.map(()=>a.categories[0].id));
  if(a.type==='storyMemory')finale=recordStoryMemory(finale,a.id,a.correctOrder.slice().reverse());
  if(a.type==='connectionBuilder'){
   assert.ok(!finale.unlockedRelationships.includes(a.relationshipId));
   const wrong=recordStoryMemory(finale,a.id,['rama','sugriva','family']);assert.ok(!wrong.storyMemoryAnswers[a.id]);
   finale=recordStoryMemory(finale,a.id,a.correct);
   assert.ok(finale.unlockedRelationships.includes(a.relationshipId));
   assert.ok(finale.globalKnowledge.relationshipIds.includes(a.relationshipId));
   assert.equal(finale.storyMemoryAnswers[a.id],a.correct.join(','));
  }
 }
 assert.equal(correctAnswerCount(finale),starsBefore,'Observation cannot award mastery stars');
 assert.equal(encounterStatus(node,finale),'In Progress');
 finale=normalizeProgress(JSON.parse(JSON.stringify(finale)));
 finale=revealStoryScene(finale,node.id);assert.equal(nodeSceneIsRevealed(node.scene,node.id,finale),true);
 for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(node,level);finaleFormats.push(a.type);assert.ok(a.hint.length>20&&a.explanation);finale=completeChallenge(finale,node,level,a.id,wrongResponse(a));}
 assert.ok(finale.finaleCompletedNodes.includes(node.id),'All wrong answers still complete the encounter');
 assert.deepEqual(nodeMastery(finale,node),[false,false,false]);
 assert.equal(encounterStatus(node,finale),'Complete');
 for(const key of ['completedNodes','meetingCompletedNodes','warCompletedNodes','herbsCompletedNodes','discoveredObjects','characterChallengeAnswers'])assert.deepEqual(finale[key],herbs[key],`Preserve ${key}`);
}
assert.equal(finaleFormats.length,12);
assert.deepEqual(new Set(finaleFormats),new Set(['singleSelect','matching','multiSelect','sequence','connectionBuilder']));
assert.equal(finale.campaignComplete,true);
assert.equal(chapterStatus(finaleChapter,finale),'Complete');
assert.equal(progressCounts(finale).encounters,progressTotals.encounters);
assert.equal(correctAnswerCount(finale),93,'The ending is allowed with less than maximum mastery');
assert.ok(finale.unlockedRelationships.includes('REL-BHARATA-RAMA-FAMILY'));
assert.ok(finale.unlockedRelationships.includes('REL-BHARATA-RAMA-DEVOTION'));
assert.equal(sacredObjects.length,2,'Necklace and sandals are not collection objects');
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(finale))),finale);
const wrongFinale=finale;
for(const node of finaleNodes){
 for(const [i,level] of ['explorer','seeker','scholar'].entries()){
  const a=masteryActivityFor(node,level);finale=completeChallenge(finale,node,level,a.id,correctResponse(a));
  assert.equal(nodeMastery(finale,node).filter(Boolean).length,i+1,'One, two, and three-star retakes');
  finale=completeChallenge(finale,node,level,a.id,wrongResponse(a));assert.equal(nodeMastery(finale,node).filter(Boolean).length,i+1);
 }
 assert.ok(finaleMemories[node.number-1].length>40);
}
assert.equal(correctAnswerCount(finale),105);
assert.equal(chapterStatus(finaleChapter,finale),'Mastered');
assert.deepEqual(mergeProgress(finale,wrongFinale).answeredChallenges,finale.answeredChallenges);
assert.deepEqual(mergeProgress(herbs,finale).finaleCompletedNodes,finale.finaleCompletedNodes);
assert.equal(mergeProgress(herbs,finale).campaignComplete,true);
assert.equal(characterKnowledgeProgress('bharata',finale).percentage,100);
// Full IDs: similarly numbered encounters must never receive each other's content.
for(const node of [journeyNodes[3],meetingNodes[3],warNodes[3],finaleNodes[3]]){
 const own=masteryActivityFor(node,'explorer');
 for(const other of [journeyNodes[3],meetingNodes[3],warNodes[3],finaleNodes[3]].filter(n=>n.id!==node.id)){
  const injected=normalizeProgress({...finale,answeredChallenges:{...finale.answeredChallenges,[`${node.id}:explorer`]:`${masteryActivityFor(other,'explorer').id}|${correctResponse(own)}`}});
  assert.equal(nodeMastery(injected,node)[0],false,`${other.id} answer must not count for ${node.id}`);
 }
}
for(const group of [[journeyNodes[2],herbsNodes[2]],[meetingNodes[0],journeyNodes[0],warNodes[0],finaleNodes[0]]]){
 for(const node of group){
  const own=masteryActivityFor(node,'explorer');
  for(const other of group.filter(candidate=>candidate.id!==node.id)){
   const injected=normalizeProgress({...finale,answeredChallenges:{...finale.answeredChallenges,[`${node.id}:explorer`]:`${masteryActivityFor(other,'explorer').id}|${correctResponse(own)}`}});
   assert.equal(nodeMastery(injected,node)[0],false,`${other.id} answer must not count for ${node.id}`);
  }
 }
}
const leapRewards=encounterCompletionRewards(journeyNodes[3],finale,{earned:0,total:0});
assert.ok(!leapRewards.some(r=>/Dhumrākṣa|Bharata|Śatrughna|Coronation|Suṣeṇa/.test(r.detail)));
const warRewards=encounterCompletionRewards(warNodes[3],finale,{earned:0,total:0});
assert.ok(warRewards.some(r=>r.detail.includes('Dhumrākṣa')));
assert.ok(!warRewards.some(r=>/Bharata|Śatrughna/.test(r.detail)));
assert.ok(!encounterCompletionRewards(herbsNodes[2],finale,{earned:0,total:0}).some(r=>/Bharata|Śatrughna/.test(r.detail)));
const firstMeetingRewards=encounterCompletionRewards(meetingNodes[0],finale,{earned:3,total:3});
assert.ok(firstMeetingRewards.some(r=>/Sugrīva|discernment/i.test(`${r.label} ${r.detail}`)));
assert.ok(!firstMeetingRewards.some(r=>/Dhumrākṣa|Bharata|Śatrughna|Coronation|Suṣeṇa/.test(r.detail)));
assert.equal(hanumanCampaignChapters.length,8,'No ninth chapter');
console.log('Passed: Chapter VIII — four encounters, twelve mastery activities, observation/memory persistence, inline Bharata connection, zero-star finale, one/two/three-star retakes, best-score merge, character knowledge, exact-ID collisions, chapter attribution, 35 playable / 35 catalog totals, and unchanged sacred objects.');
