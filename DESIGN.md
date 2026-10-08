# Design Direction: Agi Maulana

Personal engineering-leadership profile. Audience: hiring managers and recruiters
evaluating senior/staff/lead Android and mobile-engineering-leadership candidates.
The design's job: make the substance readable and let the evidence carry it.

## Identity

An engineer's dossier, not a product landing page. Feels like a well-set
engineering journal or a public engineering memo: typography does the design
work, evidence sits in the open, nothing decorates a claim.

## Personality

- Quiet confidence. The site argues through facts (99.8%, 7 months), not styling.
- Editorial over app-like: headings, rules, whitespace, lists; not cards-in-grids.
- Zero celebration. No badges, no glow, no pulse. Numbers speak.

## Dials

- ENERGY 1 (calm): typography-led, no hero theatrics.
- RHYTHM 2 (balanced): consistent base, deliberate breaks: the Good Doctor
  case study gets a wider treatment; project list is a list, not a card grid.
- MOTION 1 (hover states only): no entrance animations, no loops, no pulses.
  Only hover transitions and the theme toggle.

## Palette (2 core + 1 accent, neutrals excluded)

- Core: ink on paper. Dark: near-black ink `#18181b` on warm off-white
  `#fafaf9`. Light: same ink on white. This is a text-first profile; a
  paper-and-ink scheme signals document, not app.
- Accent: a single restrained green `#166534` (dark mode `#4ade80`), used only
  for: links, the one status dot that marks "open to opportunities", and the
  thin rule under the site header. Green reads as availability and shipping
  health; it is not decoration elsewhere.
- Reason: recruiters skim for status and evidence; accent marks exactly those.

## Typography

- Sans: `Inter` retained, reason: neutral grotesque tuned for dense UI text;
  correct for a profile meant to be skimmed, and already the site's typeface so
  the change is visual, not a rebrand.
- Mono: `JetBrains Mono` retained for metrics and project names only. Reason:
  metrics are evidence, and evidence gets a data voice. Mono is a data marker
  here, not a terminal aesthetic.
- Scale: one H1 per page, H2 section titles at moderate size, generous line
  height (1.7) on body. No uppercase labels, no wide tracking.

## Layout

- Single column, max-width 640-680px for prose sections; the case study and
  metrics can breathe wider (max 820px).
- Sections separated by whitespace and a single 1px rule where a topic truly
  shifts. Not every section: rhythm 2, not 1.
- Lists over card grids: experience as entries with hanging structure
  (role / period / substance), projects as a definition list. Cards only where
  an item is genuinely interactive (theme toggle, links).
- Footer: one line of links, not columns.

## Motif

The metric-as-evidence: real numbers set in mono with their source context
directly underneath, repeated wherever a number appears. This is the repeated
pattern that makes the site belong to Agi: every claim has its number beside it.

## Motion

- Hover: color and underline transitions only, 150ms.
- No entrance animations, no staggered fades, no pulse, no glow, no translate.
- Existing fadeIn/slideUp/stagger utilities get removed from use; utilities
  stay in CSS only if still referenced anywhere.
