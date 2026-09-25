import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import ts from 'typescript'; import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const cache={};
function load(file){if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));const filename=path.join(root,file+'.ts');if(cache[filename])return cache[filename].exports;const record={exports:{}};cache[filename]=record;const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;new Function('require','module','exports',js)(name=>name.startsWith('@/')?load(name.slice(2)):(()=>{throw new Error(name)})(),record,record.exports);return record.exports;}
const {journeyNodes,meetingNodes}=load('data/journey');const {normalizeProgress,revealStoryScene,completeChallenge,answerRelationshipChallenge,answerCharacterChallenge,choosePrediction,discoverObject,discoverSceneItem,recordStoryMemory,mergeProgress,correctAnswerCount,nodeMastery}=load('lib/progress');const {challengeFor,challengePoolFor,encodeChallengeAnswer}=load('data/challenges');const {masteryActivityFor,masteryAudit,masteryMisconceptionFeedback,storedMasteryIsCorrect}=load('data/mastery-activities');const {relationships,characters}=load('data/discoveries');const {availableRelationshipIds}=load('data/relationships');const {availableRelationshipChallenges}=load('data/relationship-challenges');const {activitiesByNode,sacredObjects}=load('data/encounter-activities');const {characterChallenges,characterProfileFields,characterKnowledgeProfiles,characterKnowledgeProgress,characterFieldIsUnlocked,characterRoleIsKnown}=load('data/character-knowledge');
const {sourceReadiness,orderedSourceIds,publicSourceState}=load('lib/source-readiness');
const {bhaktiPassOne,ringBhaktiReflection}=load('data/bhakti-pass-one');
const {chapterMapStoryReveal}=load('lib/map-story-reveal');
const {warNodes,warMastery}=load('data/war');
const {recordCrossingTrailAnswer}=load('lib/progress');
const {searchNodes}=load('data/search');
const {crossingNodeIds,crossingMemoryNames}=load('data/crossing');
const {chapterFourNodeIds,trustThread,chapterFourBasicMemories,chapterFourDeepMemories}=load('data/chapter-four');
const {chapterFiveNodeIds,escalationTrail,chapterFiveBasicMemories,chapterFiveDeepMemories}=load('data/chapter-five');
const {chapterSixNodeIds,warCouncilSteps,chapterSixBasicMemories,chapterSixDeepMemories}=load('data/chapter-six');
const {chapterSevenNodeIds,rescueBriefSteps,chapterSevenBasicMemories,chapterSevenDeepMemories}=load('data/chapter-seven');
const {finaleNodes,finaleMemories,legacyFinaleMastery}=load('data/finale');
const {herbsNodes,medicinalHerbs,rescueComparisons,herbsMastery}=load('data/herbs');
const {progressCounts,progressTotals,achievementDefinitions}=load('data/progress-metrics');
const {nodeSceneIsRevealed}=load('data/node-scenes');
const {completionMasteryCopy,encounterCompletionRewards}=load('data/encounter-completion');
const {hanumanCampaign,hanumanCampaignChapters,hanumanCampaignChapterPositions,hanumanCampaignCompanionPositions,hanumanCampaignCompanionStoryStates,hanumanCampaignLandmarks,hanumanCampaignRoutes,ramayanaEvents,ramayanaEventById,hanumanOriginsKnowledge,laterTraditionsExpansion,futureCharacterCampaigns}=load('data/hanuman-campaign');
const {hanumanCompanionRoutes,resolveCompanionSnapshot,resolveCampaignCompanionState,previousCampaignCompanionState,resolveRouteCompanionPlacement,progressionEventForNode,shouldAnimateCompanion,shouldAnimateCampaignCompanion,companionVisuals}=load('lib/journey-companion');
assert.equal(journeyNodes.length,15);assert.equal(journeyNodes[11].subEncounters.length,6);
assert.equal(ramayanaEvents.length,35);
assert.deepEqual(hanumanCampaignChapters.map(chapter=>chapter.eventIds.length),[5,5,5,3,4,6,3,4]);
assert.deepEqual(ramayanaEvents.map(event=>event.canonicalOrder),Array.from({length:35},(_,i)=>i+1));
assert.equal(hanumanCampaignChapters.length,8);assert.deepEqual(hanumanCampaignChapters.map(chapter=>chapter.title),['The Meeting','The Search','Across the Ocean','Sītā in Laṅkā','Messenger and Warrior','The War','The Mountain of Herbs','Mission Fulfilled']);assert.deepEqual(hanumanCampaign.playableNodeIds,[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map(node=>node.id));assert.deepEqual(hanumanCampaignChapters.flatMap(chapter=>chapter.playableNodeIds),[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map(node=>node.id));assert.equal(new Set(ramayanaEvents.map(event=>event.id)).size,ramayanaEvents.length);
assert.ok(hanumanCampaignLandmarks.some(item=>item.id==='rameswaram'&&item.name==='Rāmeśvaram'));assert.ok(hanumanCampaignLandmarks.some(item=>item.id==='ayodhya'));assert.ok(hanumanCampaignLandmarks.some(item=>item.id==='himalaya'));const leapRoute=hanumanCampaignRoutes.find(item=>item.routeType==='leap'),setuRoute=hanumanCampaignRoutes.find(item=>item.routeType==='setu');assert.equal(leapRoute.chapterId,'HC-03');assert.equal(setuRoute.chapterId,'HC-06');assert.notEqual(leapRoute.id,setuRoute.id);assert.equal(new Set(hanumanCampaignRoutes.map(item=>item.chapterId)).size,8);
for(const node of journeyNodes){const event=ramayanaEventById[node.id];assert.ok(event,`${node.id} missing shared event`);assert.equal(event.playableNodeId,node.id);assert.equal(event.contentStatus,'playable');assert.equal(event.sourceReviewRequired,sourceReadiness(event.sourceRefs)!=='verified');assert.equal(event.sceneArtwork.revealed,node.scene.imageRevealed);assert.ok(event.characterPaths.some(path=>path.pathId==='hanuman'&&path.perspective==='primary'));}
const plannedEvents=ramayanaEvents.filter(event=>event.contentStatus==='sourceReviewRequired');for(const event of plannedEvents){assert.equal(event.sourceReviewRequired,true);assert.equal(event.sourceRefs.length,0);assert.equal(event.activityIds.length,0);assert.equal(event.completionTakeaway,'');assert.match(event.planningNote,/approved-source review/);}assert.equal(ramayanaEvents.filter(event=>event.contentStatus==='playable').length,35);
assert.deepEqual(orderedSourceIds(['VR-HPS','TRAD','RCM-GP','VR-GP']),['VR-GP','RCM-GP','VR-HPS','TRAD']);
assert.equal(sourceReadiness([{source:'VR-GP',claimType:'textualFact',summary:'Test',verification:'verifiedPassage'}]),'verified');
assert.equal(sourceReadiness([{source:'VR-GP',claimType:'textualFact',summary:'Test',verification:'pendingEditionAudit'}]),'pendingEditionAudit');
assert.equal(sourceReadiness([{source:'VR-GP',claimType:'textualFact',summary:'Test',verification:'planningReference'}]),'planningReference');
assert.equal(publicSourceState('pendingEditionAudit'),'Edition verification pending');
assert.equal(sourceReadiness(ramayanaEventById['HFM-01'].sourceRefs),'pendingEditionAudit');
assert.equal(sourceReadiness(ramayanaEventById['HJ-09'].sourceRefs),'planningReference');
assert.equal(sourceReadiness([{source:'VR-GP',claimType:'commentaryInsight',summary:'Enrichment',verification:'pendingEditionAudit'}]),'pendingEditionAudit');
const passOneItems=Object.values(bhaktiPassOne);
assert.equal(passOneItems.length,7);
assert.deepEqual(new Set(passOneItems.map(item=>item.encounterId)),new Set(['HFS-02','HJ-03','HJ-04','HJ-10','HJ-11','HFF-04']));
for(const item of passOneItems){
 const event=ramayanaEventById[item.encounterId];
 assert.ok(event,`${item.id} must belong to a playable encounter`);
 assert.equal(item.chapterId,event.chapterId);
 assert.equal(item.claimType,'learningInterpretation');
 assert.equal(item.exactQuote,false);
 assert.equal(item.source,'VR-GP');
 assert.equal(item.verification,sourceReadiness(event.sourceRefs));
 assert.ok(item.spoilerGate&&item.locator&&item.editorialOwner);
}
assert.equal(ringBhaktiReflection(normalizeProgress(null),false),null);
const ringCarried=normalizeProgress({searchCompletedNodes:['HFS-01','HFS-02'],discoveredObjects:['ramas-ring']});
assert.equal(ringBhaktiReflection(ringCarried,true),bhaktiPassOne.ringEntrusted);
assert.equal(ringBhaktiReflection({...ringCarried,revealedScenes:['HJ-11']},true),bhaktiPassOne.ringReceived);
assert.equal(ringBhaktiReflection({...ringCarried,completedNodes:['HJ-11']},true),bhaktiPassOne.ringReceived);
for(const [id,item] of [['HJ-03',bhaktiPassOne.strengthRemembered],['HJ-04',bhaktiPassOne.purposefulLeap],['HJ-10',bhaktiPassOne.sitaFound]])assert.equal(journeyNodes.find(node=>node.id===id).completionTakeaway,item.text);
assert.deepEqual(chapterMapStoryReveal(normalizeProgress(null)),{returnToRama:false,ramaSetu:false});
assert.deepEqual(chapterMapStoryReveal(normalizeProgress({meetingCompletedNodes:meetingNodes.slice(0,2).map(node=>node.id)})),{returnToRama:false,ramaSetu:false});
assert.deepEqual(chapterMapStoryReveal(normalizeProgress({completedNodes:journeyNodes.slice(0,11).map(node=>node.id)})),{returnToRama:false,ramaSetu:false});
assert.deepEqual(chapterMapStoryReveal(normalizeProgress({completedNodes:journeyNodes.slice(0,14).map(node=>node.id)})),{returnToRama:false,ramaSetu:false});
assert.equal(chapterMapStoryReveal(normalizeProgress({completedNodes:journeyNodes.map(node=>node.id)})).returnToRama,true);
assert.equal(chapterMapStoryReveal(normalizeProgress({completedNodes:journeyNodes.map(node=>node.id),warCompletedNodes:warNodes.slice(0,3).map(node=>node.id)})).ramaSetu,true);
assert.deepEqual(chapterMapStoryReveal({completedNodes:journeyNodes.map(node=>node.id),warCompletedNodes:warNodes.map(node=>node.id)}),{returnToRama:true,ramaSetu:true});
const sitaIntroduced=normalizeProgress({unlockedCharacters:['Sītā']});
assert.equal(characterRoleIsKnown('sita',sitaIntroduced),false);
const sitaWitnessed={...sitaIntroduced,unlockedCharacters:[...sitaIntroduced.unlockedCharacters,'Sītā'],revealedScenes:['HJ-10']};
assert.equal(characterRoleIsKnown('sita',sitaWitnessed),true);
assert.equal(hanumanOriginsKnowledge.unlockEventId,'HJ-03');assert.equal(hanumanOriginsKnowledge.delivery,'retrospective-character-knowledge');assert.equal(hanumanOriginsKnowledge.sourceReviewRequired,true);assert.equal(laterTraditionsExpansion.separateFromCoreCampaign,true);assert.equal(laterTraditionsExpansion.sourceReviewRequired,true);assert.deepEqual(futureCharacterCampaigns.map(item=>item.characterId),['rama','sita','bharata','ravana']);
assert.ok(journeyNodes.every(node=>node.scene?.imageLocked&&node.scene?.imageRevealed&&node.scene?.captionLocked&&node.scene?.captionRevealed&&node.scene?.altLocked&&node.scene?.altRevealed&&node.scene?.replacementBasePath));assert.equal(new Set(journeyNodes.map(node=>node.scene.replacementBasePath)).size,15);for(const id of ['HJ-08','HJ-09','HJ-10','HJ-14'])assert.equal(journeyNodes.find(node=>node.id===id).scene.assetStatus,'final');assert.equal(journeyNodes.filter(node=>node.scene.assetStatus==='placeholder').length,0);
for(const node of journeyNodes){for(const asset of [node.scene.imageLocked,node.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)),`Missing scene asset ${asset}`);assert.ok(!node.scene.imageRevealed.includes('/characters/'));}
assert.ok(journeyNodes.every(node=>node.completionTakeaway));assert.ok(journeyNodes.slice(0,-1).every(node=>node.nextNodeTeaser));assert.equal(journeyNodes[14].nextNodeTeaser,undefined);
assert.equal(completionMasteryCopy(3),'3 of 3 mastery stars earned.');assert.match(completionMasteryCopy(2),/continue now or replay/);
const sitaScene=journeyNodes.find(node=>node.id==='HJ-10').scene;assert.equal(nodeSceneIsRevealed(sitaScene,'HJ-10',normalizeProgress({legacySearchAccess:true})),false);assert.equal(nodeSceneIsRevealed(sitaScene,'HJ-10',revealStoryScene(normalizeProgress({legacySearchAccess:true,completedNodes:journeyNodes.slice(0,9).map(node=>node.id)}),'HJ-10')),true);
const sitaCompletionProgress=normalizeProgress({completedNodes:journeyNodes.slice(0,10).map(node=>node.id),sceneDiscoveries:['HJ10-EVIDENCE:prior']});const sitaCompletionRewards=encounterCompletionRewards(journeyNodes[9],sitaCompletionProgress,{earned:1,total:5});assert.ok(sitaCompletionRewards.some(reward=>reward.type==='sceneDiscovery'&&reward.detail==='1 of 5 observations saved'));assert.ok(!sitaCompletionRewards.some(reward=>reward.type==='connectionClue'||reward.type==='relationship'));assert.ok(!sitaCompletionRewards.some(reward=>reward.detail.includes('Trijaṭā')));const trijataProgress=normalizeProgress({...sitaCompletionProgress,sceneDiscoveries:[...sitaCompletionProgress.sceneDiscoveries,'HJ10-HIDDEN-TRIJATA:trijata']});assert.ok(encounterCompletionRewards(journeyNodes[9],trijataProgress,{earned:2,total:5}).some(reward=>reward.type==='relationship'));const discoveredSitaConnection=encounterCompletionRewards(journeyNodes[9],normalizeProgress({...trijataProgress,unlockedRelationships:['REL-TRIJATA-SITA-PROTECTOR']}),{earned:0,total:0});assert.ok(discoveredSitaConnection.some(reward=>reward.type==='relationship'));assert.ok(!discoveredSitaConnection.some(reward=>reward.type==='sceneDiscovery'));
assert.equal(journeyNodes[9].title,'Aśoka Vātikā — Sītā Found');assert.equal(journeyNodes[9].place,'Aśoka Vātikā');assert.equal(journeyNodes[11].title,'Battle in Aśoka Vātikā');assert.equal(journeyNodes[11].place,'Aśoka Vātikā');
let p=normalizeProgress({legacySearchAccess:true});assert.equal(p.currentNode,'HJ-01');assert.equal(p.schemaVersion,3);assert.deepEqual(p.characterJourneys.hanuman.completedEventIds,[]);assert.ok(p.globalKnowledge.characterIds.includes('hanuman'));
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
const chapterOneMastery=meetingNodes.flatMap(node=>['explorer','seeker','scholar'].map(level=>masteryActivityFor(node,level)));assert.ok(chapterOneMastery.filter(activity=>activity.stage==='scholar').every(activity=>!activity.prompt.includes(activity.eventId)));assert.ok(chapterOneMastery.every(activity=>activity.misconceptionFeedback));for(const activity of chapterOneMastery){const wrong=wrongResponse(activity);assert.ok(masteryMisconceptionFeedback(activity,wrong).length>50);}
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
assert.ok(p.unlockedRelationships.length>0);assert.equal(p.unlockedCharacters.length,new Set(journeyNodes.flatMap(n=>n.characters)).size);assert.ok(p.achievements.includes('Bala & Buddhi'));
assert.equal(correctAnswerCount(p),45);assert.ok(p.achievements.includes('Perfect Journey'));
assert.deepEqual(p.characterJourneys.hanuman.completedEventIds,journeyNodes.map(node=>node.id));assert.deepEqual(p.characterJourneys.hanuman.completedChapterIds,['HC-03','HC-04','HC-05']);assert.equal(p.characterJourneys.hanuman.masteryStars,45);
assert.deepEqual(characters.slice(0,2).map(character=>character.name),['Hanumān','Rāma']);
assert.equal(new Set(characterChallenges.map(challenge=>challenge.type)).size,7);assert.equal(new Set(characterChallenges.map(challenge=>challenge.characterId)).size,16);assert.equal(new Set(characterChallenges.map(challenge=>challenge.prompt)).size,characterChallenges.length,'duplicate character challenge prompts');assert.ok(characterProfileFields.every(field=>field.sources.length&&field.sourceStatus&&field.scopes.includes('hanuman-v1')&&field.unlockMethod));assert.equal(characterKnowledgeProfiles.length,characters.length);assert.equal(characterKnowledgeProfiles.find(profile=>profile.characterId==='hanuman').depth,'major');assert.equal(characterKnowledgeProfiles.find(profile=>profile.characterId==='mainaka').depth,'encounter');
const ravanaFields=characterProfileFields.filter(field=>field.characterId==='ravana');assert.equal(ravanaFields.length,20);assert.deepEqual(new Set(ravanaFields.map(field=>field.section)),new Set(['overview','family','guidance','connections','journey','events','sources']));assert.equal(new Set(ravanaFields.map(field=>field.id)).size,20);
for(const id of ['rama','hanuman','sita','lakshmana','ravana','sugriva','vibhishana','jambavan','indrajit']){const fields=characterProfileFields.filter(field=>field.characterId===id);assert.ok(fields.length>=15,`${id} has only ${fields.length} supported fields`);assert.equal(new Set(fields.map(field=>field.id)).size,fields.length,`${id} has duplicate profile fields`);}
function discoverEveryAvailable(progress){let result=progress;for(const relationship of relationships){const challenge=availableRelationshipChallenges(availableRelationshipIds(result.completedNodes.length,result.meetingCompletedNodes.length,result.warCompletedNodes.length,result.herbsCompletedNodes.length,result.finaleCompletedNodes.length)).find(item=>item.id===`RC-TYPE-${relationship.id}`);if(challenge)result=answerRelationshipChallenge(result,challenge.id,challenge.answer);}return result;}
let ravanaProgress=discoverEveryAvailable(p);const ravanaBefore=characterKnowledgeProgress('ravana',ravanaProgress);assert.equal(ravanaBefore.total,20);assert.ok(ravanaBefore.percentage<100);for(const challenge of characterChallenges.filter(item=>item.characterId==='ravana'))ravanaProgress=answerCharacterChallenge(ravanaProgress,challenge.id,challenge.answer);const ravanaComplete=characterKnowledgeProgress('ravana',ravanaProgress);assert.equal(ravanaComplete.unlocked,20);assert.equal(ravanaComplete.percentage,100);assert.ok(ravanaProgress.achievements.includes('Complete Rāvaṇa'));assert.ok(ravanaProgress.unlockedRelationships.includes('REL-RAVANA-VIBHISHANA-FAMILY'));
let allKnowledge=discoverEveryAvailable(normalizeProgress({...p,meetingCompletedNodes:meetingNodes.map(n=>n.id),searchCompletedNodes:searchNodes.map(n=>n.id),warCompletedNodes:warNodes.map(n=>n.id),herbsCompletedNodes:herbsNodes.map(n=>n.id),finaleCompletedNodes:finaleNodes.map(n=>n.id)}));for(const challenge of characterChallenges)allKnowledge=answerCharacterChallenge(allKnowledge,challenge.id,challenge.answer);for(const object of sacredObjects)allKnowledge=discoverObject(allKnowledge,object.id);assert.deepEqual(allKnowledge.finaleCompletedNodes,finaleNodes.map(node=>node.id));for(const field of characterProfileFields.filter(field=>field.unlock.kind==='journey'&&field.unlock.nodeId.startsWith('HFF-')))assert.ok(characterFieldIsUnlocked(field,allKnowledge),`${field.id} did not unlock`);for(const id of ['rama','hanuman','sita','lakshmana','ravana','sugriva','vibhishana','jambavan','indrajit']){const knowledge=characterKnowledgeProgress(id,allKnowledge),locked=characterProfileFields.filter(field=>field.characterId===id&&field.scopes?.includes('hanuman-v1')&&field.countsTowardCompletion!==false&&!characterFieldIsUnlocked(field,allKnowledge)).map(field=>field.id);assert.equal(knowledge.percentage,100,`${id} cannot complete its supported profile (${knowledge.unlocked}/${knowledge.total}); locked: ${locked.join(', ')}`);}
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
assert.deepEqual(normalizeProgress({unlockedRelationships:['REL-RAMA-HANUMAN-SERVICE']}).unlockedRelationships,[]);
for(const edge of relationships){assert.ok(characters.some(c=>c.id===edge.fromCharacterId),edge.fromCharacterId);assert.ok(characters.some(c=>c.id===edge.toCharacterId),edge.toCharacterId);assert.ok(edge.eventId);assert.ok(edge.sources.length);assert.ok(edge.clue);assert.ok(edge.discoverableFrom.includes(edge.eventId));assert.ok(edge.narrativeContexts.length);}
const connectionChallenge=availableRelationshipChallenges(availableRelationshipIds(p.completedNodes.length))[0],wrongConnectionAnswer=connectionChallenge.options.find(option=>option.id!==connectionChallenge.answer).id;p=answerRelationshipChallenge(p,connectionChallenge.id,wrongConnectionAnswer);assert.equal(p.relationshipChallengeAnswers[connectionChallenge.id],wrongConnectionAnswer);p=answerRelationshipChallenge(p,connectionChallenge.id,connectionChallenge.answer);assert.equal(p.relationshipChallengeAnswers[connectionChallenge.id],connectionChallenge.answer);assert.ok(p.unlockedRelationships.includes(connectionChallenge.relationshipIds[0]));assert.ok(p.achievements.includes('First Connection'));
let layered=normalizeProgress({completedNodes:journeyNodes.map(node=>node.id)});for(const id of ['REL-HANUMAN-RAMA-DEVOTION','REL-HANUMAN-RAMA-SERVICE']){const challenge=availableRelationshipChallenges(availableRelationshipIds(layered.completedNodes.length)).find(item=>item.id===`RC-TYPE-${id}`);layered=answerRelationshipChallenge(layered,challenge.id,challenge.answer);assert.ok(layered.unlockedRelationships.includes(id));}assert.equal(layered.unlockedRelationships.filter(id=>id==='REL-HANUMAN-RAMA-DEVOTION'||id==='REL-HANUMAN-RAMA-SERVICE').length,2);
let exploration=normalizeProgress({legacySearchAccess:true});
assert.equal(choosePrediction(exploration,'HJ05-PREDICT','honor').predictionChoices['HJ05-PREDICT'],undefined);
exploration=normalizeProgress({legacySearchAccess:true,completedNodes:journeyNodes.slice(0,4).map(node=>node.id)});
const starsBefore=correctAnswerCount(exploration);
exploration=choosePrediction(exploration,'HJ05-PREDICT','honor');assert.equal(correctAnswerCount(exploration),starsBefore);assert.equal(exploration.predictionChoices['HJ05-PREDICT'],'honor');
exploration=discoverSceneItem(exploration,'HJ05-SCENE','mainaka');assert.ok(exploration.sceneDiscoveries.includes('HJ05-SCENE:mainaka'));assert.ok(exploration.unlockedCharacters.includes('Maināka'));assert.ok(exploration.achievements.includes('First Discovery'));
assert.ok(!discoverSceneItem(exploration,'HJ10-HIDDEN-TRIJATA','trijata').hiddenDiscoveries.includes('HJ10-HIDDEN-TRIJATA:trijata'));
exploration=normalizeProgress({...exploration,completedNodes:journeyNodes.slice(0,9).map(node=>node.id)});
exploration=discoverSceneItem(exploration,'HJ10-HIDDEN-TRIJATA','trijata');assert.ok(exploration.hiddenDiscoveries.includes('HJ10-HIDDEN-TRIJATA:trijata'));
assert.ok(!discoverObject(exploration,'ramas-ring').discoveredObjects.includes('ramas-ring'));
let ringExploration=normalizeProgress({meetingCompletedNodes:meetingNodes.map(node=>node.id),searchCompletedNodes:[searchNodes[0].id]});
ringExploration=discoverObject(ringExploration,'ramas-ring');assert.ok(ringExploration.discoveredObjects.includes('ramas-ring'));
exploration=normalizeProgress({...exploration,completedNodes:journeyNodes.slice(0,10).map(node=>node.id)});
exploration=recordStoryMemory(exploration,'HJ11-RING-JOURNEY',['rama','hanuman','sita']);assert.equal(exploration.storyMemoryAnswers['HJ11-RING-JOURNEY'],'rama,hanuman,sita');assert.equal(sacredObjects.length,2);assert.ok(Object.keys(activitiesByNode).length>=8);
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
assert.ok(normalizeProgress({legacySearchAccess:true,completedNodes:journeyNodes.slice(0,9).map(node=>node.id),sceneDiscoveries:['HJ10-GROVE:sita']}).revealedScenes.includes('HJ-10'));

// Chapter I expansion: independent progress, all activity formats, and old-save compatibility.
const {canEnterNode}=load('lib/progress');
let meeting=normalizeProgress(null);
assert.equal(meeting.currentNode,'HFM-01');assert.equal(meeting.legacySearchAccess,false);
assert.equal(canEnterNode(meeting,journeyNodes[0]),false);
assert.equal(canEnterNode(meeting,meetingNodes[1]),false);
assert.equal(progressTotals.encounters,35);assert.equal(progressTotals.masteryStars,105);
const allNodes=[...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes],allMasteries=allNodes.flatMap(node=>['explorer','seeker','scholar'].map(level=>masteryActivityFor(node,level)));assert.equal(allMasteries.length,105);assert.equal(allMasteries.filter(activity=>activity.misconceptionFeedback).length,61);assert.ok(allMasteries.filter(activity=>activity.stage==='scholar').every(activity=>activity.misconceptionFeedback));const hfm05Story=meetingNodes[4].activities.find(activity=>activity.type==='evidenceSort');assert.ok(hfm05Story);assert.deepEqual(hfm05Story.categories.map(category=>category.id),['known','likely','unknown']);assert.equal(hfm05Story.statements.length,4);assert.ok(hfm05Story.statements.every(statement=>statement.feedbackByCategory));
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
 if(story.type==='evidenceSort')meeting=recordStoryMemory(meeting,story.id,story.statements.map(statement=>statement.correct));
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
assert.deepEqual(new Set(meeting.unlockedRelationships),new Set(['REL-HANUMAN-SUGRIVA-SERVICE','REL-HANUMAN-RAMA-DEVOTION','REL-SUGRIVA-RAMA-ALLIANCE','REL-RAMA-LAKSHMANA-FAMILY','REL-RAMA-SITA-MARRIAGE']),'Chapter I records the family, service, devotion, and alliance facts witnessed in the story');
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
const lankini=journeyNodes[7],lankiniSource=fs.readFileSync(path.join(root,'components/source-comparison.tsx'),'utf8');
assert.match(lankini.story,/reduces his form/);assert.match(lankini.story,/restraint/);assert.match(lankini.teaching,/exactly what the mission requires/);
assert.match(lankini.scene.imageLocked,/hj-08-locked-v3/);assert.match(lankini.scene.imageRevealed,/hj-08-revealed-v3/);for(const asset of [lankini.scene.imageLocked,lankini.scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)));
assert.match(crossingUi,/small form reveal/);assert.match(crossingUi,/crossed the ocean through extraordinary power/);assert.match(crossingUi,/smaller means weaker/);
const lankiniMastery=['explorer','seeker','scholar'].map(level=>masteryActivityFor(lankini,level));assert.match(lankiniMastery[0].prompt,/change prepares/);assert.match(lankiniMastery[1].prompt,/reduced form/);assert.match(lankiniMastery[2].prompt,/powerful rescuer/);assert.doesNotMatch(lankiniMastery[2].prompt,/gnat/i);
const beforeLankiniMastery=recordCrossingTrailAnswer(normalizeProgress({legacySearchAccess:true,completedNodes:journeyNodes.slice(0,7).map(node=>node.id)}),'HJ-08','measured');assert.equal(beforeLankiniMastery.crossingTrailAnswers['HJ-08'],'measured');assert.ok(!beforeLankiniMastery.achievements.includes(crossingMemoryNames[4]),'Basic reduced-form story record must not require three stars');
assert.match(lankiniSource,/as small as a gnat/);assert.match(lankiniSource,/reduces his size to a form suited to concealment/);
console.log('Passed: Chapter III — five authored obstacle-reading interactions, Crossing Trail persistence, nonblocking repair, transfer mastery, best-score preservation, old saves, and Chapter IV handoff.');

