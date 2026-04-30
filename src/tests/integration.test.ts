import { describe, expect, it } from 'bun:test'
import Program, { status } from '../assemblo/program'
import Lists from '../assemblo/lists'
import { Logger } from '../assemblo/logger'

describe('Integration test suite', () => {
  it('should handle nested loops with multiple labels correctly', (done) => {
    const code = [
      'LBL: .start',
      'ADD: r1, 3',
      'LBL: .outer',
      'ADD: r2, 5',
      'LBL: .inner',
      'SUB: r2, 1',
      'PRT: r2',
      'JMP_ P: .inner, r2',
      'SUB: r1, 1',
      'PRT: r1',
      'JMP_ P: .outer, r1',
      'LBL: .done',
    ].join('\n')
    const inQ = Lists.createList('INPUT', [])
    const outQ = Lists.createList('OUTPUT', [])
    const p = Program.newProgram(inQ.items, outQ.items)
    p.reset(inQ.items)
    p.run(code, () => {}, () => {
      expect(p.program.status).toBe(status.FINISHED)

      expect(p.program.registers.get('r0')).toBe(0)
      expect(p.program.registers.get('r1')).toBe(0)
      expect(p.program.registers.get('r2')).toBe(0)

      const expectedLogger: Logger[] = [
        { type: 'message', value: 4, ln: 7 },
        { type: 'message', value: 3, ln: 7 },
        { type: 'message', value: 2, ln: 7 },
        { type: 'message', value: 1, ln: 7 },
        { type: 'message', value: 0, ln: 7 },
        { type: 'message', value: 2, ln: 10 },
        { type: 'message', value: 4, ln: 7 },
        { type: 'message', value: 3, ln: 7 },
        { type: 'message', value: 2, ln: 7 },
        { type: 'message', value: 1, ln: 7 },
        { type: 'message', value: 0, ln: 7 },
        { type: 'message', value: 1, ln: 10 },
        { type: 'message', value: 4, ln: 7 },
        { type: 'message', value: 3, ln: 7 },
        { type: 'message', value: 2, ln: 7 },
        { type: 'message', value: 1, ln: 7 },
        { type: 'message', value: 0, ln: 7 },
        { type: 'message', value: 0, ln: 10 },
      ]
      expect(p.program.logger).toEqual(expectedLogger)

      done()
    }, 1)
  })
})
