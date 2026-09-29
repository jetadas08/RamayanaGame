# Connections V1.1 — Kiṣkindhā implementation content specification

**Scope:** source-verified content and interaction copy only. This file does not implement a graph, add player-facing data, approve exact quotations, or alter Family & Origins, Journey, or save behavior. It refines [the Kiṣkindhā research dossier](CONNECTIONS_V1_1_KISHKINDHA_SOURCE_RESEARCH.md). The approved source images are in the read-only project mirror at `reference-pdfs/`; do not modify them.

**Edition and proof method.** `VR1` below is the original page-image PDF `Valmiki_Ramayana_Gita_Press_Part_1.pdf`, Gita Press Vālmīki Rāmāyaṇa, Kiṣkindhākāṇḍa, Sanskrit with Hindi explanation. `RCM` is the original page-image PDF `Ramcharitmanas_Gita_Press_Romanized_English.pdf`, Gita Press Rāmacaritamānasa, Kiṣkindhākāṇḍa. The approved VR1 OCR search copy helped locate passages; the cited *original images* were then inspected. In the relevant VR1 section, **PDF page = printed page + 12**. RCM PDF and printed page numbers coincide in the cited section. No outside edition supplies an edge. Source notes below give the supporting image pages, not an assertion that every line in the wider sarga was independently audited. No exact quotation appears in this specification.

**Status vocabulary.** `READY FOR BUILD` means the edge and proposed paraphrase have image-checked support for the specified story moment, not that the UI is implemented. `READY FOR EXPLORE` and `READY FOR CHARACTER FOCUS` have the same source standard for their respective surfaces. `READY FOR SOURCE NOTE` means a concise edition-tagged note can be drafted from the checked page. `NEEDS PAGE CHECK` means a more specific proposed claim still needs its own page proof. `NEEDS QUOTE PROOF` applies to *every* future exact quotation. `DEFER` means it is intentionally outside the first release.

## A. VERIFIED RELATIONSHIP MATRIX

The **direct** classification records narrated contact, a formal commitment, or stated kinship; it does not mean friendly, permanent, or simultaneous. `Contextual` means a real contact best taught in its story moment rather than as a core Build bond. `Indirect` is a *lens-routing choice*, not an epic-wide assertion that two characters never met. IDs match the research dossier.

