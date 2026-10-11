# Some experiments — implementation plan

This plan governs the rebuild of the original public GeoGebra/JavaScript
example, the repair of the live function trainer, the private Grav plugin,
and the separate update of the vanilla HTML starter.

The work remains understated and factual. New public-facing text is English.
The existing `/funktionentrainer` URL remains available. No public push,
release, or server deployment happens before the local result has been
reviewed. The Grav plugin is never released publicly.

## Fixed constraints

- Preserve the 2019 history of `danzinger/ggb-js-example`. Do not force-push
  the disconnected two-commit history currently in this working directory.
- Repair the live trainer before building the wider collection.
- Preserve the trainer's established behaviour: generate a random linear
  function, display its graph, accept algebraically equivalent answers, allow
  retries, and reveal the solution on request.
- Every generated graph must be exactly readable from the displayed grid.
- Keep the current MD design system: paper, ink, bronze, Source Serif 4 and
  Source Sans 3, semantic tokens, restrained motion, and accessible contrast.
- Do not publish private public-appearance material or private TeX content.
- Do not expose API keys in browser code, commits, logs, or public artifacts.
- Keep commit messages short and ordinary.

## 1. Restore the correct repository history

1. Add the public `ggb-js-example` repository as the origin and fetch it.
2. Retain the current disconnected `main` branch as a recoverable local
   reference.
3. Create the implementation branch from `origin/master`.
4. Port the useful local design assets and rewrite the application on that
   branch.
5. Do not push until the rebuilt history and preview have been reviewed.

Acceptance:

- The 2019 commits remain ancestors of the rebuilt public branch.
- No force-push is required.
- The worktree is clean before each implementation phase begins.

## 2. Fix the function trainer first

### GeoGebra integration

- Replace the 2018-era `5.0.445.0` deployment path.
- Capture the API supplied to `appletOnLoad(api)`; do not depend on the global
  `ggbApplet` compatibility object.
- Give every applet an explicit ID and lifecycle.
- Provide visible loading, ready, degraded, and failed states.
- Configure a fixed one-unit grid and one-unit axis numbering.
- Retain the exact GeoGebra equivalence check for valid expressions.

### Readable function generation

- Generate from a tested bank of reduced rational slopes and integer
  intercepts.
- Exclude `f(x) = 0`, immediate repeats, and visually ambiguous candidates.
- Require the y-intercept and at least one second integer lattice point to be
  visible inside the viewport with a margin.
- Use deterministic seeds in tests and optional share links.
- Introduce difficulty deliberately rather than by accidental random values.

### Input and feedback

- Tokenize and normalize integers, fractions, decimals, decimal commas,
  `2x`, `2*x`, `2·x`, whitespace, parentheses, and Unicode minus.
- Reject assignments, extra identifiers, newlines, command separators,
  unbalanced parentheses, malformed numbers, and invalid operator sequences
  before calling GeoGebra.
- Distinguish empty input, syntax error, valid but incorrect, and correct.
- Explain syntax errors inline and place the caret at the useful position.
- On a valid wrong answer, compare the entered slope and intercept where
  possible and explain only the differing part.
- After an unsuccessful attempt, offer an exact slope triangle using two
  visible lattice points.
- Use an `aria-live` status region and retain keyboard focus predictably.

### Trainer acceptance tests

- Exhaustively verify every generator candidate.
- Verify that 100% of candidates expose at least two readable lattice points.
- Accept equivalent forms such as `3x+2`, `2+x*3`, and algebraically equivalent
  parenthesized expressions.
- Reject malformed and command-like input as syntax, not mathematics.
- Test Chromium, Firefox, and WebKit at phone and desktop widths.
- Test light and dark themes, keyboard-only use, reduced motion, cold cache,
  warm cache, delayed GeoGebra, and failed GeoGebra loading.
- Require no console errors and no blank plot without explanation.

Initial commits:

- `Fix the trainer`
- `Make every graph readable`
- `Explain invalid input`

## 3. Rebuild the public repository as “Some experiments”

Use framework-free Web Components, TypeScript, and a small build/test layer.
The static HTML remains meaningful before JavaScript runs.

Architecture:

- Pure domain modules for rational arithmetic, generators, parsing,
  diagnostics, and experiment state.
- A GeoGebra adapter with explicit applet IDs, promises, event registration,
  state export/import, and cleanup.
- Reusable custom elements beginning with the function trainer.
- Corporate-design semantic tokens with neutral fallbacks.
- Unit tests for domain logic and browser tests for integration.
- CI for tests, formatting, accessibility, and static deployment.
- A factual README covering the 2019 origin, experiments, local use,
  architecture, browser support, testing, and licensing.
- Full MIT text for authored code; separate font, brand-asset, and GeoGebra
  notices. Keep GeoGebra copyright and attribution intact.

GeoGebra API demonstrations to add after the trainer:

- DOM output driven by object update and click listeners.
- Multiple independent applets without global collisions.
- Exact construction state save and restore.
- SVG/PDF export.
- Graph-to-LaTeX handoff using exact equations and vector output.

## 4. Build the private Grav plugin

Create a separate private plugin repository under the web-development
workspace. Do not publish it to GPM or a public Git host.

