export type JourneyOrigin="journey"|"chapter"|"character"|"progress"|"object"|"connections";

export function encounterHref(slug:string,origin:JourneyOrigin,context?:string){
 const params=new URLSearchParams({from:origin});
 if(context){
  if(origin==="chapter")params.set("chapter",context);
  if(origin==="character")params.set("character",context);
  if(origin==="object")params.set("object",context);
 }
 return `/journey/hanuman/${slug}?${params.toString()}`;
}

export function chapterMapHref(chapterId:string){return `/journey/hanuman?chapter=${encodeURIComponent(chapterId)}`;}

export function encounterReturn(search:string){
 const params=new URLSearchParams(search),origin=params.get("from"),context=params.get("chapter")??"";
 if(origin==="journey")return{href:"/journey",label:"Journey"};
 if(origin==="chapter"&&context)return{href:chapterMapHref(context),label:"Chapter map"};
 if(origin==="character")return{href:`/characters/${params.get("character")??"hanuman"}#memory-trail`,label:"Character memory"};
 if(origin==="progress")return{href:"/progress",label:"Progress"};
 if(origin==="object")return{href:"/progress#sacred-objects",label:"Sacred Object history"};
 if(origin==="connections")return{href:"/connections",label:"Connections"};
 return{href:"/journey",label:"Journey"};
}
