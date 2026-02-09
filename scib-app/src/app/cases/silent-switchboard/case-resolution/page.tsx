import Image from "next/image";
import Link from "next/link";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/40 px-3 py-1 text-xs text-slate-200">
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6 space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="text-sm text-slate-200 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/scib-badge.png"
              alt="SCIB Badge"
              width={48}
              height={48}
              priority
            />
            <div>
              <div className="text-xs text-slate-400">SCIB CASE FILE</div>
              <h1 className="text-xl font-semibold">Case Resolution</h1>
              <p className="text-sm text-slate-300">
                SCIB-CC-1991-022 • The Silent Switchboard
              </p>
            </div>
          </div>

          <Link
            href="/cases/silent-switchboard"
            className="text-sm text-slate-300 hover:text-white"
          >
            Back to Case
          </Link>
        </header>

        {/* Status panel */}
        <section className="rounded-2xl border border-emerald-700/40 bg-emerald-950/10 p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Tag>Case 01</Tag>
            <Tag>STATUS: SOLVED</Tag>
            <Tag>Resolution Logged</Tag>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">RESOLUTION SUMMARY</div>
            <div className="text-sm text-slate-200 leading-relaxed">
              Conclusion: The death of Martin Kells was not an accident.
              <br />
              It was a deliberate act, carried out by a coworker with motive, access,
              and opportunity, and later obscured by procedural complacency.
            </div>
          </div>
        </section>

        <Section title="Identified Culprit">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
            <div className="text-xs text-slate-400">SUBJECT</div>
            <div className="text-lg font-semibold">Roach, Gavin</div>
            <div className="text-sm text-slate-300">
              Telecom Technician • Night Shift • Witness Statement 01
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <Tag>Status: Responsible</Tag>
              <Tag>Access: Confirmed</Tag>
              <Tag>Motive: Supported</Tag>
            </div>
          </div>
        </Section>

        <Section title="Motive">
          <p>
            Roach had been engaged in unauthorised access and minor falsification of
            maintenance records. Martin Kells began documenting irregularities and
            raised concerns internally.
          </p>
          <p>
            These concerns directly threatened Roach’s employment and potential
            criminal exposure.
          </p>
          <p>
            There is no evidence of long-term planning. The act appears reactive,
            not premeditated.
          </p>
        </Section>

        <Section title="Method">
          <p>
            Roach administered a sedative to Kells during the night shift via a
            shared beverage.
          </p>
          <p>
            A second dose was later administered, exceeding safe levels. Kells
            collapsed alone in the exchange during an active maintenance window.
          </p>
          <p>
            The method required no physical struggle, left minimal immediate
            evidence, and aligned with Roach’s access and routine behaviour.
          </p>
        </Section>

        <Section title="Key Evidence">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
              <div className="text-xs text-slate-400">EVIDENCE 01</div>
              <div className="font-medium">Knowledge he should not have</div>
              <p>
                In his witness statement, Roach states:
              </p>
              <div className="rounded-lg border border-slate-800 bg-black px-4 py-3 font-mono text-sm text-slate-200">
                “You have to sign in with the ops code anyway.”
              </div>
              <p>
                At the time of the interview, Roach had no official reason to know
                that maintenance mode was enabled using ops-level access. This
                information is only supported by recovered access logs and internal
                messages.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
              <div className="text-xs text-slate-400">EVIDENCE 02</div>
              <div className="font-medium">Timeline inconsistencies</div>
              <p>
                Roach places Kells alive around 01:30. Access logs show privileged
                activity during the critical window. Security patrol confirms side
                door movement after 02:00.
              </p>
              <p>
                Roach’s account does not cover the window in which the fatal dose
                was administered.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
              <div className="text-xs text-slate-400">EVIDENCE 03</div>
              <div className="font-medium">Use of the contractor narrative</div>
              <p>
                Contractor records show override permissions linked to temporary
                access.
              </p>
              <p>
                Roach did not need to impersonate a contractor. He relied on
                existing ambiguity to deflect scrutiny.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 space-y-2">
              <div className="text-xs text-slate-400">EVIDENCE 04</div>
              <div className="font-medium">Behavioural indicators</div>
              <p>
                Roach repeatedly reframes Kells’ concerns as fatigue. His language
                mirrors phrasing later found in recovered material. He presents
                assumptions (“secured”, “locked”) as facts.
              </p>
              <p>
                This pattern aligns with deflection, not observation.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Final Determination">
          <p>
            Roach deliberately administered the fatal substance to Martin Kells
            after Kells discovered irregularities linked to Roach’s misconduct.
          </p>
          <p>
            Subsequent failures by exchange staff to fully interrogate procedural
            inconsistencies allowed the act to be misclassified at the time.
          </p>
        </Section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
          <div className="text-xs text-slate-400">CASE STATUS</div>
          <div className="text-2xl font-semibold text-emerald-300">SOLVED</div>
          <p className="text-sm text-slate-200">
            Culprit identified. Method established. Motive supported. Evidence reconciled.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/cases/silent-switchboard"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back to Case
            </Link>

            <Link
              href="/cases/silent-switchboard/recovered"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Review Recovered Archives
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
