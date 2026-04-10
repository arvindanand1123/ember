set shell := ["zsh", "-cu"]

default:
  @just --list

setup:
  pnpm install
  cargo fetch --manifest-path src-tauri/Cargo.toml

dev:
  pnpm exec vite

build:
  pnpm exec tsc
  pnpm exec vite build

preview:
  pnpm exec vite preview

tauri *args:
  pnpm exec tauri {{args}}

profile:
  VITE_PROFILE=1 pnpm exec tauri dev

lint:
  pnpm exec eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0 --fix

lint-check:
  pnpm exec eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0

test *args:
  pnpm exec vitest {{args}}
