import { describe, it, expect } from 'bun:test'
import { IOperation } from '../assemblo/operation'

import fixtures from './fixtures'
import Parser from '../assemblo/parser';


interface TestCase {
  input: string;
  operation: IOperation;
}


describe('Parser suite', () => {
  describe('Success operations', () => {
    it('parse the POP operation', () => {
      const tests: TestCase[] = [
        {
          input: 'POP: r0, INPUT',
          operation: fixtures.Operation.newOperation('popFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newListArgument('INPUT')
            ]
          )
        },
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })


    it('parse the PUSH operation', () => {
      const tests: TestCase[] = [
        {
          input: 'PUSH: OUTPUT, r0',
          operation: fixtures.Operation.newOperation('pushFn', 1,
            [
              fixtures.Argument.newListArgument('OUTPUT'),
              fixtures.Argument.newRegisterArgument('r0'),
            ],
          )
        },
        {
          input: 'PUSH: OUTPUT, 1',
          operation: fixtures.Operation.newOperation('pushFn', 1,
            [
              fixtures.Argument.newListArgument('OUTPUT'),
              fixtures.Argument.newNumberArgument('1'),
            ],
          )
        },
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })



    it('parse the JMP operations', () => {
      const tests: TestCase[] = [
        {
          input: 'JMP_N: .end, r0',
          operation: fixtures.Operation.newOperation('jmpNegFn', 1,
            [
              fixtures.Argument.newLabelArgument('.end'),
              fixtures.Argument.newRegisterArgument('r0')
            ]
          )
        },
        {
          input: 'JMP_P: .end, r0',
          operation: fixtures.Operation.newOperation('jmpPosFn', 1,
            [
              fixtures.Argument.newLabelArgument('.end'),
              fixtures.Argument.newRegisterArgument('r0')
            ]
          )
        },
        {
          input: 'JMP_Z: .end, r0',
          operation: fixtures.Operation.newOperation('jmpZeroFn', 1,
            [
              fixtures.Argument.newLabelArgument('.end'),
              fixtures.Argument.newRegisterArgument('r0')
            ]
          )
        },
        {
          input: 'JMP_U: .end, r0',
          operation: fixtures.Operation.newOperation('jmpUndFn', 1,
            [
              fixtures.Argument.newLabelArgument('.end'),
              fixtures.Argument.newRegisterArgument('r0')
            ]
          )
        }
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })



    it('parse the CPY operations', () => {
      const tests: TestCase[] = [
        {
          input: 'CPY: mx0, r0',
          operation: fixtures.Operation.newOperation('cpyFn', 1,
            [
              fixtures.Argument.newMemoryArgument('mx0'),
              fixtures.Argument.newRegisterArgument('r0')
            ]
          )
        },
        {
          input: 'CPY: mx0, 2',
          operation: fixtures.Operation.newOperation('cpyFn', 1,
            [
              fixtures.Argument.newMemoryArgument('mx0'),
              fixtures.Argument.newNumberArgument('2')
            ]
          )
        },
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })



    it('parse the LOAD operations', () => {
      const tests: TestCase[] = [
        {
          input: 'LOAD: r0, mx0',
          operation: fixtures.Operation.newOperation('loadFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newMemoryArgument('mx0'),
            ]
          )
        }
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })



    it('parse the ADD operation', () => {
      const tests: TestCase[] = [
        {
          input: 'ADD: r0, r0',
          operation: fixtures.Operation.newOperation('addFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newRegisterArgument('r0'),
            ]
          )
        },
        {
          input: 'ADD: r0, 1',
          operation: fixtures.Operation.newOperation('addFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newNumberArgument("1")
            ]
          )
        },
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])

      }
    })



    it('parse the SUB operation', () => {
      const tests: TestCase[] = [
        {
          input: 'SUB: r0, r0',
          operation: fixtures.Operation.newOperation('subFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newRegisterArgument('r0'),
            ]
          )
        },
        {
          input: 'SUB: r0, 1',
          operation: fixtures.Operation.newOperation('subFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newNumberArgument("1")
            ]
          )
        },
        {
          input: 'SUB: r0, r1',
          operation: fixtures.Operation.newOperation('subFn', 1,
            [
              fixtures.Argument.newRegisterArgument('r0'),
              fixtures.Argument.newRegisterArgument('r1'),
            ]
          )
        },
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })



    it('parse the LBL operation', () => {
      const tests: TestCase[] = [
        {
          input: 'LBL: .mult',
          operation: fixtures.Operation.newOperation('labelFn', 1,
            [
              fixtures.Argument.newLabelArgument('.mult')
            ]
          )
        }
      ]

      for (const t of tests) {
        const p = Parser.newParser()
        const operations = p.parse(t.input)

        expect(operations).toEqual([t.operation])
      }
    })
  })



  describe('Error operations', () => {
    it('should throw error if unknown argument', () => {
      const tests = [
        {
          input: 'LOAD: r3, mx0',
          exp: 'r3'
        },
        {
          input: 'POP: r0, INPUTT',
          exp: 'INPUTT'
        },
        {
          input: 'JMP_N: 1.2, r0',
          exp: '1.2'
        },
      ]

      let errMsg = ''

      for (const t of tests) {
        const p = Parser.newParser()
        try {
          p.parse(t.input)
        } catch (err) {
          const error = err as Error
          errMsg = error.message
        }

        expect(errMsg).toBe(`AT LINE: 1. UNKNOWN ARGUMENT: ${t.exp}`)
      }
    })

    it('should throw error if wrong number of arguments', () => {
      const tests = [
        { in: 'POP: r0, INPUT, r1', fName: 'POP', expN: 3 },
        { in: 'CPY: mx0', fName: 'CPY', expN: 1 },
        { in: 'LOAD: mx0', fName: 'LOAD', expN: 1 },
        { in: 'JMP_N: 7', fName: 'JMP_N', expN: 1 },
        { in: 'ADD: r1', fName: 'ADD', expN: 1 },
        { in: 'PUSH: OUTPUT', fName: 'PUSH', expN: 1 },
      ]

      let errMsg = ''

      for (const t of tests) {
        const p = Parser.newParser()
        try {
          p.parse(t.in)
        } catch (err) {
          const error = err as Error
          errMsg = error.message
        }

        expect(errMsg).toBe(`AT LINE: 1. (${t.fName}) GOT WRONG NUMBER OF ARGUMENTS: ${t.expN}`)
      }
    })
  })
})
