# Chapter I post-review implementation

## Scope

This pass fixes the campaign-level P0 issues and redesigns only Chapter I (`HFM-01` through `HFM-05`) as the post-review gameplay prototype. Chapters II–VII keep their existing encounter structure, and Chapter VIII remains on its dedicated finale experience. Shared changes are limited to backward-compatible progress, status, accessibility, and rendering support.

## P0 fixes

### Full encounter IDs

Reward attribution, discoveries, relationships, mastery, chapter ownership, and replay now use full encounter IDs. Regression coverage explicitly separates:

- `HJ-04`, `HFM-04`, `HFW-04`, and `HFF-04`
- `HJ-03` and `HFH-03`
- `HFM-01` and later campaign encounters ending in `-01`

### Dynamic campaign totals

Campaign and progress UI totals are derived from campaign data. The current model reports 8 chapters, 33 playable encounters, and 99 available mastery stars. Two additional catalog records remain non-playable content records and are not presented as encounters the player can complete.

### Reward attribution

Chapter completion and next-chapter unlocks are presented separately. Chapter-map completion panels state which chapter the player completed, then identify the next chapter that became available. Rewards remain attached to the encounter that earned them.

### Unified status model

Player-facing chapter state is now one of `Locked`, `Available`, `In Progress`, `Complete`, or `Mastered`. Editorial states no longer appear as progression states.

### Complete and mastered

`Complete` means every encounter is complete. `Mastered` additionally requires every available star. Campaign advancement depends on completion and does not require perfect mastery.

### Save compatibility

Existing saves continue through the existing merge and migration path. The implementation preserves completed encounters, best stars, characters, discoveries, connections, sacred objects, achievements, and campaign position. New Chapter I memories are additive and do not reset older data.

## Chapter I interaction design

The chapter now follows `observe → infer → experience → understand → remember` while retaining `Explore → Story → Mastery → Complete`.

| Encounter | Explore and Story mechanic | Meaningful three-star memory |
| --- | --- | --- |
| HFM-01 · Sugrīva Sends Hanumān | Inspect three unlabeled scene points, assess the strangers, then choose an approach before canon is revealed. | Discernment Before Strength |
| HFM-02 · Hanumān Meets Rāma | Inspect posture, attention, and speech; interpret which manner of address fits Hanumān before seeing Rāma's response. | Recognized Through Speech |
| HFM-03 · The Search for Sītā Revealed | Gather scene evidence, then reconstruct the mission in a meaningful sequence. | Another Person's Need |
| HFM-04 · Hanumān Brings Rāma to Sugrīva | Identify each side's need, then actively connect Rāma and Sugrīva through alliance/friendship. | The Bridge Between Allies |
| HFM-05 · The Signs of Sītā | Inspect the evidence bundle and interpret what the ornaments establish before the story explains it. | Presence Through Evidence |

Predictions are recorded before canonical narration. They do not change canon or block progress. Visual clue labels appear only after inspection, with equivalent nonvisual descriptions in accessible names.

## Mastery

All five encounters retain Discover, Understand, and Go Deeper, for 15 activities total. The progression moves from event recognition to motive or consequence and then to interpretation, source distinction, or synthesis. The activity set uses plausible misconceptions and includes single choice, matching, ordering, multi-select, cause/effect, source-aware interpretation, and connection building.

Wrong responses provide announced feedback and allow the journey to continue. Retakes preserve the best score. Earning three stars reveals the encounter's meaning memory; it does not grant power, currency, or access gating.

## Inline connections and character memories

Chapter I resolves selected relationships at the moment they become meaningful:

- Sugrīva → Hanumān: Service
- Hanumān → Rāma: Service / Devotion
- Rāma ↔ Sugrīva: Alliance / Friendship

Relationship discoveries persist in the shared Connections system. Hanumān's character page now gives the five Chapter I memories a prominent sequential trail before detailed knowledge counters. Provenance and source fields remain available deeper in the profile.

