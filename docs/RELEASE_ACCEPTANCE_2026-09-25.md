# Release readiness acceptance — 25 September 2026

The **latest decision is in “Mac acceptance completion” at the end**. Earlier sections preserve the initial audit and continuations as dated evidence; their pending lists are superseded by the latest completion.

Scope: the current Follow Hanumān production build at `5ea3889` plus the local heading-scroll correction in this acceptance pass. This is a release decision, not a new feature or editorial pass. `sources/` was not changed.

## A. Readiness score

| Area | Score / 10 | Basis |
| --- | ---: | --- |
| Overall | 6 | The build and one isolated full encounter passed; required physical-phone, assistive-technology, 200% zoom, live-account, and campaign-wide manual acceptance remain open. |
| Core gameplay | 8 | Automated coverage of all 35 encounters/eight chapters; one complete live Chapter I loop. |
| Mobile | 4 | Five responsive viewport sizes passed basic overflow checks; no physical phone available. |
| Accessibility | 5 | Semantic browser tree, focus/feedback and dialog Escape checked; VoiceOver/NVDA and true 200% zoom not completed. |
| Save/account | 4 | Guest reload and automated merge/reset coverage passed; no configured MariaDB connection to exercise live accounts. |
| Visual | 7 | Desktop and emulated mobile routes inspected; fixed completion-heading clipping; real-phone and all-chapter visual signoff pending. |
| Source integrity | 8 | Setu and Mandodarī player-facing layers match the documented editorial proof; other passages retain pending labels. |
| Performance | 6 | Local production pages and selected optimized images loaded without console warnings; no field/device timing or throttled load test. |
| Responsive | 8 | No document horizontal overflow on seven key routes at 360, 390, 430, 820, and 1272 CSS px. |

## B. Release blockers

No confirmed product defect currently meets the brief's BLOCKER definition. Release-candidate signoff is nevertheless blocked by **missing required acceptance evidence**: representative Chapters II–VIII live play, a real phone, VoiceOver/NVDA, true 200% browser zoom, and the eight live MariaDB scenarios. These are unverified gates, not claimed code failures.

## C. Must-fix before signoff

1. **MUST FIX — acceptance evidence:** Run the requested journey and layout checks on at least one real phone. No phone was available in this workspace; the owner confirmed only the database is available.
2. **MUST FIX — acceptance evidence:** Complete VoiceOver or NVDA, true 200% zoom, and reduced-motion observation, including map alternatives and account dialog focus.
3. **MUST FIX — acceptance evidence:** Provide the existing MariaDB configuration location and run the eight isolated live-account scenarios below, with before/after state records. The repository has only `.env.example`, `MARIADB_URL` is unset, and nothing listens on local port 3306. No production or existing account data was changed.
4. **MUST FIX — acceptance evidence:** Manually play one encounter in each of Chapters II–VIII and verify a completed campaign/finale in an isolated state. Automated rules pass, but they do not prove pacing and navigation on every representative surface.

## D. Can-ship issues

- **CAN SHIP:** Guest play is explicitly labeled as local-only, and the unavailable-account response says guest progress remains available. This is acceptable only if cloud accounts are tested and healthy in the release environment.
- **CAN SHIP:** A number of source panels mark edition-level citations pending while using narrative paraphrases. This follows the current editorial policy; do not promote them to exact quotations without a separate proof.

## E. Post-launch polish

- **POST-LAUNCH POLISH:** Revisit the main map's 509 kB reported First Load JS if field metrics show slow interaction. The observed optimized atlas image was 445,395 bytes; file size alone is not evidence of an unacceptable user delay.

## F. Acceptance matrix

| Workstream | Code complete | Acceptance complete | Open items |
| --- | --- | --- | --- |
| Goal 3 Mobile | Yes | No | Physical phone, touch/panning, safe areas, keyboard, orientation, felt performance. |
| Goal 4 Accessibility | Yes | No | Screen reader, true 200% zoom, reduced motion, full keyboard journey. |
| Goal 5 Trust / Progression | Yes | No | Eight live MariaDB account/save scenarios. |
| Visual Polish | Yes, with a focus-offset correction in this pass | Partial | Physical phone, all chapter routes, finale. |
| Bhakti Pass 1 | Yes | Partial | Full progressed-state and finale review. |
| Bhakti Pass 2 | Yes | Partial | Screen-reader/mobile reading order for Setu; confirm against approved pages at release signoff. |

