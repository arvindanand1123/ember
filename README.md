# phorgePDF
Adobe pdf software sucks. All I want to do is view a pdf, add some text to it, and add signatures - all while using a non-clunky and choppy app. This is why I built phorgePDF - a lightweight pdf editor.

## Prerequisites

Before installing phorgePDF, ensure you have the following installed:

- **Node.js** (20 or higher) - [Download here](https://nodejs.org/)
- **pnpm** - Install with: `npm install -g pnpm`
- **Rust** (latest stable)

## Installation

- Install dependencies:
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

- `pnpm lint` - Run ESLint and auto-fix issues
- `pnpm lint:check` - Check for linting issues without fixing
- TBD for rust
