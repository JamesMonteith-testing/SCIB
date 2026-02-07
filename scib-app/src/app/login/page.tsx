import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-xl">
        <header className="flex items-center gap-4 py-4">
          <Image src="/brand/scib-badge.png" alt="SCIB Badge" width={56} height={56} priority />
          <div>
            <div className="text-sm text-slate-300">SCIB Secure Access</div>
            <h1 className="text-xl font-semibold">Detective Login</h1>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Badge Number</label>
            <input
              placeholder="SCIB-1234"
              className="w-full rounded-xl bg-slate-950/60 border border-slate-800 px-4 py-3 outline-none focus:border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-slate-300">Verification Method</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className="rounded-xl bg-slate-800 hover:bg-slate-700 transition px-4 py-3 font-medium">
                Email Code (stub)
              </button>
              <button className="rounded-xl bg-slate-800 hover:bg-slate-700 transition px-4 py-3 font-medium">
                SMS Code (stub)
              </button>
            </div>
            <p className="text-xs text-slate-500">
              This is a prototype screen. Next step: real code delivery + verification.
            </p>
          </div>

          <div className="pt-2 grid grid-cols-1 gap-3">
            <Link
              href="/cases/silent-switchboard"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-medium text-center"
            >
              Continue to SCIB Database
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-3 font-medium text-center"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