## G. Save integrity

The isolated `127.0.0.1:3001` origin started at **0/35 encounters, 0/105 stars**. A full Chapter I encounter ended at **1/35, 1/105** after two incorrect and one correct mastery responses. Reload restored the completed encounter and the one-star result. This did not alter the existing progressed save on port 3000. Automated tests pass for merging, stale-tab union, reset epoch, best-score retention, and account serialization.

| Required live scenario | Live result | Required record |
| --- | --- | --- |
| Guest → new account | Pending DB setup | Before/after encounters, stars, relationships, knowledge, objects, recent changes. |
| Guest → existing account | Pending DB setup | Both local and cloud progress retained. |
| Cloud older than local | Pending DB setup | Newer local events preserved. |
| Local older than cloud | Pending DB setup | Newer cloud events preserved. |
| Two-tab stale write | Pending DB setup | Tab A advance remains after Tab B save. |
| Reset → stale write | Pending DB setup | Old epoch rejected; no restoration. |
| Reload after merge | Pending DB setup | Merged state remains canonical. |
| Sign out / sign in | Pending DB setup | Server-backed state restored. |

## H. Accessibility

Browser accessibility output exposes named navigation links, chapter status, nonvisual chapter controls, named observation controls, mastery feedback, and a completion heading. The live wrong-answer result announced "Incorrect. You can try again or continue" and offered both retry and continuation. The account dialog initially focused Close; Escape dismissed it and returned focus to the save trigger. The completion heading initially scrolled to `0px` under a `73px` fixed header; a global `main h1, main h2` scroll margin was added and the rebuilt production page placed it at `120px` on desktop. A mobile 390 px check found the heading visible with no document overflow.

Full keyboard traversal, true 200% zoom, VoiceOver/NVDA, and live reduced-motion observation remain unverified. Automated reduced-motion/companion tests pass, but are not a substitute for those checks.

## I. Physical mobile

**Not run.** No real iPhone or Android device was available. Viewport emulation is recorded under responsive acceptance and does not establish Safari/Chrome touch, browser chrome, safe-area, home-indicator, software-keyboard, or orientation behavior.

## J. Visual acceptance

Campaign, Chapter I/III, encounter Explore/Story/Mastery/Completion, Journey, Characters, Connections, and Progress were opened in the production build. The isolated complete state showed the revealed scene, one star, the saved connection, next encounter, and an optional mastery improvement. Seven key routes had no page-level horizontal overflow at all five requested viewport widths. The heading-scroll correction is the only product edit. Route-by-route chapter artwork, Sacred Objects in progressed states, all campaign segments, and finale composition still require manual acceptance.

## K. Source integrity

The player-facing Setu panel orders Vālmīki before Rāmacaritamānasa, attributes two short Gita Press excerpts with printed-page locators, separates the later bridge from Hanumān's earlier leap, and explicitly rejects a name-on-stones attribution. The repository's line-level proof ledger approves exactly these two excerpts, not all 15 candidate passages. Mandodarī is labeled a paraphrase with corrected Sundara 10:50–54 and 11:1–4 printed-page references. The two medicinal rescues remain distinct in Chapter VII data. Other source references are marked `planningReference` or `pendingEditionAudit`; no additional exact-quote approval is inferred.

## L. Performance

The warm local production server returned HTML for map, encounter, Characters, and Progress in approximately 2–4 ms; this measures local server response only. Next/Image delivered the desktop atlas at 1080-width for 445,395 bytes and the tested full scene at 3840-width for 1,125,292 bytes. The checked browser tabs had no captured warnings/errors or hydration warnings. Production build reports 509 kB First Load JS for the main map and 293 kB for encounters. Network-throttled LCP/INP/CLS and physical-device felt load remain unmeasured.

## M. Finale

