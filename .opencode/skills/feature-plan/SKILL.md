---
name: feature-plan
description: Template for Assemblo feature specification documents
license: MIT
compatibility: opencode
metadata:
  audience: developers
  purpose: planning
---

## Required Spec Sections

1. **Goal** — What does this feature do? 1-2 sentences. What problem does it solve for the learner?

2. **Affected Modules** — Which `src/assemblo/*.ts` files change. Reference the dependency map:
   - `tokens.ts` → new function/register/memory/list constants?
   - `argument.ts` → new argument type?
   - `{registers,memory,lists,labels}.ts` → new internals?
   - `operation.ts` → new operation shape?
   - `parser.ts` → new parsing logic?
   - `evaluator.ts` → new instruction function? New eval state?
   - `program.ts` → new lifecycle method? Status changes?
   - `index.ts` → new exports?
   - UI files → new display elements?
   - Test files → new test suites?

3. **New Interfaces/Types** — Any new types, interfaces, or changes to existing ones. Include full TypeScript definitions.

4. **Data Flow** — How data moves through the pipeline:
   ```
   Source code (string) → Parser.parse() → IOperation[] → Evaluator.tick() → Registers/Memory/Lists/Logger
   ```
   Where does the new feature hook in?

5. **State Machine Impact** — Any new `status` values or transitions beyond:
   ```
   READY → PARSING → PARSED → RUNNING → FINISHED
   ```

6. **Test Strategy** — Which test files need updates:
   - `parser.test.ts` — new parsing test cases
   - `evaluator.test.ts` — new instruction evaluation tests
   - `program.test.ts` — new lifecycle tests
   - `integration.test.ts` — new end-to-end test
   - `debug-parity.test.ts` — new parity test
   - New fixtures in `src/tests/fixtures/`?

7. **Documentation Updates** — Which `src/ui/docs/` files need changes:
   - `assemblo.ts` — overview / landing doc
   - `instructions.ts` — new instruction structure
   - `instructions-set.ts` — new instruction definition (name + HTML description)
   - `arguments.ts` — new argument type docs
   - `registers.ts` — new register docs
   - `memory.ts` — new memory docs
   - `lists.ts` — new list docs
   - `errors.ts` — new error type docs
   - Every feature MUST include documentation updates. No feature is complete without docs.

8. **UI Changes** — Any changes to:
   - `src/ui/coder/` — editor, output, controls
   - `src/ui/challenges/` — new challenges

9. **Migration Path** — Backward compatible? Any breaking changes to existing programs or challenges?
