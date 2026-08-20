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

### `build-system-owns-layout`

Layout is built with `Container.build(spec)` (`src/components/Container.ts`) and
interactive controls with `Controls` (`src/components/Controls.ts`). A raw `styled.div`
outside those two files is a violation — ESLint enforces the mechanical half via
`no-restricted-syntax`. Semantic elements (`styled.span`, `styled.p`, `styled.input`,
`styled.img`, `styled.header`, `styled.button`) are not covered and stay legitimate.

When a component needs something `Container`/`Controls` does not support, **stop and ask
the user how to best support it.** Extending `ContainerSpec` / `ControlSpec` is the
expected fix. Reaching for a raw `styled.div`, or smuggling one in under another name to
dodge the lint selector, is not. If a bespoke primitive really is right, it lands behind
an `eslint-disable-next-line no-restricted-syntax` naming this rule and stating why.

*Why:* every hand-rolled `div` is a piece of layout the design system cannot see, theme,
or change later. The ban is only useful if the pressure it creates flows back into the
build system instead of around it.

### `labels-earn-their-keep`

Every explicit label — a variable, a function, a class, any name for a thing — costs
something. Individually the cost is small; across a codebase the labels *are* the
complexity. A name earns its keep when it encapsulates a concept you can then compose
with, so the code reads the way it behaves instead of needing to be mentally executed.

Create a function or a variable when **at least one** of these is true:

- it names a concept notable enough to be worth thinking about on its own, or
- it is used in more than one place, or
- it hides real complexity behind a single idea.

Otherwise, inline it. Naming is not the default way to organize code; sequence and
structure are.

```ts
// Bad — the label adds nothing the component name did not already say.
const titleBarRightSpacerSpec: ContainerSpec = {
  minWidth: 280,
};
export const TitleBarRightSpacer = Container.build(titleBarRightSpacerSpec);

// Good — equally obvious inline.
export const TitleBarRightSpacer = Container.build({ minWidth: 280 } satisfies ContainerSpec);
```

A type annotation is **not** a label, and this rule never asks for one to be removed. In
the inlined form the `satisfies ContainerSpec` / `satisfies ControlSpec` is load-bearing:
`build<Spec extends ContainerSpec>(spec: Spec)` infers `Spec` from the literal, so without
`satisfies` excess-property checking silently stops working and a typo like `stackTyp`
compiles clean. Inlining a spec keeps the `satisfies` inside the call.

The one shape that is *never* justified — a module-scope, non-exported const holding an
object or array literal that is read exactly once, as the argument to
`Container.build`/`Controls.build` — is enforced mechanically by
`ember/no-single-use-spec-const` (`eslint-rules/no-single-use-spec-const.js`). Everything
else here is judgment, and stays judgment: whether a concept is notable enough is not a
thing a linter can decide. When a single-use name genuinely earns its keep by hiding
complexity, keep it — and if the lint rule disagrees, that is what a suppression naming
this rule is for.

*Why:* names are the codebase's vocabulary. A vocabulary of concepts lets you compose;
a vocabulary of aliases just makes you look things up.

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
