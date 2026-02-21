import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center text-center gap-5">
          <Image
            src="/brand/scib-badge.png"
            alt="SCIB Badge"
            width={220}
            height={220}
            priority
          />

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Serious Crime Investigations Bureau
            </h1>
            <p className="text-slate-300">Secure Case Access Terminal</p>
          </div>

          <div className="w-full grid grid-cols-1 gap-3 mt-4">
            <Link
              href="/login"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition px-4 py-3 font-semibold"
            >
              Log In
            </Link>

            <Link
              href="/register"
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 transition px-4 py-3 font-medium"
            >
              Register
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            SCIB Internal Network • Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </main>
  );
}