Automated tests cover zero-star completion, replay, best-score merging, and the 35/35 campaign count. The finale route and completed-state pacing, art, devotional close, return action, recap, and mobile composition were not live-played in this pass. This acceptance remains open.

## N. Final regression

`pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check` all pass after the focus-offset change. The build generated 89 static pages. Formerly reported routes `/journey/hanuman/chapters/the-meeting`, `/journey/hanuman/sita-found`, `/journey/hanuman/ring-and-message`, `/journey/hanuman/chapters/mountain-of-herbs`, and `/journey/hanuman/chapters/mission-fulfilled` returned HTTP 200. An invalid encounter returned 404; unauthenticated progress returned 401; malformed login returned a clear 400; unavailable account storage returned a clear 503 and guest fallback message.

## Decision

**NOT READY FOR RELEASE CANDIDATE**

The current code passes the checks completed here, but the brief makes physical-mobile, assistive-technology/zoom, and live-database acceptance release gates. Those results cannot be inferred from emulation or unit tests.

## Continuation — remaining-gate audit

This continuation did not reopen the completed structural, content, or automated checks.

### A. Database acceptance

The app reads `MARIADB_URL` from the process environment through `lib/db.ts`. The documented local mechanism is `/Users/jetadas/Documents/Codex/2026-09-12/jetadas08-ramayanagame/RamayanaGame/.env.local`, copied from `.env.example`, with a MariaDB/MySQL URL for a database and application user already granted access. The app can create its three tables on the first account request, or an operator can apply `database/schema.sql`. The connectivity check is `pnpm db:check` with `MARIADB_URL` available to that process.

Only `.env.example` exists in this checkout. `MARIADB_URL` is unset, and no server listens on local TCP port 3306. No credential was read, printed, changed, or requested in plaintext. The owner was asked for a **config location or setup instructions only**. Database-specific acceptance stops here until a working connection is present. Guest → new/existing account, cloud/local age ordering, stale-tab write, reset epoch, reload after merge, and sign-out/sign-in restoration all remain **NOT RUN LIVE**; automated coverage from the first audit remains valid but does not satisfy this gate.

### B. Chapters II–VIII representative live play

**Not completed in this continuation.** The existing browser save shows Chapters I and II mastered at 10/35 encounters, with Chapter III current and Chapters IV–VIII locked. The independent fresh Safari origin starts at 0/35. The completed Chapter II state reopens at completion/mastery rather than at Explore, so it cannot substitute for the requested full representative playthrough. The existing progressed save was left unchanged; no locked state was bypassed or presented as live acceptance. Each Chapter II–VIII entry still needs arrival, Explore, Story, Mastery, completion, return/next link, and reload evidence.

### C. Screen-reader acceptance

**Not completed.** Browser accessibility-tree inspection from the first audit establishes semantic exposure, but it is not a VoiceOver/NVDA session or an announcement test. No screen reader was recorded as used. A macOS native-browser session was available, but Safari's active tab/app state changed concurrently during the attempt; the system-wide reader was not enabled during another person's active use. Campaign, chapter, encounter, mastery, completion, Characters, Connections, Progress, and save-dialog announcement/focus checks all remain open.

### D. True 200% zoom acceptance

**Not completed.** The in-app browser did not change its CSS viewport or device-pixel ratio after either `Command-=` or `Command-Shift-=`. A device-pixel ratio of 2 was already present before the shortcut and reflects the display, not verified 200% page zoom. One native Safari **Zoom In** step was applied to a temporary localhost QA tab, but the app's active tab changed concurrently before a verified 200% setting or route sweep. That temporary tab was closed afterward. The prior 360–1272 px responsive sweep is not a substitute for actual browser zoom. All specified zoom routes remain open.

### E. Real-phone acceptance

**Not run.** The owner previously confirmed that only the database was available, not a physical phone. No device/OS/browser can be recorded. Emulated viewport results remain separate from touch, browser chrome, safe-area, software-keyboard, orientation, and felt-performance acceptance.

### F. New defects

No new product defect was confirmed in this continuation. The missing configuration and unavailable testing surfaces are **MUST FIX acceptance gates**, not BLOCKER-class code defects.

### G. Fixes made

