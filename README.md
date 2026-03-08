# Ember
[Charter](https://www.notion.so/Charter-2d98e8006a5080afa056c6cfe124c97c?source=copy_link)

## Prerequisites

Before installing Ember, ensure you have the following installed:

- **direnv** - Install from [direnv.net](https://direnv.net/)
- **nvm** - Install from [nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- **Node.js** 22 (loaded automatically by `direnv`)
- **pnpm** - Install with: `npm install -g pnpm`
- **Rust** (latest stable)

## Installation

Allow the repo environment and switch to Node 22:

```bash
direnv allow
```

Install dependencies:
```bash
pnpm install
```
## Development

To run the app in development mode:

```bash
direnv allow
pnpm tauri dev
```

This will start the Vite dev server and launch the Tauri app.

## Build

- TBD

## Release

- TBD

## Contributing

Code checked into the repo must be linted and formatted:

### Frontend
- `pnpm lint` - Run ESLint and auto-fix issues
- `pnpm lint:check` - Check for linting issues without fixing

### Rust (run from `src-tauri/`)
- `cargo fmt` - Auto-format code
- `cargo fmt-check` - Check code formatting
- `cargo lint` - Run clippy (warnings treated as errors)
- `cargo test` - Run tests
