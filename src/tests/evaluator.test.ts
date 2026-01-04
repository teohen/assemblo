
import { describe, it, expect } from 'bun:test'
import Chance from 'chance';
import fixtures from './fixtures'
import { Evaluator } from '../assemblo';
import { EvaluatorFixture } from './fixtures/evaluator';
import { newMemory, newRegisters } from './fixtures/maps';

const chance = new Chance();

interface TestCase {
  evaluator: EvaluatorFixture
  expLine?: number;
  expValue: number;
}

describe('EVALUATOR SUITE', () => {
  describe('SUCCESS', () => {
    it(' should evaluate the POP instruction', () => {
      // POP: r0, INPUT
      const randNumber = chance.integer({ min: 0, max: 1000 })
      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            input: [randNumber],
            operations: [
              fixtures.Operation.newOperation('popFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newListArgument('INPUT'),
              ])
            ],
          }),
          expValue: randNumber
        },
      ]

      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        const newLine = evaluator.tick(line)


        expect(t.expValue).toBe(evaluator.eva.registers.get("R0X"));
        expect(1).toBe(newLine)
      }
    })


    it(' should evaluate the PUSH instruction', () => {
      // PUSH: OUTPUT, r0
      // PUSH: OUTPUT, 2

      const randNumber = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('pushFn', 1, [
                fixtures.Argument.newListArgument('OUTPUT'),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: randNumber,
              name: "R0X"
            }])
          }),
          expValue: randNumber
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('pushFn', 1, [
                fixtures.Argument.newListArgument('OUTPUT'),
                fixtures.Argument.newNumberArgument(randNumber),
              ]),
            ],
          }),
          expValue: randNumber
        },
      ]

      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        evaluator.tick(line)

        expect(evaluator.eva.outQ).toEqual([randNumber])
      }
    })


    it('Should evaluate the JMP instructions to the conditional path', () => {
      const randNumber = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('jmpNegFn', 1, [
                fixtures.Argument.newNumberArgument(randNumber),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: -1,
              name: "R0X"
            }]),
          }),
          expValue: randNumber
        },

        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('jmpNegFn', 1, [
                fixtures.Argument.newNumberArgument(randNumber),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: 1,
              name: "R0X"
            }]),
          }),
          expValue: 1
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('jmpPosFn', 1, [
                fixtures.Argument.newNumberArgument(randNumber),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: -1,
              name: "R0X"
            }]),
          }),
          expValue: 1
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('jmpPosFn', 1, [
                fixtures.Argument.newNumberArgument(randNumber),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: 1,
              name: "R0X"
            }]),
          }),
          expValue: randNumber
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('jmpZeroFn', 1, [
                fixtures.Argument.newNumberArgument(randNumber),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: -1,
              name: "R0X"
            }]),
          }),
          expValue: 1
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('jmpZeroFn', 1, [
                fixtures.Argument.newNumberArgument(randNumber),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: 0,
              name: "R0X"
            }]),
          }),
          expValue: randNumber
        }
      ]

      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        const newLine = evaluator.tick(line)
        expect(t.expValue).toBe(newLine);
      }

    })

    it('should evaluate the CPY instruction', () => {
      // CPY: mx0, r0
      // CPY: mx0, 1

      const randNumber = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('cpyFn', 1, [
                fixtures.Argument.newMemoryArgument('mx0'),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([{
              value: randNumber,
              name: "R0X"
            }]),
          }),
          expValue: randNumber
        }

      ]

      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        evaluator.tick(line)
        expect(t.expValue).toBe(t.evaluator.memory.get("MX0"))
      }
    })

    it('should evaluate the LOAD instruction', () => {
      // LOAD: r0, mx0
      //
      const randNumber = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('loadFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newMemoryArgument('mx0'),
              ]),
            ],
            memory: newMemory([{
              name: "MX0",
              value: randNumber,
            }]),
          }),
          expValue: randNumber
        }
      ]

      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        evaluator.tick(line)
        expect(t.expValue).toBe(t.evaluator.registers.get("R0X"));
      }
    })

    it('should evaluate the ADD instruction', () => {
      // ADD: r0, r1 ADD: r0, r0
      // ADD: r0, 1

      const randNumber1 = chance.integer({ min: 0, max: 1000 })
      const randNumber2 = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('addFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newRegisterArgument('r1'),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              },
              {
                name: "R1X",
                value: randNumber2
              },

            ]),
          }),
          expValue: randNumber1 + randNumber2
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('addFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              }
            ]),
          }),
          expValue: randNumber1 + randNumber1
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('addFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newNumberArgument(randNumber2),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              }
            ]),
          }),
          expValue: randNumber1 + randNumber2
        }

      ];



      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        evaluator.tick(line)
        expect(t.evaluator.registers.get("R0X")).toBe(t.expValue);

      }
    })

    it('should evaluate the SUB instruction', () => {
      // ADD: r0, r1
      // ADD: r0, r0
      // ADD: r0, 1

      const randNumber1 = chance.integer({ min: 0, max: 1000 })
      const randNumber2 = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('subFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newRegisterArgument('r1'),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              },
              {
                name: "R1X",
                value: randNumber2
              },

            ]),
          }),
          expValue: randNumber1 - randNumber2
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('subFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              }
            ]),
          }),
          expValue: 0
        },
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('subFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
                fixtures.Argument.newNumberArgument(randNumber2),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              }
            ]),
          }),
          expValue: randNumber1 - randNumber2
        }

      ];



      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        evaluator.tick(line)
        expect(t.evaluator.registers.get("R0X")).toBe(t.expValue);

      }
    })


    it('should evaluate the PRT instruction', () => {
      // PRT: r0

      const randNumber1 = chance.integer({ min: 0, max: 1000 })

      const tests: TestCase[] = [
        {
          evaluator: fixtures.Evaluator.newEvaluator({
            operations: [
              fixtures.Operation.newOperation('prtFn', 1, [
                fixtures.Argument.newRegisterArgument('r0'),
              ]),
            ],
            registers: newRegisters([
              {
                name: "R0X",
                value: randNumber1
              }
            ]),
          }),
          expValue: randNumber1
        }

      ]

      for (const t of tests) {
        const line = 1
        const evaluator = Evaluator.newEvaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          line
        )

        evaluator.tick(line)
        expect(t.evaluator.logger).toEqual([{ type: 'message', value: t.expValue, ln: 1 }])
      }
    })
  })
})



describe("ERROR", () => {
  it('should return error to unknown instructions', () => {
    const randFName = chance.word();

    const tests: TestCase[] = [
      {
        evaluator: fixtures.Evaluator.newEvaluator({
          operations: [
            fixtures.Operation.newOperation(randFName, 1, [
              fixtures.Argument.newRegisterArgument('r0'),
            ]),
          ],
        }),
        expValue: 1
      }
    ]

    const t = tests[0];
    const expValue = `Instruction (${randFName}) does not exist.`;
    const line = 1;

    const evaluator = Evaluator.newEvaluator(
      t.evaluator.input,
      t.evaluator.output,
      t.evaluator.registers,
      t.evaluator.memory,
      t.evaluator.operations,
      t.evaluator.logger,
      line
    )

    evaluator.tick(line)
    expect(t.evaluator.logger).toEqual([
      { type: 'error', value: expValue, ln: t.expValue }
    ])
  });
})
/*

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