No product code or content was changed in this continuation. The prior completion-heading scroll fix remains the only code correction from the release audit.

### H. Remaining blockers

The release decision is held by absent live database evidence, representative Chapters II–VIII play, actual screen-reader testing, true 200% browser zoom, and a real phone. The database-specific portion can resume once the existing `MARIADB_URL` configuration location is supplied without sharing its value.

### I. Updated readiness score

**6/10, unchanged.** No new gate was signed off, and no new product failure lowered the score.

**NOT READY FOR RELEASE CANDIDATE**

- Live MariaDB save/account acceptance after the connection configuration is available.
- Representative live play for Chapters II–VIII.
- VoiceOver or NVDA acceptance.
- Actual 200% browser zoom acceptance.
- At least one real-phone acceptance run.

## Mac acceptance continuation — 25 September 2026

This pass addressed only the remaining release gates. A physical phone was unavailable by owner instruction; no emulator, responsive viewport, simulator, or desktop resizing is counted as real-device acceptance. Testing used a separate local production server at `127.0.0.1:3001` and a separate Chrome origin, so the existing port-3000 journey was not changed. Prerequisite completion prefixes were seeded **only in that isolated local save** to open later chapter samples; those prerequisites were not represented as manually played.

### A. Database acceptance

**NOT RUN LIVE.** The app requires `MARIADB_URL` (`lib/db.ts`), normally supplied through `.env.local` at the repository root; `pnpm db:check` is the documented connectivity check. This checkout has only `.env.example`, no configured `MARIADB_URL`, and no local listener on port 3306. A targeted search found no usable `.env.local` in the Codex project directories. The owner said a database is available and was asked for its configuration location or setup instructions, without credentials. Until that connection is available, all eight live scenarios (guest → new/existing account, local/cloud age ordering, two-tab stale write, reset/stale write, reload after merge, and sign out/in) remain pending. No account data or credentials were touched.

### B. Chapters II–VIII representative live play

| Chapter | Encounter played in isolated Chrome origin | Observed result | Remaining check |
| --- | --- | --- | --- |
| II | Southern Search Begins (HFS-01) | Arrival, Explore, Story, mastery, completion, next link, and reload passed. An incorrect answer earned no star and did not block; a correct one earned a star. Completion persisted at 1/3. | None for this representative encounter. |
| III | The Leap (HJ-04) | Arrival through completion passed at 3/3, next Maināka link appeared, and reload retained the result. | None for this representative encounter. |
| IV | Vibhīṣaṇa (HJ-09) | Three Explore clues, Story rewards, mastery, 3/3 completion, next encounter, and reload passed. | None for this representative encounter. |
| V | Aśoka Grove Battle (HJ-12) | Four escalation beats, Story, varied mastery, 3/3 completion, next encounter, and reload passed. | None for this representative encounter. |
| VI | Crossing into Laṅkā (HFW-03) | Arrival, role-matching Explore, Story rewards, matching/choice mastery, 3/3 completion, and next Western Gate link passed. Setu comparison control became available. | Completion reload and next-link navigation were not rechecked before the Mac locked. |
| VII | Jāmbavān Calls for Hanumān (HFH-01) | Arrival, three-part rescue brief, Story, wrong-answer retry, 3/3 mastery, completion, and next First Mountain Rescue link passed. | Completion reload and next-link navigation were not rechecked before the Mac locked. |
| VIII | Rāvaṇa Falls (HFF-01) | Arrival, observation, resolved/unfinished evidence classification, Story, first mastery answer, and two role matches advanced. | Mac locked during the third role match; mastery completion, next link, and reload remain pending. |

The Chapter VII wrong-answer attempt initially produced 0 stars, explicit correction, Try again, and Continue. Retrying with all three correct capabilities earned the star. This confirms nonblocking behavior in another chapter. Prefix fixtures verified each representative encounter in its intended available state, but do not prove natural chapter-to-chapter unlocking or a 35/35 end-to-end run.

### C. Screen-reader acceptance

