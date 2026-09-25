"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {BookOpen,Check,Clock3,GitBranch,LogOut,Map,Menu,Route,UsersRound,X} from "lucide-react";
import {AuthDialog} from "@/components/auth-dialog";
import {useProgress} from "@/components/progress-provider";
import {Button} from "@/components/ui/button";

const links=[
 {label:"Map",meaning:"Where",href:"/journey/hanuman",icon:Map},
 {label:"Journey",meaning:"Story order",href:"/journey",icon:Route},
 {label:"Characters",meaning:"Who",href:"/characters",icon:UsersRound},
 {label:"Connections",meaning:"Relationships",href:"/connections",icon:GitBranch},
 {label:"Progress",meaning:"Your record",href:"/progress",icon:Clock3},
];

function isCurrent(pathname:string,href:string){
 if(href==="/journey/hanuman")return pathname==="/"||pathname==="/map"||pathname==="/journey/hanuman";
 if(href==="/journey")return pathname==="/journey"||pathname.startsWith("/journey/hanuman/");
 return pathname===href||pathname.startsWith(`${href}/`);
}

export function SiteHeader(){
 const pathname=usePathname(),[authOpen,setAuthOpen]=useState(false),[menuOpen,setMenuOpen]=useState(false);
 const {user,saving,logout}=useProgress();
 return <>
  <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-[var(--gold)]/15 bg-[#160e0c]/92 backdrop-blur-xl">
   <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
    <Link href="/" className="site-brand flex items-center gap-3" aria-label="Rāmāyaṇa home"><span className="grid size-10 place-items-center rounded-full border border-[var(--gold)]/35 bg-[var(--gold)]/8 text-[var(--gold)]"><BookOpen size={18}/></span><span><strong className="font-display block text-lg font-medium tracking-wide text-[var(--cream)]">Rāmāyaṇa</strong><small className="block text-[9px] uppercase tracking-[.28em] text-[var(--gold)]">The living journey</small></span></Link>
    <nav aria-label="Primary navigation" className={`${menuOpen?"flex":"hidden"} site-primary-nav absolute left-4 right-4 top-20 flex-col gap-1 rounded-2xl border border-white/10 bg-[#211511] p-3 shadow-2xl md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
     {links.map(({label,meaning,href,icon:Icon})=>{const current=isCurrent(pathname,href);return <Link key={href} href={href} aria-current={current?"page":undefined} title={`${label} · ${meaning}`} onClick={()=>setMenuOpen(false)} className="site-nav-link"><Icon aria-hidden="true"/><span><strong>{label}</strong><small>{meaning}</small></span></Link>;})}
    </nav>
    <div className="flex items-center gap-2">
     {user?<div className="site-save-state"><span aria-live="polite"><Check/>{saving?"Saving…":"Saved"}<small>{user.name}</small></span><Button variant="icon" onClick={logout} title="Sign out" aria-label="Sign out"><LogOut size={16}/></Button></div>:<Button className="site-local-save" variant="ghost" size="sm" title="Progress saves automatically on this browser. Sign in to sync it across devices." aria-label="Progress saved locally. Sign in to sync across devices." onClick={()=>setAuthOpen(true)}><Check/><span><strong>Saved locally</strong><small>Sign in to sync</small></span></Button>}
     <Button variant="icon" className="md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(value=>!value)}>{menuOpen?<X size={18}/>:<Menu size={18}/>}</Button>
    </div>
   </div>
  </header>
  <AuthDialog open={authOpen} onClose={()=>setAuthOpen(false)}/>
 </>;
}
