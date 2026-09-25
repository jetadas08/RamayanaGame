import {bhaktiPassOne} from "@/data/bhakti-pass-one";

export interface NodeCompletionDefinition {
 completionTakeaway:string;
 nextNodeTeaser?:string;
}

export const hanumanNodeCompletion:Record<string,NodeCompletionDefinition>={
 "HJ-01":{completionTakeaway:"At the sea’s edge, despair becomes a decision: the search can continue when shared purpose is stronger than fear.",nextNodeTeaser:"An aged witness brings the knowledge that restores direction to the search."},
 "HJ-02":{completionTakeaway:"Sampāti’s far-reaching sight turns loss into service and gives the search party the direction it needs.",nextNodeTeaser:"Jāmbavān helps Hanumān remember the strength that has always been his."},
 "HJ-03":{completionTakeaway:bhaktiPassOne.strengthRemembered.text,nextNodeTeaser:"Remembered strength becomes action as Hanumān commits himself to the ocean crossing."},
 "HJ-04":{completionTakeaway:bhaktiPassOne.purposefulLeap.text,nextNodeTeaser:"A golden mountain rises from the sea with an offer of rest and hospitality."},
 "HJ-05":{completionTakeaway:"Hanumān honors Maināka’s kindness without surrendering the urgency of Rāma’s work.",nextNodeTeaser:"A divine test asks Hanumān to answer expanding force with intelligence and agility."},
 "HJ-06":{completionTakeaway:"By becoming small after growing vast, Hanumān shows that true strength includes flexibility and discernment.",nextNodeTeaser:"The next obstacle is a genuine threat that seizes Hanumān through his shadow."},
 "HJ-07":{completionTakeaway:"Hanumān distinguishes a sacred test from a consuming threat and acts with the firmness the moment requires.",nextNodeTeaser:"At Laṅkā’s threshold, its guardian confronts the unseen messenger."},
 "HJ-08":{completionTakeaway:"Strength joins discernment. Hanumān enters in reduced form and uses only the force required; open crossing becomes concealed search.",nextNodeTeaser:"Chapter IV — Sītā in Laṅkā: the journey is no longer about crossing space, but finding Sītā without being discovered."},
 "HJ-09":{completionTakeaway:"Hanumān neither trusts blindly nor rejects by appearance: he verifies that Vibhīṣaṇa’s signs form a reliable pattern.",nextNodeTeaser:"In the guarded grove, hope depends on identifying Sītā without rushing the reveal."},
 "HJ-10":{completionTakeaway:bhaktiPassOne.sitaFound.text,nextNodeTeaser:"Rāma’s ring must now turn carried trust into proof an unknown messenger can make recognizable."},
 "HJ-11":{completionTakeaway:"The search becomes hope: relationship, message, and Rāma’s Ring agree, allowing Sītā to recognize and trust the messenger.",nextNodeTeaser:"Chapter V shifts from hidden observation to public action as Hanumān’s mission becomes impossible for Laṅkā to ignore."},
 "HJ-12":{completionTakeaway:"Through every escalation, Hanumān’s power remains governed by mission and carries him toward Rāvaṇa’s court.",nextNodeTeaser:"Bound before the king, Hanumān must speak Rāma’s warning without fear."},
 "HJ-13":{completionTakeaway:"Hanumān stands before power as a messenger, offering Rāvaṇa a final path away from destruction.",nextNodeTeaser:"The punishment meant to shame Hanumān becomes a warning carried across Laṅkā."},
 "HJ-14":{completionTakeaway:"Hanumān transforms cruelty into consequence, yet keeps the fire in service of the larger mission.",nextNodeTeaser:"With Sītā’s message and token, Hanumān must cross the ocean once more and return to Rāma."},
 "HJ-15":{completionTakeaway:"Hanumān completes the search by carrying Sītā’s truth faithfully home; the knowledge needed for rescue is now in Rāma’s hands."},
};
