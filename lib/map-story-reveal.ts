import type {JourneyProgressState} from "@/lib/types";

/** Story labels are revealed by their encounter, not by the chapter-map being opened. */
export function chapterMapStoryReveal(progress:Pick<JourneyProgressState,"completedNodes"|"warCompletedNodes">){
 return {
  returnToRama:progress.completedNodes.includes("HJ-15"),
  ramaSetu:progress.warCompletedNodes.includes("HFW-03"),
 };
}