The plugin will:

- Support the deployed Grav 2.0 site.
- Provide a page template and experiment registry.
- Register JavaScript and CSS only on pages that use an experiment.
- Load one GeoGebra runtime for any number of experiment instances.
- Use the MD semantic tokens when present and accessible fallbacks otherwise.
- Configure language, difficulty, viewport, permitted input forms, and loading
  strategy through YAML/front matter.
- Contain no analytics and no browser-visible secret.
- Replace the trainer-specific theme code only after parity tests pass.

Deployment gate:

1. Install and test in the local Grav environment.
2. Compare standalone and Grav behaviour with the same browser suite.
3. Review the local page visually and functionally.
4. Make a private plugin release if desired.
5. Install on the server, clear Grav caches, verify HTTPS, then update the
   local live mirror.

Commit: `Add the Grav plugin`

## 5. Add useful experiments

### Deterministic experiments

1. **Break-even under pressure** — generate a plausible business case and
   show revenue, cost, profit, break-even, safety margin, and which assumption
   actually controls the result.
2. **Thresholds** — turn an administrative rule into a piecewise function and
   expose jumps, gaps, and edge cases.
3. **Graph to paper** — adjust a graph and export an exact SVG plus a small,
   original English LaTeX question fragment. Use the production discipline of
   `mdl-tex-templates-bootstrap` without copying its private material.

### AI-assisted experiments

1. **Paragraph → model** — AI extracts quantities, units, and assumptions
   into a strict schema; deterministic code performs every calculation.
2. **Rule → boundary** — AI translates prose into a decision table;
   deterministic tests find contradictions and minimal counterexamples.
3. **Question → instrument** — AI proposes an interactive representation of
   an original LaTeX question; GeoGebra or the deterministic engine must
   verify it before it is presented as correct.

AI rules:

- No chat-style interface merely for appearance.
- AI translates, classifies, or proposes; it does not own arithmetic truth.
- Every result exposes input → interpretation → deterministic result.
- Every experiment has one-click precomputed examples that require no account,
  API request, or uploaded data.
- Live model calls are a later, explicit credential/provider decision and use
  a private server endpoint with validation, rate limits, and cost limits.

Commit: `Add the experiments`

## 6. Update the vanilla HTML starter

Update the existing `danzinger/boilerplate-vanilla` repository instead of
creating another public repository. Preserve its history.

The updated starter remains zero-dependency at runtime and requires no build:

- Semantic, indexable HTML with landmarks and a skip link.
- A small modern reset rather than vendored Normalize.
- CSS custom properties, logical properties, fluid type, `:focus-visible`,
  balanced headings, and reduced-motion support.
- A `type="module"` entry that progressively enhances the page.
- A real 404 page, robots file, neutral icon placeholders, and optional
  manifest guidance.
- A short local-server command, validation workflow, browser-support statement,
  deployment checklist, and security-header notes.
- No personal brand assets and no GeoGebra dependency.

Commit: `Update the vanilla starter`

## 7. Presentation and discoverability

- Write all new public UI, documentation, metadata, and code comments in
  English.
- Keep `/funktionentrainer` available even if the visible title becomes
  “Function trainer”.
- Serve substantive descriptions in HTML rather than rendering the entire
  page from JavaScript.
- Use unique titles, descriptions, canonical URLs, Open Graph metadata,
  sitemap entries, and truthful structured data.
- Link live experiments to their source and source repositories to their live
  examples.
- Add a quiet “Some experiments” link to the wider web presence only after
  the collection contains finished work.
- Never use `expert`, `consultant`, `AI strategy`, `thought leader`, service
  catalogues, or promotional claims. The work is the claim.

## 8. Licensing and privacy gate

GeoGebra's November 2025 terms distinguish non-commercial teaching use from
uses intended to obtain commercial advantage. Do not silently treat the full
GeoGebra product as MIT.

- Keep the immediate trainer clearly within its teaching context.
- Record GeoGebra as separately licensed and include “Made with GeoGebra®”.
- Do not include the GeoGebra runtime inside the repository's MIT scope.
- Clarify licensing before using GeoGebra itself in broader finance or
  AI-oriented public demonstrations. Those experiments can use authored
  SVG/Canvas rendering until then.
- Make no third-party visitor request without an explicit, documented reason.
- Prefer a pinned self-hosted runtime for the teaching site once licensing and
  update mechanics are settled.

## 9. Files outside scope

- Treat `/home/m/code/mdl-corporate-design/public-appearance/` as private
  context only. Never copy its wording into a public repository.
- Treat `/home/m/code/mdl-tex-templates-bootstrap/` as read-only reference.
  Its existing modification to `lib/doc_lib.py` is unrelated user work and
  must remain untouched.
- Do not modify or deploy the live mirror as if it were the authoritative
  theme or plugin source.

## Completion order

1. Correct public history established locally.
2. Trainer repaired and tested.
3. Local Grav plugin proves the same trainer works in Grav.
4. Public repository foundation and first deterministic experiments complete.
5. Vanilla starter updated in its own repository.
6. AI modes added only after the execution and credential model is approved.
7. Public pushes and server deployment occur only after review.
