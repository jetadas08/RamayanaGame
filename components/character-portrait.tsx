import Image from "next/image";
import type {CharacterPortraitData} from "@/lib/types";

type PortraitUsage = "card"|"detail"|"medallion"|"reward";
const DEFAULT_PORTRAIT_POSITION="50% 25%";

const portraitSizes:Record<PortraitUsage,string>={
 card:"(max-width: 768px) 90vw, 320px",
 detail:"(max-width: 768px) 90vw, 448px",
 medallion:"128px",
 reward:"96px",
};

function positionPercent(value:string){
 const match=value.match(/^\s*[\d.]+%\s+([\d.]+)%\s*$/);
 return match?Math.min(100,Math.max(0,Number(match[1]))):25;
}

export function CharacterPortrait({name,portrait,large=false,usage}:{name:string;portrait:CharacterPortraitData;large?:boolean;usage?:PortraitUsage}){
 const resolvedUsage=usage??(large?"detail":"card");
 const isThumbnail=resolvedUsage==="medallion"||resolvedUsage==="reward";
 const focalPosition=(isThumbnail&&portrait.thumbnailPosition)||portrait.position||DEFAULT_PORTRAIT_POSITION;
 if(!portrait.sprite){
  return <Image src={portrait.src} alt={isThumbnail?"":`Illustrated portrait of ${name}`} fill sizes={portraitSizes[resolvedUsage]} quality={95} className="object-cover" style={{objectPosition:focalPosition}}/>;
 }

 // The legacy Laṅkā artwork contains six columns and three portrait rows.
 // Position the full native sprite by cell and then center the requested focal
 // point inside the current card/detail/circular viewport.
 const {column,row,columns,rows}=portrait.sprite;
 const visibleHeightInCellWidths=resolvedUsage==="detail"?1.25:resolvedUsage==="card"?0.75:1;
 const cellHeightInCellWidths=columns/rows;
 const focalY=positionPercent(focalPosition)/100;
 const cropWithinCell=Math.min(
  cellHeightInCellWidths-visibleHeightInCellWidths,
  Math.max(0,focalY*cellHeightInCellWidths-visibleHeightInCellWidths/2),
 );
 const topOffset=(row*cellHeightInCellWidths+cropWithinCell)/visibleHeightInCellWidths*100;
 return <Image
  src={portrait.src}
  alt={isThumbnail?"":`Illustrated portrait of ${name}`}
  width={1254}
  height={1254}
  quality={95}
  unoptimized
  className="max-w-none"
  style={{position:"absolute",width:`${columns*100}%`,height:"auto",left:`-${column*100}%`,top:`-${topOffset}%`}}
 />;
}
