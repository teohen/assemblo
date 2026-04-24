# AGENTS.md

## Project Overview

**Assemblo** is a pseudo-Assembly language platform for learning computer architecture and low-level logic fundamentals.

## Tech Stack

- **Runtime**: Bun (Node.js compatible, requires Node >=20.0.0)
- **Language**: TypeScript
- **Linting**: ESLint with typescript-eslint
- **Testing**: Bun test with --inspect --coverage
- **Build**: Bun build outputs to `./dist`

## Commands

| Command | Description |
|---------|-------------|
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Run ESLint with auto-fix |
| `bun run types` | TypeScript type check (`tsc --noEmit`) |
| `bun run build` | Build to `./dist` |
| `bun run test` | Run tests with coverage |
| `bun run testnc` | Run tests without coverage |
| `bun run prod` | Full pipeline: lint → types → build |

## Code Conventions

- **Semicolons**: None ( ASI )
- **Quotes**: Single quotes
- **Indentation**: 2 spaces
- **Unused**: Prefix with `_` (args, vars, caught errors)
- **Explicit any**: Warning only

## Directories

```
src/          Source code
dist/         Build output (generated)
tests/        Test files
specs/        Specification files
node_modules/ Dependencies
```

## Agent Behavior

### Default Configuration

- Activate **caveman** skill on every response (ultra-compressed mode)
- This agent runs as caveman by default

After every implementation, run these scripts automatically:
- `bun run lint` - ESLint check
- `bun run types` - TypeScript type check
- `bun run test` - Run tests with coverage
- `bun run build` - Builds the project

All must pass before considering implementation complete.

## Important Notes

- All build output goes to `dist/` (ignored in git)
- Tests use Bun's built-in test runner
- ESLint ignores: `dist/**`, `node_modules/**`, `bin/**`