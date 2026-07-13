# Ember
[Charter](https://fir-toad-794.notion.site/Ember-Charter-2d98e8006a5080afa056c6cfe124c97c?source=copy_link)

## Prerequisites

Before contributing, ensure you have the following installed:

- **direnv** - Install from [direnv.net](https://direnv.net/)
- **nvm** - Install from [nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- **Node.js** 22 (loaded automatically by `direnv`)
- **pnpm** - Install with: `npm install -g pnpm`
- **just** - Install from [just.systems](https://just.systems/)
- **Rust** (latest stable)

## Installation

Allow the repo environment and switch to Node 22:

```bash
direnv allow
```

Install dependencies for the frontend and Tauri:
```bash
just setup
```

All `just` recipes assume you have already run `direnv allow` in this repo.

## Development

To run the app in development mode:

```bash
direnv allow
just dev
```

This will start the Vite dev server and launch the Tauri app.

## Build

- TBD

## Release

- TBD

## Contributing

Code checked into the repo must be linted and formatted:

### Frontend
- `just lint` - Run ESLint and auto-fix issues
- `just lint-check` - Check for linting issues without fixing
- `just test` - Run the Vitest test suite

### Rust (run from `src-tauri/`)
- `cargo fmt` - Auto-format code
- `cargo fmt-check` - Check code formatting
- `cargo lint` - Run clippy (warnings treated as errors)
- `cargo test` - Run tests
