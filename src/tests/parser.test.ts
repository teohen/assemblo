import assert


import Argument from "../assemblo/argument.js";
import Operation from "../assemblo/operation.js";
import Program from "../assemblo/program.js";



// Define test types
interface TestCase {
  in: string;
  expArg1?: Argument;
  expAgr2?: Argument;
  expFuncName?: string;
  fn?: string;
}

interface OperationTest {
  line: number;
  type: string;
  argsLength: number;
  funcName: string;
}

interface ArgumentTest {
  type: string;
  literal: string | number;
  intern: string | number;
}

describe("parser suite", () => {
  function testOperation(op: Operation, expLine: number, expType: string, expArgsLen: number, expFuncName: string): void {
    assert.equal(op.line, expLine);
    assert.equal(op.type, expType);
    assert.equal(op.args.length, expArgsLen);
    assert.equal(op.funcName, expFuncName);
  }

  function testArgument(arg: Argument, expArg: ArgumentTest): void {
    assert.equal(arg.type, expArg.type);
    assert.equal(arg.literal, expArg.literal);
    assert.equal(arg.intern, expArg.intern);
  }

  describe("SUCCESS INSTRUCTIONS", () => {
    it("should parse the POP instructions", () => {
      const tests: TestCase[] = [
        {
          in: `POP: r0, INPUT`,
          expArg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.LIST, "INPUT", tokens.LISTS.INPUT)
        },
        {
          in: `POP: r1, INPUT`,
          expArg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.LIST, "INPUT", tokens.LISTS.INPUT)
        },
        {
          in: `POP: r2, INPUT`,
          expArg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.LIST, "INPUT", tokens.LISTS.INPUT)
        }
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);
        const op = operations[0];

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.POP);

        const arg1 = op.args[0];
        testArgument(arg1, t.expArg1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expAgr2!);
      }
    });

    it("should parse the PUSH instructions", () => {
      const tests: TestCase[] = [
        {
          in: `PUSH: OUTPUT, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          expArg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          in: `PUSH: OUTPUT, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          expArg2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          in: `PUSH: OUTPUT, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          expArg2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          in: `PUSH: OUTPUT, -1`,
          expAgr1: new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          expArg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1)
        },
        {
          in: `PUSH: OUTPUT, 0`,
          expAgr1: new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          expArg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0)
        },
        {
          in: `PUSH: OUTPUT, 1`,
          expAgr1: new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          expArg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        }
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);
        const op = operations[0];

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.PUSH);

        const arg1 = op.args[0];
        testArgument(arg1, t.expAgr1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expArg2!);
      }
    });

    it("should parse the CPY instructions", () => {
      const tests: TestCase[] = [
        {
          in: `CPY: mx0, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          in: `CPY: mx1, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          in: `CPY: mx2, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          in: `CPY: mx0, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          in: `CPY: mx1, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          in: `CPY: mx2, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          in: `CPY: mx0, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          in: `CPY: mx1, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          in: `CPY: mx2, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          in: `CPY: mx0, -1`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1)
        },
        {
          in: `CPY: mx1, 0`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "0", 0)
        },
        {
          in: `CPY: mx2, 1`,
          expArg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        }
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);
        const op = operations[0];

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.CPY);

        const arg1 = op.args[0];
        testArgument(arg1, t.expArg1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expAgr2!);
      }
    });

    it("should parse the JMP instructions", () => {
      const tests: TestCase[] = [
        {
          in: `JMP_N: 7, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          fn: "jmpNegFn"
        },
        {
          in: `JMP_N: 7, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          fn: "jmpNegFn"
        },
        {
          in: `JMP_N: 7, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          fn: "jmpNegFn"
        },
        {
          in: `JMP_P: 7, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          fn: "jmpPosFn"
        },
        {
          in: `JMP_P: 7, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          fn: "jmpPosFn"
        },
        {
          in: `JMP_P: 7, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          fn: "jmpPosFn"
        },
        {
          in: `JMP_Z: 7, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          fn: "jmpZeroFn"
        },
        {
          in: `JMP_Z: 7, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          fn: "jmpZeroFn"
        },
        {
          in: `JMP_Z: 7, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          fn: "jmpZeroFn"
        },
        {
          in: `JMP_U: 7, r0`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          fn: "jmpUndFn"
        },
        {
          in: `JMP_U: 7, r1`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          fn: "jmpUndFn"
        },
        {
          in: `JMP_U: 7, r2`,
          expArg1: new Argument(tokens.ARG_TYPES.NUM, "7", 7),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          fn: "jmpUndFn"
        },
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);

        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.FLOW, 2, t.fn!);

        const arg1 = op.args[0];
        testArgument(arg1, t.expArg1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expAgr2!);
      }
    });

    it("should parse the ADD instructions", () => {
      const tests: TestCase[] = [
        {
          in: `ADD: r0, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          in: `ADD: r0, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        },
        {
          in: `ADD: r0, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
        },
        {
          in: `ADD: r1, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          in: `ADD: r1, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        },
        {
          in: `ADD: r1, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
        },
        {
          in: `ADD: r2, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          in: `ADD: r2, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        },
        {
          in: `ADD: r2, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
        },
        {
          in: `ADD: r0, -1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1),
        },
        {
          in: `ADD: r0, 0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "0", 0),
        },
        {
          in: `ADD: r0, 1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "1", 1),
        },
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);
        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.ADD);

        const arg1 = op.args[0];
        testArgument(arg1, t.expAgr1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expAgr2!);
      }
    });

    it("should parse the LOAD instructions", () => {
      const tests: TestCase[] = [
        {
          in: `LOAD: r0, mx0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
        },
        {
          in: `LOAD: r0, mx1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
        },
        {
          in: `LOAD: r0, mx2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
        },
        {
          in: `LOAD: r1, mx0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
        },
        {
          in: `LOAD: r1, mx1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
        },
        {
          in: `LOAD: r1, mx2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
        },
        {
          in: `LOAD: r2, mx0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0),
        },
        {
          in: `LOAD: r2, mx1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1),
        },
        {
          in: `LOAD: r2, mx2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx2),
        },
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);
        const op = operations[0];

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.LOAD);

        const arg1 = op.args[0];
        testArgument(arg1, t.expAgr1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expAgr2!);
      }
    });

    it("should parse the SUB instructions", () => {
      const tests: TestCase[] = [
        {
          in: `SUB: r0, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          in: `SUB: r0, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        },
        {
          in: `SUB: r0, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
        },
        {
          in: `SUB: r1, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          in: `SUB: r1, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        },
        {
          in: `SUB: r1, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
        },
        {
          in: `SUB: r2, r0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          in: `SUB: r2, r1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        },
        {
          in: `SUB: r2, r2`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          expAgr2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
        },
        {
          in: `SUB: r0, -1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1),
        },
        {
          in: `SUB: r0, 0`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "0", 0),
        },
        {
          in: `SUB: r0, 1`,
          expAgr1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          expAgr2: new Argument(tokens.ARG_TYPES.NUM, "1", 1),
        },
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);
        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.SUB);

        const arg1 = op.args[0];
        testArgument(arg1, t.expAgr1!);

        const arg2 = op.args[1];
        testArgument(arg2, t.expAgr2!);
      }
    });

    it("should parse the START instructions", () => {
      const tests: TestCase[] = [
        { in: "START" },
      ];

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in);

        assert.equal(operations.length, 1);

        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.FLOW, 0, tokens.FUNCTIONS.START);
      }
    });
  });

  describe("ERROR INSTRUCTIONS", () => {
    it("should throw error if unknown instruction", () => {
      const tests: Array<{in: string, exp: string}> = [
        { in: "CARRY: r0, mx0", exp: "CARRY" },
        { in: "MOV: r0, mx0", exp: "MOV" },
        { in: "JMP: r0, mx0", exp: "JMP" },
      ];

      for (const t of tests) {
        const p = new Parser();
        try {
          p.parse(t.in);
        } catch (err) {
          const error = err as Error;
          assert.equal(error.message, `AT LINE: 1. UNKNOWN INSTRUCTION: ${t.exp}`);
        }
      }
    });

    it("should throw error if unknown argument", () => {
      const tests: Array<{in: string, arg: string}> = [
        { in: "LOAD: r3, mx0", arg: "r3" },
        { in: "POP: r0, INPUTT", arg: "INPUTT" },
        { in: "JMP_N: 1.2, r0", arg: "1.2" },
      ];

      let errMsg = '';

      for (const t of tests) {
        const p = new Parser();
        try {
          p.parse(t.in);
        } catch (err) {
          const error = err as Error;
          errMsg = error.message;
        }

        assert.equal(errMsg, `AT LINE: 1. UNKNOWN ARGUMENT: ${t.arg}`);
      }
    });

    it("should throw error if wrong number of arguments", () => {
      const tests: Array<{in: string, fName: string, expN: number}> = [
        { in: "POP: r0, INPUT, r1", fName: "POP", expN: 3 },
        { in: "CPY: mx0", fName: "CPY", expN: 1 },
        { in: "LOAD: mx0", fName: "LOAD", expN: 1 },
        { in: "JMP_N: 7", fName: "JMP_N", expN: 1 },
        { in: "ADD: r1", fName: "ADD", expN: 1 },
        { in: "PUSH: OUTPUT", fName: "PUSH", expN: 1 },
      ];

      let errMsg = '';

      for (const t of tests) {
        const p = new Parser();
        try {
          p.parse(t.in);
        } catch (err) {
          const error = err as Error;
          errMsg = error.message;
        }

        assert.equal(errMsg, `AT LINE: 1. (${t.fName}) GOT WRONG NUMBER OF ARGUMENTS: ${t.expN}`);
      }
    });
  });
});