**PENDING.** macOS VoiceOver was turned on in System Settings and turned off again afterward. The caption panel option was enabled in VoiceOver Utility, but an actual spoken/captioned traversal and announcement sequence could not be observed and recorded. Chrome's accessibility tree exposed headings, named map/navigation controls, answer choices, feedback, and completion, but the tree is not a substitute for VoiceOver acceptance. Campaign, chapter, encounter, mastery, completion, Characters, Connections, Progress, and save-dialog reader checks remain open. No NVDA session was run.

### D. True 200% zoom acceptance

**Partially passed, not signed off.** Chrome's native View → Zoom In was used and Chrome exposed **“Zoom: 200%”**. At that actual page zoom, campaign map, Chapter I chapter map, encounter entry, Characters, Connections, Progress, and locked Chapter VI/encounter states exposed headings and relevant navigation/actions. Visual inspection of the campaign and Chapter I map found no confirmed essential clipping; document scrolling was available. Chrome was restored to **100%**. Mastery, completion, and the expanded Setu Compare Traditions panel were not checked at 200% before the Mac locked, so the full zoom gate remains open. Earlier responsive viewport tests are separate evidence, not a substitute for this gate.

### E. Real-phone acceptance

**PENDING BY OWNER INSTRUCTION.** No physical phone was available. Device, OS, and browser are therefore unrecorded. No simulated environment is counted toward this gate. This does not block completion of other Mac-based checks.

### F. New defects

No new release-class product defect was confirmed. Some native Chrome accessibility clicks only scrolled a target into view on the first attempt; a subsequent click or visible coordinate selection advanced the interaction. This is a test-control observation, not yet evidence of an app defect. Unverified acceptance gates are classified **MUST FIX evidence**, not code BLOCKERs.

### G. Fixes made

No new code, content, account, or source edit was made in this continuation. The earlier fixed-header heading scroll correction remains the sole product change in the release audit. The QA fixture affected only local storage on the isolated port-3001 origin.

### H. Remaining release gates

1. Live MariaDB save/account scenarios A–H after the existing connection configuration is available.
2. Finish Chapter VIII mastery/completion/next/reload and verify VI–VII completion reload/next navigation.
3. VoiceOver or NVDA traversal with recorded announcements and focus behavior across the specified routes.
4. Actual 200% Chrome zoom on Mastery, Completion, and expanded Setu Compare Traditions, with source text and primary actions inspected.
5. At least one physical-phone run when a device becomes available.

The Mac locked during Chapter VIII play and could not be unlocked automatically. An owner unlock was requested to finish the remaining Mac UI checks. It did not affect the isolated save or the earlier passed checks. The temporary port-3001 production server was stopped after recording this result; the isolated browser save remains on that origin.

### I. Updated readiness score and decision

**7/10 overall.** Representative live play and true browser zoom added material evidence, but the database, screen reader, final zoom surfaces, one finale encounter, and physical phone still prevent signoff. This score is an acceptance judgment, not a product-quality regression.

**NOT READY FOR RELEASE CANDIDATE**

## Mac acceptance completion — 25 September 2026

This is the latest acceptance state. Earlier sections remain historical evidence. The production build was exercised in a separate Chrome save at `127.0.0.1:3001`; the user's port-3000 save was untouched. Later isolated prerequisite fixtures retained chapter completion flags but replaced granular mastery state for the Chapter VI and VII samples, so those two mastery sequences had to be replayed before their final reload checks. The fixtures are not counted as a natural 35-encounter playthrough.

### A. Chapter VI final verification — PASS

Crossing into Laṅkā (HFW-03) finished at **3/3 mastery stars**. Reload reopened **Encounter Complete** with the same 3/3 result. “Continue to Hanumān at the Western Gate” opened that encounter. The Setu “Compare traditions” disclosure was available during the intended Story/Mastery state and opened both traditions with their quotation and source attribution. The final completion screen continues to offer “Explore deeper.”

### B. Chapter VII final verification — PASS

Jāmbavān Calls for Hanumān (HFH-01) finished at **3/3 mastery stars**. Reload reopened **Encounter Complete** with 3/3. “Continue to The First Mountain Rescue” opened that encounter. The prior wrong-answer and retry result remains valid; it was not repeated in this pass.

### C. Chapter VIII final verification — PASS

