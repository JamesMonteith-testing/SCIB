"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CaseNavLinks from "@/components/CaseNavLinks";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <Tag>SCIB-CC-1991-022</Tag>
      </div>
      <div className="text-slate-200 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

const PDF_SRC = "/evidence/SCIB-CC-1991-022/E-03/E-03_Evidence_Sheet.pdf";
const PHOTO_SRC = "/evidence/SCIB-CC-1991-022/E-03/E-03_Photo_EvidenceBag.png";

const UNLOCK_STORE_KEY = "scib_case01_unlocked_evidence_v1";

function isUnlocked(id: string) {
  try {
    const raw = localStorage.getItem(UNLOCK_STORE_KEY);
    const base = new Set(["E-01", "E-02"]);
    if (!raw) return base.has(id);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) parsed.forEach((x) => typeof x === "string" && base.add(x.toUpperCase()));
    return base.has(id);
  } catch {
    return id === "E-01" || id === "E-02";
  }
}

export default function Page() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(isUnlocked("E-03"));
    function onStorage(e: StorageEvent) {
      if (e.key === UNLOCK_STORE_KEY) setOk(isUnlocked("E-03"));
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Evidence Viewer</div>
              <h1 className="text-xl font-semibold">Evidence Item E-03</h1>
              <p className="text-sm text-slate-300">Dot-matrix Access Log (partial) • Intake Property</p>
            </div>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/case-file/evidence-list"
            contextLabel="Back to Evidence List"
          />
        </header>

        {!ok ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-2">
              <div className="text-xs text-slate-400">ACCESS STATUS</div>
              <div className="text-lg font-semibold">LOCKED</div>
              <div className="text-sm text-slate-200">
                Clue: locate the access log header stamp and the faint footer reference. Submit as{" "}
                <span className="font-mono">WHX/OPS 1991-022-03</span>.
              </div>
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/investigation-room"
                  className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
                >
                  Go to Investigation Room (submit solution)
                </Link>
                <Link
                  href="/cases/silent-switchboard/case-file/evidence-list"
                  className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
                >
                  Evidence List (unlock shortcut)
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-2">
              <div className="text-xs text-slate-400">REGISTER ENTRY</div>
              <div className="text-sm text-slate-200">
                Ref: <span className="font-mono">E-03</span> • Collected: <span className="font-mono">03/05/91 04:35</span>
              </div>
              <div className="text-sm text-slate-200">
                Item: Dot-matrix access log (partial). Header stamp <span className="font-mono">WHX/OPS</span>. Footer reference{" "}
                <span className="font-mono">1991-022-03</span>.
              </div>
            </div>

            <Panel title="Evidence Sheet (PDF)">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-slate-400">If the embedded viewer fails, open the file directly.</div>
                <Link href={PDF_SRC} className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-xs font-medium">
                  Open PDF
                </Link>
              </div>
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-black">
                <iframe src={PDF_SRC} className="w-full h-[520px]" />
              </div>
            </Panel>

            <Panel title="Photo (evidence bag)">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
                <Image src={PHOTO_SRC} alt="Evidence bag photo" width={1200} height={900} className="w-full h-auto" />
              </div>
            </Panel>
          </section>
        )}
      </div>
    </main>
  );
}
