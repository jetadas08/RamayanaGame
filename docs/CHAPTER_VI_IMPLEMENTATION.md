# Chapter VI — The War

Implemented from `Follow_Hanuman_Chapter_VI_The_War_Content_Pack_v1.docx` and its accompanying request. The existing Explore → Story → Mastery → Complete flow is retained.

## Content and navigation

| Record | Encounter | Story interaction |
|---|---|---|
| HFW-01 | Hanumān Reports Laṅkā | Sort observations and unsupported assumptions |
| HFW-02 | Hanumān Speaks for Vibhīṣaṇa | Sort evidence, reasonable concern, and unsupported assumptions |
| HFW-03 | Crossing into Laṅkā | Order the solitary leap, report, and army crossing |
| HFW-04 | Hanumān at the Western Gate | Read the advancing threat |
| HFW-05 | Hanumān in Battle | Order the rally and Akampana duel |
| HFW-06 | Night of Crisis | Identify the rescue priority |

Every encounter has a scene-discovery Explore activity and three mastery activities. The 18 mastery activities use single choice, multi-select, sequence, matching, and connection-building controls. Source-aware and cause/effect questions retain the supplied content. Incorrect answers allow progression; retakes and account merges preserve best stars.

The campaign now includes 26 playable encounters and 78 possible stars. Chapter VI unlocks after HJ-15. `/journey/hanuman/chapters/the-war` provides six selectable map markers with encounter names in a separate responsive grid to avoid map-label collisions. Selecting a marker changes the information card and the individual Why here? information. Encounter navigation returns to this chapter map.

After HFW-06, the completion screen celebrates Chapter VI and points primarily to `/journey/hanuman/chapters/mountain-of-herbs`. Chapter VII is unlocked but explicitly awaits its approved content pack; no playable content has been fabricated.

## Artwork

Twelve bespoke wide paintings are installed at `public/images/journey/hanuman/hfw-01-locked-v1.png` through `hfw-06-revealed-v1.png`. Each encounter has its own locked/revealed pair, captions, alt text and existing reveal transition. No portrait is used as a primary encounter scene. Prompt provenance is in `data/war-art-prompts.md`. The night scene shows the incapacitated brothers and a torchlit search, without gore.

## Discoveries and source handling

Added Nala, Dhumrākṣa, Akampana, Kumuda and Mainda to the character registry, with scene crops for supporting collection artwork. Character Knowledge adds Hanumān’s reporting, counsel, command, protection and rescue roles, Nala’s bridge-building role, and the distinct Vibhīṣaṇa source context.

New relationship clues/challenges cover Hanumān–Vibhīṣaṇa alliance, Vibhīṣaṇa–Rāma alliance, Nala’s service, Dhumrākṣa and Akampana opposition, and Jāmbavān’s rescue guidance. The two successful mastery connection builders reveal their specific relationship; the entire network is not automatically revealed. Existing messenger/service relationships remain available. No sacred objects were added.

All six encounters use the supplied Vālmīki Yuddha Kāṇḍa source layer. HJ-09’s Rāmacaritamānasa meeting remains separate. Exact Gita Press verses are flagged pending edition audit. Rāma grants refuge; Hanumān gives counsel. Nala is the bridge-builder. Earlier leap and later Setu routes have distinct lines and labels. Rāmeśvaram / Adam’s Bridge is contextual, not proof of the textual route. Gates and battlefields are narrative regions rather than surveyed coordinates.

## Progress and files

`warCompletedNodes` extends the existing progress record and account JSON without renaming or replacing legacy HJ IDs. Old save fixtures retain their completion, mastery, scenes, characters, knowledge, relationships and sacred objects. Chapter I progress remains independent. No player save was reset during verification.

Primary additions: `data/war.ts`, `data/war-content.json`, `data/war-art-prompts.md`, `components/war-map.tsx`, `components/war-map.module.scss`, `components/mountain-chapter-entry.tsx`, and the two chapter routes.

Integration changes: `lib/types.ts`, `lib/progress.ts`, `data/hanuman-campaign.ts`, `data/journey.ts`, `data/mastery-activities.ts`, `data/encounter-activities.ts`, `data/encounter-completion.ts`, `data/character-ids.ts`, `data/character-knowledge.ts`, `data/discoveries.ts`, `data/relationships.ts`, `data/progress-metrics.ts`, `components/campaign-map.tsx`, `components/encounter.tsx`, `components/encounter-activities.tsx`, `components/encounter-activities.module.scss`, `components/mastery-activity-renderer.tsx`, `components/journey.module.scss`, `components/relationship-challenge-game.tsx`, Journey/Progress/Connections pages, encounter route generation, and account progress/register APIs. Tests are in `scripts/test-progress.mjs`.

The reported Chapter I question now says “Whom does Hanumān bring together in this encounter?” Other player-facing uses of “node” in the two new content packs were similarly replaced.

## Verification and limits

- Progress tests pass: all six Explore and Story activities, all 18 mastery activities, wrong-answer completion, best-score retakes/merge, scene unlocks, sequential access, relationships, source metadata and legacy-save preservation.
- Lint, TypeScript and production build pass.
- Browser inspection at desktop/tablet and 390px mobile widths: map markers and names separated, map selection and per-location information work, chapter gating is respected.
- Browser verification uses the existing saved progress and does not force-unlock later encounters. Full new encounter progression is exercised by automated state tests rather than by modifying the user’s save.
- Exact edition/verse verification and Chapter VII playable content remain pending. Paintings and supporting scene crops are illustrative rather than source evidence.
