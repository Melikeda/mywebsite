type CoverKind = "linkedin" | "github" | "kaggle" | "medium";

const common = {
  viewBox: "0 0 160 200",
  fill: "none",
  "aria-hidden": true as const,
  className: "cover__drawing",
};

export function CoverArt({ kind }: { kind: CoverKind }) {
  if (kind === "linkedin") {
    return (
      <svg {...common}>
        <rect width="160" height="200" fill="#0a66c2" />
        <rect className="cover-banner" x="10" y="14" width="140" height="22" rx="11" fill="#dff0ff" />
        <text x="26" y="29" fill="#0a66c2" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8" fontWeight="700">
          open to work (please)
        </text>
        <rect className="cover-in" x="18" y="50" width="44" height="44" rx="8" fill="#fff" />
        <text x="28" y="80" fill="#0a66c2" fontFamily="Figtree, Segoe UI, sans-serif" fontSize="26" fontWeight="700">
          in
        </text>
        <g className="cover-bubble">
          <ellipse cx="118" cy="62" rx="28" ry="16" fill="#fff" />
          <path d="M98 72l-8 10 16-6" fill="#fff" />
          <text x="100" y="66" fill="#0a66c2" fontFamily="Fraunces, Georgia, serif" fontSize="9">
            let’s chat?
          </text>
        </g>
        <g className="cover-hand cover-hand--l">
          <circle cx="48" cy="128" r="10" fill="#f3d2b3" />
          <rect x="40" y="136" width="16" height="28" rx="6" fill="#0b3a66" />
        </g>
        <g className="cover-hand cover-hand--r">
          <circle cx="112" cy="128" r="10" fill="#e8c4a0" />
          <rect x="104" y="136" width="16" height="28" rx="6" fill="#083057" />
        </g>
        <path className="cover-shake" d="M64 148c10-8 22-8 32 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        <text x="18" y="188" fill="#cfe6ff" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
          coffee? endorsements?
        </text>
      </svg>
    );
  }

  if (kind === "github") {
    return (
      <svg {...common}>
        <rect width="160" height="200" fill="#1b1714" />
        <rect x="12" y="14" width="136" height="172" rx="8" stroke="#c8b89a" strokeWidth="1.4" />
        <circle className="cover-dot cover-dot--r" cx="28" cy="30" r="3.4" fill="#e08a6a" />
        <circle className="cover-dot cover-dot--y" cx="40" cy="30" r="3.4" fill="#c4a35a" />
        <circle className="cover-dot cover-dot--g" cx="52" cy="30" r="3.4" fill="#6cc644" />
        <text x="64" y="34" fill="#c8b89a" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
          ~/yolocilin
        </text>
        <text x="22" y="58" fill="#6cc644" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="9">
          $ git push
        </text>
        <text className="cover-type" x="22" y="74" fill="#e8dcc8" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
          everything is fine
        </text>
        <rect className="cover-cursor" x="118" y="66" width="6" height="10" fill="#6cc644" />
        <circle className="cover-commit" cx="36" cy="118" r="6" fill="#6cc644" />
        <circle cx="36" cy="148" r="5" stroke="#6cc644" strokeWidth="1.6" />
        <circle cx="36" cy="176" r="5" stroke="#6cc644" strokeWidth="1.6" />
        <path d="M36 124v19M36 153v18" stroke="#6cc644" strokeWidth="1.6" />
        <path className="cover-branch" d="M36 148c30 0 30-20 58-20" stroke="#c8b89a" strokeWidth="1.5" />
        <g className="cover-bug">
          <ellipse cx="118" cy="132" rx="10" ry="7" fill="#e08a6a" />
          <path d="M110 128l-6-6M126 128l6-6M110 136l-6 4M126 136l6 4" stroke="#e08a6a" strokeWidth="1.4" />
        </g>
        <text x="70" y="176" fill="#8a7d6c" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="7">
          it compiled on my machine
        </text>
      </svg>
    );
  }

  if (kind === "kaggle") {
    return (
      <svg {...common}>
        <rect width="160" height="200" fill="#123844" />
        <rect x="0" y="0" width="160" height="34" fill="#20beff" />
        <text x="12" y="22" fill="#08303c" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="9" fontWeight="700">
          LB · one more epoch
        </text>
        <g className="cover-medal">
          <circle cx="42" cy="78" r="22" fill="#f0c14b" />
          <circle cx="42" cy="78" r="13" fill="#123844" />
          <text x="36" y="83" fill="#f0c14b" fontFamily="Fraunces, Georgia, serif" fontSize="16">
            1
          </text>
        </g>
        <text className="cover-auc" x="78" y="70" fill="#7ad7ff" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
          +0.001
        </text>
        <rect className="cover-bar cover-bar--a" x="78" y="82" width="64" height="10" rx="2" fill="#20beff" />
        <rect className="cover-bar cover-bar--b" x="78" y="98" width="44" height="10" rx="2" fill="#7ad7ff" />
        <rect className="cover-bar cover-bar--c" x="78" y="114" width="54" height="10" rx="2" fill="#20beff" opacity="0.65" />
        <g className="cover-jump">
          <circle cx="48" cy="150" r="8" fill="#f3d2b3" />
          <rect x="40" y="158" width="16" height="18" rx="4" fill="#20beff" />
          <path d="M40 176l-6 10M56 176l6 10" stroke="#7ad7ff" strokeWidth="2" />
        </g>
        <text x="78" y="168" fill="#9fe4ff" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
          submit.csv
        </text>
        <text className="cover-run" x="78" y="184" fill="#f0c14b" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
          ▶ running…
        </text>
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect width="160" height="200" fill="#f7f3ea" />
      <circle className="cover-m" cx="128" cy="28" r="16" fill="#1a1612" />
      <text x="121" y="34" fill="#f7f3ea" fontFamily="Fraunces, Georgia, serif" fontSize="18" fontWeight="600">
        M
      </text>
      <text className="cover-draft" x="16" y="78" fill="#1a1612" fontFamily="Fraunces, Georgia, serif" fontSize="22">
        once upon
      </text>
      <text className="cover-draft cover-draft--2" x="16" y="102" fill="#1a1612" fontFamily="Fraunces, Georgia, serif" fontSize="22">
        a model…
      </text>
      <rect className="cover-cursor cover-cursor--ink" x="118" y="86" width="5" height="16" fill="#1a1612" />
      <g className="cover-clap cover-clap--1">
        <text x="18" y="148" fontSize="18">
          👏
        </text>
      </g>
      <g className="cover-clap cover-clap--2">
        <text x="48" y="148" fontSize="18">
          👏
        </text>
      </g>
      <g className="cover-clap cover-clap--3">
        <text x="78" y="148" fontSize="18">
          👏
        </text>
      </g>
      <path className="cover-scribble" d="M18 168c18-10 28 8 46 0 18-8 28 10 52 2" stroke="#b34a2a" strokeWidth="1.8" fill="none" />
      <text x="18" y="192" fill="#5d554c" fontFamily="IBM Plex Mono, ui-monospace, monospace" fontSize="8">
        50 claps, still drafting
      </text>
    </svg>
  );
}