Rāvaṇa Falls (HFF-01) advanced through its remaining role match and final mastery activity to **3/3** with no dead end. Completion showed the three stars and next encounter. Reload retained completion and 3/3; “Continue the journey” opened Hanumān Brings Sītā the News (HFF-02). No wrong answer was exercised in this encounter; the nonblocking wrong-answer behavior was already observed in Chapters II and VII.

### D. True Chrome 200% zoom — PASS for the specified surfaces

Chrome explicitly reported **“Zoom: 200%”**. On Mastery, the question, answer controls, correct-result feedback, and “View completion” action were readable and usable. On Completion, the heading sat below the fixed navigation, the 3/3 stars and payoff were legible, and the next action was reachable by normal document scrolling. With Setu “Compare traditions” expanded, both Vālmīki and Rāmacaritamānasa quotation blocks and their printed-page attributions were readable; the mastery response action remained reachable. Visual inspection found no essential clipping or unintended document-level horizontal scroll on these surfaces. The earlier continuation records the other specified 200% routes. Chrome was restored to **100%** afterward. Internal map panning is separate from page overflow.

### E. Actual macOS VoiceOver — PENDING

VoiceOver was switched on in macOS System Settings, and “Show caption panel” was enabled in VoiceOver Utility. A VoiceOver navigation command was sent while Chrome displayed an encounter, but neither spoken output nor a caption-panel transcript could be observed through the available Mac control surface. The browser accessibility tree and focus reporting are supporting semantics only; they do **not** establish what VoiceOver announced. VoiceOver was switched off again. No reader pass, issue, or failure is inferred for the individual routes.

| Required VoiceOver area | Actual-reader result | Observation needed before signoff |
| --- | --- | --- |
| Campaign map | PENDING | Page identity, current chapter, actions, nonvisual map description. |
| Chapter map | PENDING | Current/locked encounter status and navigation. |
| Encounter | PENDING | Heading, phase, primary action. |
| Mastery | PENDING | Question, named/selected choices, correct/incorrect feedback, retry/continue. |
| Completion | PENDING | Heading, stars, next action. |
| Characters | PENDING | Collection navigation and knowledge hierarchy. |
| Connections | PENDING | Relationship state, controls, information. |
| Progress | PENDING | Next step, summary, actions. |
| Save dialog | PENDING | Dialog announcement, entry/exit focus, control names. |

The acceptance brief requests PASS / PASS WITH ISSUE / FAIL for each **tested** area. None of these areas received observable VoiceOver announcement evidence, so assigning one of those verdicts would be misleading. This is an evidence gap, not a confirmed product defect.

### F. Live database — PENDING CONFIGURATION

A targeted recheck found no repository `.env.local` and no `MARIADB_URL` in this process. No connection string or credential was printed. `pnpm db:check` and all eight live account/save scenarios remain **not run** because the existing MariaDB configuration has not been made available to this checkout. Prior automated merge/reset coverage is unchanged.

**LIVE DATABASE ACCEPTANCE — PENDING CONFIGURATION**

### G. Physical phone — PENDING

No physical phone is available. Mac browser checks are not counted as a device run.

**REAL PHONE ACCEPTANCE — PENDING**

### H. New defects and fixes

No new BLOCKER or MUST FIX product defect was confirmed; no product code, sacred content, save logic, or database data was changed in this completion pass. The existing `app/globals.scss` fixed-header heading-scroll correction from the first audit remains the only product edit. VoiceOver, database, and phone are **MUST FIX acceptance evidence gates**, not observed application failures.

### I. Updated readiness score

**8/10 overall.** Representative Chapters II–VIII, Chapter VI–VIII final reload/next checks, and actual 200% zoom now pass. Actual VoiceOver announcements, eight live MariaDB scenarios, and a physical-phone run remain unverified. The score measures acceptance evidence, not a regression in product quality.

### J. Final current decision

**NOT READY FOR RELEASE CANDIDATE**

- Actual macOS VoiceOver traversal with observable announcements and focus behavior on the nine required areas.
- Live MariaDB save/account scenarios A–H after the existing configuration is available.
- At least one physical-phone acceptance run.
