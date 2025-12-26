import { describe, it, expect } from 'bun:test';

import * as ASM from '../assemblo'
import { newLabelArgument, newListArgument, newMemoryArgument, newNumberArgument, newRegisterArgument } from './fixtures/argument';

interface TestCase {
  input: string;
  exp: ASM.Operation;
}

describe('Parser suite', () => {
  describe('Success operations', () => {
    it('parse the POP operation', () => {
      const tests: TestCase[] = [
        {
          input: `POP: r0, INPUT`,
          exp: new ASM.Operation(
            1,
            "popFn",
            [
              newRegisterArgument("r0"),
              newListArgument("INPUT")
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the PUSH operation', () => {
      const tests: TestCase[] = [
        {
          input: `PUSH: OUTPUT, r0`,
          exp: new ASM.Operation(
            1,
            "pushFn",
            [
              newListArgument("OUTPUT"),
              newRegisterArgument("r0"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
        {
          input: `PUSH: OUTPUT, 1`,
          exp: new ASM.Operation(
            1,
            "pushFn",
            [
              newListArgument("OUTPUT"),
              newNumberArgument("1"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the JMP operations', () => {
      const tests: TestCase[] = [
        {
          input: `JMP_N: .end, r0`,
          exp: {
            args: [
              newLabelArgument(".end"),
              newRegisterArgument("r0")
            ],
            funcName: "jmpNegFn",
            line: 1,
            type: ASM.tokens.FUNCTION_TYPES.FLOW
          },
        },
        {
          input: `JMP_P: .end, r0`,
          exp: {
            args: [
              newLabelArgument(".end"),
              newRegisterArgument("r0")
            ],
            funcName: "jmpPosFn",
            line: 1,
            type: ASM.tokens.FUNCTION_TYPES.FLOW
          },
        },
        {
          input: `JMP_Z: .end, r0`,
          exp: {
            args: [
              newLabelArgument(".end"),
              newRegisterArgument("r0")
            ],
            funcName: "jmpZeroFn",
            line: 1,
            type: ASM.tokens.FUNCTION_TYPES.FLOW
          },
        },
        {
          input: `JMP_U: .end, r0`,
          exp: {
            args: [
              newLabelArgument(".end"),
              newRegisterArgument("r0")
            ],
            funcName: "jmpUndFn",
            line: 1,
            type: ASM.tokens.FUNCTION_TYPES.FLOW
          },
        }
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the CPY operations', () => {
      const tests: TestCase[] = [
        {
          input: `CPY: mx0, r0`,
          exp: new ASM.Operation(
            1,
            "cpyFn",
            [
              newMemoryArgument("mx0"),
              newRegisterArgument("r0")
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
        {
          input: `CPY: mx0, 2`,
          exp: new ASM.Operation(
            1,
            "cpyFn",
            [
              newMemoryArgument("mx0"),
              newNumberArgument("2")
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the LOAD operations', () => {
      const tests: TestCase[] = [
        {
          input: `LOAD: r0, mx0`,
          exp: new ASM.Operation(
            1,
            "loadFn",
            [
              newRegisterArgument("r0"),
              newMemoryArgument("mx0"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        }
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the ADD operation', () => {
      const tests: TestCase[] = [
        {
          input: `ADD: r0, r0`,
          exp: new ASM.Operation(
            1,
            "addFn",
            [
              newRegisterArgument("r0"),
              newRegisterArgument("r0"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
        {
          input: `ADD: r0, 1`,
          exp: new ASM.Operation(
            1,
            "addFn",
            [
              newRegisterArgument("r0"),
              newNumberArgument("1"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the SUB operation', () => {
      const tests: TestCase[] = [
        {
          input: `SUB: r0, r0`,
          exp: new ASM.Operation(
            1,
            "subFn",
            [
              newRegisterArgument("r0"),
              newRegisterArgument("r0"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
        {
          input: `SUB: r0, 1`,
          exp: new ASM.Operation(
            1,
            "subFn",
            [
              newRegisterArgument("r0"),
              newNumberArgument("1"),
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        },
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
        expect(op.args[1]).toEqual(t.exp.args[1]);
      }
    });

    it('parse the LBL operation', () => {
      const tests: TestCase[] = [
        {
          input: `LBL: .mult`,
          exp: new ASM.Operation(
            1,
            "labelFn",
            [
              newLabelArgument(".mult")
            ],
            ASM.tokens.FUNCTION_TYPES.PROC
          )
        }
      ];

      for (const t of tests) {
        const p = new ASM.Parser();
        const operations = p.parse(t.input);

        expect(operations.length).toBe(1);

        const op = p.operations[0];
        expect(op).toEqual(t.exp)

        expect(op.args[0]).toEqual(t.exp.args[0]);
      }
    });
  });

  describe('Error operations', () => {
    it("should throw error if unknown argument", () => {
      const tests = [
        {
          input: "LOAD: r3, mx0",
          exp: "r3"
        },
        {
          input: "POP: r0, INPUTT",
          exp: "INPUTT"
        },
        {
          input: "JMP_N: 1.2, r0",
          exp: "1.2"
        },
      ];

      let errMsg = '';

      for (const t of tests) {
        const p = new ASM.Parser();
        try {
          p.parse(t.input);
        } catch (err) {
          const error = err as Error;
          errMsg = error.message;
        }

        expect(errMsg).toBe(`AT LINE: 1. UNKNOWN ARGUMENT: ${t.exp}`);
      }
    });

    it("should throw error if wrong number of arguments", () => {
      const tests = [
        { in: "POP: r0, INPUT, r1", fName: "POP", expN: 3 },
        { in: "CPY: mx0", fName: "CPY", expN: 1 },
        { in: "LOAD: mx0", fName: "LOAD", expN: 1 },
        { in: "JMP_N: 7", fName: "JMP_N", expN: 1 },
        { in: "ADD: r1", fName: "ADD", expN: 1 },
        { in: "PUSH: OUTPUT", fName: "PUSH", expN: 1 },
      ];

      let errMsg = '';

      for (const t of tests) {
        const p = new ASM.Parser();
        try {
          p.parse(t.in);
        } catch (err) {
          const error = err as Error;
          errMsg = error.message;
        }

        expect(errMsg).toBe(`AT LINE: 1. (${t.fName}) GOT WRONG NUMBER OF ARGUMENTS: ${t.expN}`);
      }
    });
  });
});