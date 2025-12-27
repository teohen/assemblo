
/*import { describe, it, expect } from 'bun:test'
import Chance from 'chance';
import fixtures from './fixtures'
// import { EvaluatorFixture } from './fixtures/evaluator';
import { Evaluator } from '../assemblo';
import { EvaluatorFixture } from './fixtures/evaluator';

const chance = new Chance();

interface TestCase {
  evaluator: EvaluatorFixture
  expLine?: number;
  expValue?: number;
}

describe('EVALUATOR SUITE', () => {
  describe('SUCCESS', () => {
    it.only(' should evaluate the POP instruction', () => {
      // POP: r0, INPUT
      const randNumber = chance.integer({ min: 0, max: 1000 })
      const tests: TestCase[] = [
        {
          evaluator: fixtures.EvaluatorFixtures.createEvaluator({
            input: [1],
            operations: [
              fixtures.OperationFixtures.createOperation('popFn', 1, [
                fixtures.ArgumentFixtures.newRegisterArgument('r0'),
                fixtures.ArgumentFixtures.newListArgument('INPUT'),
              ])
            ],
          }),
          expValue: randNumber
        },
      ]

      for (const t of tests) {
        const line = 1
        const eva = new Evaluator(
          t.evaluator.input,
          t.evaluator.output,
          t.evaluator.registers,
          t.evaluator.memory,
          t.evaluator.operations,
          t.evaluator.logger,
          t.evaluator.labels
        )

        const newLine = eva.tick(line)
        expect(eva.registers.get("R0X"))
        expect(1).toBe(newLine)
      }
    })
    
        it(' should evaluate the PUSH instruction', () => {
          // PUSH: OUTPUT, r0
          // PUSH: OUTPUT, 2
    
          const randNumber = chance.integer({ min: 0, max: 1000 })
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                1,
                'pushFn',
                [
                  newListArgument('OUTPUT'),
                  newRegisterArgument('r0'),
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: randNumber }]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber
            },
            {
              op: new ASM.Operation(
                1,
                'pushFn',
                [
                  newListArgument('OUTPUT'),
                  newNumberArgument(randNumber.toString())
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber
            },
          ]
    
          for (const t of tests) {
    
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op,
            ]
    
            const eva = new ASM.Evaluator(
              t.input ?? [],
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            const newLine = eva.tick(line)
            expect(t.expValue).toBe(output[0])
            expect(1).toBe(newLine)
          }
        })
    
        it('Should evaluate the JMP instructions to the conditional path', () => {
    
          const randLabelName = randLabel()
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                1,
                'jmpNegFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: -1 }]),
              memory: newMap([]),
              labels: newMap([{ name: randLabelName }])
            },
            {
              op: new ASM.Operation(
                1,
                'jmpPosFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: 1 }]),
              memory: newMap([]),
              labels: newMap([{ name: randLabelName }])
            },
            {
              op: new ASM.Operation(
                1,
                'jmpZeroFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: 0 }]),
              memory: newMap([]),
              labels: newMap([{ name: randLabelName }])
            },
            {
              op: new ASM.Operation(
                1,
                'jmpUndFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newFilledMap([{ name: ASM.tokens.REGISTERS.r0, value: undefined }]),
              memory: newMap([]),
              labels: newMap([{ name: randLabelName }])
            }
          ]
    
          for (const t of tests) {
            console.log(`testing ${t.op.funcName} instruction`)
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const args = [
              new Argument(ASM.tokens.ARG_TYPES.NUM, '1', 1),
            ]
    
            const operations = [
              t.op,
              new ASM.Operation(line, ASM.tokens.FUNCTIONS.PRT, args, ASM.tokens.FUNCTION_TYPES.PROC),
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            const newLine = eva.tick(line)
            const expLine = t.labels.get(randLabelName)
            expect(expLine).toBeDefined()
            expect(expLine).toBe(newLine)
          }
    
        })
    
        it('Should evaluate the JMP instructions to the other path', () => {
    
          const lineNumber = chance.integer({ min: 0, max: 1000 })
          const randLabelName = randLabel()
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                lineNumber,
                'jmpNegFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([{ name: ASM.tokens.REGISTERS.r0, value: 1 }]),
              memory: newMap([]),
              labels: newMap([]),
              expLine: lineNumber
            },
            {
              op: new ASM.Operation(
                lineNumber,
                'jmpPosFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
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
                'jmpZeroFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
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
                'jmpUndFn',
                [newLabelArgument(randLabelName), newRegisterArgument('r0')],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newFilledMap([{ name: ASM.tokens.REGISTERS.r0, value: 1 }]),
              memory: newMap([]),
              labels: newMap([{ name: randLabelName }]),
              expLine: lineNumber
            }
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const args = [
              new Argument(ASM.tokens.ARG_TYPES.NUM, '1', 1),
            ]
    
            const operations = [
              t.op,
              new ASM.Operation(line, ASM.tokens.FUNCTIONS.PRT, args, ASM.tokens.FUNCTION_TYPES.PROC),
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            const newLine = eva.tick(line)
            expect(t.expLine).toBe(newLine)
          }
    
        })
    
        it('should evaluate the CPY instruction', () => {
          // CPY: mx0, r0
          // CPY: mx0, 1
    
          const randNumber = chance.integer({ min: 0, max: 1000 })
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                1,
                'cpyFn',
                [
                  newMemoryArgument('mx0'),
                  newRegisterArgument('r0'),
                ],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber }
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber
            },
            {
              op: new ASM.Operation(
                1,
                'cpyFn',
                [
                  newMemoryArgument('mx0'),
                  newNumberArgument(randNumber.toString())
                ],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber }
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber
            }
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            eva.tick(line)
            const regVal = eva.memory.get(t.op.args[0].intern.toString())
            expect(regVal).toBe(t.expValue)
          }
    
        })
    
        it('should evaluate the LOAD instruction', () => {
          // LOAD: r0, mx0
          const randNumber = chance.integer({ min: 0, max: 1000 })
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                1,
                'loadFn',
                [
                  newRegisterArgument('r0'),
                  newMemoryArgument('mx0'),
                ],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([
              ]),
              memory: newMap([
                { name: ASM.tokens.MEMORY.mx0, value: randNumber }
              ]),
              labels: newMap([]),
              expValue: randNumber
            }
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            eva.tick(line)
            const memVal = eva.registers.get(t.op.args[0].intern.toString())
            expect(memVal).toBe(t.expValue)
          }
        })
    
        it('should evaluate the ADD instruction', () => {
          // ADD: r0, r1
          // ADD: r0, r0
          // ADD: r0, 1
    
          const randNumber1 = chance.integer({ min: 0, max: 1000 })
          const randNumber2 = chance.integer({ min: 0, max: 1000 })
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                1,
                'addFn',
                [
                  newRegisterArgument('r0'),
                  newRegisterArgument('r1'),
                ],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
                { name: ASM.tokens.REGISTERS.r1, value: randNumber2 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1 + randNumber2
            },
            {
              op: new ASM.Operation(
                1,
                'addFn',
                [
                  newRegisterArgument('r0'),
                  newRegisterArgument('r0'),
                ],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1 + randNumber1
            },
            {
              op: new ASM.Operation(
                1,
                'addFn',
                [
                  newRegisterArgument('r0'),
                  newNumberArgument(randNumber2.toString())
                ],
                ASM.tokens.FUNCTION_TYPES.FLOW
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1 + randNumber2
            },
    
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            eva.tick(line)
            const regVal = eva.registers.get(t.op.args[0].intern.toString())
            if (!regVal || !t.expValue) throw new Error('failed')
    
            expect(regVal).toBe(t.expValue)
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
              op: new ASM.Operation(
                1,
                'subFn',
                [
                  newRegisterArgument('r0'),
                  newRegisterArgument('r1'),
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
                { name: ASM.tokens.REGISTERS.r1, value: randNumber2 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1 - randNumber2
            },
            {
              op: new ASM.Operation(
                1,
                'subFn',
                [
                  newRegisterArgument('r0'),
                  newRegisterArgument('r0'),
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1 - randNumber1
            },
            {
              op: new ASM.Operation(
                1,
                'subFn',
                [
                  newRegisterArgument('r0'),
                  newNumberArgument(randNumber2.toString())
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1 - randNumber2
            },
    
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            eva.tick(line)
            const regVal = eva.registers.get(t.op.args[0].intern.toString())
            if (regVal === undefined || t.expValue === undefined) throw new Error('failed')
    
            expect(regVal).toBe(t.expValue)
          }
        })
    
        it('should evaluate the PRT instruction', () => {
          // PRT: r0
    
          const randNumber1 = chance.integer({ min: 0, max: 1000 })
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                1,
                'printFn',
                [
                  newRegisterArgument('r0'),
                  newRegisterArgument('r1'),
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([
                { name: ASM.tokens.REGISTERS.r0, value: randNumber1 },
              ]),
              memory: newMap([]),
              labels: newMap([]),
              expValue: randNumber1
            },
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              t.labels
            )
    
            eva.tick(line)
            const logVal = eva.logger.pop()
            if (logVal === undefined || t.expValue === undefined) throw new Error('failed')
    
            expect(logVal).toEqual({ ln: 1, type: 'message', value: t.expValue })
          }
        })
    
        it('should evaluate the LBL instruction', () => {
          // LB: .any_label
    
          const randNumber = chance.integer({ min: 0, max: 1000 })
          const randString = chance.word({ capitalize: false, length: 50 },)
    
          const tests: TestCase[] = [
            {
              op: new ASM.Operation(
                randNumber,
                'labelFn',
                [
                  newLabelArgument(randString),
                ],
                ASM.tokens.FUNCTION_TYPES.PROC
              ),
              registers: newMap([]),
              memory: newMap([]),
              labels: newMap([]),
            },
          ]
    
          for (const t of tests) {
            const input: number[] = []
            const output: number[] = []
    
            const registers = t.registers
            const memory = t.memory
            const labels = t.labels
    
            const line = 1
            const logger: Logger = []
    
            const operations = [
              t.op
            ]
    
            const eva = new ASM.Evaluator(
              input,
              output,
              registers,
              memory,
              operations,
              logger,
              labels
            )
    
            eva.tick(line)
    
            expect(labels).toBeDefined()
            const val = labels.get(randString)
            expect(val).toBe(randNumber)
          }
        })
          
  })
})

    

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