| ID | Pair, relationship, and classification | Original approved page image inspected | Verified paraphrase boundary | Destination / status |
| --- | --- | --- | --- | --- |
| K01 | Hanumān–Sugrīva: envoy, counsel, entrusted service; **direct**. | VR1 2:1–29, printed 751–753 / PDF 763–765; 44:1–3, printed 883 / PDF 895. | Sugrīva sends Hanumān to learn who the brothers are; later he judges Hanumān fit for the search. Do not imply Hanumān serves Vāli. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K02 | Sugrīva–Vāli: brothers in conflict; **direct**. | VR1 9:1–26, printed 768–769 / PDF 780–781; 22, printed 805–806 / PDF 817–818. | Sugrīva recounts a dispute and exile involving his elder brother; Vāli later addresses him about Aṅgada. Do not reduce the dispute to one motive or present Sugrīva's account as an omniscient judgment. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K03 | Vāli–Tārā: spouses, counsel; **direct**. | VR1 15:8–21, printed 786 / PDF 798; 18:55–57, printed 799 / PDF 811. | Tārā warns Vāli, including Rāma's support for Sugrīva; Vāli's later words acknowledge the value of her counsel. Do not call her merely a worried spectator. | **READY FOR BUILD; READY FOR CHARACTER FOCUS**. |
| K04 | Vāli–Aṅgada: father and son; **direct**. | VR1 22:1–22, printed 805–806 / PDF 817–818. | Vāli speaks about his son Aṅgada's future and addresses him before death. Do not assign Aṅgada's fatherhood to Sugrīva. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K05 | Tārā–Aṅgada: mother and son; **direct**. | VR1 19:27–28, printed 802 / PDF 814; 22:11–14, printed 806 / PDF 818; 55:14–15, printed 904 / PDF 916. | Tārā is Aṅgada's mother; his later words remember her in the search-party crisis. Do not confuse her with the male searcher Tāra. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K06 | Sugrīva–Aṅgada: uncle, protector, king/heir; **direct**. | VR1 22:1–22, printed 805–806 / PDF 817–818; 26:11–13 and 38–39, printed 819–820 / PDF 831–832. | Vāli asks Sugrīva to care for Aṅgada; in VR1 Sugrīva makes him crown prince. Do not describe this only as effortless family harmony. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K07 | Rāma–Sugrīva: mutual friendship/alliance; **direct**. | VR1 5:6–24, printed 759–760 / PDF 771–772; RCM dohas 3–5, printed/PDF 733–734. | Their alliance joins Rāma's search for Sītā to Sugrīva's need for help. Each has an obligation; later delay does not erase the alliance. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K08 | Hanumān–Rāma: envoy and mediator, later service; **direct**. | VR1 3:1–10 and 25–38, printed 753–755 / PDF 765–767; 44:1–3, printed 883 / PDF 895; RCM opening and dohas 3–4, printed/PDF 730, 733–734. | Hanumān meets Rāma as Sugrīva's envoy and brings about the meeting with Sugrīva. The devotional recognition on RCM 733 is **RCM-specific**. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K09 | Hanumān–Lakṣmaṇa: first embassy; **direct**, supporting. | VR1 3:1–10 and 25–38, printed 753–755 / PDF 765–767; 5:18–20, printed 760 / PDF 772. | Hanumān meets and addresses both brothers, then brings them toward Sugrīva. Do not make this a separate sworn alliance. | **READY FOR EXPLORE; READY FOR CHARACTER FOCUS**. |
| K10 | Hanumān–Aṅgada: southern search companions and counsel; **direct**. | VR1 41:1–6, printed 871–872 / PDF 883–884; 54:1–11, printed 901 / PDF 913; 55:14–15, printed 904 / PDF 916. | They join the southern party; Hanumān later counsels Aṅgada in a crisis. Their exchange is not uniformly agreeable. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K11 | Jāmbavān–Hanumān: reminder and encouragement; **direct**. | VR1 65:35, printed 922 / PDF 934; 66:1–3 and 34–38, printed 922–924 / PDF 934–936; RCM closing passage after doha 29, printed/PDF 761. | Jāmbavān calls Hanumān to the task and recalls his capacity. He does **not** give or create Hanumān's powers. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K12 | Jāmbavān–Aṅgada: search leadership and counsel; **direct**. | VR1 65:28–35, printed 921–922 / PDF 933–934; RCM closing passage after doha 29, printed/PDF 761. | Jāmbavān advises Aṅgada about the crossing and preserving the party's leader. Do not call him Aṅgada's parent or king. | **READY FOR BUILD; READY FOR SOURCE NOTE**. |
| K13 | Rāma–Vāli: confrontation and ethical debate; **direct**, contextual. | VR1 16:35–39, printed 790 / PDF 802; 17:1–18, printed 791 / PDF 803; 18:55–66, printed 799 / PDF 811; RCM dohas 8–10, printed/PDF 739–742. | Vāli questions Rāma's act and Rāma answers. A short “Rāma defeats Vāli” edge cannot carry the ethical context. RCM's devotional ending stays labeled separately. | **READY FOR EXPLORE; READY FOR SOURCE NOTE**. |
| K14 | Lakṣmaṇa–Sugrīva: accountability within alliance; **direct**, later. | VR1 31 opening, printed 841 / PDF 853; 34:12–19, printed 854 / PDF 866; 35:1–23, printed 854–856 / PDF 866–868; RCM dohas 19–20, printed/PDF 750–751. | Lakṣmaṇa presses Sugrīva to honor the promised search; their confrontation is addressed. Do not label permanent enmity or a broken alliance. | **READY FOR EXPLORE; READY FOR SOURCE NOTE**. |
| K15 | Tārā–Lakṣmaṇa: counsel in crisis; **direct**, later. | VR1 35:1–23, printed 854–856 / PDF 866–868; RCM passage after doha 19, printed/PDF 750–751. | Tārā speaks to Lakṣmaṇa amid the conflict. RCM specifically pairs her with Hanumān in the approach; do not silently import that detail into VR1. | **READY FOR EXPLORE; READY FOR SOURCE NOTE**. |
| K16 | Tārā–Sugrīva: political counsel/succession context; **direct/contextual**. | VR1 18:55–64, printed 799 / PDF 811; 35:1–23, printed 854–856 / PDF 866–868. | Vāli asks Sugrīva not to disregard Tārā's counsel; she later speaks in the alliance crisis. Do not invent a formal “chief minister” role. | **READY FOR EXPLORE; READY FOR SOURCE NOTE**. |
| K17 | Hanumān–Tārā: counsel after Vāli's death; **direct**, contextual. | VR1 21:1–16, printed 804–805 / PDF 816–817. | Hanumān speaks directly to grieving Tārā about Aṅgada and the kingdom's future. Do not portray their contact as a permanent core allegiance or say they never interact. | **READY FOR EXPLORE; READY FOR SOURCE NOTE**. |
| K18 | Rāma–Tārā: consolation; **direct**, contextual. | VR1 24:25–44, printed 812–814 / PDF 824–826, especially 24:41–44 on p. 814 / PDF 826; RCM after doha 10, printed/PDF 742. | Rāma addresses Tārā after Vāli's death. RCM adds a distinct request for Bhakti; do not project that wording into VR1. | **READY FOR EXPLORE; READY FOR SOURCE NOTE**. |
| K19 | Hanumān–Vāli: path through Sugrīva; **indirect in this lens**. | Positive path verified by VR1 2:1–29, printed 751–753 / PDF 763–765; 9:1–26, printed 768–769 / PDF 780–781. No exhaustive negative proof is claimed. | “Hanumān's Kiṣkindhā connection to Vāli runs through Sugrīva.” Never say “they never met” or “there is no contact anywhere.” | **READY FOR EXPLORE** as a routing explanation; **DEFER** as direct Build edge. |
| K20 | Rāma–Lakṣmaṇa: brothers in the search; **direct**, supporting. | VR1 3:1–10 and 25–38, printed 753–755 / PDF 765–767; 31 opening, printed 841 / PDF 853. | The brothers arrive together; Lakṣmaṇa later carries Rāma's urgent message. Their family tie need not be a core Build puzzle here. | **READY FOR CHARACTER FOCUS; READY FOR EXPLORE**. |

