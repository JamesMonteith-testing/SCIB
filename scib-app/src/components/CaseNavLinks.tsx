import Link from "next/link";

type Props = {
  /** Case hub route, e.g. /cases/silent-switchboard */
  caseHref: string;
  /** Optional primary context action (e.g. Back to Evidence List) */
  contextHref?: string;
  contextLabel?: string;
};

export default function CaseNavLinks({ caseHref, contextHref, contextLabel }: Props) {
  return (
    <div className="flex flex-col items-end gap-2">
      {contextHref && contextLabel ? (
        <Link
          href={contextHref}
          className="rounded-xl border border-slate-700 hover:bg-slate-900 transition px-4 py-2 text-sm font-medium"
        >
          {contextLabel}
        </Link>
      ) : null}

      <div className="flex items-center gap-4 text-sm">
        <Link href="/" className="text-slate-300 hover:text-white">
          Home
        </Link>
        <Link href={caseHref} className="text-slate-300 hover:text-white">
          Back to Case
        </Link>
      </div>
    </div>
  );
}
