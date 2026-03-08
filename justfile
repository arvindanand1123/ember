set shell := ["zsh", "-cu"]

default:
  @just --list

dev:
  direnv exec . pnpm exec vite

build:
  direnv exec . pnpm exec tsc
  direnv exec . pnpm exec vite build

preview:
  direnv exec . pnpm exec vite preview

tauri *args:
  direnv exec . pnpm exec tauri {{args}}

lint:
  direnv exec . pnpm exec eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix

lint-check:
  direnv exec . pnpm exec eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0

test *args:
  direnv exec . pnpm exec vitest {{args}}
