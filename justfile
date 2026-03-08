set shell := ["zsh", "-cu"]

default:
  @just --list

dev:
  pnpm exec vite

build:
  pnpm exec tsc
  pnpm exec vite build

preview:
  pnpm exec vite preview

tauri *args:
  pnpm exec tauri {{args}}

lint:
  pnpm exec eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix

lint-check:
  pnpm exec eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0

test *args:
  pnpm exec vitest {{args}}
