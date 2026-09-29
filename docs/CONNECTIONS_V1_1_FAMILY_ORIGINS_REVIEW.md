# Connections V1.1 — Family & Origins vertical slice

The refined Family & Origins slice is the pattern candidate for later Connections lenses. Explore offers spoiler-safe inspection before Build; Build keeps Hanumān and the growing graph primary; Character Focus presents directional relationship statements and source-aware Learn More material. The Vālmīki claims remain pending approved Gita Press edition audit.

## Acceptance status

- Tap placement and keyboard placement: verified.
- Wrong-answer retry and other-lens feedback: verified.
- Responsive review: desktop, 820 × 900, 430 × 932, 390 × 844, and 360 × 800; no page-level horizontal overflow.
- **Observed physical defect (Mac trackpad):** the native drag preview displayed the full portrait atlas instead of the selected cropped portrait. **Status before fix: PHYSICAL POINTER DRAG — FAIL.**
- **First defect fixed:** the pool supplies a portrait-sized cropped canvas to `dataTransfer.setDragImage()` for both Family & Origins and Kiṣkindhā. The second Mac trackpad test confirmed this preview behaves correctly. Family native drop and pointer fallback are guarded against duplicate placement.
- **Second observed physical defect (Mac trackpad):** dragging settled Sugrīva in the authored graph still produced the full portrait-atlas ghost. Graph portraits had no placement drag handler, but their nested images retained native browser dragging. Settled graph buttons and their images are now explicitly non-draggable, with text selection suppressed; click, keyboard, and drop-target behavior remain. **Status after code fix: PHYSICAL POINTER DRAG — PENDING RE-TEST.** Browser automation, synthetic drag events, and code inspection do not count as a physical pass.

### Physical pointer acceptance record

| Check | Device | Real physical pointer used | Result |
| --- | --- | --- | --- |
| Native preview before code fix: full portrait atlas displayed | Mac trackpad | Yes, user-reported | FAIL before fix |
| Cropped pool-portrait preview after first code fix | Mac trackpad | Yes, user-reported | FIXED for pool portrait |
| Settled Sugrīva node produced full atlas ghost before second fix | Mac trackpad | Yes, user-reported | FAIL before fix |
| Settled graph node cannot begin a native drag after second fix | Mac trackpad | Not yet re-tested | PENDING RE-TEST |
| Valid portrait drag, relationship choice, authored graph position, line, label, and persistence | Mac trackpad | Not yet verified | PENDING |
| Distractor drop, other-lens feedback, no lost progress, return to pool | Mac trackpad | Not yet verified | PENDING |
| Invalid drop outside the graph and immediate retry | Mac trackpad | Not yet verified | PENDING |
| One release without duplicate relationship step, feedback, edge, or progress | Mac trackpad | Not yet verified | PENDING |
| Two consecutive drags without stale state | Mac trackpad | Not yet verified | PENDING |
| Physical feel and concrete usability defects | Mac trackpad | Not yet verified | PENDING |

The running local `/connections` page and automated checks do not establish physical-pointer acceptance. Update each pending row only after a real trackpad re-test is observed or reported with specific results.

Post-fix browser regression: Family & Origins portrait selection by click and placement by tapping Hanumān reached the relationship-choice step. Kiṣkindhā portrait selection and placement by keyboard Return reached the relationship-choice step. These checks cover the alternate input paths only; the native drag preview and drop behavior still need the physical trackpad re-test.

Second-fix browser regression: tapping settled Sugrīva in the Kiṣkindhā graph selected his inspection clue; keyboard Return did the same and opened his Character Focus. In Family & Origins, a portrait could still be selected from the pool, paired, revealed, and opened from its settled graph position using the keyboard. Both lenses' settled graph images now render with `draggable={false}` while pool drag handlers remain unchanged. A real trackpad is still required to verify that no native drag or atlas ghost begins on a settled node and that subsequent pool drags still work.

The original Family & Origins checkpoint predates Kiṣkindhā. Both lenses now use the same cropped drag-preview helper.
