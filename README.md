# Ember
[Charter](https://www.notion.so/Charter-2d98e8006a5080afa056c6cfe124c97c?source=copy_link)

## Prerequisites

Before installing Ember, ensure you have the following installed:

- **Node.js** (20 or higher)
- **pnpm** - Install with: `npm install -g pnpm`
- **Rust** (latest stable)

## Installation

Install dependencies:
```bash
pnpm install
```
## Development

To run the app in development mode:

```bash
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