**Verification result:** the affirmative claims above have been checked on the cited original approved page images. K19 is deliberately *not* a verified universal negative. Wider-sarga interpretations, spelling of any exact line, and any future quote require separate proof. Some original scan pages are dense; a second independent sacred-content editorial review is still required before publication, even where the relationship and paraphrase are ready.

## B. FINAL GRAPH EDGE LIST

Only these eleven edges are proposed for the **first Build graph**. The relation label is player-facing; the explanation remains outside the line itself. An edge's placement in Build does not erase the contextual Explore links in §A.

| Edge | Player-facing label | Scope and direction | Status |
| --- | --- | --- | --- |
| K01 Hanumān—Sugrīva | **Sugrīva's trusted envoy** | Service from Hanumān toward Sugrīva; later entrusted mission. | **READY FOR BUILD** |
| K08 Hanumān—Rāma | **Hanumān meets Rāma** | First embassy, then mediation. Avoid implying they are kin. | **READY FOR BUILD** |
| K07 Rāma—Sugrīva | **Mutual alliance** | Two-way promise and help. | **READY FOR BUILD** |
| K02 Sugrīva—Vāli | **Brothers in conflict** | Kinship remains true despite dispute. | **READY FOR BUILD** |
| K03 Vāli—Tārā | **Wife and counsellor** | Family and counsel; do not reduce to a romance edge. | **READY FOR BUILD** |
| K04 Vāli—Aṅgada | **Father and son** | Parentage and final concern. | **READY FOR BUILD** |
| K05 Tārā—Aṅgada | **Mother and son** | Parentage, grief, care. | **READY FOR BUILD** |
| K06 Sugrīva—Aṅgada | **Uncle and crown prince** | Kinship plus succession under Sugrīva's reign. | **READY FOR BUILD** |
| K10 Hanumān—Aṅgada | **Southern search companions** | Later shared mission, including counsel and disagreement. | **READY FOR BUILD** |
| K12 Jāmbavān—Aṅgada | **Counsel to the search leader** | Later mission moment. | **READY FOR BUILD** |
| K11 Jāmbavān—Hanumān | **Reminds Hanumān of his strength** | Later seashore moment; no power-giving claim. | **READY FOR BUILD** |

**Explore-only links:** K09, K13–K18, K20, and the indirect K19 path. K09 can be visible as a meeting clue without turning Lakṣmaṇa into another first-round sworn ally. The graph's temporal layers must separate **first embassy → family/succession → southern search → delayed-search accountability**. Keep all eight core nodes available in the lens; hide or reveal edges by the learning moment, not by pretending the people do not belong.

## C. BUILD ROUND SPEC

These strings are player-ready *candidates*. Correctness is scoped by each instruction's story moment. Once a later direct contact exists, the earlier round must not mark that character “unrelated”; feedback says “not part of this moment.” Character selection and edge selection are distinct checks so a correct person with the wrong relation gets specific guidance.

### Round 1 — The first meeting

