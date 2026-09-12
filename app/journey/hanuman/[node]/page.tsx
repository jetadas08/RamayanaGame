import { notFound } from "next/navigation";
import { Encounter } from "@/components/encounter";
import { journeyNodeBySlug, journeyNodes } from "@/data/journey";

export function generateStaticParams() { return journeyNodes.map((node) => ({ node: node.slug })); }

export default async function EncounterPage({ params }: { params: Promise<{ node: string }> }) {
  const { node: slug } = await params;
  const node = journeyNodeBySlug(slug);
  if (!node) notFound();
  const next = journeyNodes[node.number];
  return <Encounter key={node.id} node={node} nextSlug={next?.slug} />;
}
