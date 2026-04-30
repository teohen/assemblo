---
name: arch-guide
description: Assemblo project architecture reference for planning and implementation
license: MIT
compatibility: opencode
metadata:
  audience: developers
  purpose: reference
---

## Module Dependency Map

```
tokens.ts (zero deps)
  → argument.ts (types for all arg variants)
    → registers.ts (IMap: r0, r1, r2)
    → memory.ts   (IMap: mx0, mx1, mx2)
    → lists.ts    (IListInput/IListOutput: INPUT, OUTPUT)
    → labels.ts   (IMap: label → line)
    → operation.ts (IOperation: line, funcName, args[])
      → parser.ts   (source code → IOperation[])
        → evaluator.ts (IOperation[] → mutate state, return next line)
          → program.ts (orchestrates parser + evaluator + lifecycle)
            → index.ts (barrel exports)
```

## Key Patterns

- **No classes** — Pure functions + object literals + closures
- **Factory pattern** — Every module exports `Module.new*()` that returns an interface
- **Discriminated union** — `IArgument.type ∈ {MEM, REG, LST, NUM, LBL, CND}`
- **IMap interface** — Shared by registers, memory, labels:
  ```typescript
  interface IMap {
    map: Map<string, number>
    get: (key: string) => number
    set: (key: string, value: number) => void
  }
  ```
- **State machine** — `READY → PARSING → PARSED → RUNNING → FINISHED`
- **Logger** — `{ type: 'error' | 'message' | 'success', value: string | number, ln: number }`

## Code Conventions

| Rule | Standard |
|------|----------|
| Semicolons | None (ASI) |
| Quotes | Single |
| Indent | 2 spaces |
| Unused params | Prefix with `_` |
| Explicit `any` | Warning only |

## Test Patterns

| File | Focus | Pattern |
|------|-------|---------|
| `parser.test.ts` | 14 instruction parsing tests | Table-driven: `TestCase[]`, iterate, `expect().toEqual()` |
| `evaluator.test.ts` | 9 instruction eval tests | Table-driven + `chance` randomization |
| `program.test.ts` | 8 lifecycle tests | `spyOn` + `mockImplementation`, `done()` callback |
| `integration.test.ts` | 1 end-to-end nested loop | Real code → final state assertion |
| `debug-parity.test.ts` | 6 run-vs-debug parity | `snapshot()` + `compareSnapshots()` |

- Fixtures in `src/tests/fixtures/`: `argument.ts`, `operation.ts`, `evaluator.ts`, `maps.ts`
- Async tests use `done()` callback (not async/await)

## Commands

```
bun run lint    → ESLint check
bun run types   → tsc --noEmit
bun run test    → bun test --inspect --coverage
bun run testnc  → bun test --inspect (no coverage)
bun run build   → bun build ./src/**/*.html --outdir ./dist
bun run prod    → lint → types → build
```

## UI Structure

```
src/ui/
  index.html + script.ts       → Home page: challenge list + theme toggle
  coder.html + script.ts + ui.ts + codemirror.ts → Main IDE
  docs.html + script.ts + ui.ts + *.ts pages      → Documentation viewer
  challenges/challenges.ts    → Challenge definitions
```