// Chapter IV: evidence precedes interpretation; trust is verified and the Ring becomes active proof.
assert.deepEqual(chapterFourNodeIds,['HJ-09','HJ-10','HJ-11']);assert.deepEqual(trustThread.map(stage=>stage.verb),['Assess','Verify','Prove']);
assert.equal(hanumanCampaignChapters.find(c=>c.id==='HC-04').completionCopy,'The search becomes hope.');
assert.deepEqual(journeyNodes.slice(8,11).map(node=>node.id),chapterFourNodeIds);
assert.deepEqual(journeyNodes.slice(8,11).map(node=>node.scene.imageRevealed),['/images/journey/hanuman/hj-09-revealed-v2.png','/images/journey/hanuman/hj-10-revealed-v2.png','/images/journey/hanuman/hj-11-revealed-v2.png']);
for(const asset of [journeyNodes[10].scene.imageLocked,journeyNodes[10].scene.imageRevealed])assert.ok(fs.existsSync(path.join(root,'public',asset)),asset);
assert.deepEqual(journeyNodes[8].sourceLabels,['RCM-GP','Compare Traditions']);assert.doesNotMatch(journeyNodes[8].sourceLabels.join(' '),/VR-/);assert.match(journeyNodes[8].whyHere.textual,/Vālmīki structures this portion differently/);
const chapterFourUi=fs.readFileSync(path.join(root,'components/chapter-four-experience.tsx'),'utf8');assert.match(chapterFourUi,/Trust Thread/);assert.match(chapterFourUi,/Reasoning repair/);assert.match(chapterFourUi,/Rāma → Hanumān/);assert.match(JSON.stringify(activitiesByNode['HJ-10']),/unknown presence inside enemy territory/);
let chapterFour=normalizeProgress(crossing);
// HJ-09: a premature trust choice persists, requires a second signal, and can be revised.
const h9=journeyNodes[8];assert.equal(canEnterNode(chapterFour,h9),true);chapterFour=discoverSceneItem(chapterFour,'HJ09-EVIDENCE','devotion');chapterFour=discoverSceneItem(chapterFour,'HJ09-EVIDENCE','speech');chapterFour=choosePrediction(chapterFour,'C4-HJ09-DECISION','reveal');assert.equal(chapterFour.predictionChoices['C4-HJ09-DECISION'],'reveal');chapterFour=choosePrediction(chapterFour,'C4-HJ09-REPAIR','second-sign');assert.equal(chapterFour.predictionChoices['C4-HJ09-REPAIR'],'second-sign');chapterFour=choosePrediction(chapterFour,'C4-HJ09-DECISION','observe');chapterFour=discoverSceneItem(chapterFour,'HJ09-CHARACTER');chapterFour=discoverSceneItem(chapterFour,'HJ09-RELATION');chapterFour=revealStoryScene(chapterFour,h9.id);
for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h9,level);assert.ok(a.prompt&&a.explanation);chapterFour=completeChallenge(chapterFour,h9,level,a.id,correctResponse(a));}
assert.ok(chapterFour.completedNodes.includes('HJ-09'));assert.ok(chapterFour.unlockedRelationships.includes('REL-HANUMAN-VIBHISHANA-FRIENDSHIP'));assert.ok(chapterFour.achievements.includes(chapterFourBasicMemories['HJ-09']));assert.ok(chapterFour.achievements.includes(chapterFourDeepMemories['HJ-09']));
// HJ-10: a plausible palace candidate is tested, contradicted and revised before the grove verification.
const h10=journeyNodes[9],mandodariActivities=activitiesByNode['HJ-10'].filter(activity=>activity.id.includes('MANDODARI')||activity.id.includes('FIRST-HYPOTHESIS')||activity.id.includes('REVISE-HYPOTHESIS'));assert.equal(mandodariActivities.length,3);assert.ok(mandodariActivities.every(activity=>activity.sources.length===1&&activity.sources[0]==='VR-GP'),'The Mandodarī sequence stays in the Vālmīki source layer');assert.match(h10.story,/Rāvaṇa’s palace/);assert.match(h10.story,/corrects the first conclusion/);assert.doesNotMatch(h10.story,/fool|obvious mistake/i);
chapterFour=choosePrediction(chapterFour,'C4-HJ10-FIRST-HYPOTHESIS','accept');assert.equal(chapterFour.predictionChoices['C4-HJ10-FIRST-HYPOTHESIS'],'accept');chapterFour=choosePrediction(chapterFour,'C4-HJ10-FIRST-HYPOTHESIS','observe');chapterFour=recordStoryMemory(chapterFour,'C4-HJ10-MANDODARI-EVIDENCE',['supports','contradicts','contradicts','insufficient']);chapterFour=choosePrediction(chapterFour,'C4-HJ10-REVISE-HYPOTHESIS','palace');chapterFour=choosePrediction(chapterFour,'C4-HJ10-REVISE-HYPOTHESIS','continue');
for(const clue of ['condition','captivity','remembrance'])chapterFour=discoverSceneItem(chapterFour,'HJ10-EVIDENCE',clue);chapterFour=choosePrediction(chapterFour,'C4-HJ10-DECISION','immediate');chapterFour=choosePrediction(chapterFour,'C4-HJ10-REPAIR','sita-perspective');chapterFour=choosePrediction(chapterFour,'C4-HJ10-DECISION','wait');chapterFour=discoverSceneItem(chapterFour,'HJ10-CHARACTERS');chapterFour=revealStoryScene(chapterFour,h10.id);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h10,level);chapterFour=completeChallenge(chapterFour,h10,level,a.id,correctResponse(a));}
assert.ok(chapterFour.completedNodes.includes('HJ-10'));assert.ok(chapterFour.unlockedCharacters.includes('Sītā'));assert.ok(chapterFour.achievements.includes('Found Sītā in Aśoka Vātikā'));assert.ok(chapterFour.achievements.includes('Recognition Requires Patience'));
// HJ-11: prior Ring knowledge, words/token repair, coherent proof, and messenger connection.
const h11=journeyNodes[10];chapterFour=discoverObject(chapterFour,'ramas-ring');chapterFour=choosePrediction(chapterFour,'C4-HJ11-RECALL','recognition');chapterFour=choosePrediction(chapterFour,'C4-HJ11-DECISION','words');assert.equal(chapterFour.predictionChoices['C4-HJ11-DECISION'],'words');chapterFour=choosePrediction(chapterFour,'C4-HJ11-DECISION','combined');chapterFour=recordStoryMemory(chapterFour,'C4-HJ11-PROOF',['approach','connection','ring','message']);chapterFour=discoverSceneItem(chapterFour,'HJ11-MESSENGER');chapterFour=revealStoryScene(chapterFour,h11.id);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h11,level);chapterFour=completeChallenge(chapterFour,h11,level,a.id,correctResponse(a));}
assert.equal(chapterFour.completedNodes.length,11);assert.equal(canEnterNode(chapterFour,journeyNodes[11]),true,'Chapter V unlocks after the proof encounter');assert.ok(chapterFour.discoveredObjects.includes('ramas-ring'));assert.ok(!chapterFour.discoveredObjects.includes('sitas-cudamani'),'The future cūḍāmaṇi endpoint remains hidden until its existing return encounter');assert.ok(chapterFour.unlockedRelationships.includes('REL-HANUMAN-SITA-MESSENGER'));assert.ok(chapterFour.achievements.includes('Gave Sītā Rāma’s Ring and carried her message onward'));assert.ok(chapterFour.achievements.includes('Proof Aligns Object, Message, and Relationship'));
const c4Mastery=journeyNodes.slice(8,11).flatMap(node=>['explorer','seeker','scholar'].map(level=>masteryActivityFor(node,level)));assert.equal(c4Mastery.length,9);assert.equal(c4Mastery.filter(a=>a.stage==='scholar').length,3);assert.ok(c4Mastery.filter(a=>a.stage==='scholar').every(a=>/hostile|incomplete|dangerous|workshop/.test(a.prompt)));assert.ok(c4Mastery.every(a=>!a.prompt.includes('source code')));assert.match(masteryActivityFor(h10,'explorer').prompt,/first plausible candidate/);assert.match(masteryActivityFor(h10,'seeker').prompt,/context outweigh/);assert.match(masteryActivityFor(h10,'scholar').prompt,/workshop/);
const legacyChapterFourAnswer=`MA-HJ-10-explorer|${challengeFor(h10,'explorer',0).answer}`;assert.equal(storedMasteryIsCorrect(h10,'explorer',legacyChapterFourAnswer),true,'Pre-redesign Chapter IV mastery stars remain valid');
assert.equal(storedMasteryIsCorrect(h10,'explorer','MA-HJ-10-explorer|context,devotion,prior'),true,'Previous HJ-10 evidence mastery remains valid');assert.equal(storedMasteryIsCorrect(h10,'seeker','MA-HJ-10-seeker|a'),true,'Previous HJ-10 perspective mastery remains valid');
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(chapterFour))),chapterFour);assert.deepEqual(mergeProgress(crossing,chapterFour).completedNodes,chapterFour.completedNodes);
console.log('Passed: Chapter IV — Trust Thread, evidence hierarchy, perspective repair, Ring proof chain, nine mastery activities, memories, relationships, source distinction, persistence, and Chapter V handoff.');

