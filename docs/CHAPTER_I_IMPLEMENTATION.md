# Chapter I — The Meeting implementation

Implemented from `Follow_Hanuman_Chapter_I_The_Meeting_Content_Pack_v1.docx`.

## Playable content

| ID | Encounter | Route |
|---|---|---|
| HFM-01 | Sugrīva Sends Hanumān | `/journey/hanuman/sugriva-sends-hanuman` |
| HFM-02 | Hanumān Meets Rāma | `/journey/hanuman/hanuman-meets-rama` |
| HFM-03 | The Search for Sītā Revealed | `/journey/hanuman/search-for-sita-revealed` |
| HFM-04 | Hanumān Brings Rāma to Sugrīva | `/journey/hanuman/hanuman-brings-rama-to-sugriva` |
| HFM-05 | The Signs of Sītā | `/journey/hanuman/signs-of-sita` |

Chapter I is available from the campaign map and Journey list. A new regional chapter map shows five interactive markers, separate readable encounter names, stars, selection details, locked states and geography notes. It reuses the existing encounter component and Explore → Story → Mastery → Complete flow.

The imported pack supplies story paragraphs, completion takeaways, next-node teasers, questions, answer keys, explanations, source notes and art direction. Explore includes three discoveries per encounter. Story includes peaceful-approach prediction, respectful-speech selection, a mission sequence, an active Rāma–Sugrīva alliance builder, and interpretation of the ornaments as evidence.

All fifteen mastery activities use the existing Discover / Understand / Go Deeper machinery: single choice, sequence, matching and multi-select. Wrong answers allow continuation; successful retakes improve the stored best score. Progress merging also preserves the best mastery score.

## Discoveries and collections

- Rāma, Lakṣmaṇa and Sugrīva become visible through the opening discoveries. Sītā is introduced as the absent person at the center of the mission in HFM-03, not as physically present in the meeting.
- Character Knowledge adds Hanumān’s eloquence, learning and restraint; Sītā’s absence as the mission; and the dropped ornaments as story evidence.
- Existing service, marriage, family and alliance relationships gain Chapter I clue availability. Merely completing encounters does not automatically reveal the whole network.
- The HFM-04 builder requires the player to connect Rāma, Sugrīva and Alliance / Friendship. A correct construction reveals that relationship with a short animation, respecting reduced-motion preferences.
- Dropped ornaments remain story evidence. The Sacred Objects catalog is still Rāma’s Ring and Sītā’s Cūḍāmaṇi.
- Hanumān’s origin material remains associated with HJ-03.

## Artwork

Ten bespoke wide paintings provide distinct locked/revealed pairs for all five encounters. They use the existing scene-card transition at the end of Story, before Mastery. Revelation is persisted, and completed scenes remain revealed on later visits. No Chapter I scene uses a character bust or a placeholder. Prompt provenance is in `data/meeting-art-prompts.md`.

## Completion and preservation

Completing HFM-05 marks Chapter I complete and offers Chapter II — The Search, beginning at HJ-01. Existing HJ identifiers and completion arrays are unchanged. Chapter I completion is stored separately as `meetingCompletedNodes`; campaign totals aggregate both sets to twenty encounters and sixty stars.

Old saves retain access to their existing HJ journey through `legacySearchAccess`; new players begin at HFM-01 and unlock the Search after completing the Meeting. Browser saves, account-save payloads and registration merge payloads include the new fields and scene reveals. The existing database `encounter_progress` JSON column holds these fields; no destructive schema migration is needed.

## Sources and geography

The primary playable narrative is Vālmīki Rāmāyaṇa. The supplied chapter-level references are retained. Exact verse ranges remain explicitly pending Gita Press edition review; they are not represented as verified quotations. Optional commentary / later tradition notes remain in Explore deeper, separate from the factual narrative and quizzes.

Ṛṣyamūka / Kiṣkindhā is represented as a traditional, debated region. Chapter-map markers express story order and do not claim precise archaeological coordinates. Map accuracy and Why here remain available.

## Validation

- Automated regression tests cover the existing fifteen HJ encounters and 45 stars.
- Added tests cover all five HFM encounters and fifteen mastery activities, correct/incorrect responses, retakes, best-score merge, unlock order, story interactions, connection building, Character Knowledge, evidence vs sacred objects, artwork file presence, scene-reveal persistence, Chapter I completion and Chapter II transition.
- Serialization and old-save normalization tests verify preservation of HJ completion and mastery.
- Lint, TypeScript check and production build pass.
- Browser checks verified campaign selection, chapter-map entry, opening encounter, exploration gating, story prediction and the cinematic reveal. At 390px, the chapter selector, map and encounter fit without document-level horizontal overflow. Desktop layout was visually inspected.
- Live authenticated database save/reload was not exercised; payload wiring and progress serialization were checked in code and tests.

## Files changed for Chapter I

New:
- `data/meeting-content.json`
- `data/meeting.ts`
- `data/meeting-art-prompts.md`
- `components/meeting-map.tsx`
- `components/meeting-map.module.scss`
- `public/images/journey/hanuman/hfm-01-locked-v1.png` through `hfm-05-revealed-v1.png` (ten assets)
- `docs/CHAPTER_I_IMPLEMENTATION.md`

Integration:
- `lib/types.ts`, `lib/progress.ts`
- `data/journey.ts`, `data/hanuman-campaign.ts`
- `data/mastery-activities.ts`, `data/encounter-activities.ts`, `data/encounter-completion.ts`
- `data/character-knowledge.ts`, `data/relationships.ts`, `data/relationship-challenges.ts`, `data/progress-metrics.ts`
- `components/campaign-map.tsx`, `components/encounter.tsx`
- `components/encounter-activities.tsx`, `components/encounter-activities.module.scss`
- `components/progress-provider.tsx`, `components/relationship-challenge-game.tsx`
- `app/journey/hanuman/[node]/page.tsx`, `app/journey/page.tsx`, `app/progress/page.tsx`, `app/connections/page.tsx`
- `app/api/progress/route.ts`, `app/api/auth/register/route.ts`
- `scripts/test-progress.mjs`

Existing uncommitted campaign, scene-art and uniform-reveal work was preserved. Later campaign content remains planned; the five Chapter I encounters have no gameplay or artwork placeholders. Exact source-verse verification remains an editorial follow-up.
