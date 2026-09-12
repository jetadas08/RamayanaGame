import { Badge } from "@/components/ui/badge";
import { confidenceCopy } from "@/data/journey";
import type { ConfidenceLevel } from "@/lib/types";

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  return <Badge className={`confidence confidence-${level}`}><span>{level}</span>{confidenceCopy[level]}</Badge>;
}