// Chapter V: escalation becomes message, consequence, and a prioritized mission report.
assert.deepEqual(chapterFiveNodeIds,['HJ-12','HJ-13','HJ-14','HJ-15']);assert.equal(escalationTrail.length,7);assert.deepEqual(escalationTrail.map(step=>step.label),['Hidden messenger','Discovered in the grove','Open conflict','Capture / court','Warning delivered','Laṅkā burns','Mission report']);
const chapterFiveUi=fs.readFileSync(path.join(root,'components/chapter-five-experience.tsx'),'utf8'),chapterFiveCss=fs.readFileSync(path.join(root,'components/chapter-five-experience.module.scss'),'utf8');assert.match(chapterFiveUi,/Read escalation/);assert.match(chapterFiveUi,/Deliver/);assert.match(chapterFiveUi,/Trace consequence/);assert.match(chapterFiveUi,/useful intelligence/);assert.match(chapterFiveCss,/prefers-reduced-motion/);
let chapterFive=normalizeProgress(chapterFour);
const h12=journeyNodes[11];assert.equal(canEnterNode(chapterFive,h12),true);assert.match(h12.story,/Brahmāstra/);assert.equal(h12.subEncounters.length,6);
chapterFive=discoverSceneItem(chapterFive,'HJ12-BATTLE-DISCOVERIES','12.1');for(const [id,answer,spots] of [['C5-HJ12-BEAT-2','military',['12.2','12.3','12.4']],['C5-HJ12-BEAT-3','royal',['12.5']],['C5-HJ12-BEAT-4','capture',['12.6']]]){chapterFive=choosePrediction(chapterFive,id,id==='C5-HJ12-BEAT-3'?'insignificant':answer);chapterFive=choosePrediction(chapterFive,id,answer);for(const spot of spots)chapterFive=discoverSceneItem(chapterFive,'HJ12-BATTLE-DISCOVERIES',spot);}assert.equal(chapterFive.sceneDiscoveries.filter(id=>id.startsWith('HJ12-BATTLE-DISCOVERIES:')).length,6);
chapterFive=revealStoryScene(chapterFive,h12.id);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h12,level);chapterFive=completeChallenge(chapterFive,h12,level,a.id,wrongResponse(a));chapterFive=completeChallenge(chapterFive,h12,level,a.id,correctResponse(a));}assert.ok(chapterFive.completedNodes.includes('HJ-12'));assert.ok(chapterFive.achievements.includes(chapterFiveBasicMemories['HJ-12']));assert.ok(chapterFive.achievements.includes(chapterFiveDeepMemories['HJ-12']));
const h13=journeyNodes[12];chapterFive=choosePrediction(chapterFive,'C5-HJ13-TONE','ego');chapterFive=choosePrediction(chapterFive,'C5-HJ13-REPAIR','ego');chapterFive=choosePrediction(chapterFive,'C5-HJ13-TONE','service');chapterFive=recordStoryMemory(chapterFive,'C5-HJ13-MESSAGE',['identity','fact','warning','way-out']);chapterFive=choosePrediction(chapterFive,'C5-HJ13-REACTION','refusal');chapterFive=discoverSceneItem(chapterFive,'C5-HJ13-MESSENGER');chapterFive=revealStoryScene(chapterFive,h13.id);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h13,level);chapterFive=completeChallenge(chapterFive,h13,level,a.id,correctResponse(a));}assert.ok(chapterFive.unlockedRelationships.includes('REL-HANUMAN-RAVANA-MESSENGER'));assert.ok(chapterFive.achievements.includes(chapterFiveDeepMemories['HJ-13']));
const h14=journeyNodes[13];chapterFive=recordStoryMemory(chapterFive,'C5-HJ14-CAUSE',['consequence','spread','movement','response','wrapped','decision']);assert.equal(chapterFive.storyMemoryAnswers['C5-HJ14-CAUSE'],'consequence,spread,movement,response,wrapped,decision');chapterFive=recordStoryMemory(chapterFive,'C5-HJ14-CAUSE',['decision','wrapped','response','movement','spread','consequence']);chapterFive=choosePrediction(chapterFive,'C5-HJ14-TURN','movement');chapterFive=choosePrediction(chapterFive,'C5-HJ14-MISSION','sita');chapterFive=revealStoryScene(chapterFive,h14.id);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h14,level);chapterFive=completeChallenge(chapterFive,h14,level,a.id,correctResponse(a));}assert.ok(chapterFive.achievements.includes(chapterFiveBasicMemories['HJ-14']));
const h15=journeyNodes[14];chapterFive=recordStoryMemory(chapterFive,'C5-HJ15-REPORT',['sita','proof','next']);chapterFive=choosePrediction(chapterFive,'C5-HJ15-INTELLIGENCE','priority');chapterFive=recordStoryMemory(chapterFive,'C5-HJ15-CUDAMANI',['sita','hanuman','rama']);chapterFive=discoverObject(chapterFive,'sitas-cudamani');chapterFive=discoverSceneItem(chapterFive,'C5-HJ15-MESSENGER');chapterFive=revealStoryScene(chapterFive,h15.id);for(const level of ['explorer','seeker','scholar']){const a=masteryActivityFor(h15,level);chapterFive=completeChallenge(chapterFive,h15,level,a.id,correctResponse(a));}
assert.equal(chapterFive.completedNodes.length,15);assert.ok(chapterFive.discoveredObjects.includes('sitas-cudamani'));assert.equal(chapterFive.storyMemoryAnswers['C5-HJ15-CUDAMANI'],'sita,hanuman,rama');assert.ok(chapterFive.unlockedRelationships.includes('REL-HANUMAN-RAMA-MESSENGER'));assert.ok(chapterFive.achievements.includes(chapterFiveBasicMemories['HJ-15']));assert.ok(chapterFive.achievements.includes(chapterFiveDeepMemories['HJ-15']));assert.equal(canEnterNode(chapterFive,warNodes[0]),true,'Chapter VI unlocks after the mission report');
const c5Mastery=journeyNodes.slice(11,15).flatMap(node=>['explorer','seeker','scholar'].map(level=>masteryActivityFor(node,level)));assert.equal(c5Mastery.length,12);assert.ok(c5Mastery.filter(a=>a.stage==='scholar').every(a=>/leader|hostile ruler|public punishment|rescue scout/.test(a.prompt)));assert.ok(c5Mastery.every(a=>a.explanation&&a.hint));
const h12Rewards=encounterCompletionRewards(h12,chapterFive,{earned:6,total:6});const characterReward=h12Rewards.find(reward=>reward.type==='character');assert.ok(characterReward.detail.includes('Akṣa Kumāra')&&characterReward.detail.includes('Indrajit'));assert.ok(!characterReward.detail.includes('Kiṅkaras'));
const legacyChapterFiveAnswer=`MA-HJ-12-explorer|${journeyNodes.slice(10,13).map(node=>node.id).join(',')}`;assert.equal(storedMasteryIsCorrect(h12,'explorer',legacyChapterFiveAnswer),true,'Pre-redesign Chapter V mastery stars remain valid');
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(chapterFive))),chapterFive);assert.deepEqual(mergeProgress(chapterFour,chapterFive).completedNodes,chapterFive.completedNodes);
console.log('Passed: Chapter V — Escalation Trail, six-stage source record compressed into four playable beats, capture/court reasoning, messenger repair, causal reconstruction, report priority, twelve mastery activities, memories, connections, cūḍāmaṇi return, old saves, and Chapter VI handoff.');

