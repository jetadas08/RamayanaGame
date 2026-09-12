"use client";

import { useState, useEffect, useRef } from "react";
import { LogIn, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGuestProgress, useProgress } from "@/components/progress-provider";

export function AuthDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { refreshAccount } = useProgress();
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=dialogRef.current;if(open)dialog?.showModal();else dialog?.close();},[open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "register" ? { ...payload, guestProgress: getGuestProgress() } : payload),
    });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Something went wrong."); setBusy(false); return; }
    await refreshAccount(); onClose();
    } catch { setError("Connection unavailable. Please try again."); } finally { setBusy(false); }
  }

  return (
    <dialog ref={dialogRef} onCancel={onClose} aria-labelledby="account-title" className="m-auto w-full max-w-md bg-transparent p-0 backdrop:bg-black/80">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-[#e5b669]/25 bg-[#241810] p-7 shadow-2xl">
        <button onClick={onClose} className="absolute right-5 top-5 cursor-pointer text-[var(--muted)] hover:text-white" aria-label="Close"><X size={20} /></button>
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[var(--saffron)]/15 text-[var(--gold)]"><Sparkles /></div>
        <p className="eyebrow">Carry your journey with you</p>
        <h2 id="account-title" className="font-display mt-2 text-3xl text-[var(--cream)]">{mode === "register" ? "Create your traveller profile" : "Welcome back"}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{mode === "register" ? "Your guest discoveries will be moved into your account automatically." : "Continue your journey on this or any other device."}</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "register" && <input aria-label="Your name" autoComplete="name" name="name" required minLength={2} placeholder="Your name" className="field" />}
          <input aria-label="Email address" autoComplete="email" name="email" required type="email" placeholder="Email address" className="field" />
          <input aria-label="Password" autoComplete={mode==="register"?"new-password":"current-password"} name="password" required type="password" minLength={8} placeholder="Password (8+ characters)" className="field" />
          {error && <p className="text-sm text-[#f1a07f]">{error}</p>}
          <Button className="mt-2 w-full" disabled={busy} type="submit"><LogIn size={16} />{busy ? "Please wait…" : mode === "register" ? "Save my journey" : "Continue journey"}</Button>
        </form>
        <button className="mt-5 w-full cursor-pointer text-center text-sm text-[var(--muted)] hover:text-[var(--cream)]" onClick={() => { setError(""); setMode(mode === "register" ? "login" : "register"); }}>
          {mode === "register" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </dialog>
  );
}
