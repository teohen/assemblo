import test, { describe, it } from "node:test";
import assert from "node:assert";
import Parser from "../src/parser.mjs";
import tokens from "../src/tokens.mjs";


describe("parser suite", () => {
  function testOperation(op, expLine, expType, expArgsLen, expFuncName) {
    assert.equal(op.line, expLine);
    assert.equal(op.type, expType);
    assert.equal(op.args.length, expArgsLen);
    assert.equal(op.funcName, expFuncName);
  }

  function testArgument(arg, expType, expLabel) {
    assert.equal(arg.type, expType);
    assert.equal(arg.literal, expLabel);
  }

  describe("SUCCESS INSTRUCTIONS", () => {
    it("should parse the POP instructions", () => {
      const tests = [
        { in: `POP: r0, INPUT`, expArg1Lit: "r0" },
        { in: `POP: r1, INPUT`, expArg1Lit: "r1" },
        { in: `POP: r2, INPUT`, expArg1Lit: "r2" },
      ]

      for (const t of tests) {
        const p = new Parser();
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);
        const op = operations[0]

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.POP);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.REG, t.expArg1Lit);

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.LIST, "INPUT");
      }
    });

    it("should parse the PUSH instructions", () => {
      const tests = [
        { in: `PUSH: OUTPUT, r0`, expArg2Lit: "r0" },
        { in: `PUSH: OUTPUT, r1`, expArg2Lit: "r1" },
        { in: `PUSH: OUTPUT, r2`, expArg2Lit: "r2" },
      ];

      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);
        const op = operations[0]

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.PUSH);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.LIST, "OUTPUT");

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.REG, t.expArg2Lit);
      }
    });

    it("should parse the CPY instructions", () => {
      const tests = [
        { in: `CPY: mx0, r0`, expArg1Lit: "mx0", expArg2Lit: "r0" },
        { in: `CPY: mx1, r0`, expArg1Lit: "mx1", expArg2Lit: "r0" },
        { in: `CPY: mx2, r0`, expArg1Lit: "mx2", expArg2Lit: "r0" },
        { in: `CPY: mx0, r1`, expArg1Lit: "mx0", expArg2Lit: "r1" },
        { in: `CPY: mx1, r1`, expArg1Lit: "mx1", expArg2Lit: "r1" },
        { in: `CPY: mx2, r1`, expArg1Lit: "mx2", expArg2Lit: "r1" },
        { in: `CPY: mx0, r2`, expArg1Lit: "mx0", expArg2Lit: "r2" },
        { in: `CPY: mx1, r2`, expArg1Lit: "mx1", expArg2Lit: "r2" },
        { in: `CPY: mx2, r2`, expArg1Lit: "mx2", expArg2Lit: "r2" },
      ];



      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);
        const op = operations[0]

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.CPY);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.MEM, t.expArg1Lit);

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.REG, t.expArg2Lit);
      }
    });

    it("should parse the JMP instructions", () => {
      const tests = [
        { in: "JMP_N: 7, r0", fn: tokens.FUNCTIONS.JMP_N, arg2Lit: "r0" },
        { in: "JMP_N: 7, r1", fn: tokens.FUNCTIONS.JMP_N, arg2Lit: "r1" },
        { in: "JMP_N: 7, r2", fn: tokens.FUNCTIONS.JMP_N, arg2Lit: "r2" },
        { in: "JMP_P: 7, r0", fn: tokens.FUNCTIONS.JMP_P, arg2Lit: "r0" },
        { in: "JMP_P: 7, r1", fn: tokens.FUNCTIONS.JMP_P, arg2Lit: "r1" },
        { in: "JMP_P: 7, r2", fn: tokens.FUNCTIONS.JMP_P, arg2Lit: "r2" },
        { in: "JMP_Z: 7, r0", fn: tokens.FUNCTIONS.JMP_Z, arg2Lit: "r0" },
        { in: "JMP_Z: 7, r1", fn: tokens.FUNCTIONS.JMP_Z, arg2Lit: "r1" },
        { in: "JMP_Z: 7, r2", fn: tokens.FUNCTIONS.JMP_Z, arg2Lit: "r2" },
        { in: "JMP_U: 7, r0", fn: tokens.FUNCTIONS.JMP_U, arg2Lit: "r0" },
        { in: "JMP_U: 7, r1", fn: tokens.FUNCTIONS.JMP_U, arg2Lit: "r1" },
        { in: "JMP_U: 7, r2", fn: tokens.FUNCTIONS.JMP_U, arg2Lit: "r2" },
      ];


      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);

        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.FLOW, 2, t.fn);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.NUM, 7);

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.REG, t.arg2Lit);
      }
    });

    it("should parse the ADD instructions", () => {
      const tests = [
        { in: "ADD: r0, r0", arg1Lit: "r0", arg2Lit: "r0" },
        { in: "ADD: r0, r1", arg1Lit: "r0", arg2Lit: "r1" },
        { in: "ADD: r0, r2", arg1Lit: "r0", arg2Lit: "r2" },
        { in: "ADD: r1, r0", arg1Lit: "r1", arg2Lit: "r0" },
        { in: "ADD: r1, r1", arg1Lit: "r1", arg2Lit: "r1" },
        { in: "ADD: r1, r2", arg1Lit: "r1", arg2Lit: "r2" },
        { in: "ADD: r2, r0", arg1Lit: "r2", arg2Lit: "r0" },
        { in: "ADD: r2, r1", arg1Lit: "r2", arg2Lit: "r1" },
        { in: "ADD: r2, r2", arg1Lit: "r2", arg2Lit: "r2" },
      ];



      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);
        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.ADD);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.REG, t.arg1Lit);

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.REG, t.arg2Lit);
      }
    });

    it("should parse the LOAD instructions", () => {
      const tests = [
        { in: `LOAD: r0, mx0`, expArg1Lit: "r0", expArg2Lit: "mx0" },
        { in: `LOAD: r0, mx1`, expArg1Lit: "r0", expArg2Lit: "mx1" },
        { in: `LOAD: r0, mx2`, expArg1Lit: "r0", expArg2Lit: "mx2" },
        { in: `LOAD: r1, mx0`, expArg1Lit: "r1", expArg2Lit: "mx0" },
        { in: `LOAD: r1, mx1`, expArg1Lit: "r1", expArg2Lit: "mx1" },
        { in: `LOAD: r1, mx2`, expArg1Lit: "r1", expArg2Lit: "mx2" },
        { in: `LOAD: r2, mx0`, expArg1Lit: "r2", expArg2Lit: "mx0" },
        { in: `LOAD: r2, mx1`, expArg1Lit: "r2", expArg2Lit: "mx1" },
        { in: `LOAD: r2, mx2`, expArg1Lit: "r2", expArg2Lit: "mx2" },
      ];



      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);
        const op = operations[0]

        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.LOAD);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.REG, t.expArg1Lit);

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.MEM, t.expArg2Lit);
      }
    });

    it("should parse the SUB instructions", () => {
      const tests = [
        { in: "SUB: r0, r0", arg1Lit: "r0", arg2Lit: "r0" },
        { in: "SUB: r0, r1", arg1Lit: "r0", arg2Lit: "r1" },
        { in: "SUB: r0, r2", arg1Lit: "r0", arg2Lit: "r2" },
        { in: "SUB: r1, r0", arg1Lit: "r1", arg2Lit: "r0" },
        { in: "SUB: r1, r1", arg1Lit: "r1", arg2Lit: "r1" },
        { in: "SUB: r1, r2", arg1Lit: "r1", arg2Lit: "r2" },
        { in: "SUB: r2, r0", arg1Lit: "r2", arg2Lit: "r0" },
        { in: "SUB: r2, r1", arg1Lit: "r2", arg2Lit: "r1" },
        { in: "SUB: r2, r2", arg1Lit: "r2", arg2Lit: "r2" },
      ];

      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);

        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.PROC, 2, tokens.FUNCTIONS.SUB);

        const arg1 = op.args[0];
        testArgument(arg1, tokens.ARG_TYPES.REG, t.arg1Lit);

        const arg2 = op.args[1];
        testArgument(arg2, tokens.ARG_TYPES.REG, t.arg2Lit);
      }
    });

    it("should parse the START instructions", () => {
      const tests = [
        { in: "START"},
      ];

      for (const t of tests) {
        const p = new Parser(t.in);
        const operations = p.parse(t.in)

        assert.equal(operations.length, 1);

        const op = p.operations[0];
        testOperation(op, 1, tokens.FUNCTION_TYPES.FLOW, 0, tokens.FUNCTIONS.START);
      }
    });

  });

  describe("ERROR INSTRUCTIONS", () => {
    it("should throw error if unknow instruction", () => {
      const tests = [
        { in: "CARRY: r0, mx0", exp: "CARRY"},
        { in: "MOV: r0, mx0", exp: "MOV"},
        { in: "JMP: r0, mx0", exp: "JMP"},
      ];

      for (const t of tests) {
        const p = new Parser(t.in);
        try {
          p.parse(t.in)
        }catch(err) {
          assert.equal(err.message, `AT LINE: 1. UNKNOWN INSTRUCTION: ${t.exp}`);
        }
      }
    });

    it("should throw error if unknown argument", () => {
      const tests = [
        { in: "LOAD: r3, mx0", arg: "r3"},
        { in: "POP: r0, INPUTT", arg: "INPUTT"},
        { in: "JMP_N: 1.2, r0", arg: "1.2"},
      ];

      let errMsg = ''

      for (const t of tests) {
        const p = new Parser(t.in);
        try {
          p.parse(t.in)
        }catch(err) {
          errMsg = err.message
        }

        assert.equal(errMsg, `AT LINE: 1. UNKNOWN ARGUMENT: ${t.arg}`);
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


      let errMsg = ''

      for (const t of tests) {
        const p = new Parser(t.in);
        try {
          p.parse(t.in)
        }catch(err) {
          errMsg = err.message
        }

        assert.equal(errMsg, `AT LINE: 1. (${t.fName}) GOT WRONG NUMBER OF ARGUMENTS: ${t.expN}`,);
      }
    });
  });
});
