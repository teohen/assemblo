import { describe, it, expect, expectTypeOf } from 'bun:test';

import Argument from '../assemblo/argument';
import * as ASM from '../assemblo'
import { Label, Labels, Logger } from '../assemblo/program';
import { newLabelArgument, newRegisterArgument, randLabel } from './fixtures/argument';
import { newMap, newFilledMap } from './fixtures/maps';
import { createOperation } from './fixtures/operation';
import { Chance } from 'chance';
const chance = new Chance();

interface TestCase {
  op: ASM.Operation;
  registers: Map<string, number | undefined>;
  memory: Map<string, number | undefined>;
  labels: Labels;
  expLine?: number;
}

describe("EVALUATOR SUITE", () => {

  it("Should evaluate the JMP instructions to the conditional path", () => {

    const randLabelName = randLabel()

    const tests: TestCase[] = [
      {
        op: new ASM.Operation(
          1,
          "jmpNegFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: -1 }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }])
      },
      {
        op: new ASM.Operation(
          1,
          "jmpPosFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: 1 }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }])
      },
      {
        op: new ASM.Operation(
          1,
          "jmpZeroFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: 0 }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }])
      },
      {
        op: new ASM.Operation(
          1,
          "jmpUndFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newFilledMap([{ name: ASM.tokens.REGISTERS.r0, value: undefined }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }])
      }
    ];

    for (let t of tests) {
      console.log(`testing ${t.op.funcName} instruction`);
      const input: number[] = [];
      const output: number[] = [];

      const registers = t.registers;
      const memory = t.memory;

      const line = 1;
      const logger: Logger = [];

      const args = [
        new Argument(ASM.tokens.ARG_TYPES.NUM, "1", 1),
      ];

      const operations = [
        t.op,
        new ASM.Operation(line, ASM.tokens.FUNCTIONS.PRT, args, ASM.tokens.FUNCTION_TYPES.PROC),
      ];

      const eva = new ASM.Evaluator(
        input,
        output,
        registers,
        memory,
        operations,
        logger,
        t.labels
      );

      const newLine = eva.tick(line);
      const expLine = t.labels.get(randLabelName)
      expect(expLine).toBeDefined()
      expect(expLine).toBe(newLine);
    }

  })

  it("Should evaluate the JMP instructions to the other path", () => {

    const lineNumber = chance.integer({ min: 0, max: 1000 })
    const randLabelName = randLabel()

    const tests: TestCase[] = [
      {
        op: new ASM.Operation(
          lineNumber,
          "jmpNegFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value:  1}]),
        memory: newMap([]),
        labels: newMap([]),
        expLine: lineNumber
      },
      {
        op: new ASM.Operation(
          lineNumber,
          "jmpPosFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: -1 }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }]),
        expLine: lineNumber
      },
      {
        op: new ASM.Operation(
          lineNumber,
          "jmpZeroFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: 1 }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }]),
        expLine: lineNumber
      },
      {
        op: new ASM.Operation(
          lineNumber,
          "jmpUndFn",
          [newLabelArgument(randLabelName), newRegisterArgument("r0")],
          ASM.tokens.FUNCTION_TYPES.FLOW
        ),
        registers: newFilledMap([{ name: ASM.tokens.REGISTERS.r0, value: 1 }]),
        memory: newMap([]),
        labels: newMap([{ name: randLabelName }]),
        expLine: lineNumber
      }
    ];

    for (let t of tests) {
      console.log(`testing ${t.op.funcName} instruction`);
      const input: number[] = [];
      const output: number[] = [];

      const registers = t.registers;
      const memory = t.memory;

      const line = 1;
      const logger: Logger = [];

      const args = [
        new Argument(ASM.tokens.ARG_TYPES.NUM, "1", 1),
      ];

      const operations = [
        t.op,
        new ASM.Operation(line, ASM.tokens.FUNCTIONS.PRT, args, ASM.tokens.FUNCTION_TYPES.PROC),
      ];

      const eva = new ASM.Evaluator(
        input,
        output,
        registers,
        memory,
        operations,
        logger,
        t.labels
      );

      const newLine = eva.tick(line);
      expect(t.expLine).toBe(newLine);
    }

  })

});



/*
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
      // POP: REG, INPUT
      const tests = [
        { reg: "r0", arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0) },
        { reg: "r1", arg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1) },
        { reg: "r2", arg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2) },
      ]

      for (let t of tests) {
        const expRegisterValue = chance.integer({ min: 0 });

        const input = [expRegisterValue];
        const output = [];
        const registers = new Map();
        registers.set(tokens.REGISTERS[t.reg], undefined);
        const memory = new Map();
        const line = 1;
        const logger = [];



        const args = [
          t.arg1,
          new Argument(tokens.ARG_TYPES.LIST, "INPUT", tokens.LISTS.INPUT),
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
        assert.equal(registers.get(tokens.REGISTERS[t.reg]), expRegisterValue);
        assert.equal(newLine, line)
        assert.equal(input.length, 0);
      }
    });

    it("should evaluate the PUSH operation", () => {
      // PUSH: OUTPUT, REG
      // PUSH: OUTPUT, 1
      const tests = [
        { expValue: chance.integer({ min: 0 }), arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0) },
        { expValue: chance.integer({ min: 0 }), arg2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1) },
        { expValue: chance.integer({ min: 0 }), arg2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2) },
        { expValue: -1, arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1) },
        { expValue: 0, arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0) },
        { expValue: 1, arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1) },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();
        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          registers.set(t.arg2.intern, t.expValue);
        }

        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.LIST, "OUTPUT", tokens.LISTS.OUTPUT),
          t.arg2,
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

        assert.equal(newLine, line)
        assert.equal(output.length, 1);
        assert.equal(output[0], t.expValue);
      }
    });

    it("should evaluate the CPY operation", () => {
      // CPY: mx0, r0
      // CPY: mx0, 1

      const tests = [
        {
          expValue: chance.integer({ min: 0 }),
          arg1: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0), arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          expValue: chance.integer({ min: 0 }),
          arg1: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1), arg2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          expValue: chance.integer({ min: 0 }),
          arg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx1), arg2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          expValue: -1,
          arg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx1), arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1)
        },
        {
          expValue: 0,
          arg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx1), arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0)
        },
        {
          expValue: 1,
          arg1: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx1), arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();
        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          registers.set(t.arg2.intern, t.expValue);
        }

        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          t.arg1,
          t.arg2,
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

        assert.equal(newLine, line)
        assert.equal(memory.size, 1);
        assert.equal(memory.get(t.arg1.intern), t.expValue);
      }
    });

    it("should evaluate the LOAD operation", () => {
      // LOAD: r0, mx0
      // LOAD: r1, mx1

      const tests = [
        {
          expValue: chance.integer({ min: 0 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.MEM, "mx0", tokens.MEMORY.mx0)
        },
        {
          expValue: chance.integer({ min: 0 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          arg2: new Argument(tokens.ARG_TYPES.MEM, "mx1", tokens.MEMORY.mx1)
        },
        {
          expValue: chance.integer({ min: 0 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          arg2: new Argument(tokens.ARG_TYPES.MEM, "mx2", tokens.MEMORY.mx1)
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();
        const memory = new Map();
        memory.set(t.arg2.intern, t.expValue)
        const line = 1;
        const logger = [];

        const args = [
          t.arg1,
          t.arg2,
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

        assert.equal(newLine, line)
        assert.equal(registers.size, 1);
        assert.equal(registers.get(t.arg1.intern), t.expValue);
      }
    });

    it("should evaluate the ADD operation", () => {
      // ADD: r0, r1
      // ADD: r0, r0
      // ADD: r0, 1

      const tests = [
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: chance.integer({ min: 0, max: 10000 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: chance.integer({ min: 0, max: 10000 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          valueArg1: 10,
          valueArg2: 10,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: -1,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: 0,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: 1,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        },
        {
          valueArg1: undefined,
          valueArg2: 1,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        registers.set(t.arg1.intern, t.valueArg1);
        registers.set(t.arg2.intern, t.valueArg2);


        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          t.arg1,
          t.arg2,
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

        assert.equal(newLine, line);
        assert.equal(registers.get(t.arg1.intern), (t.valueArg1 || 0) + t.valueArg2);
      }
    });

    it("should evaluate the SUB operation", () => {
      // SUB: r0, r1
      // SUB: r0, r0
      // SUB: r0, 1

      const tests = [
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: chance.integer({ min: 0, max: 10000 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: chance.integer({ min: 0, max: 10000 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2)
        },
        {
          valueArg1: 10,
          valueArg2: 10,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: -1,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: 0,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r1", tokens.REGISTERS.r1),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0)
        },
        {
          valueArg1: chance.integer({ min: 0, max: 10000 }),
          valueArg2: 1,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        },
        {
          valueArg1: undefined,
          valueArg2: 1,
          arg1: new Argument(tokens.ARG_TYPES.REG, "r2", tokens.REGISTERS.r2),
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1)
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        registers.set(t.arg1.intern, t.valueArg1);
        registers.set(t.arg2.intern, t.valueArg2);


        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          t.arg1,
          t.arg2,
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

        assert.equal(newLine, line);
        assert.equal(registers.get(t.arg1.intern), (t.valueArg1 || 0) - t.valueArg2);
      }
    });

    it("should evaluate the PRT operation", () => {
      // PRT: r0

      const tests = [
        {
          valArg1: chance.integer({ min: 0, max: 10000 }),
          arg1: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        registers.set(t.arg1.intern, t.valArg1);

        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          t.arg1,
          t.arg2,
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.PRT, args, tokens.FUNCTION_TYPES.PROC)
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

        assert.equal(newLine, line);
        assert.equal(logger.length, 1);
        assert.equal(logger[0].type, 'message');
        assert.equal(logger[0].value, t.valArg1);
      }
    });

    it("should evaluate the JMP_N operation", () => {
      // JMP_N: 1, r0
      // JMP_N: 1, 2

      const tests = [
        {
          expLine: 0,
          valArg2: chance.integer({ min: -10000, max: -1 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 1,
          valArg2: chance.integer({ min: 0, max: 10000 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 0,
          valArg2: -1,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1),
        },
        {
          expLine: 1,
          valArg2: 0,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0),
        },
        {
          expLine: 1,
          valArg2: 1,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1),
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          registers.set(t.arg2.intern, t.valArg2);
        }

        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, "1", 1),
          t.arg2,
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_N, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line, tokens.FUNCTIONS.PRT, args[1], tokens.FUNCTION_TYPES.PROC),
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

        assert.equal(newLine, t.expLine);
        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          assert.equal(registers.get(t.arg2.intern), t.valArg2);
        }
      }
    });

    it("should evaluate the JMP_P operation", () => {
      // JMP_P: 1, r0
      // JMP_P: 1, 2

      const tests = [
        {
          expLine: 0,
          valArg2: chance.integer({ min: 1, max: 100000 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 1,
          valArg2: chance.integer({ min: -100000, max: 0 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 1,
          valArg2: -1,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1),
        },
        {
          expLine: 1,
          valArg2: 0,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0),
        },
        {
          expLine: 0,
          valArg2: 1,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1),
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          registers.set(t.arg2.intern, t.valArg2);
        }


        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, "1", 1),
          t.arg2,
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_P, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line, tokens.FUNCTIONS.PRT, args[1], tokens.FUNCTION_TYPES.PROC),
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

        assert.equal(newLine, t.expLine);
        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          assert.equal(registers.get(t.arg2.intern), t.valArg2);
        }
      }
    });

    it("should evaluate the JMP_Z operation", () => {
      // JMP_Z: 1, r0
      // JMP_Z: 1, 2

      const tests = [
        {
          expLine: 1,
          valArg2: chance.integer({ min: -100000, max: 0 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 0,
          valArg2: 0,
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 1,
          valArg2: chance.integer({ min: -100000, max: 0 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 1,
          valArg2: -1,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "-1", -1),
        },
        {
          expLine: 0,
          valArg2: 0,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "0", 0),
        },
        {
          expLine: 1,
          valArg2: 1,
          arg2: new Argument(tokens.ARG_TYPES.NUM, "1", 1),
        },
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          registers.set(t.arg2.intern, t.valArg2);
        }


        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, "1", 1),
          t.arg2,
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_Z, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line, tokens.FUNCTIONS.PRT, args[1], tokens.FUNCTION_TYPES.PROC),
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

        assert.equal(newLine, t.expLine);
        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          assert.equal(registers.get(t.arg2.intern), t.valArg2);
        }
      }
    });

    it("should evaluate the JMP_U operation", () => {
      // JMP_U: 1, r0

      const tests = [
        {
          expLine: 1,
          valArg2: chance.integer({ min: -100000, max: 0 }),
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        },
        {
          expLine: 0,
          valArg2: undefined,
          arg2: new Argument(tokens.ARG_TYPES.REG, "r0", tokens.REGISTERS.r0),
        }
      ]

      for (let t of tests) {
        const input = [];
        const output = [];

        const registers = new Map();

        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          registers.set(t.arg2.intern, t.valArg2);
        }


        const memory = new Map();
        const line = 1;
        const logger = [];

        const args = [
          new Argument(tokens.ARG_TYPES.NUM, "1", 1),
          t.arg2,
        ];

        const operations = [
          new Operation(line, tokens.FUNCTIONS.JMP_U, args, tokens.FUNCTION_TYPES.FLOW),
          new Operation(line, tokens.FUNCTIONS.PRT, args[1], tokens.FUNCTION_TYPES.PROC),
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

        assert.equal(newLine, t.expLine);
        if (t.arg2.type === tokens.ARG_TYPES.REG) {
          assert.equal(registers.get(t.arg2.intern), t.valArg2);
        }
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

    it("should throw if line number is invalid for all JMP operations", () => {
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
        assert.equal(logger[0].value, `At line ${line}. Source argument should not be undefined`);
      }
    });

    it("should not SUB the values if one of them are undefined", () => {
      const tests = [
        { a1: chance.integer({ min: 0, max: 100 }), a2: undefined },
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
*/