"use client";

import {useRouter} from "next/navigation";
import {MeetingMap} from "@/components/meeting-map";

export default function MeetingChapterPage(){
 const router=useRouter();
 return <MeetingMap onBack={()=>router.push("/journey/hanuman")}/>;
}
