/**
 * Nova AI Assistant — the one control in this app's header that the METIS portal does not own.
 *
 * ── Why this file exists at all ──
 * It is byte-identical in `sa-web-service` and `sa-insights-lite`. The two apps had drifted into
 * genuinely different controls — one a transparent pill with a 38px orb and a two-part wordmark,
 * the other a permanently-filled indigo pill with a 32px orb and a single label — so the same
 * feature looked like two different features depending on which child app you had open. Keeping
 * the markup in one file per repo, rather than inline in each Header, is what makes "identical"
 * something you can check by diffing instead of by eye.
 *
 * ── Why it is drawn the way it is ──
 * The portal paints a bar directly above this one, and its shape vocabulary is deliberate:
 *
 *     hexagon           a control with no word in it — bell, feedback, theme
 *     capsule + lockup  something carrying text — the brand (name / tagline),
 *                       the account (name / role); both two-line
 *     rounded square    a named product mark
 *
 * Nova is a NAMED THING that happens to be pressable, not a utility switch — so it takes the
 * rounded-square tile, with its two-line lockup beside it inside one capsule.
 *
 * It used to take the hexagon, and that was wrong on the portal's own terms: in this system the
 * hexagon means "a control with no word in it", and it is the shape the bell, the feedback horn
 * and the theme switch wear. Nova borrowing it filed the assistant with three chrome utilities,
 * and sitting one row under them it read as a fourth that had drifted down. The rounded square is
 * the shape the portal gives the MXYZX mark itself — the "this is a product with a name" shape —
 * which is what Nova actually is.
 *
 * The material still follows the portal's construction: a rim layer with a face inset inside it,
 * quiet at rest, lifting on hover, and — when the panel is open — a light travelling the rim.
 * Same three states, one size step down, because host chrome should out-rank a child's own
 * controls rather than compete with them.
 *
 * ── Colour ──
 * Indigo → violet is the portal's ramp, and using it is most of what makes this look like it
 * belongs. Nova's own identity survives as the cyan in the travelling light: enough to keep the
 * assistant recognisable, not enough to drag the control out of the host's palette. The previous
 * indigo → blue → cyan fill put a third hue on a 32px object and read as a stock "AI" gradient.
 */

import { Box, Tooltip, Typography } from '@mui/material';

/* Same scales the two Headers define. Repeated here so this file can be copied between the repos
   without dragging an import path along with it. */