// Chapter VI: all six encounters, nonblocking answers, persistent best scores and chapter handoff.
let war=chapterFive;
assert.deepEqual(chapterSixNodeIds,warNodes.map(n=>n.id));assert.deepEqual(warCouncilSteps.map(step=>step.category),['Intelligence','Advice','Roles','Threats','Protection','Priority']);
const chapterSixUi=fs.readFileSync(path.join(root,'components/chapter-six-experience.tsx'),'utf8'),chapterSixCss=fs.readFileSync(path.join(root,'components/chapter-six-experience.module.scss'),'utf8');assert.match(chapterSixUi,/War Council/);assert.match(chapterSixUi,/Prioritize/);assert.match(chapterSixUi,/Counsel/);assert.match(chapterSixUi,/Coordinate/);assert.match(chapterSixUi,/Triage/);assert.match(chapterSixUi,/Vālmīki Rāmāyaṇa/);assert.doesNotMatch(chapterSixUi,/Later popular tradition/);assert.match(chapterSixCss,/grid-template-columns:repeat\(6/);assert.match(chapterSixCss,/prefers-reduced-motion/);
function playChapterSixNode(progress,nodeId){
 const acts=activitiesByNode[nodeId].filter(a=>a.id.startsWith('C6-'));
 for(const a of acts){
  if(a.type==='predictionChoice'){const wrong=a.choices.find(choice=>choice.id!==a.canonicalAnswer).id;progress=choosePrediction(progress,a.id,wrong);assert.equal(progress.predictionChoices[a.id],wrong);progress=choosePrediction(progress,a.id,a.canonicalAnswer);}
  if(a.type==='storyMemory'){progress=recordStoryMemory(progress,a.id,a.correctOrder.slice().reverse());assert.ok(progress.storyMemoryAnswers[a.id]);progress=recordStoryMemory(progress,a.id,a.correctOrder);}
  if(a.type==='sceneDiscovery')for(const hotspot of a.hotspots)progress=discoverSceneItem(progress,a.id,hotspot.id);
  if(a.type==='characterUnlock'||a.type==='relationshipUnlock')progress=discoverSceneItem(progress,a.id);
 }
 return progress;
}
assert.equal(canEnterNode(normalizeProgress(null),warNodes[0]),false);
assert.equal(canEnterNode(war,warNodes[1]),false);
assert.equal(normalizeProgress({...war,warCompletedNodes:['HFW-06']}).warCompletedNodes.length,0);
assert.equal(normalizeProgress({warCompletedNodes:warNodes.map(n=>n.id),herbsCompletedNodes:herbsNodes.map(n=>n.id)}).warCompletedNodes.length,0);
const previousObjects=war.discoveredObjects.slice(),previousKnowledge=war.characterChallengeAnswers;
for(const node of warNodes){
 assert.ok(canEnterNode(war,node));
 war=playChapterSixNode(war,node.id);
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
 assert.ok(war.achievements.includes(chapterSixBasicMemories[node.id]));assert.ok(war.achievements.includes(chapterSixDeepMemories[node.id]));
 assert.deepEqual(nodeMastery(mergeProgress(war,beforeRetry),node),[true,true,true]);
 assert.deepEqual(war.completedNodes,combined.completedNodes);
 assert.deepEqual(war.meetingCompletedNodes,combined.meetingCompletedNodes);
 assert.deepEqual(war.discoveredObjects,previousObjects);
 assert.deepEqual(war.characterChallengeAnswers,previousKnowledge);
 assert.equal(ramayanaEventById[node.id].chapterId,'HC-06');
 assert.ok(ramayanaEventById[node.id].sourceRefs.every(s=>s.source==='VR-GP'&&s.verification==='pendingEditionAudit'));
}
assert.equal(war.warCompletedNodes.length,6);assert.equal(correctAnswerCount(war),84);
const c6Mastery=warNodes.flatMap(node=>['explorer','seeker','scholar'].map(level=>masteryActivityFor(node,level)));assert.equal(c6Mastery.length,18);assert.ok(c6Mastery.every(a=>a.explanation&&a.hint));assert.ok(c6Mastery.filter(a=>a.stage==='scholar').every(a=>/relief team|trusted adviser|team|alerts|teammate|crisis team/.test(a.prompt)));assert.deepEqual(new Set(c6Mastery.map(a=>a.type)),new Set(['singleSelect','multiSelect','matching','sequence']));
const oldWarMastery=warMastery(warNodes[0],'explorer'),legacyWarAnswer=`${oldWarMastery.id}|${correctResponse(oldWarMastery)}`;assert.equal(storedMasteryIsCorrect(warNodes[0],'explorer',legacyWarAnswer),true,'Pre-redesign Chapter VI mastery stars remain valid');
assert.ok(war.characterJourneys.hanuman.completedChapterIds.includes('HC-06'));
assert.ok(war.characterJourneys.hanuman.completedEventIds.includes('HFW-06'));
assert.equal(hanumanCampaignChapters.find(c=>c.id==='HC-07').playableNodeIds.length,3);
for(const name of ['Nala','Dhumrākṣa','Akampana','Kumuda','Mainda'])assert.ok(war.unlockedCharacters.includes(name),name);
for(const id of ['REL-HANUMAN-VIBHISHANA-ALLIANCE','REL-VIBHISHANA-RAMA-ALLIANCE','REL-NALA-RAMA-SERVICE','REL-DHUMRAKSHA-HANUMAN-OPPOSITION','REL-AKAMPANA-HANUMAN-OPPOSITION','REL-JAMBAVAN-HANUMAN-RESCUE'])assert.ok(war.unlockedRelationships.includes(id),id);
assert.ok(availableRelationshipIds(15,5,6).includes('REL-JAMBAVAN-HANUMAN-RESCUE'));
assert.equal(sacredObjects.length,2);
assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(war))),war);
assert.deepEqual(mergeProgress(combined,war).warCompletedNodes,war.warCompletedNodes);
assert.match(meetingNodes[3].challenge.prompt,/in this encounter/);
console.log('Passed: Chapter VI — six encounters, eighteen mastery activities, evidence sorting, source separation, scene pairs/reveals, wrong-answer progression, best-score retakes/merge, relationships, preserved legacy progress, and Chapter VII handoff.');

