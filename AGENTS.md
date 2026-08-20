# AGENTS.md

The spec for the Ember codebase. This file is the **rule registry**: the place a rule
lives when it cannot be encoded in tooling.

Two agents pivot on this file:

- **`custodian`** reads it and drives the codebase back into compliance.
- **`legislator`** is the only agent that may add rules to it.

Humans may of course edit anything here. The constraint is on agents: no agent other than
the Legislator amends the Rules section.

## Canonical checks

These commands define "correct". Nothing else is authoritative — not a passing hunch, not a
green editor.

| Check | Command | Auto-fixes? |
| --- | --- | --- |
| Frontend lint | `just lint-check` | `just lint` |
| Frontend types | `pnpm exec tsc --noEmit` | no |
| Frontend tests | `just test run` | no |
| Rust format | `cargo fmt --check` (in `src-tauri/`) | `cargo fmt` |
| Rust lint | `cargo lint` (in `src-tauri/`) | no |
| Rust tests | `cargo test` (in `src-tauri/`) | no |

> **Gap:** premerge CI runs every check above *except* `tsc`. Type errors reach `main` via
> that hole. Until CI closes it, the Custodian treats `tsc --noEmit` as a first-class check.

## Rule tiers

A rule is a principle the codebase must adhere to. Encode it at the lowest tier that can
express it:

1. **Tooling — ESLint** (`eslint.config.js`). Preferred. Mechanically checkable, fixable,
   already in CI.
2. **Tooling — Semgrep** (`.semgrep/rules.yml`). For structural or cross-file patterns
   ESLint cannot express. *Not yet adopted in this repo* — the Legislator bootstraps it
   (config + `just semgrep-check` + CI step) on the first rule that genuinely needs it.
3. **Prose — this file.** Only when the idea does not compress into either tool. These are
   enforced by agent judgment, not by a command, so they cost more and are held to a
   higher bar.

## Suppression protocol

A violation that carries a suppression marker is **not** a violation. Agents leave it
alone. The marker must name the rule and give a reason:

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic passthrough, O(1) layer
// @ts-expect-error -- upstream types lag the runtime shape
// nosemgrep: ember.rule-id -- reason
```

```rust
#[allow(clippy::too_many_arguments)] // reason
```

Prose rules have no native suppression syntax, so they use:

```ts
// agents-allow: <rule-id> -- reason
```

placed on the line above the exception, or at the top of the file for a whole-file
exemption.

**Suppressing is a legitimate outcome.** An agent may add a suppression instead of a fix
when the code is deliberately the way it is — but the reason must be real, and it is
reported as a suppression, never as a fix.

## Rules

Each rule has a stable `id` used by `agents-allow`. This registry deliberately starts
small; it grows through the Legislator, one deliberate amendment at a time.

### `checks-green`

Every change leaves all six canonical checks passing. A change that fixes one check by
breaking another is not done.

### `theme-tokens`

Visual values — spacing, color, radius, font size, z-index — come from theme tokens
(`src/components/theme.ts`), not raw CSS strings, wherever the prop accepts a token. Raw
values are for props typed to allow them (`TokenOrRawValue`) and for the token
definitions themselves.

*Why:* raw values silently drift from the design system and defeat theming.

### `tests-mirror-src`

Tests live under `tests/`, mirroring the `src/` path of what they cover
(`src/pages/Foo.tsx` → `tests/pages/Foo.test.tsx`). Shared fixtures go in `tests/mocks.ts`
and `tests/utils.ts` rather than being redefined per file.

### `suppressions-carry-reasons`

Every suppression marker names the rule it suppresses and states why, per the suppression
protocol above. A bare `// eslint-disable-next-line` is itself a violation.

*Why:* an unexplained suppression is indistinguishable from a mistake, and nobody can ever
safely remove it.

## Candidate rules — NON-BINDING

Observations that look like rules but have **not** been enacted. The Custodian must ignore
this section entirely. Listed so the next person has a starting point.

- **Driver-hook boundary.** Tauri IPC arguably belongs behind `useInternalDriver` /
  `useExternalDriver` rather than being called from components. Currently split:
  `PDFViewerPage` goes through the hooks, `FileSelectorPage` imports `open` from
  `@tauri-apps/plugin-dialog` directly. Enacting this would require refactoring
  `FileSelectorPage`.
- **No stray print statements.** `console.log` / `println!` appear in `useHandleKeyDown`,
  `FileSelectorPage`, `App`, and `src-tauri/src/lib.rs`. Enacting this needs a decision on
  what replaces them (a logger? nothing?) before it can be enforced.
