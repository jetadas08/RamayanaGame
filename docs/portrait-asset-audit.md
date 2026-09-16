# Character portrait asset audit

Audited 10 September 2026. Collection portraits render responsively at up to approximately 320 × 240 CSS pixels on desktop and 90vw on small screens. Character details render at up to 448 × 336 pixels. Connections medallions render at 56–94 pixels and encounter/reward portraits at 58–74 pixels.

`lanka-sprite.png` is 1254 × 1254 overall, but it contains six portrait columns. A card crop therefore has only about 209 × 157 source pixels available. Every character still using that sprite needs dedicated high-resolution artwork even though the full sprite dimensions exceed 1024 pixels.

| Character | Image path | Native dimensions | Current rendered size | Status |
|---|---|---:|---|---|
| Hanumān | `/images/characters/hanuman.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Rāma | `/images/characters/rama.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Aṅgada | `/images/characters/angada.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Jāmbavān | `/images/characters/jambavan.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Vanara search party | `/images/characters/vanara-search-party.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Sampāti | `/images/characters/sampati.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Maināka | `/images/characters/mainaka.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Surasā | `/images/characters/surasa.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Siṃhikā | `/images/characters/simhika.png` | 1254 × 1254 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Sītā | `/images/characters/sita-v2.png` | 1448 × 1086 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Trijaṭā | `/images/characters/trijata-v2.png` | 1448 × 1086 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Indrajit | `/images/characters/indrajit-v2.png` | 1448 × 1086 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Rāvaṇa | `/images/characters/ravana-v3.png` | 1448 × 1086 | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | GOOD |
| Laṅkinī | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Vibhīṣaṇa | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Rākṣasī guards | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Kiṅkaras | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Jambumālī | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Seven Sons of the Ministers | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Virūpākṣa | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Yūpākṣa | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Durdhara | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Praghasa | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Bhāsakarṇa | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Akṣa Kumāra | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |
| Lakṣmaṇa | `/images/characters/lakshmana-v2.png` | 1122 × 1402 | Collection ≤320 × 400; detail ≤620 × 775; small uses ≤94 × 94 | GOOD |
| Sugrīva | `/images/characters/lanka-sprite.png` | 1254 × 1254 sheet; ≈209 × 157 card crop | Collection ≤320 × 240; detail ≤448 × 336; small uses ≤94 × 94 | REPLACE RECOMMENDED |

No current asset falls in the 800–1023 pixel `ACCEPTABLE` band. Dedicated portraits are `GOOD`; sprite crops are `REPLACE RECOMMENDED`.
