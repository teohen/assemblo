import test, { describe, it } from "node:test";
import assert from "node:assert";
import Evaluator from "../src/evaluator.mjs";
import Operation from "../src/operation.mjs";
import tokens from "../src/tokens.mjs";
import Argument from "../src/argument.mjs";
import Chance from "chance";

const chance = new Chance();

describe("Evaluator suite", () => {
  describe("SUCCESS", () => {

    it(" should evaluate the POP operation", () => {
      const tests = [
        { in: "r0" },
        { in: "r1" },
        { in: "r2" },
      ]

      for (let t of tests) {
        const expRegisterValue = chance.integer({ min: 0 });

        const input = [expRegisterValue];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.in], undefined);
        const memory = new Map();
        const line = 1;
        const logger = [];



        const args = [
          new Argument(tokens.ARG_TYPES.REG, t.in, tokens.REGISTERS[t.in]),
          new Argument(tokens.ARG_TYPES.LIST, "INPUT", tokens.ARG_TYPES.LIST),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.POP, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(registers.get(tokens.REGISTERS[t.in]), expRegisterValue);
        assert.equal(newLine, line)
        assert.equal(input.length, 0);
      }
    });

    it(" should evaluate the PUSH operation", () => {
      const tests = [{
        in: "r0",
        in: "r1",
        in: "r2",
      }]

      for (let t of tests) {


        const expRegisterValue = chance.integer({ min: 0 });

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.in], expRegisterValue);
        const memory = new Map();
        const line = 1;
        const logger = [];



        const args = [
          new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.ARG_TYPES.LIST),
          new Argument(tokens.ARG_TYPES.REG, t.in, tokens.REGISTERS[t.in]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.PUSH, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(registers.get(tokens.REGISTERS[t.in]), expRegisterValue);
        assert.equal(newLine, line)
        assert.equal(input.length, 0);
      }
    });

    it(" should evaluate the CPY operation", () => {
      const tests = [
        { a1: "mx0", a2: "r0" },
        { a1: "mx1", a2: "r0" },
        { a1: "mx2", a2: "r0" },
        { a1: "mx0", a2: "r1" },
        { a1: "mx1", a2: "r1" },
        { a1: "mx2", a2: "r1" },
        { a1: "mx0", a2: "r2" },
        { a1: "mx1", a2: "r2" },
        { a1: "mx2", a2: "r2" },
      ]

      for (let t of tests) {


        const expMemoryValue = chance.integer({ min: 0 });

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a2], expMemoryValue);
        const memory = new Map();
        memory.set(tokens.MEMORY[t.a1], undefined);
        const line = 1;
        const logger = [];



        const args = [
          new Argument(tokens.ARG_TYPES.MEM, t.a1, tokens.MEMORY[t.a1]),
          new Argument(tokens.ARG_TYPES.REG, t.a2, tokens.REGISTERS[t.a2]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.CPY, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(memory.get(tokens.MEMORY[t.a1]), expMemoryValue);
        assert.equal(registers.get(tokens.REGISTERS[t.a2]), expMemoryValue);
        assert.equal(newLine, line)
      }
    });

    it(" should evaluate the LOAD operation", () => {
      const tests = [
        { a1: "r0", a2: "mx0" },
        { a1: "r0", a2: "mx1" },
        { a1: "r0", a2: "mx2" },
        { a1: "r1", a2: "mx0" },
        { a1: "r1", a2: "mx1" },
        { a1: "r1", a2: "mx2" },
        { a1: "r2", a2: "mx0" },
        { a1: "r2", a2: "mx1" },
        { a1: "r2", a2: "mx2" },
      ]

      for (let t of tests) {
        const expRegisterValue = chance.integer({ min: 0 });

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], undefined);
        const memory = new Map();
        memory.set(tokens.MEMORY[t.a2], expRegisterValue);
        const line = 1;
        const logger = [];



        const args = [
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
          new Argument(tokens.ARG_TYPES.MEM, t.a2, tokens.MEMORY[t.a2]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.LOAD, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(memory.get(tokens.MEMORY[t.a2]), expRegisterValue);
        assert.equal(registers.get(tokens.REGISTERS[t.a1]), expRegisterValue);
        assert.equal(newLine, line)
      }
    });

    it(" should evaluate the ADD operation", () => {
      const tests = [
        { a1: "r0", a2: "r1" },
        { a1: "r0", a2: "r2" },
        { a1: "r1", a2: "r0" },
        { a1: "r1", a2: "r2" },
        { a1: "r2", a2: "r0" },
        { a1: "r2", a2: "r1" },
        { a1: "r2", a2: "r1" },
      ]

      for (let t of tests) {
        const reg1Value = chance.integer({ min: 0, max: 100 });
        const reg2Value = chance.integer({ min: 0, max: 100 });

        const expRegisterValue = reg1Value + reg2Value

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], reg1Value);
        registers.set(tokens.REGISTERS[t.a2], reg2Value);
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
          new Argument(tokens.ARG_TYPES.REG, t.a2, tokens.REGISTERS[t.a2]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.ADD, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(registers.get(tokens.REGISTERS[t.a1]), expRegisterValue);
        assert.equal(newLine, line)
      }
    });

    it(" should evaluate the SUB operation", () => {
      const tests = [
        { a1: "r0", a2: "r1" },
        { a1: "r0", a2: "r2" },
        { a1: "r1", a2: "r0" },
        { a1: "r1", a2: "r2" },
        { a1: "r2", a2: "r0" },
        { a1: "r2", a2: "r1" },
      ]

      for (let t of tests) {
        const reg1Value = chance.integer({ min: 0, max: 100 });
        const reg2Value = chance.integer({ min: 0, max: 100 });

        const expRegisterValue = reg1Value - reg2Value

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], reg1Value);
        registers.set(tokens.REGISTERS[t.a2], reg2Value);
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
          new Argument(tokens.ARG_TYPES.REG, t.a2, tokens.REGISTERS[t.a2]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.SUB, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(registers.get(tokens.REGISTERS[t.a1]), expRegisterValue);
        assert.equal(newLine, line)
      }
    });

    it("should evaluate the PRT operation", () => {
      const tests = [
        { a1: "r0" },
        { a1: "r1" },
        { a1: "r2" },
      ]

      for (let t of tests) {
        const expRegisterValue = chance.integer({ min: 0, max: 100 });

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], expRegisterValue);
        const memory = new Map();
        const line = chance.integer({ min: 0, max: 50 });
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
        ];

        const operations = [];
        operations[line - 1] = new Operation(line, tokens.FUNCTIONS.PRT, args, tokens.FUNCTION_TYPES.PROC)

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(newLine, line)
        assert.equal(logger.length, 1)
        assert.equal(logger[0].value, expRegisterValue)
        assert.equal(logger[0].type, 'message')
      }
    });

    it("should evaluate the JMP_N operation", () => {
      const tests = [
        { a1: "r0", regV: -1, expLine: 2 },
        { a1: "r0", regV: 1, expLine: 1 },
        { a1: "r1", regV: -1, expLine: 2 },
        { a1: "r1", regV: 1, expLine: 1 },
        { a1: "r2", regV: -1, expLine: 2 },
        { a1: "r2", regV: 1, expLine: 1 },
      ]

      for (let t of tests) {
        const expectedLineNumber = t.expLine;

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], t.regV);
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, 3, 3),
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_N, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line + 1, tokens.FUNCTIONS.PRT, [args[1]], tokens.FUNCTION_TYPES.PROC),
          new Operation(line + 2, tokens.FUNCTIONS.END, args, tokens.FUNCTION_TYPES.FLOW)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(newLine, expectedLineNumber)
      }
    });

    it(" should evaluate the JMP_P operation", () => {
      const tests = [
        { a1: "r0", regV: -1, expLine: 1 },
        { a1: "r0", regV: 1, expLine: 2 },
        { a1: "r1", regV: -1, expLine: 1 },
        { a1: "r1", regV: 1, expLine: 2 },
        { a1: "r2", regV: -1, expLine: 1 },
        { a1: "r2", regV: 1, expLine: 2 },
      ]

      for (let t of tests) {
        const expectedLineNumber = t.expLine;

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], t.regV);
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, 3, 3),
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_P, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line + 1, tokens.FUNCTIONS.PRT, [args[1]], tokens.FUNCTION_TYPES.PROC),
          new Operation(line + 1, tokens.FUNCTIONS.END, args, tokens.FUNCTION_TYPES.FLOW)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(newLine, expectedLineNumber)
      }
    });

    it(" should evaluate the JMP_Z operation", () => {
      const tests = [
        { a1: "r0", regV: -1, expLine: 1 },
        { a1: "r0", regV: 0, expLine: 2 },
        { a1: "r1", regV: -1, expLine: 1 },
        { a1: "r1", regV: 0, expLine: 2 },
        { a1: "r2", regV: -1, expLine: 1 },
        { a1: "r2", regV: 0, expLine: 2 },
      ]

      for (let t of tests) {
        const expectedLineNumber = t.expLine;

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], t.regV);
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, 3, 3),
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_Z, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line + 1, tokens.FUNCTIONS.PRT, [args[1]], tokens.FUNCTION_TYPES.PROC),
          new Operation(line + 1, tokens.FUNCTIONS.END, args, tokens.FUNCTION_TYPES.FLOW)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(newLine, expectedLineNumber)
      }
    });

    it(" should evaluate the JMP_U operation", () => {
      const tests = [
        { a1: "r0", regV: -1, expLine: 1 },
        { a1: "r0", regV: undefined, expLine: 2 },
        { a1: "r1", regV: -1, expLine: 1 },
        { a1: "r1", regV: undefined, expLine: 2 },
        { a1: "r2", regV: -1, expLine: 1 },
        { a1: "r2", regV: undefined, expLine: 2 },
      ]

      for (let t of tests) {
        const expectedLineNumber = t.expLine;

        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.a1], t.regV);
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, 3, 3),
          new Argument(tokens.ARG_TYPES.REG, t.a1, tokens.REGISTERS[t.a1]),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_U, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line + 1, tokens.FUNCTIONS.PRT, [args[1]], tokens.FUNCTION_TYPES.PROC),
          new Operation(line + 1, tokens.FUNCTIONS.END, args, tokens.FUNCTION_TYPES.FLOW)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(newLine, expectedLineNumber)
      }
    });
  });

  describe("ERROR", () => {
    it("should show error if function doesnt exist", () => {
      const randonFName = chance.word();

      const input = [];
      const output = [];
      const registers = new Map();
      const memory = new Map();
      const line = 1;
      const logger = [];

      const operations = [
        new Operation(line,
          randonFName,
          [],
          tokens.FUNCTION_TYPES.PROC
        )
      ];

      const eva = new Evaluator(
        input,
        output,
        registers,
        memory,
        operations,
        logger
      );

      const newLine = eva.tick(line)

      assert.equal(newLine, -1);
      assert.equal(logger.length, 1);
      assert.equal(logger[0].type, 'error');
      assert.equal(logger[0].value, `At line ${line}. Instruction (${randonFName}) not found`);
    });

    it(" should throw if line number is invalid for all JMP operations", () => {
      const tests = [
        { a1: tokens.FUNCTIONS.JMP_N },
        { a1: tokens.FUNCTIONS.JMP_P },
        { a1: tokens.FUNCTIONS.JMP_Z },
        { a1: tokens.FUNCTIONS.JMP_U },
      ]

      for (let t of tests) {
        const expectedLineNumber = chance.integer({ min: 3, max: 100 })

        const input = [];
        const output = [];
        const registers = new Map();
        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, expectedLineNumber, expectedLineNumber),
          new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        ];

        const operations = [
          new Operation(line, t.a1, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line + 1, tokens.FUNCTIONS.END, args, tokens.FUNCTION_TYPES.FLOW)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        let error;

        try {
          eva.tick(line)
        } catch (err) {
          error = err
        }

        assert.equal(error.message, `AT LINE: 1. CAN'T JUMP TO INVALID LINE: ${expectedLineNumber}`)
      }
    });

    it("should not ADD the values if one of them are undefined", () => {
      const tests = [
        { a1: chance.integer({ min: 0, max: 100 }), a2: undefined },
        { a1: undefined, a2: chance.integer({ min: 0, max: 100 }) },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS.r0, t.a1);
        registers.set(tokens.REGISTERS.r1, t.a2);

        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.ADD, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(registers.get(tokens.REGISTERS.r0), t.a1);
        assert.equal(registers.get(tokens.REGISTERS.r1), t.a2);
        assert.equal(newLine, -1);
        assert.equal(logger.length, 1);
        assert.equal(logger[0].type, 'error');
        assert.equal(logger[0].value, `At line ${line}. Argument should be a valid integer.`);
      }
    });

    it("should not SUB the values if one of them are undefined", () => {
      const tests = [
        { a1: chance.integer({ min: 0, max: 100 }), a2: undefined },
        { a1: undefined, a2: chance.integer({ min: 0, max: 100 }) },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS.r0, t.a1);
        registers.set(tokens.REGISTERS.r1, t.a2);

        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.SUB, args, tokens.FUNCTION_TYPES.PROC)
        ];

        const eva = new Evaluator(
          input,
          output,
          registers,
          memory,
          operations,
          logger
        );

        const newLine = eva.tick(line)
        assert.equal(registers.get(tokens.REGISTERS.r0), t.a1);
        assert.equal(registers.get(tokens.REGISTERS.r1), t.a2);
        assert.equal(newLine, -1);
        assert.equal(logger.length, 1);
        assert.equal(logger[0].type, 'error');
        assert.equal(logger[0].value, `At line ${line}. Argument should be a valid integer.`);
      }
    });
  })
});
