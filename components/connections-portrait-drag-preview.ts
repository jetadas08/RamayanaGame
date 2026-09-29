import type {CharacterPortraitData} from "@/lib/types";

const size=64;

function percentage(value:string|undefined,index:number,defaultValue:number){
 const parts=value?.match(/([\d.]+)%/g);
 const number=Number.parseFloat(parts?.[index]??"");
 return Number.isFinite(number)?Math.min(1,Math.max(0,number/100)):defaultValue;
}

function portraitCrop(image:HTMLImageElement,portrait:CharacterPortraitData){
 const focal=portrait.thumbnailPosition??portrait.position;
 const x=percentage(focal,0,.5);
 const y=percentage(focal,1,.25);
 if(portrait.sprite){
  const {column,row,columns,rows}=portrait.sprite;
  const cellWidth=image.naturalWidth/columns;
  const cellHeight=image.naturalHeight/rows;
  const side=Math.min(cellWidth,cellHeight);
  return {sx:column*cellWidth+(cellWidth-side)*x,sy:row*cellHeight+Math.min(cellHeight-side,Math.max(0,y*cellHeight-side/2)),side};
 }
 const side=Math.min(image.naturalWidth,image.naturalHeight);
 return {sx:(image.naturalWidth-side)*x,sy:(image.naturalHeight-side)*y,side};
}

/** A native drag image must be a cropped bitmap, never the sprite <img> itself. */
export function setConnectionsPortraitDragImage(dataTransfer:DataTransfer,source:HTMLElement,portrait:CharacterPortraitData,name:string){
 const canvas=document.createElement("canvas");
 canvas.width=size;
 canvas.height=size;
 canvas.setAttribute("aria-hidden","true");
 Object.assign(canvas.style,{position:"fixed",left:"-1000px",top:"0",width:`${size}px`,height:`${size}px`,pointerEvents:"none"});
 const context=canvas.getContext("2d");
 if(context){
  context.fillStyle="#102c2d";
  context.beginPath();
  context.arc(size/2,size/2,size/2-2,0,Math.PI*2);
  context.fill();
  context.save();
  context.beginPath();
  context.arc(size/2,size/2,size/2-5,0,Math.PI*2);
  context.clip();
  const image=source.querySelector("img");
  if(image?.complete&&image.naturalWidth>0){
   const crop=portraitCrop(image,portrait);
   context.drawImage(image,crop.sx,crop.sy,crop.side,crop.side,5,5,size-10,size-10);
  }else{
   context.fillStyle="#f1d395";
   context.font="600 28px Georgia, serif";
   context.textAlign="center";
   context.textBaseline="middle";
   context.fillText(name.charAt(0),size/2,size/2);
  }
  context.restore();
  context.strokeStyle="#e5b75f";
  context.lineWidth=3;
  context.beginPath();
  context.arc(size/2,size/2,size/2-2,0,Math.PI*2);
  context.stroke();
 }
 document.body.append(canvas);
 dataTransfer.setDragImage(canvas,size/2,size/2);
 return ()=>canvas.remove();
}
