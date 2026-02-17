import Image from "next/image";
import Link from "next/link";
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

const PDF_SRC = "/evidence/SCIB-CC-1991-022/E-01/E-01_Evidence_Sheet.pdf";
const PHOTO_SRC = "/evidence/SCIB-CC-1991-022/E-01/E-01_Photo_EvidenceBag.png";
const PERSONAL_PHOTO_SRC = "/evidence/SCIB-CC-1991-022/E-01/hettie-birthday-party.png";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={48} height={48} priority />
            <div>
              <div className="text-xs text-slate-400">SCIB Evidence Viewer</div>
              <h1 className="text-xl font-semibold">Evidence Item E-01</h1>
              <p className="text-sm text-slate-300">Lanyard + Access Card • Intake Property</p>
            </div>
          </div>

          <CaseNavLinks
            caseHref="/cases/silent-switchboard"
            contextHref="/cases/silent-switchboard/case-file/evidence-list"
            contextLabel="Back to Evidence List"
          />
        </header>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-2">
            <div className="text-xs text-slate-400">REGISTER ENTRY</div>
            <div className="text-sm text-slate-200">
              Ref: <span className="font-mono">E-01</span> • Collected: <span className="font-mono">03/05/91 04:22</span>
            </div>
            <div className="text-sm text-slate-200">
              Item: Lanyard + access card. Card label: <span className="font-mono">MKELLS</span>. Lanyard clip fractured (fresh).
            </div>
          </div>

          <Panel title="Evidence Sheet (PDF)">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">If the embedded viewer fails, open the file directly.</div>
              <a
                href={PDF_SRC}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-300 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300"
              >
                Open PDF
              </a>
            </div>

            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <object data={PDF_SRC} type="application/pdf" className="w-full h-[70vh]">
                <div className="p-4 text-sm text-slate-200">
                  PDF preview unavailable in this browser.{" "}
                  <a
                    href={PDF_SRC}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 decoration-slate-600 hover:decoration-slate-300"
                  >
                    Open PDF
                  </a>
                  .
                </div>
              </object>
            </div>
          </Panel>

          <Panel title="Evidence Photo">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <Image src={PHOTO_SRC} alt="E-01 Photo — Evidence Bag" width={1200} height={900} className="w-full h-auto" priority />
            </div>
            <div className="text-xs text-slate-500">Exhibit photo: bagged lanyard + access card recovered from Main Control Room.</div>
          </Panel>

          <Panel title="Personal Effects Attachment">
            <div className="rounded-xl border border-slate-800 bg-slate-950/30 overflow-hidden">
              <Image
                src={PERSONAL_PHOTO_SRC}
                alt="Recovered personal photograph (locker contents)"
                width={1400}
                height={900}
                className="w-full h-auto"
              />
            </div>

            <div className="pt-2 text-xs text-slate-500 space-y-1">
              <div>Photograph recovered from MKELLS’ locker.</div>
              <div>Subject: Hettie (Staffordshire Bull Terrier).</div>
              <div>Image depicts 1st birthday celebration.</div>
              <div>Dog aged 2 at time of recovery.</div>
            </div>
          </Panel>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <CaseNavLinks
              caseHref="/cases/silent-switchboard"
              contextHref="/cases/silent-switchboard/case-file/evidence-list"
              contextLabel="Back to Evidence List"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
