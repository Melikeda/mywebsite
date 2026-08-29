export function Mark({ kind }: { kind: string }) {
  const common = {
    viewBox: "0 0 120 90",
    fill: "none",
    "aria-hidden": true as const,
  };

  if (kind === "notebook") {
    return (
      <svg {...common}>
        <rect x="22" y="10" width="76" height="70" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M38 10v70" stroke="currentColor" strokeWidth="1.6" />
        <path d="M48 28h38M48 40h32M48 52h36" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="30" cy="32" r="2.2" fill="currentColor" />
        <circle cx="30" cy="48" r="2.2" fill="currentColor" />
      </svg>
    );
  }

  if (kind === "campus") {
    return (
      <svg {...common}>
        <path d="M20 70h80" stroke="currentColor" strokeWidth="1.6" />
        <path d="M32 70V38l28-16 28 16v32" stroke="currentColor" strokeWidth="1.6" />
        <rect x="52" y="48" width="16" height="22" stroke="currentColor" strokeWidth="1.6" />
        <path d="M40 52h8M72 52h8M40 62h8M72 62h8" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  if (kind === "vision") {
    return (
      <svg {...common}>
        <rect x="28" y="22" width="64" height="46" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="60" cy="45" r="12" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="60" cy="45" r="4" fill="currentColor" />
        <path d="M40 22l8-10h24l8 10" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  if (kind === "product") {
    return (
      <svg {...common}>
        <rect x="34" y="16" width="52" height="58" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M34 32h52M44 44h20M44 54h16" stroke="currentColor" strokeWidth="1.4" />
        <rect x="70" y="42" width="10" height="10" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }

  if (kind === "writing") {
    return (
      <svg {...common}>
        <path d="M28 66h64" stroke="currentColor" strokeWidth="1.6" />
        <path d="M40 62l36-36 10 10-36 36H40z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M70 32l10 10" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M22 62c18-28 28-28 38 0 10-24 22-24 38 0" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="40" cy="34" r="4" fill="currentColor" />
      <circle cx="78" cy="28" r="3" fill="currentColor" />
      <path d="M22 70h76" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
