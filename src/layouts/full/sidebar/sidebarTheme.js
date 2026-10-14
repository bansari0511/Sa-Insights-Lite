/**
 * =============================================================================
 * Sidebar Design Tokens — "Metis Light"
 *
 * A self-contained, LIGHT palette for the sa-web-service sidebar, tuned to
 * correlate with the Metis host chrome. The host rail wears an
 * indigo → violet → fuchsia brand ramp; this sidebar answers in the same
 * family but as a bright, frosted-glass surface so the child app reads as a
 * light companion to the host rather than a mismatched dark panel.
 *
 * Deliberately NOT sourced from theme.palette.brand.* — those tokens are dark
 * (and, in light mode, partly undefined). Keeping the sidebar's look here means
 * it is stable across both app theme modes and does not perturb the rest of the
 * app that still depends on the brand palette.
 * =============================================================================
 */

export const SB = {
  // ─── Surface ──────────────────────────────────────────────────────────────
  // Bright frosted glass with a faint lavender wash toward the foot.
  surface:
    'linear-gradient(184deg, #ffffff 0%, #f7f6ff 50%, #eef1ff 100%)',
  // Soft indigo-tinted separation from the content, plus a lit inner right edge.
  surfaceShadow:
    '10px 0 34px rgba(79, 70, 229, 0.08), 4px 0 14px rgba(139, 92, 246, 0.06)',
  border: 'rgba(99, 102, 241, 0.18)',
  divider: 'rgba(99, 102, 241, 0.12)',

  // ─── Brand ramp (shared with the host) ───────────────────────────────────
  indigo: '#6366f1',
  indigoStrong: '#4f46e5',
  violet: '#8b5cf6',
  fuchsia: '#d946ef',
  accentSoft: '#a5b4fc',
  // Solid marks (collapsed logo tile, active icon fill, toggle hover).
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)',
  // Clipped brand-name text — matches the host drawer's gradient wordmark.
  gradientText: 'linear-gradient(100deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',

  // ─── Text ────────────────────────────────────────────────────────────────
  text: '#475569',        // slate-600 — resting row label
  textStrong: '#1e293b',  // slate-800 — hover / active label
  // slate-500 — section labels, secondary. Was slate-400 (#94a3b8), which only
  // reached 2.2:1 against this panel's near-white gradient and read as washed
  // out; slate-500 clears WCAG AA (4.5:1) while staying subordinate to the rows.
  textMuted: '#64748b',
  icon: '#64748b',        // slate-500 — resting icon

  // ─── States ──────────────────────────────────────────────────────────────
  hoverBg: 'rgba(99, 102, 241, 0.08)',
  activeBg:
    'linear-gradient(95deg, rgba(99, 102, 241, 0.16) 0%, rgba(139, 92, 246, 0.10) 55%, rgba(217, 70, 239, 0.06) 100%)',
  activeShadow:
    '0 6px 18px rgba(99, 102, 241, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
  // Left accent bar on hover/active rows.
  accentBar: 'linear-gradient(180deg, #818cf8 0%, #d946ef 100%)',
  accentBarGlow: '0 0 10px rgba(129, 140, 248, 0.6)',

  // ─── Scrollbar ───────────────────────────────────────────────────────────
  scrollThumb: 'rgba(99, 102, 241, 0.28)',
  scrollThumbHover: 'rgba(99, 102, 241, 0.45)',
  scrollTrack: 'rgba(99, 102, 241, 0.05)',
};

export default SB;
