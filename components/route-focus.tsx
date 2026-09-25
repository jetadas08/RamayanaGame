"use client";

import {usePathname} from "next/navigation";
import {useEffect,useRef} from "react";

export function RouteFocus(){
 const pathname=usePathname();
 const previous=useRef<string|null>(null);
 useEffect(()=>{
 const old=previous.current;
 previous.current=pathname;
  if(old===pathname)return;
  const update=()=>{
   const heading=document.querySelector<HTMLElement>("main:not([aria-busy='true']) h1,[role='main']:not([aria-busy='true']) h1");
   if(!heading)return false;
   document.title=`${heading.textContent?.trim()||"The living journey"} | Rāmāyaṇa`;
   if(old===null)return true;
   if(!heading.hasAttribute("tabindex"))heading.tabIndex=-1;
   heading.focus({preventScroll:true});
   heading.scrollIntoView({block:"start",behavior:"instant"});
   return true;
  };
  if(update())return;
  const observer=new MutationObserver(()=>{if(update())observer.disconnect();});
  observer.observe(document.body,{childList:true,subtree:true});
  const timeout=window.setTimeout(()=>observer.disconnect(),5000);
  return()=>{observer.disconnect();window.clearTimeout(timeout);};
 },[pathname]);
 return null;
}
