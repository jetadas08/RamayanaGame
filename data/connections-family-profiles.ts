import type {NetworkClaimType} from "@/data/connections-v1-1";

export interface FamilyProfileSource {
  work:"Vālmīki Rāmāyaṇa"|"Rāmacaritamānasa";
  edition:"Gita Press";
  locator:string;
  printedPage:string;
  verification:"Approved edition page image checked. Paraphrase only";
}

export interface FamilyProfileSection {
  title:string;
  body:string;
  claimType:Extract<NetworkClaimType,"textualFact"|"learningInterpretation">;
  sources:FamilyProfileSource[];
  storyContext?:string;
  meaning?:string;
  sourceLimit?:string;
}

export interface FamilyProfile {
  facts:string[];
  sections:FamilyProfileSection[];
}

const valmiki=(locator:string,printedPage:string):FamilyProfileSource=>({
  work:"Vālmīki Rāmāyaṇa",edition:"Gita Press",locator,printedPage,
  verification:"Approved edition page image checked. Paraphrase only",
});
const manasa=(locator:string,printedPage:string):FamilyProfileSource=>({
  work:"Rāmacaritamānasa",edition:"Gita Press",locator,printedPage,
  verification:"Approved edition page image checked. Paraphrase only",
});

export const familyProfiles:Record<"anjana"|"kesari"|"vayu",FamilyProfile>={
  anjana:{
    facts:[
      "Hanumān’s mother.",
      "Keśarī’s wife; Vāyu also has a divine role in Hanumān’s birth.",
    ],
    sections:[
      {title:"Identity and family",body:"Añjanā is Hanumān’s mother and Keśarī’s wife. Her father is Kuñjara, a leader among the vānar people.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.8–10, 20","922–923")]},
      {title:"Earlier identity and transformation",body:"In Jāmbavān’s telling, Añjanā was once the apsaras Puñjikasthalā. A curse changed her form.",sourceLimit:"These verses do not name who gave the curse, why it was given, or how it ended.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.8–9","922")]},
      {title:"Hanumān’s birth",body:"Añjanā is Hanumān’s mother, and Keśarī is her husband. Vāyu has a divine role in Hanumān’s birth. Later in the Uttara Kāṇḍa, Añjanā is remembered again as Keśarī’s wife and Hanumān’s mother.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.8, 10–20, 29–30","922–924"),valmiki("Uttara Kāṇḍa 7.35.19–21","970")]},
      {title:"Meaning in the journey",body:"Before the ocean crossing, Jāmbavān recalls Hanumān’s beginnings.",storyContext:"The search party needs someone who can cross the sea.",meaning:"The journey holds Hanumān’s family origins beside the courage he will soon bring to Rāma’s work.",claimType:"learningInterpretation",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.8–30","922–924")]},
    ],
  },
  kesari:{
    facts:[
      "Añjanā’s husband and a leader among the vānar people.",
      "Hanumān’s father in the family lineage; Vāyu has a separate divine role in his birth.",
    ],
    sections:[
      {title:"Family relationship",body:"Keśarī is Añjanā’s husband and Hanumān’s father in the family lineage. Vāyu’s role in Hanumān’s birth is divine and separate.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.8, 29–30","922, 924")]},
      {title:"Place in the story",body:"Keśarī joins the vānar leaders gathered for Sugrīva’s campaign.",sourceLimit:"The cited verse does not give Keśarī a speaking role.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.39.18","864")]},
      {title:"Hanumān remembers Keśarī",body:"When Hanumān speaks to Sītā, he remembers how Keśarī helped sages by defeating the demon Sambasādana near Gokarṇa mountain.",sourceLimit:"Gokarṇa is a textual place name here; this passage does not establish a modern location.",claimType:"textualFact",sources:[valmiki("Sundara Kāṇḍa 5.35.80–83","164–165")]},
      {title:"Meaning in the journey",body:"Hanumān tells Sītā about Keśarī as he introduces himself.",storyContext:"Sītā is meeting Rāma’s messenger for the first time.",meaning:"By naming his father, Hanumān gives Sītā another way to recognize the messenger before her.",claimType:"learningInterpretation",sources:[valmiki("Sundara Kāṇḍa 5.35.80–83","164–165")]},
    ],
  },
  vayu:{
    facts:[
      "Vāyu is the wind deity.",
      "He has a divine role in Hanumān’s birth; Keśarī is Hanumān’s father in the family lineage.",
    ],
    sections:[
      {title:"Divine relationship",body:"Vāyu, the wind deity, has a divine role in Hanumān’s birth and is linked with his extraordinary speed. Keśarī is Hanumān’s father in the family lineage.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.10–20, 29–30","922–924"),valmiki("Sundara Kāṇḍa 5.35.83, 90","164–165")]},
      {title:"A childhood connection",body:"When the young Hanumān is struck, Vāyu withdraws the wind. The gods grant the child boons. In the Uttara Kāṇḍa telling, Vāyu brings Hanumān home to Añjanā.",claimType:"textualFact",sources:[valmiki("Kiṣkindhā Kāṇḍa 4.66.21–28","923–924"),valmiki("Uttara Kāṇḍa 7.36.27","976")]},
      {title:"In the Rāmacaritamānasa",body:"In the Rāmacaritamānasa, Hanumān is called a son of the wind. At the shore, Jāmbavān reminds him of his strength and calls him toward Rāma’s work.",sourceLimit:"These passages do not provide the detailed birth account found in the cited Vālmīki verses.",claimType:"textualFact",sources:[manasa("Bāla Kāṇḍa, opening Soraṭhā 17","44"),manasa("Kiṣkindhā Kāṇḍa, Jāmbavān’s exhortation, chaupāī group 1–6","761")]},
      {title:"Meaning in the journey",body:"Jāmbavān reminds Hanumān of his strength at the shore.",storyContext:"The search for Sītā cannot continue until someone crosses the ocean.",meaning:"His remembered strength finds its purpose in serving Rāma.",claimType:"learningInterpretation",sources:[manasa("Kiṣkindhā Kāṇḍa, Jāmbavān’s exhortation, chaupāī group 1–6","761")]},
    ],
  },
};