## Completion and finale

Chapter I completion screens prioritize the revealed cinematic scene, stars, one emotional takeaway, one primary unlock, and Continue. Secondary changes are collapsed under `Added to your journey · N`.

HFM-05 uses a ceremonial chapter recap: Observe, Speak, Understand, Connect, Remember. It closes with “The meeting becomes a mission,” then presents Chapter II — The Search as the next step. The UI states separately that Chapter I is complete and Chapter II is unlocked.

## Mobile and accessibility

- Mobile layouts stack scene, evidence, completion, and recap content without clipped controls or a reward wall.
- Hotspots use keyboard-operable buttons, comfortable touch targets, accessible descriptions, and `aria-pressed` state.
- Selected answers are exposed through native controls and ARIA state.
- Wrong-answer feedback, star changes, memory rewards, and connection confirmations use live status semantics.
- Focus moves to the active phase or question heading after transitions.
- Meaning is communicated through labels and icons as well as color.
- Reduced-motion styles suppress decorative transitions.

## Validation

Automated checks:

- `pnpm test` — passed, including ID-collision, save merge, reward-attribution, chapter unlock, and Chapter I/VI/VII/VIII coverage
- `pnpm exec tsc --noEmit` — passed
- `pnpm lint` — passed
- `pnpm build` — passed; 87 static pages generated, including all 33 playable encounters

Manual browser validation used a fresh isolated guest origin and covered first entry, HFM-01 through HFM-05, all Explore and Story interactions, all 15 mastery activities, an intentional wrong answer, hints, score improvement from two to three stars, three-star memory reveal, inline connections, character memories, compact completion screens, the ceremonial finale, Chapter II unlock, and persistence after reload. Mobile checks at 390 × 844 verified the completion layout and all three tappable HFM-01 hotspots. A hotspot was also activated with the keyboard.

## Old and new UX comparison

| Dimension | Old pattern | New Chapter I | Current limitation |
| --- | --- | --- | --- |
| Discovery | Labeled cards often supplied meaning immediately. | Scene evidence must be inspected before labels and interpretation appear. | Hotspots remain authored coordinates and need careful QA per illustration. |
| Repetition | Encounters frequently shared the same read-and-answer rhythm. | Each encounter uses a related but distinct observation, dialogue, reconstruction, alliance, or object mechanic. | The shared phase shell is still visibly consistent across encounters. |
| Emotional engagement | Rewards read as administrative collection updates. | Cinematic reveal, one takeaway, and memory-first reward create a clearer emotional close. | Some secondary global rewards still use system-oriented wording when expanded. |
| Learning depth | Recall dominated and prediction sometimes followed explanation. | Prediction precedes canon; mastery advances from recognition to interpretation. | The prototype does not yet adapt difficulty to player performance. |
| Reward clarity | Several updates competed for attention. | One primary unlock and one memory lead; secondary updates are collapsed. | A perfect-score memory still depends on the player noticing the three-star result. |
| Connection integration | Relationships often accumulated as deferred clues. | Selected relationships resolve inline at the story moment and persist globally. | Only the most meaningful Chapter I relationships use the inline builder. |
| Completion pacing | Large reward walls slowed continuation. | Compact hierarchy and collapsed updates keep Continue prominent. | Long localized titles may need additional typography tuning. |
| Replay motivation | Replay mainly improved a number. | A missed star visibly withholds a named meaning memory; best score is preserved. | There is no chapter-level replay recommendation yet. |

## Recommendation

The model is ready to scale as a design system, but each later chapter should receive its own mechanic family rather than copying Chapter I's interactions. Scale the shared evidence, pre-canon prediction, memory reward, compact completion, and inline-connection primitives. Author chapter-specific activities and bespoke scene QA in small batches, beginning with one chapter, then validate mobile placement, content accuracy, and save compatibility before moving to the next.

