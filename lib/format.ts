// Shared money formatting so big numbers read professionally at any scale.

// Compact: $850 / $42K / $1.63M / $4.75M — switches units by magnitude.
export function fmtCompact(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000
    // 1 decimal under 10M, 2 decimals under 100M for precision on smaller deals
    const decimals = m >= 100 ? 0 : m >= 10 ? 1 : 2
    return `${sign}$${m.toFixed(decimals)}M`
  }
  if (abs >= 1_000) {
    return `${sign}$${Math.round(abs / 1_000)}K`
  }
  return `${sign}$${Math.round(abs)}`
}

// Full: $1,630,000 — for tables and detail rows where exact figures matter.
export function fmtFull(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`
}