- **Instruction:** “Start with Hanumān's first embassy. Who does he serve, and whom does he meet?”
- **Eligible characters:** Sugrīva, Rāma, Lakṣmaṇa. **Required edges:** Hanumān–Sugrīva (`Sugrīva's trusted envoy`) and Hanumān–Rāma (`Hanumān meets Rāma`). Hanumān–Lakṣmaṇa is a valid **Explore** contact, never a wrong answer to “whom does he meet.”
- **Plausible distractors:** Vāli (connected through Sugrīva), Aṅgada and Jāmbavān (join Hanumān's story later). Avoid Tārā as an absolute “never met” distractor because K17 is direct later.
- **Relationship choices:** “Sugrīva's trusted envoy” / “Brothers” / “Rivals”; “Hanumān meets Rāma” / “Father and son” / “Already sworn enemies.”
- **Correct feedback:** “Yes. Sugrīva sends Hanumān to learn who the brothers are. That careful meeting opens the way to an alliance.”
- **Wrong-character feedback:** “This person matters in Kiṣkindhā, but this step follows Hanumān's first embassy. Look for the one who sends him and the brothers he approaches.”
- **Wrong-edge feedback:** “You found the people. Now name what happens between them: Sugrīva sends an envoy; Hanumān meets Rāma.”
- **`learningInterpretation`:** “Service begins with attention.”
- **Status:** **READY FOR BUILD**; K09 remains **READY FOR EXPLORE**.

### Round 2 — The bond and the royal family

- **Instruction:** “Follow the new alliance into Kiṣkindhā. Connect Sugrīva, Vāli, Tārā, and Aṅgada by the ties the story gives them.”
- **Eligible characters:** Rāma, Sugrīva, Vāli, Tārā, Aṅgada. **Required edges:** K07, K02–K05. The first edge is alliance; the others distinguish brotherhood, marriage/counsel, and parentage.
- **Plausible distractors:** Hanumān as Vāli's direct confidant; Sugrīva as Aṅgada's father; Tārā as an unrelated palace observer. These are *wrong labels or paths*, not excluded people.
- **Relationship choices:** “Mutual alliance” / “Blood relatives”; “Brothers in conflict” / “Unrelated rivals”; “Wife and counsellor” / “Southern search companion”; “Father and son” / “Uncle and son”; “Mother and son” / “Sister and brother.”
- **Correct feedback:** “The alliance leads into a family changed by conflict. Vāli and Sugrīva are brothers; Tārā and Aṅgada are part of the same family story.”
- **Wrong-character feedback:** “Stay with the alliance and the royal family for now. The search party comes next.”
- **Wrong-edge feedback:** “The people fit. Check the kind of tie: friendship between Rāma and Sugrīva, conflict between brothers, and Aṅgada's parents.”
- **`learningInterpretation`:** “Friendship brings responsibility beyond one person.”
- **Status:** **READY FOR BUILD**. The Rāma–Vāli ethical exchange remains **READY FOR EXPLORE**, not reduced to a Build label.

### Round 3 — An heir joins the search

- **Instruction:** “The story moves from the kingdom to the southern search. Connect Aṅgada's new role with Hanumān and Jāmbavān.”
- **Eligible characters:** Sugrīva, Aṅgada, Hanumān, Jāmbavān. **Required edges:** K06, K10–K12.
- **Plausible distractors:** Sugrīva as Aṅgada's father; Jāmbavān as the giver of Hanumān's powers; Tārā as the named southern searcher (only if feedback distinguishes the male Tāra carefully).
- **Relationship choices:** “Uncle and crown prince” / “Father and son”; “Southern search companions” / “Rivals for the throne”; “Counsel to the search leader” / “Father and son”; “Reminds Hanumān of his strength” / “Gives Hanumān his strength.”
- **Correct feedback:** “Aṅgada remains Vāli and Tārā's son, becomes heir under Sugrīva, and joins the southern search. Jāmbavān advises him and calls Hanumān to act.”
- **Wrong-character feedback:** “Look for the people who carry the southern search forward. Tārā's role in the family is different from the searcher's role.”
- **Wrong-edge feedback:** “The team is right. Try the relationship again: succession for Aṅgada, companionship in the search, and counsel from Jāmbavān.”
- **`learningInterpretation`:** “Remembering a shared purpose can turn strength into service.”
- **Status:** **READY FOR BUILD**. Do not make the Tāra/Tārā name trap mandatory for newcomers.

### Round 4 — Find the path

- **Instruction:** “Some people meet directly; others connect through the network. Trace the path that fits each moment.”
- **Eligible correct paths:** Hanumān → Sugrīva → Vāli (**indirect in this lens**); Hanumān ↔ Tārā (**direct later conversation, Explore**); Lakṣmaṇa ↔ Sugrīva (**direct later confrontation, Explore**); Rāma ↔ Sugrīva (**direct alliance**). Correctness includes the time label.
- **Plausible distractors:** Hanumān–Vāli as a direct service edge; Tārā as someone Hanumān never speaks to; Lakṣmaṇa–Sugrīva as permanent enemies; Rāma–Sugrīva as family.
- **Relationship choices:** “Direct in this moment” / “Direct later” / “Through someone else”; the selection must be paired with an explanatory path, not scored solely on a hidden graph edge.
- **Correct feedback:** “You followed the right path. A relationship can be close to the story without being a direct bond in this moment.”
- **Wrong-character feedback:** “Both people may matter here. Check *when* they meet, or which person connects them.”
- **Wrong-edge feedback:** “The pair is right; the route needs another look. Hanumān reaches Vāli's story through Sugrīva, while Tārā and Lakṣmaṇa each have later direct conversations.”
- **`learningInterpretation`:** “Careful attention makes room for every person's role.”
- **Status:** **READY FOR BUILD** as a path-classification round; contextual pair explanations are **READY FOR EXPLORE**.

## D. DISTRACTOR MATRIX

Use a wrong option only in a question whose **time and relationship type are explicit**. Never mark a true later contact wrong simply because its edge is hidden in the current graph.

| Candidate | Correct boundary | Feedback to show | Status |
| --- | --- | --- | --- |
| Hanumān serves Vāli directly | The core route is Hanumān → Sugrīva → Vāli. No distinct direct service edge is established here. | “Trace this part of the story through Sugrīva.” | **READY FOR BUILD** |
| Sugrīva is Aṅgada's father | Vāli is his father; Sugrīva is his uncle and later king. | “Aṅgada's father is Vāli. Sugrīva becomes responsible for him as the kingdom changes.” | **READY FOR BUILD** |
| Tārā is only a palace spectator | Her counsel and motherhood are explicit. | “Look again at who warns Vāli and cares about Aṅgada's future.” | **READY FOR BUILD** |
| Jāmbavān gives Hanumān his powers | He reminds and urges Hanumān. | “Jāmbavān calls attention to strength Hanumān already has.” | **READY FOR BUILD** |
| Rāma and Sugrīva are relatives | Their connection is an alliance, not kinship. | “Their promise joins two needs; it does not make them family.” | **READY FOR BUILD** |
| Lakṣmaṇa and Sugrīva become permanent enemies | The tense exchange occurs within the existing alliance. | “Lakṣmaṇa presses the search promise; the alliance continues.” | **READY FOR BUILD** in Round 4 |
| Hanumān never speaks with Tārā | VR1 21 narrates a direct conversation. | “They speak after Vāli's death. It is a later, difficult moment.” | **READY FOR BUILD** in Round 4 |
| Queen Tārā joins the southern party because “Tāra” is named | A similarly named **male** searcher is distinct from Queen Tārā. | “This searcher and Queen Tārā are different people.” | **DEFER** unless a source-note affordance and careful disambiguation are provided. |
| Nala or Nīla as a first-round family link | Wider mission relevance does not make them part of the first embassy/family problem. | “They belong to another part of the journey; follow this scene's people first.” | **DEFER** as first-release options. |

## E. EXPLORE COPY

Explore is available **before** Build completion. The visible line hints at relationships; the optional deeper hint may appear after inspection. Do not show the final Build edge label, all parentage, or the correct Round 4 route as a pre-solved list. These lines are source-checked paraphrase candidates, not quotes.

| Character | Identity / why they matter / one relationship clue | Optional deeper hint | Status |
| --- | --- | --- | --- |
| Hanumān | “Sugrīva sends Hanumān to meet two strangers near Ṛṣyamūka. Watch whom he approaches, and how.” | “His first task is to learn before he introduces anyone.” | **READY FOR EXPLORE** |
| Sugrīva | “Sugrīva watches from the hill, uncertain of the newcomers. One brother has changed his place in the kingdom.” | “His hope for help will become a promise to help in return.” | **READY FOR EXPLORE** |
| Vāli | “Vāli rules Kiṣkindhā as his brother lives apart. The dispute reaches beyond the two of them.” | “Before the battle, someone close to him sees a danger he does not accept.” | **READY FOR EXPLORE** |
| Tārā | “Tārā sees the danger gathering around Vāli. Her words matter to the kingdom, not only to her household.” | “Follow what she asks him to consider—and who will need care afterward.” | **READY FOR EXPLORE** |
| Aṅgada | “Aṅgada's future changes with the conflict in Kiṣkindhā. Look for the people who protect his place.” | “His path will lead beyond the royal household into the search.” | **READY FOR EXPLORE** |
| Jāmbavān | “Jāmbavān is an elder among the southern searchers. Notice when he speaks and whom he urges forward.” | “At the shore, his counsel helps the group decide who should cross.” | **READY FOR EXPLORE** |
| Rāma | “Rāma seeks Sītā and arrives with Lakṣmaṇa. A conversation opened by Hanumān will change Sugrīva's future too.” | “The help promised here moves in both directions.” | **READY FOR EXPLORE** |
| Lakṣmaṇa | “Lakṣmaṇa comes beside Rāma. Later, he returns when the promised search has not moved quickly enough.” | “Watch how anger, counsel, and the task itself shape that meeting.” | **READY FOR EXPLORE** |

## F. CHARACTER FOCUS COPY

These opening profiles may appear **after selection/reveal**. Each uses two to four short factual lines. They do not replace Learn More or source notes.

| Character | Opening profile | Status |
| --- | --- | --- |
| Hanumān | “Sugrīva sends Hanumān to meet Rāma and Lakṣmaṇa. He brings the brothers to Sugrīva. Later, he joins the southern search.” | **READY FOR CHARACTER FOCUS** |
| Sugrīva | “Sugrīva is Vāli's brother. He and Rāma make a mutual alliance. As king, he sends searchers and makes Aṅgada heir.” | **READY FOR CHARACTER FOCUS** |
| Vāli | “Vāli is Sugrīva's elder brother, Tārā's husband, and Aṅgada's father. His conflict with Sugrīva reshapes the kingdom. He speaks for himself when Rāma's arrow strikes him.” | **READY FOR CHARACTER FOCUS** |
| Tārā | “Tārā is Vāli's wife and Aṅgada's mother. She warns Vāli before the battle. Later, her counsel matters during the kingdom's transition.” | **READY FOR CHARACTER FOCUS** |
| Aṅgada | “Aṅgada is the son of Vāli and Tārā. He becomes crown prince under Sugrīva. He joins the southern search and faces difficult decisions.” | **READY FOR CHARACTER FOCUS** |
| Jāmbavān | “Jāmbavān is an elder in the southern search. He advises Aṅgada. At the shore, he reminds Hanumān of his strength and task.” | **READY FOR CHARACTER FOCUS** |
| Rāma | “Rāma seeks Sītā. Hanumān brings him into contact with Sugrīva, and they pledge help to one another. Rāma's action against Vāli becomes a matter of direct debate.” | **READY FOR CHARACTER FOCUS** |
| Lakṣmaṇa | “Lakṣmaṇa arrives with his brother Rāma. Later, he presses Sugrīva to honor the search promise. Tārā helps address his anger.” | **READY FOR CHARACTER FOCUS** |

## G. LEARN MORE STRUCTURE

Keep the opening profile short; these are optional, layered sections, not automatic tooltip text. Each section should offer **what happened, why it matters, and its source note**. The last column is its first-release status.

| Character | Section headings and focus | Status |
| --- | --- | --- |
| Hanumān | “The first embassy” (VR1 2–5); “A careful introduction” (5); “The seashore reminder” (65–66); “A difficult conversation with Tārā” (21). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Sugrīva | “Brothers and exile” (9–10); “A promise in both directions” (5); “The search delayed” (31–36); “Aṅgada's place” (26). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Vāli | “Tārā's warning” (15); “Vāli questions Rāma” (17–18); “Concern for Aṅgada” (22); “A devotional turn in the RCM” (RCM 739–742, explicitly labeled). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Tārā | “Counsel before battle” (15); “Aṅgada and succession” (19–22); “Speaking to Lakṣmaṇa” (35); “RCM's Bhakti emphasis” (RCM 742, explicitly labeled). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Aṅgada | “His parents” (22); “The crown prince” (26); “The southern search and doubts” (41, 54–55, 65). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Jāmbavān | “The southern party” (41); “Counsel to Aṅgada” (65); “Calling Hanumān to the task” (66); “RCM's service framing” (RCM 761). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Rāma | “The mutual alliance” (5); “The debate with Vāli” (16–18); “The kingdom after Vāli” (24, 26); “Where the RCM differs” (RCM 739–743). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |
| Lakṣmaṇa | “Beside Rāma at the first meeting” (3–5); “Calling Sugrīva to account” (31–36); “Tārā's intervention” (35); “Coronation agency in the RCM” (RCM 743). | **READY FOR CHARACTER FOCUS; READY FOR SOURCE NOTE** |

## H. FACT → CONTEXT → MEANING LINES

Only the first two fields are textual claims. The third is an **internally labeled `learningInterpretation`**, offered as a gentle reflection, not as a quotation, a doctrinal verdict, or evidence for the relationship. Show it only after the player has seen the fact and scene context.

| Fact | Story context | `learningInterpretation` | Status |
| --- | --- | --- | --- |
| Sugrīva sends Hanumān to inquire. | He does not yet know who the brothers are. | “Service begins with attention.” | **READY FOR BUILD** |
| Rāma and Sugrīva make an alliance. | Each promises help in a different need. | “Friendship asks something of both friends.” | **READY FOR BUILD** |
| Tārā warns Vāli. | She knows the danger of Sugrīva's new support. | “Wise counsel deserves to be heard.” | **READY FOR EXPLORE** |
| Vāli asks for Aṅgada's care. | His death leaves a son and a kingdom in transition. | “Responsibility continues after conflict.” | **READY FOR CHARACTER FOCUS** |
| Lakṣmaṇa presses Sugrīva. | Sītā's search has been delayed. | “A promise matters when it becomes action.” | **READY FOR EXPLORE** |
| Jāmbavān urges Hanumān forward. | The southern search has reached the ocean. | “Remembering purpose can steady courage.” | **READY FOR BUILD** |
| RCM gives Vāli and Tārā devotional moments. | That retelling frames the aftermath with explicit Bhakti language. | “Devotion can be explored in this tradition's own voice.” | **READY FOR SOURCE NOTE** only with an RCM label; **DEFER** as generic graph feedback. |

## I. SOURCE NOTES

**Player-facing source-note format:** “Vālmīki Rāmāyaṇa, Kiṣkindhākāṇḍa, sarga [number], Gita Press Part 1, printed p. [number].” When relevant add a separate line: “Rāmacaritamānasa, Kiṣkindhākāṇḍa, Gita Press, doha [number] and nearby verses, p. [number].” The app must show only source work, edition, passage, printed page, and a short plain-language boundary. Do not show `K` IDs, `VR1`, internal statuses, OCR method, or raw enums to players.

| Relationship / claim type | Player-facing source-note sentence candidate | Edition, passage, printed page; verification | Status |
| --- | --- | --- | --- |
| K01 · narrated envoy/service | “Sugrīva sends Hanumān to learn who has arrived; later he entrusts him with the search.” | VR1, sargas 2 and 44, pp. 751–753, 883; original images 763–765, 895 checked. | **READY FOR SOURCE NOTE** |
| K02 · kinship/conflict | “Sugrīva tells the history of his conflict with his elder brother Vāli.” | VR1, sarga 9, pp. 768–769; images 780–781 checked. | **READY FOR SOURCE NOTE** |
| K03 · spouse/counsel | “Tārā warns Vāli before his fight with Sugrīva.” | VR1, sarga 15, p. 786; image 798 checked. | **READY FOR SOURCE NOTE** |
| K04 · father/son | “Vāli speaks about the future of his son Aṅgada.” | VR1, sarga 22, pp. 805–806; images 817–818 checked. | **READY FOR SOURCE NOTE** |
| K05 · mother/son | “Aṅgada is Tārā's son; her place in his future is part of the aftermath.” | VR1, sargas 19 and 22, pp. 802, 805–806; images 814, 817–818 checked. | **READY FOR SOURCE NOTE** |
| K06 · succession | “Vāli asks Sugrīva to care for Aṅgada; Sugrīva later makes him crown prince.” | VR1, sargas 22 and 26, pp. 805–806, 819–820; images 817–818, 831–832 checked. RCM p. 743 assigns the installation to Lakṣmaṇa; image 743 checked. | **READY FOR SOURCE NOTE** with edition-specific agent. |
| K07 · mutual alliance | “Rāma and Sugrīva pledge help across the two needs that brought them together.” | VR1, sarga 5, pp. 759–760; images 771–772 checked. RCM dohas 3–5, pp. 733–734; images checked. | **READY FOR SOURCE NOTE** |
| K08 · narrated meeting/mediation | “Hanumān approaches Rāma as Sugrīva's envoy and helps bring the two sides together.” | VR1, sargas 3–5, pp. 753–760; images 765, 767, 771–772 checked. RCM pp. 730, 733–734 checked separately. | **READY FOR SOURCE NOTE** |
| K09 · narrated first contact | “Hanumān also speaks with Lakṣmaṇa during the first embassy.” | VR1, sarga 3, pp. 753–755; images 765, 767 checked. | **READY FOR SOURCE NOTE** |
| K10 · party/companionship/counsel | “Hanumān and Aṅgada join the southern search, and Hanumān later counsels him.” | VR1, sargas 41, 54–55, pp. 871–872, 901–904; images 883–884, 913, 916 checked. | **READY FOR SOURCE NOTE**; include the difficult exchange in expanded note. |
| K11 · counsel/reminder | “Jāmbavān urges Hanumān toward the ocean crossing and reminds him of his capacity.” | VR1, sargas 65–66, pp. 922–924; images 934–936 checked. RCM p. 761 checked separately. | **READY FOR SOURCE NOTE** |
| K12 · counsel/leadership | “Jāmbavān advises Aṅgada about the crossing and his role as leader.” | VR1, sarga 65, pp. 921–922; images 933–934 checked. RCM p. 761 checked separately. | **READY FOR SOURCE NOTE** |
| K13 · conflict/debate | “Vāli questions Rāma's act, and Rāma replies.” | VR1, sargas 16–18, pp. 790–799; images 802–805, 811 checked. RCM dohas 8–10, pp. 739–742 checked separately. | **READY FOR SOURCE NOTE**; **READY FOR EXPLORE**, not first Build. |
| K14 · alliance accountability | “Lakṣmaṇa confronts Sugrīva over the delayed search; the exchange remains within their alliance.” | VR1, sargas 31, 34–36, pp. 841, 854–858; images 853, 866–868 checked. RCM pp. 750–751 checked separately. | **READY FOR SOURCE NOTE** |
| K15 · counsel/diplomacy | “Tārā speaks to Lakṣmaṇa during that tense visit.” | VR1, sarga 35, pp. 854–856; images 866–868 checked. RCM pp. 750–751 checked separately. | **READY FOR SOURCE NOTE** |
| K16 · political counsel | “Vāli commends Tārā's counsel to Sugrīva; she later responds to the search crisis.” | VR1, sargas 18 and 35, pp. 799, 854–856; images 811, 866–868 checked. | **READY FOR SOURCE NOTE** |
| K17 · contextual direct counsel | “Hanumān speaks with Tārā after Vāli's death about Aṅgada and what follows.” | VR1, sarga 21, pp. 804–805; images 816–817 checked. | **READY FOR SOURCE NOTE** |
| K18 · consolation/tradition difference | “Rāma addresses Tārā after Vāli's death. The Rāmacaritamānasa gives her response an explicit devotional emphasis.” | VR1, sarga 24, pp. 812–814; images 824–826 checked. RCM p. 742 checked separately. | **READY FOR SOURCE NOTE** with separate work labels. |
| K19 · editorial indirect path | “The Kiṣkindhā graph reaches Vāli through Sugrīva's family conflict; it does not posit a direct Hanumān–Vāli service bond.” | Supporting positive route: VR1 sargas 2 and 9, pp. 751–753, 768–769; images 763–765, 780–781 checked. This is *not* an exhaustive negative claim. | **READY FOR SOURCE NOTE** as graph-scope explanation only. |
| K20 · kinship/shared mission | “Rāma and Lakṣmaṇa are brothers who arrive together.” | VR1, sarga 3, pp. 753–755; images 765, 767 checked. | **READY FOR SOURCE NOTE** |

**Tradition firewall:** the RCM images at pp. 730, 733–734, 738–743, 750–751, and 760–761 were read as the RCM itself. In particular, VR1 sarga 26, p. 820 gives the Aṅgada installation to **Sugrīva**; RCM doha 11, p. 743 gives it to **Lakṣmaṇa**. A shared caption can say only “Aṅgada becomes crown prince.” RCM's devotional Vāli/Tārā scenes and Hanumān–Tārā embassy with Lakṣmaṇa are not labels for VR1 events. These distinctions are **READY FOR SOURCE NOTE**.

## J. DEFERRED MATERIAL

| Material | Why it stays out | Status |
| --- | --- | --- |
| Direct Hanumān–Vāli Build edge | It would hide the approved multi-hop path and lacks a distinct, established direct service relationship for this lens. | **DEFER** |
| Ruma, Nala, Nīla as first-release nodes | They deserve role-specific source and challenge design; they do not clarify the eight-character first graph. | **DEFER** |
| Queen Tārā / male Tāra trick question | The name collision can be educative, but is unfair without a clear optional source note and accessible name distinction. | **DEFER** |
| K09, K13–K18, K20 as first-release Build edges | They are true contacts/kinship but would overload the principal family-alliance-search path or need fuller ethical context. | **READY FOR EXPLORE**; **DEFER** as Build edges. |
| Full Vāli ethical verdict | The source presents a challenge and response. A short graph chip cannot adjudicate it. | **READY FOR SOURCE NOTE**; **DEFER** as one-line verdict. |
| Later war or return-scene bonds | Require the approved VR2 page images and a later story window. | **NEEDS PAGE CHECK; DEFER** |
| A single combined “Gita Press says” voice | VR1 and RCM differ in emphasis and sometimes in acting person. | **DEFER** permanently; keep work-specific notes. |

## K. QUOTE-PROOF NEEDS

**No exact quote is approved or included.** Even where a page image was inspected for a relationship, a quotation needs a separate character-by-character check of script, verse boundaries, edition page, transliteration, translation attribution, and publication rights. Potential future excerpts—Sugrīva's envoy instruction (VR1 2), the alliance (VR1 5), Tārā's warning (VR1 15), Vāli on Aṅgada (VR1 22), the delayed-search confrontation (VR1 34–35), Jāmbavān's address (VR1 66), and RCM's devotional closing scenes (RCM pp. 740–742, 761)—are all **NEEDS QUOTE PROOF**. Implement the paraphrases above only.

## L. IMPLEMENTATION-READY QUEUE

This is a handoff sequence for a **later** implementation task, not authorization to change app code now.

1. **READY FOR BUILD:** Add only the eleven typed edges in §B, with story moment, direction, relationship label, and provenance from §I. K19 must be represented as a path explanation, not a direct edge.
2. **READY FOR BUILD:** Implement the four rounds in §C. Validate correct people and edge types separately. The time qualifier must travel with every distractor and every answer explanation.
3. **READY FOR EXPLORE:** Introduce the eight short investigation entries in §E before Build completion. Expand the contextual K09 and K13–K18 links only when the relevant scene is visible.
4. **READY FOR CHARACTER FOCUS:** Use §F as openings and §G as optional depth. Review fit at small widths and in screen-reader order during the implementation task.
5. **READY FOR SOURCE NOTE:** Attach work-specific notes from §I; keep VR1 and RCM separate, especially Aṅgada's installation and the RCM's devotional scenes.
6. **READY FOR BUILD / READY FOR EXPLORE:** Place each `learningInterpretation` line after its fact and context, never as evidence or as a sermon. Review all feedback for tone and clarity with newcomers.
7. **NEEDS PAGE CHECK:** Any wording that goes beyond the exact claims in §A, any new character or later-chapter scene, and any new tradition comparison requires another approved original-page inspection.
8. **NEEDS QUOTE PROOF:** All exact quotations. **DEFER:** the optional nodes, the Tārā/Tāra trap, and any direct Hanumān–Vāli Build bond.

**Editorial acceptance before code merge:** a second reader should recheck the page locators and diacritics in §I, confirm source-note display keeps the two works distinct, and verify no wrong-answer feedback contradicts a true later connection. Relationship claims and player-ready copy are prepared; UI, interaction, accessibility, and real-device acceptance are outside this research-only task.
