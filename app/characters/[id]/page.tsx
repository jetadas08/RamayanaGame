import {notFound} from "next/navigation";
import {characters} from "@/data/discoveries";
import {CharacterDetail} from "@/components/character-detail";
export function generateStaticParams(){return characters.map(c=>({id:c.id}));}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;if(!characters.some(c=>c.id===id))notFound();return <CharacterDetail id={id}/>;}
