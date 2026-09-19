"use client";
import {useRouter} from "next/navigation";
import {WarMap} from "@/components/war-map";
export default function WarChapterPage(){const router=useRouter();return <WarMap onBack={()=>router.push("/journey/hanuman")}/>;}
