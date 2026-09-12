"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, LogOut, Menu, UserRound, X } from "lucide-react";
import { AuthDialog } from "@/components/auth-dialog";
import { useProgress } from "@/components/progress-provider";
import { Button } from "@/components/ui/button";

const links = [["Map", "/journey/hanuman"], ["Journey", "/journey"], ["Characters", "/characters"], ["Connections", "/connections"]];

export function SiteHeader() {
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, saving, logout } = useProgress();
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--gold)]/15 bg-[#160e0c]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full border border-[var(--gold)]/35 bg-[var(--gold)]/8 text-[var(--gold)]"><BookOpen size={18} /></span><span><strong className="font-display block text-lg font-medium tracking-wide text-[var(--cream)]">Rāmāyaṇa</strong><small className="block text-[9px] uppercase tracking-[.28em] text-[var(--gold)]">The living journey</small></span></Link>
          <nav className={`${menuOpen ? "flex" : "hidden"} absolute left-4 right-4 top-20 flex-col gap-1 rounded-2xl border border-white/10 bg-[#211511] p-3 shadow-2xl md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
            {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-white/7 hover:text-[var(--cream)]">{label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            {user ? <div className="flex items-center gap-2"><span className="text-xs text-[var(--muted)]">{saving ? "Saving…" : user.name}</span><Button variant="icon" onClick={logout} title="Sign out"><LogOut size={16} /></Button></div> : <Button variant="secondary" size="sm" aria-label="Save progress or sign in" onClick={() => setAuthOpen(true)}><UserRound size={15} /> <span className="hidden sm:inline">Save progress</span></Button>}
            <Button variant="icon" className="md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</Button>
          </div>
        </div>
      </header>
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
