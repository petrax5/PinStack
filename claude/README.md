# Claude handoff folder

This folder is the bridge between Claude (design thinking) and Milo (implementation).
Jesus pastes briefs both ways; files move through git instead of the clipboard.

## Protocol

1. Milo writes a brief as `claude/brief-<topic>.md` and pushes it.
2. On his Mac, Jesus points Claude at this repo (Claude Code on a local clone,
   or Claude's GitHub connector) and says: "read claude/brief-<topic>.md and do it."
3. Claude writes its output as `claude/out-<topic>.md` (full file contents, never
   diffs) and pushes. For site files, Claude may instead push a branch named
   `claude/<topic>` with the changed files.
4. Milo reads the output, verifies it against the rules below, ships it to `main`,
   and checks it live. Nothing ships without Milo's verification.

## Repo map (petrax5/PinStack, branch `main`, Netlify auto-deploys on push)

- `index.html`, `styles.css`, `script.js` — the one-page Pinstack Design site.
- `assets/` — logos (`pinstack-stacked-pin-*.svg`), photos, screenshots.
- CSS/JS links carry `?v=N`; bump N on every CSS/JS change.

## Brand (Grove & Citrus)

- Tokens: Grove `#1F3B2E`, Citrus `#F08A24`, Sage `#DCE5D3`, Cream `#FBF7F0`, Ink `#17201B`.
- Type: Young Serif (display, 22px+), Figtree (text). Google Fonts.
- Buttons 10px radius, framed images 16px, nothing else rounded.
- One Citrus moment per screen. Dark theme remaps tokens; bands stay Grove.

## Copy rules (hard)

- Jesus works from home in Orange County. Never call it a studio.
- Never claim every design starts as a paper sketch.
- Never state what Oasis paid.
- Never invent clients, testimonials, stats, or reviews. The only real case study is Oasis Detailing Supplies.
- No em-dashes in web copy, ever.
- Contact email stays `hello@pinstack.design` until Jesus says otherwise.
