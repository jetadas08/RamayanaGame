import Link from "next/link";

export function MobileEncounterShortcut({id,title,href}:{id:string;title:string;href?:string}){
 return <div className="mobile-encounter-shortcut"><span><small>Current encounter · {id}</small><strong>{title}</strong></span>{href?<Link href={href}>Enter encounter <span aria-hidden="true">→</span></Link>:<small>Continue the previous encounter to unlock this chapter.</small>}</div>;
}