// Chapter VII keeps both medicinal missions separate and preserves every earlier save field.
let herbs=normalizeProgress(war);
assert.deepEqual(chapterSevenNodeIds,herbsNodes.map(node=>node.id));assert.deepEqual(rescueBriefSteps.map(step=>step.label),['Needed servant','First rescue','Second rescue']);
const chapterSevenUi=fs.readFileSync(path.join(root,'components/chapter-seven-experience.tsx'),'utf8'),chapterSevenCss=fs.readFileSync(path.join(root,'components/chapter-seven-experience.module.scss'),'utf8');assert.match(chapterSevenUi,/Rescue Brief/);assert.match(chapterSevenUi,/Identify the needed servant/);assert.match(chapterSevenUi,/Preserve precision/);assert.match(chapterSevenUi,/Two similar journeys · two distinct missions/);assert.match(chapterSevenUi,/Four named medicines/);assert.doesNotMatch(chapterSevenUi,/countdown|time remaining/i);assert.match(chapterSevenCss,/prefers-reduced-motion/);
function playChapterSevenNode(progress,nodeId){
 for(const a of activitiesByNode[nodeId].filter(activity=>activity.id.startsWith('C7-'))){
  if(a.type==='predictionChoice'){const wrong=a.choices.find(option=>option.id!==a.canonicalAnswer).id;progress=choosePrediction(progress,a.id,wrong);assert.equal(progress.predictionChoices[a.id],wrong);progress=choosePrediction(progress,a.id,a.canonicalAnswer);}
  if(a.type==='characterUnlock'||a.type==='relationshipUnlock')progress=discoverSceneItem(progress,a.id);
 }
 return progress;
}
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
assert.equal(rescueComparisons.length,2);assert.ok(rescueComparisons[0].source.includes('74:19–35, 61–77'));assert.ok(rescueComparisons[1].source.includes('101:28–45'));
const newFormats=[];
for(const node of herbsNodes){
 assert.ok(canEnterNode(herbs,node));
 herbs=playChapterSevenNode(herbs,node.id);
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
 assert.ok(herbs.achievements.includes(chapterSevenBasicMemories[node.id]));assert.ok(herbs.achievements.includes(chapterSevenDeepMemories[node.id]));
 for(const key of ['completedNodes','meetingCompletedNodes','warCompletedNodes','discoveredObjects','characterChallengeAnswers'])assert.deepEqual(herbs[key],war[key],`Preserve ${key}`);
}
assert.equal(newFormats.length,9);assert.deepEqual(new Set(newFormats),new Set(['singleSelect','multiSelect','matching']));
const c7Mastery=herbsNodes.flatMap(node=>['explorer','seeker','scholar'].map(level=>masteryActivityFor(node,level)));assert.equal(c7Mastery.length,9);assert.ok(c7Mastery.every(a=>a.explanation&&a.hint));assert.ok(c7Mastery.filter(a=>a.stage==='scholar').every(a=>/emergenc|rescue team/.test(a.prompt)));
const oldHerbsMastery=herbsMastery(herbsNodes[0],'explorer'),legacyHerbsAnswer=`${oldHerbsMastery.id}|${correctResponse(oldHerbsMastery)}`;assert.equal(storedMasteryIsCorrect(herbsNodes[0],'explorer',legacyHerbsAnswer),true,'Pre-redesign Chapter VII mastery stars remain valid');
assert.equal(correctAnswerCount(herbs),93);assert.equal(progressCounts(herbs).encounters,31);
assert.ok(herbs.characterJourneys.hanuman.completedChapterIds.includes('HC-07'));
assert.ok(herbs.unlockedCharacters.includes('Suṣeṇa'));
assert.equal(characterKnowledgeProfiles.find(p=>p.characterId==='sushena').depth,'supporting');
const sushenaFields=characterProfileFields.filter(f=>f.characterId==='sushena');assert.ok(sushenaFields.length>=8);assert.ok(!sushenaFields.some(f=>f.section==='family'));assert.equal(characterKnowledgeProgress('sushena',herbs).percentage,100);
assert.equal(sacredObjects.length,2);assert.deepEqual(herbs.discoveredObjects,war.discoveredObjects);
assert.equal(hanumanCampaignChapters.find(c=>c.id==='HC-08').playableNodeIds.length,4);
for(const id of ['REL-SUSHENA-LAKSHMANA-PROTECTOR','REL-SUSHENA-HANUMAN-GUIDANCE']){
 assert.ok(!war.unlockedRelationships.includes(id));assert.ok(herbs.unlockedRelationships.includes(id),'Story-established healing relationships enter the network');
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
const hff01Next=finaleNodes[0].activities.find(a=>a.id==='HFF-01-NEXT');assert.equal(hff01Next.type,'predictionChoice');assert.equal(hff01Next.revisable,true);assert.match(hff01Next.choices.find(c=>c.id===hff01Next.canonicalAnswer).label,/Sītā must receive the news/);assert.match(hff01Next.feedbackByChoice['0'],/who still does not know/i);
const hff02Message=finaleNodes[1].activities.find(a=>a.id==='HFF-02-MESSAGE');assert.equal(hff02Message.type,'predictionChoice');assert.match(hff02Message.explanation,/ring|trusted messenger/i);assert.match(hff02Message.feedbackByChoice['0'],/most need to know first/i);
const hff03Prepare=finaleNodes[2].activities.find(a=>a.id==='HFF-03-PREPARE');assert.equal(hff03Prepare.type,'predictionChoice');assert.match(hff03Prepare.canonicalReveal,/Who.*what has happened.*what comes next/i);assert.match(hff03Prepare.feedbackByChoice['1'],/Bharata specifically need/i);
const hff04Trail=finaleNodes[3].activities.find(a=>a.id==='HFF-04-TRAIL');assert.equal(hff04Trail.type,'storyMemory');assert.equal(hff04Trail.items.length,4);assert.ok(hff04Trail.items.every(item=>!/Chapter [IVX]+/.test(item.label)));
const finaleChapter=hanumanCampaignChapters.find(c=>c.id==='HC-08');
assert.equal(chapterStatus(finaleChapter,finale),'Current');
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
assert.deepEqual(new Set(finaleFormats),new Set(['singleSelect','matching','sequence']));
const finaleTransferPrompts=finaleNodes.map(node=>masteryActivityFor(node,'scholar').prompt);assert.match(finaleTransferPrompts[0],/rescue team.*has not been told/i);assert.match(finaleTransferPrompts[1],/waited in uncertainty/i);assert.match(finaleTransferPrompts[2],/different listeners/i);assert.match(finaleTransferPrompts[3],/service can continue/i);
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
for(const node of finaleNodes){const old=legacyFinaleMastery(node,'scholar'),saved=`${old.id}|${correctResponse(old)}`;assert.equal(storedMasteryIsCorrect(node,'scholar',saved),true,'Pre-alignment Chapter VIII mastery stars remain valid');}
const missionMapSource=fs.readFileSync(path.join(root,'components/mission-chapter-entry.tsx'),'utf8');assert.match(missionMapSource,/useEffect\(\(\)=>\{setSelected\(Math\.min\(progress\.finaleCompletedNodes\.length,finaleNodes\.length-1\)\)/,'Chapter VIII map follows restored progress after hydration');
const finaleViewSource=fs.readFileSync(path.join(root,'components/finale-experience.tsx'),'utf8');assert.match(finaleViewSource,/stars===3&&<div className=\{styles\.finalMemory\}/,'Final memory remains hidden until three stars');assert.match(finaleViewSource,/Two completed journeys of trust/);assert.equal(sacredObjects.length,2);
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

// Global information architecture: destinations explain their purpose and expose current state.
const siteHeaderSource=fs.readFileSync(path.join(root,'components/site-header.tsx'),'utf8');
assert.match(siteHeaderSource,/usePathname/,'Navigation derives its selected state from the current route');
for(const [label,meaning] of [['Map','Where'],['Journey','Story order'],['Characters','Who'],['Connections','Relationships'],['Progress','Your record']]){
 assert.ok(siteHeaderSource.includes(`label:"${label}",meaning:"${meaning}"`),`${label} explains its destination`);
}
assert.match(siteHeaderSource,/aria-current=\{current\?"page":undefined\}/,'The active destination is announced accessibly');
assert.match(siteHeaderSource,/Saved locally/,'Local persistence reads as status instead of a primary action');
assert.match(siteHeaderSource,/Progress saved locally\. Sign in to sync across devices\./,'The compact save state retains an explanatory accessible name');
const campaignMapSource=fs.readFileSync(path.join(root,'components/campaign-map.tsx'),'utf8');
const journeyIndexSource=fs.readFileSync(path.join(root,'app/journey/page.tsx'),'utf8');
assert.match(campaignMapSource,/Map · Where the journey moves/);
assert.match(campaignMapSource,/Select a chapter region, then enter its encounter map\./);
assert.match(journeyIndexSource,/Journey · The story in order/);
assert.match(journeyIndexSource,/Use Map when you want to see where the campaign travels\./);
console.log('Passed: global navigation selected states, semantic labels, quiet save status, and Map/Journey distinction.');

// Goal 2 targeted cleanup: continuity, contextual return, mobile tabs, rewards, and source/object history.
const progressPageSource=fs.readFileSync(path.join(root,'app/progress/page.tsx'),'utf8');
assert.match(progressPageSource,/Current journey · Chapter/,'Progress leads with the current narrative state');
assert.match(progressPageSource,/Last time/,'Progress preserves recent story context');
assert.match(progressPageSource,/Revisit final journey/,'Completed campaigns retain a meaningful next action');
assert.match(progressPageSource,/encounterHref\(nextNode\.slug,"progress"\)/,'Progress records encounter origin');
const encounterSource=fs.readFileSync(path.join(root,'components/encounter.tsx'),'utf8');
assert.match(encounterSource,/scrollIntoView\(\{behavior:reduced\?"auto":"smooth",block:"start"\}\)/,'Phase and replay changes restore visible focus');
assert.match(encounterSource,/encounterReturn\(window\.location\.search\)/,'Encounter return respects its entry context');
assert.match(encounterSource,/Story · Revealed/,'Reveal is framed as the resolution of Story');
assert.match(encounterSource,/Reflect on what happened/,'Story now bridges explicitly into mastery');
assert.match(encounterSource,/Journey record ·/,'Secondary completion rewards are progressively disclosed');
const connectionPageSource=fs.readFileSync(path.join(root,'app/connections/page.tsx'),'utf8');
const connectionStyles=fs.readFileSync(path.join(root,'app/connections/connections.module.scss'),'utf8');
assert.doesNotMatch(connectionPageSource,/role="tablist"|role="tab"/,'Connection modes use ordinary pressed buttons, not incomplete tabs');assert.equal((connectionPageSource.match(/aria-pressed=\{mode===/g)||[]).length,3);assert.match(connectionStyles,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/,'Connection modes fit at 390px without horizontal clipping');
const objectCardSource=fs.readFileSync(path.join(root,'components/sacred-object-card.tsx'),'utf8');
const objectHistorySource=fs.readFileSync(path.join(root,'data/sacred-object-history.ts'),'utf8');
assert.match(objectCardSource,/Sacred Object history/);assert.match(objectHistorySource,/rama-entrusts-the-ring/);assert.match(objectHistorySource,/ring-and-message/);assert.match(objectHistorySource,/return-to-rama/);assert.match(objectCardSource,/encounterHref\(step\.slug,"object",objectId\)/);
const {approvedSetuQuotes,mandodariSourceContext}=load('data/bhakti-pass-two');assert.deepEqual(approvedSetuQuotes.map(quote=>quote.source),['VR-GP','RCM-GP']);assert.ok(approvedSetuQuotes.every(quote=>quote.reference.verification==='verifiedPassage'));assert.match(mandodariSourceContext.locator,/printed pp\. 78–79; 11:1–4, printed p\. 79/);
const sourceComparisonSource=fs.readFileSync(path.join(root,'components/source-comparison.tsx'),'utf8');
assert.match(sourceComparisonSource,/Vālmīki Rāmāyaṇa · Preferred edition/);assert.match(sourceComparisonSource,/Return to \{node\.title\}/);
for(const [file,chapter] of [['meeting-map.tsx','HC-01'],['search-map.tsx','HC-02'],['crossing-map.tsx','HC-03'],['war-map.tsx','HC-06'],['herbs-map.tsx','HC-07']]){
 const source=fs.readFileSync(path.join(root,'components',file),'utf8');assert.ok(source.includes(`"chapter","${chapter}"`),`${file} retains chapter context`);
}
console.log('Passed: Goal 2 continuity, contextual return, mobile tabs, completion hierarchy, and Sacred Object/source pathways.');

// Animated Journey Companion: position is derived from campaign progress; motion requires a fresh progression event.
assert.equal(hanumanCompanionRoutes.length,8);assert.ok(hanumanCompanionRoutes.every(route=>route.campaignId==='hanuman'&&route.companionId==='hanuman'));assert.equal(hanumanCompanionRoutes.find(route=>route.chapterId==='HC-03').movementPreset,'crossing');assert.equal(hanumanCompanionRoutes.find(route=>route.chapterId==='HC-04').movementPreset,'stealth');assert.equal(hanumanCompanionRoutes.find(route=>route.chapterId==='HC-07').movementPreset,'emergency-flight');assert.equal(hanumanCompanionRoutes.find(route=>route.chapterId==='HC-08').movementPreset,'ceremonial-arrival');
assert.deepEqual(Object.keys(hanumanCampaignCompanionPositions),Object.keys(hanumanCampaignChapterPositions));assert.ok(Object.keys(hanumanCampaignCompanionPositions).every(id=>{const anchor=hanumanCampaignCompanionPositions[id];return (anchor.point.x!==hanumanCampaignChapterPositions[id].x||anchor.point.y!==hanumanCampaignChapterPositions[id].y)&&anchor.stateId&&anchor.terrain&&anchor.approachControl&&anchor.arrivalOffset&&anchor.ground.width>=22&&anchor.ground.width<=25;}),'Macro companion uses authored terrain anchors, arrival directions, and restrained ground treatments separate from chapter controls');
const facingRight=resolveRouteCompanionPlacement({x:40,y:40},{x:20,y:40},{x:60,y:40}),facingLeft=resolveRouteCompanionPlacement({x:60,y:40},{x:80,y:40},{x:40,y:40});assert.equal(facingRight.facing,'right');assert.equal(facingLeft.facing,'left');assert.ok(facingRight.point.x>45&&facingRight.point.x<60,'Companion rests visibly along the route without covering the current node');assert.ok(facingLeft.point.x<55&&facingLeft.point.x>40,'Mirrored travel keeps the companion clear of the current node');
const meetingRoute=hanumanCompanionRoutes.find(route=>route.chapterId==='HC-01');
const companionStart=resolveCompanionSnapshot(meetingRoute,[],false);assert.equal(companionStart.currentNodeId,'HFM-01');assert.equal(companionStart.previousNodeId,undefined);assert.equal(companionStart.visualState,'resting');
const companionMid=resolveCompanionSnapshot(meetingRoute,['HFM-01','HFM-02'],false);assert.equal(companionMid.currentNodeId,'HFM-03');assert.equal(companionMid.previousNodeId,'HFM-02');
const eventBase=progressionEventForNode('HFM-02'),event={...eventBase,id:'test-progress'};assert.equal(event.nextNodeId,'HFM-03');assert.equal(shouldAnimateCompanion(event,meetingRoute,companionMid),true);assert.equal(shouldAnimateCompanion(undefined,meetingRoute,companionMid),false,'Refresh without a transient event stays static');
const replayEvent={...progressionEventForNode('HFM-01'),id:'replay'};assert.equal(shouldAnimateCompanion(replayEvent,meetingRoute,companionMid),false,'Replay cannot move the companion backward');
assert.deepEqual(hanumanCampaignChapters.map(chapter=>hanumanCampaignCompanionStoryStates.filter(state=>state.chapterId===chapter.id).length),[1,3,4,3,3,4,3,4]);assert.equal(new Set(hanumanCampaignCompanionStoryStates.map(state=>state.stateId)).size,hanumanCampaignCompanionStoryStates.length);assert.ok(hanumanCampaignCompanionStoryStates.every(state=>state.terrain&&state.approachControl&&state.arrivalOffset&&state.mobilePoint),'Every macro story state has authored desktop/mobile placement and terrain grounding');
const chapterTransition={...progressionEventForNode('HFM-05'),id:'chapter-transition'},searchDeparture=resolveCampaignCompanionState(['HFM-01','HFM-02','HFM-03','HFM-04','HFM-05']);assert.equal(searchDeparture.stateId,'search-departs-kishkindha');assert.equal(shouldAnimateCampaignCompanion(chapterTransition,searchDeparture),true,'Completing a chapter advances the macro companion to the next authored story state');assert.equal(shouldAnimateCampaignCompanion(undefined,searchDeparture),false,'Reloading resolves the saved anchor without replaying movement');
const crossingStart=resolveCampaignCompanionState(['HFM-05','HFS-02','HJ-01','HJ-03']);assert.equal(crossingStart.stateId,'leap-prepared');const crossingLeap=resolveCampaignCompanionState(['HFM-05','HFS-02','HJ-01','HJ-03','HJ-04']);assert.equal(crossingLeap.stateId,'ocean-leap');assert.equal(previousCampaignCompanionState(crossingLeap).stateId,'leap-prepared');const crossingMiddle=resolveCampaignCompanionState(['HFM-05','HFS-02','HJ-01','HJ-03','HJ-04','HJ-05','HJ-06']);assert.equal(crossingMiddle.stateId,'mid-ocean-crossing');const crossingArrival=resolveCampaignCompanionState(['HFM-05','HFS-02','HJ-01','HJ-03','HJ-04','HJ-05','HJ-06','HJ-07','HJ-08']);assert.equal(crossingArrival.stateId,'lanka-threshold');assert.deepEqual([crossingStart,crossingLeap,crossingMiddle,crossingArrival].map(state=>state.movementPreset),['standard','leap','crossing','stealth']);
const restored=normalizeProgress({meetingCompletedNodes:['HFM-01','HFM-02']});assert.equal(resolveCompanionSnapshot(meetingRoute,restored.meetingCompletedNodes,false).currentNodeId,'HFM-03','Restored saves resolve the same position without animation');
const companionComplete=resolveCompanionSnapshot(meetingRoute,meetingRoute.nodeIds,false);assert.equal(companionComplete.currentNodeId,'HFM-05');assert.equal(companionComplete.visualState,'chapter-complete');
const finaleRoute=hanumanCompanionRoutes.find(route=>route.chapterId==='HC-08'),campaignEnd=resolveCompanionSnapshot(finaleRoute,finaleRoute.nodeIds,true);assert.equal(campaignEnd.currentNodeId,'HFF-04');assert.equal(campaignEnd.visualState,'campaign-complete');
const companionSource=fs.readFileSync(path.join(root,'components/journey-companion.tsx'),'utf8'),companionCss=fs.readFileSync(path.join(root,'components/journey-companion.module.scss'),'utf8'),campaignCompanionSource=fs.readFileSync(path.join(root,'components/use-campaign-companion.ts'),'utf8');assert.match(companionSource,/prefers-reduced-motion: reduce/);assert.match(companionSource,/data-facing/);assert.match(companionSource,/resolveRouteCompanionPlacement/);assert.match(companionSource,/curvePoint/);assert.match(companionSource,/setState\("departing"\)/);assert.match(companionSource,/controlB=\{x:to\.x\+arrivalOffset\.x/);assert.match(companionSource,/Object\.entries\(visual\.poses\)/,'Pose assets remain layered for a crossfade instead of swapping abruptly');assert.doesNotMatch(companionSource,/CharacterPortrait|styles\.name|styles\.marker/);assert.match(companionCss,/pointer-events:none/);assert.match(companionCss,/data-macro="true"\]\{width:50px;height:60px/);assert.match(companionCss,/data-facing="left"/);assert.match(companionCss,/@keyframes groundSettle/);assert.doesNotMatch(companionCss,/border-radius:50%.*background:#172d2d/);assert.match(companionCss,/@media\(max-width:760px\)/);assert.match(companionCss,/@media\(prefers-reduced-motion:reduce\)/);for(const pose of ['idle','moving','arriving'])assert.ok(fs.existsSync(path.join(root,'public',companionVisuals.hanuman.poses[pose])));assert.match(companionVisuals.hanuman.poses.idle,/hanuman-map-idle-v3\.png$/);assert.match(companionVisuals.hanuman.poses.moving,/hanuman-map-travel-v3\.png$/);assert.match(companionVisuals.hanuman.poses.arriving,/hanuman-map-arrive-v3\.png$/);assert.notEqual(companionVisuals.hanuman.poses.idle,companionVisuals.hanuman.poses.moving);assert.notEqual(companionVisuals.hanuman.poses.moving,companionVisuals.hanuman.poses.arriving);assert.match(campaignCompanionSource,/shouldAnimateCampaignCompanion/);
assert.match(campaignMapSource,/JourneyCompanion/,`The campaign atlas renders the Journey Companion`);assert.match(campaignMapSource,/function openChapterFromMarker/);assert.match(campaignMapSource,/onClick=\{\(\)=>openChapterFromMarker\(chapter\.id\)\}/,'Playable atlas chapter markers enter their chapter map directly');for(const file of ['meeting-map.tsx','search-map.tsx','crossing-map.tsx','journey-map.tsx','war-map.tsx','herbs-map.tsx','mission-chapter-entry.tsx'])assert.doesNotMatch(fs.readFileSync(path.join(root,'components',file),'utf8'),/JourneyCompanion/,`${file} keeps chapter maps focused on encounter controls`);
for(const file of ['meeting-map.tsx','war-map.tsx','herbs-map.tsx','mission-chapter-entry.tsx']){const source=fs.readFileSync(path.join(root,'components',file),'utf8');assert.match(source,/available\?<Link|canEnterNode\(progress,item\)\?<Link/,`${file} lets playable atlas markers enter encounters directly`);assert.match(source,/Locked.*onClick=\{\(\)=>setSelected|onClick=\{\(\)=>setSelected.*Locked/s,`${file} keeps locked markers interactive for feedback`);}
console.log('Passed: Journey Companion position, progression-only motion, replay safety, restore accuracy, reduced motion, mobile sizing, interaction safety, and campaign completion.');

// Goal 5: canonical restoration, best answers, story knowledge, and stale saves.
const {recordProgressChanges,recordEncounterPhase}=load('lib/progress');
const {knownObjectJourneySteps}=load('data/sacred-object-history');
const {progressValues,progressFromRow}=load('lib/progress-storage');
const freshTrust=normalizeProgress(null);
const malformedTrust=normalizeProgress({discoveredObjects:['sitas-cudamani','sitas-cudamani'],unlockedRelationships:['REL-HANUMAN-SITA-MESSENGER'],sceneDiscoveries:['HJ10-GROVE:sita'],completedNodes:['HJ-15','not-a-node'],globalKnowledge:{characterIds:['sita'],relationshipIds:['REL-HANUMAN-SITA-MESSENGER'],sacredObjectIds:['sitas-cudamani']}});
assert.deepEqual(malformedTrust.discoveredObjects,[]);assert.deepEqual(malformedTrust.unlockedRelationships,[]);assert.deepEqual(malformedTrust.sceneDiscoveries,[]);assert.deepEqual(malformedTrust.completedNodes,[]);assert.ok(!malformedTrust.globalKnowledge.characterIds.includes('sita'));
const accountLocal=normalizeProgress({meetingCompletedNodes:['HFM-01']});
const accountCloud=normalizeProgress({meetingCompletedNodes:['HFM-01','HFM-02']});
assert.deepEqual(mergeProgress(accountLocal,accountCloud).meetingCompletedNodes,['HFM-01','HFM-02']);
assert.deepEqual(mergeProgress(accountCloud,accountLocal).meetingCompletedNodes,['HFM-01','HFM-02']);
const tabA=normalizeProgress({meetingCompletedNodes:['HFM-01','HFM-02']});
const tabB=normalizeProgress({meetingCompletedNodes:['HFM-01'],characterChallengeAnswers:{'CK-HANUMAN':'a'}});
const staleWrite=mergeProgress(tabA,tabB);assert.deepEqual(staleWrite.meetingCompletedNodes,['HFM-01','HFM-02']);assert.equal(staleWrite.characterChallengeAnswers['CK-HANUMAN'],'a');
const goodCharacter=normalizeProgress({characterChallengeAnswers:{'CK-HANUMAN':'a'}}),badCharacter=normalizeProgress({characterChallengeAnswers:{'CK-HANUMAN':'b'}});
for(const [left,right,expected] of [[goodCharacter,badCharacter,'a'],[badCharacter,goodCharacter,'a'],[goodCharacter,goodCharacter,'a'],[badCharacter,badCharacter,'b']])assert.equal(mergeProgress(left,right).characterChallengeAnswers['CK-HANUMAN'],expected);
const relationChallenge=availableRelationshipChallenges(availableRelationshipIds(0,1)).find(item=>item.relationshipIds.includes('REL-HANUMAN-SUGRIVA-SERVICE'));
assert.ok(relationChallenge);
const relationBase={meetingCompletedNodes:['HFM-01']};
const goodRelation=normalizeProgress({...relationBase,relationshipChallengeAnswers:{[relationChallenge.id]:relationChallenge.answer}}),badRelation=normalizeProgress({...relationBase,relationshipChallengeAnswers:{[relationChallenge.id]:relationChallenge.options.find(option=>option.id!==relationChallenge.answer).id}});
for(const [left,right,expected] of [[goodRelation,badRelation,relationChallenge.answer],[badRelation,goodRelation,relationChallenge.answer],[goodRelation,goodRelation,relationChallenge.answer],[badRelation,badRelation,badRelation.relationshipChallengeAnswers[relationChallenge.id]]])assert.equal(mergeProgress(left,right).relationshipChallengeAnswers[relationChallenge.id],expected);
const hfmStory=revealStoryScene(freshTrust,'HFM-01');assert.ok(hfmStory.unlockedRelationships.includes('REL-HANUMAN-SUGRIVA-SERVICE'));
assert.ok(hfmStory.unlockedCharacters.includes('Sugrīva'),'A witnessed character remains discovered before encounter completion');
const futurePath={campaignId:'lakshmana',completedEventIds:[],answeredActivityIds:[],masteryStars:0,completedChapterIds:[]};
assert.deepEqual(normalizeProgress({characterJourneys:{lakshmana:futurePath}}).characterJourneys.lakshmana,futurePath,'A future character path survives Hanumān save normalization');
const ramaStory=revealStoryScene(normalizeProgress({meetingCompletedNodes:meetingNodes.map(node=>node.id),searchCompletedNodes:['HFS-01']}),'HFS-02');
assert.ok(characterFieldIsUnlocked(characterProfileFields.find(field=>field.id==='rama-event-v1-role'),ramaStory),'Witnessed role is learned from Story before mastery');
const storyChange=recordProgressChanges(freshTrust,hfmStory);assert.ok(storyChange.recentChanges.some(change=>change.kind==='relationship'));assert.deepEqual(normalizeProgress(JSON.parse(JSON.stringify(storyChange))).recentChanges,storyChange.recentChanges);
assert.equal(knownObjectJourneySteps('ramas-ring',ringExploration).length,1);
const ringAfterReturn=normalizeProgress({...ringExploration,searchCompletedNodes:searchNodes.map(node=>node.id),completedNodes:journeyNodes.slice(0,11).map(node=>node.id)});
assert.equal(knownObjectJourneySteps('ramas-ring',ringAfterReturn).length,3);
const phaseExplore=recordEncounterPhase(freshTrust,'HFM-01','explore');
const phaseStory=recordEncounterPhase(phaseExplore,'HFM-01','story');
assert.equal(normalizeProgress(JSON.parse(JSON.stringify(phaseStory))).encounterPhases['HFM-01'],'story');
const phaseUnlock=recordEncounterPhase(revealStoryScene(phaseStory,'HFM-01'),'HFM-01','unlock');
assert.equal(normalizeProgress(JSON.parse(JSON.stringify(phaseUnlock))).encounterPhases['HFM-01'],'unlock');
const phaseMastery=recordEncounterPhase(phaseUnlock,'HFM-01','mastery');
assert.equal(normalizeProgress(JSON.parse(JSON.stringify(phaseMastery))).encounterPhases['HFM-01'],'mastery');
const phaseComplete=recordEncounterPhase(meeting,'HFM-01','complete');
assert.equal(normalizeProgress(JSON.parse(JSON.stringify(phaseComplete))).encounterPhases['HFM-01'],'complete');
assert.equal(normalizeProgress({encounterPhases:{'HJ-15':'complete'}}).encounterPhases['HJ-15'],undefined);
assert.equal(chapterStatus(hanumanCampaignChapters[0],freshTrust),'Current');
assert.equal(chapterStatus(hanumanCampaignChapters[0],normalizeProgress({meetingCompletedNodes:meetingNodes.map(node=>node.id)})),'Complete');
assert.equal(chapterStatus(hanumanCampaignChapters[0],meeting),'Mastered');
assert.equal(characters.find(character=>character.id==='bharata').unlockNodeId,'HFF-03');
assert.ok(characters.find(character=>character.id==='sugriva').unlockNodeId.startsWith('HFM-'));
const replayRewards=encounterCompletionRewards(journeyNodes[14],finished,{earned:0,total:0},finished);
assert.ok(replayRewards.filter(reward=>reward.type!=='connectionClue').every(reward=>reward.label==='In your record'));
const accountValues=progressValues(storyChange),accountRow=Object.fromEntries(['current_node','completed_nodes','unlocked_characters','unlocked_relationships','answered_challenges','relationship_challenges','encounter_progress','achievements','difficulty'].map((key,index)=>[key,accountValues[index]]));
assert.deepEqual(progressFromRow(accountRow).recentChanges,storyChange.recentChanges);
const progressRouteSource=fs.readFileSync(path.join(root,'app/api/progress/route.ts'),'utf8');assert.match(progressRouteSource,/FOR UPDATE/);assert.match(progressRouteSource,/mergeProgress\(progressFromRow\(row\),incoming\)/);assert.match(progressRouteSource,/reset_epoch/);
console.log('Passed: Goal 5 save merge, stale-tab union, quiz best answers, impossible-save repair, story unlocks, Sacred Object chronology, phase restore, current chapter, replay labels, and account serialization.');
