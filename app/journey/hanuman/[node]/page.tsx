import {finaleNodes} from "@/data/finale";
import {herbsNodes} from "@/data/herbs";
import {warNodes} from "@/data/war";
import { notFound } from "next/navigation";
import { Encounter } from "@/components/encounter";
import { journeyNodes, meetingNodes } from "@/data/journey";
import {searchNodes} from "@/data/search";

export function generateStaticParams() { return [...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].map((node) => ({ node: node.slug })); }

export default async function EncounterPage({ params }: { params: Promise<{ node: string }> }) {
  const { node: slug } = await params;
  const node = [...meetingNodes,...searchNodes,...journeyNodes,...warNodes,...herbsNodes,...finaleNodes].find(node=>node.slug===slug);
  if (!node) notFound();
  const next = node.id.startsWith("HFF-")?finaleNodes[node.number]:node.id.startsWith("HFH-")?(herbsNodes[node.number]??finaleNodes[0]):node.id.startsWith("HFW-")?(warNodes[node.number]??herbsNodes[0]):node.id.startsWith("HFM-")?(meetingNodes[node.number]??searchNodes[0]):node.id.startsWith("HFS-")?(searchNodes[node.number]??journeyNodes[0]):(journeyNodes[node.number]??warNodes[0]);
  return <Encounter key={node.id} node={node} nextSlug={next?.slug} />;
}
