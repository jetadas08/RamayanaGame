# Chapter VII — The Mountain of Herbs

Implemented from the supplied Chapter VII v1 content pack.

## Encounters and campaign

- HFH-01: Jāmbavān Calls for Hanumān — first medicinal mission, Yuddha Kāṇḍa 6.74.
- HFH-02: The First Mountain Rescue — retrieval, restoration of Rāma, Lakṣmaṇa and the army, and return of the mountain complete this first mission.
- HFH-03: Suṣeṇa and the Second Rescue — the later mission of 6.101. Replaces the planned “The Mountain Returns”; no fourth encounter added.

The campaign retains 35 canonical records, with 29 playable encounters and 87 available mastery stars. Chapter VII unlocks after HFW-06, then progresses sequentially through its three encounters. Its chapter map shows two distinct narrative rescue routes, a broad northern medicinal mountain region, and encounter-specific “Why here?” information. No modern peak or GPS certainty is asserted. Cards and controls adapt to mobile widths.

## Gameplay and content

Explore → Story → Mastery → Complete remains intact. All nine supplied mastery activities are implemented, including choice, multiple selection, matching, sequencing and source comparison. Incorrect answers permit progression; retakes retain the best score.

Four-herb knowledge distinguishes Mṛta Sañjīvanī (restoring life), Viśalyakaraṇī (removing weapons/healing weapon wounds), Suvarṇakaraṇī (restoring complexion), and Sandhānī (joining fractures/severed parts). The optional Compare traditions section distinguishes the two Vālmīki missions and later devotional compression without a “which tradition is correct” test.

Suṣeṇa is a supporting character with ten supported knowledge facts across relevant categories. He examines, diagnoses, instructs and administers treatment; Hanumān retrieves the mountain. Two relationship challenges use existing Guidance and Protector types, with explicit physician context. Existing Jāmbavān–Hanumān guidance and Vibhīṣaṇa alliance are reinforced. Herbs and the mountain are knowledge/place discoveries, not Sacred Objects.

Six bespoke cinematic images supply three locked/revealed pairs, using the existing shared reveal stage and transition. Art provenance and prompts are in data/herbs-art-prompts.md.

Chapter completion summarizes discoveries and enables the primary Chapter VIII — Mission Fulfilled CTA. Chapter VIII remains an honest content-pending destination; no playable encounters were fabricated. Empty planned-chapter progress counters are hidden.

## Persistence

A separate herbsCompletedNodes collection extends normalization, sequential gating, score aggregation, merging and account progress payloads. Existing HJ, Meeting and War IDs, completion, best scores, scene discoveries, characters, knowledge, relationships, objects and achievements are retained. No destructive migration or reset is used.

## Files

New content: data/herbs.ts, data/herbs-content.json, data/herbs-art-prompts.md and six public/images/journey/hanuman/hfh-*-v1.png assets.

New map and destination: components/herbs-map.tsx, components/herbs-map.module.scss, components/mission-chapter-entry.tsx and app/journey/hanuman/chapters/mission-fulfilled/page.tsx. Updated components/mountain-chapter-entry.tsx delegates to the playable chapter map.

Integration: data/hanuman-campaign.ts, data/journey.ts, data/character-ids.ts, data/discoveries.ts, data/character-knowledge.ts, data/relationships.ts, data/encounter-completion.ts, data/progress-metrics.ts, lib/types.ts, lib/progress.ts, components/encounter.tsx, components/mastery-activity-renderer.tsx, components/campaign-map.tsx, components/relationship-challenge-game.tsx, app/journey/hanuman/[node]/page.tsx, app/journey/page.tsx, app/progress/page.tsx, app/connections/page.tsx, app/api/progress/route.ts and app/api/auth/register/route.ts.

Regression coverage: scripts/test-progress.mjs. Pre-existing uncommitted work for earlier chapters and art was preserved.

## Verification and remaining review

- pnpm test: passed, including all nine activities, feedback, unlock order, completion, retakes, save normalization/merge, character knowledge, relationship clues, source distinction and image pair availability.
- pnpm lint: passed without warnings.
- pnpm exec tsc --noEmit: passed.
- pnpm build: passed.
- Browser: chapter map loaded at normal desktop and 390px mobile widths; selecting HFH-03 changed the location-specific accuracy panel; direct encounter access correctly respected the current save’s Chapter VI gate. Existing user progress was not altered to bypass that gate.
- Full progression was exercised in automated fixtures, not by overwriting the user’s browser save. Live authenticated database synchronization was not exercised.
- Source chapter references follow the supplied pack. Exact Gita Press edition/verse audit remains explicitly pending.
- Chapter VIII awaits approved content. Chapter VII has no placeholder scene images.