const C = {
  indigo: { 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA' },
  violet: { 300: '#C4B5FD', 500: '#8B5CF6', 600: '#7C3AED' },
  cyan:   { 300: '#67E8F9' },
  slate:  { 400: '#94A3B8', 500: '#64748B', 600: '#475569' },
};

/* Square, and a step under the portal's 40px brand tile for the reason the hexagon was a step
   under its 44px nodes: host chrome out-ranks a child's own controls. The radius scales with it —
   the bar's tile is 40px at radius 14, so 32 at 11 holds the same corner-to-size ratio and
   therefore the same family resemblance. A radius kept at 14 on a smaller square reads as a
   different, rounder shape rather than as the same one seen smaller. */
const TILE = 32;
const TILE_R = 11;
/* The face sits 1.5px inside the rim, so its radius comes down by the same 1.5. Leave it equal
   and the inner corner cuts across the outer one — the rim stays a hairline along the flats and
   visibly fattens at all four corners. */
const FACE_R = TILE_R - 1.5;

const NovaGlyph = ({ color }) => (
  /* A four-point spark with concave sides — a nova, which is what the name says.

     The mark it replaces was a dot with eight straight rays, which is the universal LOADING
     glyph: a spinner caught mid-turn. On a control whose entire job is to be pressed, "already
     busy" is the wrong first read. The concave sides are also what separate this from the
     portal's own "What's New" sparkles in the account menu, which are straight-edged and
     doubled — one product should not ship two marks that mean different things and look alike. */
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.6c.62 3.63 1.34 5.36 2.85 6.87S18.09 11.86 21.4 12c-3.31.14-5.04.86-6.55 2.37S12.62 17.77 12 21.4c-.62-3.63-1.34-5.36-2.85-6.87S5.91 12.14 2.6 12c3.31-.14 5.04-.86 6.55-2.37S11.38 6.23 12 2.6Z"
      fill={color}
    />
  </svg>
);

const NovaToggle = ({ isChatOpen = false, onToggleChat, isDark = false }) => {
  if (!onToggleChat) return null;

  const accent = isDark ? C.indigo[300] : C.indigo[600];
  /* indigo-400, not 300. At 300 the rim on a white header measured as a suggestion of an edge
     rather than an edge — the node read as a watermark next to the portal's own hexagons, which
     sit on a tinted bar and get their definition from it for free. This one does not. */
  const rimRest = isDark ? 'rgba(165, 180, 252, 0.52)' : C.indigo[400];
  const glyph = isChatOpen ? '#FFFFFF' : accent;

  /* The face at rest: a dip, built the way the portal builds one — darker at the top, landing on
     the surface colour at the bottom. Opaque, because the rim is a whole hexagon painted underneath
     it; anything translucent here leaks rim across the entire shape instead of leaving it as an
     edge, and the node comes out a flat grey tile. */
  const faceRest = isDark
    ? 'linear-gradient(180deg, #0B1220 0%, #161F32 52%, #1E293B 100%)'
    : `linear-gradient(180deg, #E7EAF3 0%, #F4F6FB 52%, #FFFFFF 100%)`;

  return (
    <Tooltip title={isChatOpen ? 'Close Nova AI Assistant' : 'Open Nova AI Assistant'} arrow placement="bottom">
      <Box
        role="button"
        tabIndex={0}
        aria-pressed={isChatOpen}
        aria-label={isChatOpen ? 'Close Nova AI Assistant' : 'Open Nova AI Assistant'}
        onClick={onToggleChat}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleChat(); }
        }}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.1,
          cursor: 'pointer', userSelect: 'none',
          mr: 1.5, pl: 0.5, pr: { xs: 0.5, sm: 1.4 }, py: 0.5,
          borderRadius: '999px',
          /* ── The capsule is drawn at rest, not only when open ──
             It used to be `transparent` on both border and background, on the argument that it
             was there to GROUP the tile with its lockup rather than to be a second object, and
             that a bordered pill under a bar that has none would be a visible join.

             The second half of that was simply wrong about the bar: the portal's own controls all
             carry a rim — three hexagons with hairlines and a filled account capsule — so a
             hairline here matches the row above rather than breaking from it. And the first half
             cost more than it saved. With no edge and no surface, the only thing that looked
             pressable was the 32px tile; the words beside it read as a caption that happened to
             sit nearby, even though the whole capsule is the hit target. A control should show
             you where it starts and stops.

             The surface matters as much as the line. A border with nothing behind it outlines a
             hole; the near-white fill is what makes this read as a raised object, and it is what
             the 1px hairline is enclosing. */
          background: isChatOpen
            ? (isDark ? 'rgba(165, 180, 252, 0.16)' : 'rgba(79, 70, 229, 0.09)')
            : (isDark ? 'rgba(148, 163, 184, 0.10)' : 'rgba(255, 255, 255, 0.82)'),
          border: `1px solid ${isChatOpen
            ? (isDark ? 'rgba(165, 180, 252, 0.55)' : C.indigo[300])
            : (isDark ? 'rgba(165, 180, 252, 0.28)' : C.indigo[200])}`,
          /* A single hairline of a shadow, light only. In dark the capsule is lighter than its
             ground, so a drop shadow under it would darken the very edge the border is drawing. */
          boxShadow: isDark ? 'none' : '0 1px 2px rgba(15, 23, 42, 0.05)',
          transition: 'background 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
          outline: 'none',
          '&:hover': {
            background: isDark ? 'rgba(165, 180, 252, 0.16)' : 'rgba(255, 255, 255, 0.96)',
            borderColor: isDark ? 'rgba(165, 180, 252, 0.5)' : C.indigo[400],
            boxShadow: isDark ? 'none' : '0 2px 6px rgba(79, 70, 229, 0.14)',
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 3px ${isDark ? 'rgba(165,180,252,0.35)' : 'rgba(79,70,229,0.28)'}`,
          },
          /* Hover and press are answered by the NODE, not by the capsule — the capsule moving as
             well would double the gesture. */
          '&:hover .nova-tile': {
            transform: 'translateY(-2px)',
            background: isChatOpen ? undefined : accent,
            filter: `drop-shadow(0 6px 11px ${isDark ? 'rgba(2,6,23,0.85)' : 'rgba(79,70,229,0.45)'})`,
          },
          '&:active .nova-tile': { transform: 'translateY(0) scale(0.92)' },
          '&:hover .nova-name': { opacity: 1 },
        }}
      >
        {/* ── The tile ──
            Element = rim. ::after = the light that travels it while the panel is open. ::before =
            the face, inset 1.5px, covering everything but that edge. `overflow: hidden` keeps the
            sweep inside the rounded square — the hexagon used a clip-path for that, a
            border-radius does it here, which is why the two-layer build survives the shape change
            unaltered. Rotating the sweep is still safe: it is a CHILD of the clipped box, so the
            tile stays put while the gradient turns. */}
        <Box
          className="nova-tile"
          sx={{
            position: 'relative',
            flexShrink: 0,
            width: TILE, height: TILE,
            borderRadius: `${TILE_R}px`,
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isChatOpen ? `linear-gradient(150deg, ${C.indigo[500]} 0%, ${C.violet[600]} 100%)` : rimRest,
            transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), background 240ms ease, filter 240ms ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '-60%',
              zIndex: 0,
              opacity: isChatOpen ? 1 : 0,
              background: `conic-gradient(from 0deg, transparent 0deg, ${C.cyan[300]} 46deg, transparent 122deg, transparent 360deg)`,
              animation: isChatOpen ? 'novaTileSweep 2.8s linear infinite' : 'none',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '1.5px',
              zIndex: 1,
              borderRadius: `${FACE_R}px`,
              background: isChatOpen
                ? `linear-gradient(150deg, ${C.indigo[500]} 0%, ${C.violet[600]} 100%)`
                : faceRest,
              transition: 'background 240ms ease',
            },
            '@keyframes novaTileSweep': { to: { transform: 'rotate(360deg)' } },
            /* The sweep is the only thing here that runs without being asked to. Removed rather
               than paused: a conic gradient frozen mid-turn parks a bright patch on two edges and
               leaves the other four dark, which reads as a rendering fault. */
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '&::after': { animation: 'none', opacity: 0 },
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2, display: 'flex' }}>
            <NovaGlyph color={glyph} />
          </Box>
        </Box>

        {/* ── The lockup ──
            Two lines, the portal's pattern for anything in chrome that carries text. The name is
            the brand ramp; the descriptor is small caps in muted ink, so "Nova" is what you read
            and "AI ASSISTANT" is what tells you what it is. */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', lineHeight: 1, whiteSpace: 'nowrap' }}>
          <Typography
            component="span"
            className="nova-name"
            sx={{
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.005em',
              lineHeight: 1.15,
              opacity: 0.94,
              transition: 'opacity 200ms ease',
              background: isDark
                ? `linear-gradient(135deg, ${C.indigo[300]} 0%, ${C.violet[300]} 100%)`
                : `linear-gradient(135deg, ${C.indigo[600]} 0%, ${C.violet[600]} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nova
          </Typography>
          <Typography
            component="span"
            sx={{
              /* Quiet, and it took two goes to get there.

                 0.6rem / 600 / 0.1em tracking made this line WIDER and very nearly as heavy as
                 the name above it — twelve tracked capitals beat four letters — so the lockup came
                 out bottom-heavy. Trimming to 0.55rem / 0.07em recovered 5px of width and almost
                 none of the balance, because SIZE was never the problem: twelve capitals at
                 weight 600 in a mid-slate is simply a lot of ink whatever size it is set at.

                 What fixed it was dropping the weight to 500 and the colour to slate-400. Compare
                 the account capsule in the bar above — "DEMO-USER" over "USER" — and the second
                 line there is subordinate by TONE, not by being small.

                 It also used to brighten to indigo-600 when the panel opened, which inverted the
                 hierarchy exactly when the control mattered most: the descriptor became the
                 loudest thing in it and "Nova" — the part that identifies what you opened — came
                 second. The open state is already carried by the filled node and the tinted
                 capsule. This line has no news to add, so it stays muted in both states. */
              fontWeight: 500,
              fontSize: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.055em',
              lineHeight: 1.35,
              color: isDark ? 'rgba(226, 232, 240, 0.5)' : C.slate[400],
            }}
          >
            AI Assistant
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default NovaToggle;
