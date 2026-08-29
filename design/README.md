# Vendored corporate design

Copied from `webdev/design/`, which is itself vendored from
`mdl-corporate-design`. This theme is its own repository, so it carries its
own copy rather than reaching across a directory it cannot depend on.

**Vendored:** 2026-08-29
**Source:** webdev/design/ (see webdev/design/README.md for its upstream)

Do not edit anything in this directory. Re-vendor instead, and update the
date above in the same commit.

## Recorded exceptions

Step 6 of the port scanned the four component layers for primitive tokens
leaking past the semantic layer. Five hits remain, all inherited verbatim
from the live Hugo implementation:

| File | Line | Token | Rule |
| --- | --- | --- | --- |
| `css/30-components.css` | 102 | `--md-bronze-800` | `.btn--solid:hover` (light) |
| `css/30-components.css` | 105 | `--md-bronze-350` | `.btn--solid:hover` (`[data-theme="dark"]`) |
| `css/30-components.css` | 109 | `--md-bronze-350` | `.btn--solid:hover` (`prefers-color-scheme: dark`) |
| `css/30-components.css` | 624 | `--md-ink-300` | `.crumbs span[aria-hidden]` |
| `css/40-article.css` | 32 | `--md-ink-300` | `.article__meta .dot` |

They are left in place, not rewritten, because no semantic token carries the
value either of them needs:

- **`--md-bronze-800` / `--md-bronze-350`** are the hover step of a filled
  accent surface. `--accent-solid` is the resting state; there is no
  `--accent-solid-hover` role. Substituting any existing semantic token would
  make the hover indistinguishable from the resting state.
- **`--md-ink-300`** is the brand hairline value, used here to colour a
  decorative separator glyph. The nearest semantic role, `--text-faint`, binds
  to `--md-ink-400`, one step darker.

The fix belongs upstream in `mdl-corporate-design`: add an `--accent-solid-hover`
role and a semantic role for hairline-weight glyph colour, re-vendor, then
repoint these five declarations. Rewriting them here instead would make this
theme drift from the Hugo site on matthiasdanzinger.at, which is the one thing
the verbatim port exists to prevent.
