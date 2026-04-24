import { describe, expect, it } from 'bun:test'

import Program, { IProgram, status } from '../assemblo/program'
import Lists from '../assemblo/lists'

describe('Integration test suite', () => {
  it('should run the countdown program correctly', (done) => {
    const countdownCode =
      `LBL: .start
        ADD: r1, 5
        LBL: .loop
        SUB: r1, 1
        PRT: r1
        JMP_P: 3, r1
        LBL: .end`

    const inQ = Lists.createList('INPUT', [])
    const outQ = Lists.createList('OUTPUT', [])

    const p: IProgram = Program.newProgram(inQ.items, outQ.items)

    p.reset(inQ.items)
    p.run(
      countdownCode,
      () => { },
      () => {
        expect(p.program.status).toBe(status.FINISHED)
        expect(p.program.outQ.items).toEqual([])
        expect(p.program.registers.get('r1')).toBe(0)
        expect(p.program.registers.get('r0')).toBe(0)
        expect(p.program.registers.get('r2')).toBe(0)
        expect(p.program.memory.get('mx0')).toBe(0)
        expect(p.program.memory.get('mx1')).toBe(0)
        expect(p.program.memory.get('mx2')).toBe(0)
        expect(p.program.logger).toEqual([
          { type: 'message', value: 4, ln: 5 },
          { type: 'message', value: 3, ln: 5 },
          { type: 'message', value: 2, ln: 5 },
          { type: 'message', value: 1, ln: 5 },
          { type: 'message', value: 0, ln: 5 }
        ])
        expect(p.program.line).toBe(-1)
        done()
      },
      1)
  })
})