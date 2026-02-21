"use client";

import Image from "next/image";
import Link from "next/link";

export default function RegisterIndex() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="mx-auto w-full max-w-xl text-center">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/scib-badge.png"
              alt="SCIB Badge"
              width={56}
              height={56}
              priority
            />
            <div className="text-left">
              <div className="text-sm text-slate-300">
                SCIB Secure Access
              </div>
              <h1 className="text-xl font-semibold">
                Register
              </h1>
            </div>
          </div>

          <Link
            href="/"
            className="text-sm text-slate-300 hover:text-white"
          >
            Back
          </Link>
        </header>

        {/* Horizontal Icon Row */}
        <div className="mt-8 flex justify-center gap-10">

          {/* LinkedIn */}
          <Link href="/register/linkedin" className="group">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#0A66C2]">
                <path d="M19 0h-14C2.239 0 1 1.239 1 3v18c0 1.761 1.239 3 4 3h14c1.761 0 3-1.239 3-3V3c0-1.761-1.239-3-3-3zM8.338 19H5.667V9h2.671v10zM7.003 7.8c-.855 0-1.546-.694-1.546-1.55 0-.855.691-1.55 1.546-1.55.855 0 1.546.695 1.546 1.55 0 .856-.691 1.55-1.546 1.55zM19 19h-2.667v-4.906c0-1.169-.021-2.673-1.63-2.673-1.632 0-1.882 1.274-1.882 2.591V19h-2.667V9h2.561v1.367h.036c.357-.675 1.229-1.386 2.53-1.386 2.705 0 3.203 1.78 3.203 4.095V19z"/>
              </svg>
            </div>
            <div className="mt-2 text-sm text-slate-300 group-hover:text-white">
              LinkedIn
            </div>
          </Link>

          {/* Facebook */}
          <Link href="/register/facebook" className="group">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#1877F2]">
                <path d="M22 12.07C22 6.485 17.523 2 12 2S2 6.485 2 12.07c0 4.991 3.657 9.128 8.438 9.879v-6.993H7.898v-2.886h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.465h-1.261c-1.243 0-1.63.771-1.63 1.562v1.876h2.773l-.443 2.886h-2.33v6.993C18.343 21.198 22 17.061 22 12.07z"/>
              </svg>
            </div>
            <div className="mt-2 text-sm text-slate-300 group-hover:text-white">
              Facebook
            </div>
          </Link>

          {/* Instagram */}
          <Link href="/register/instagram" className="group">
            <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#E4405F]">
                <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm8.916 3.083a1.083 1.083 0 110 2.167 1.083 1.083 0 010-2.167zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2.083a2.917 2.917 0 100 5.834 2.917 2.917 0 000-5.834z"/>
              </svg>
            </div>
            <div className="mt-2 text-sm text-slate-300 group-hover:text-white">
              Instagram
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}
