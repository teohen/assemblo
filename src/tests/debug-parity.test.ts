import { beforeEach, describe, expect, it } from 'bun:test'
import Program, { status } from '../assemblo/program'
import List from '../assemblo/lists'
import { Logger } from '../assemblo/logger'

interface ProgramSnapshot {
  line: number
  status: string
  clock: number
  registers: { R0X: number, R1X: number, R2X: number }
  memory: { MX0: number, MX1: number, MX2: number }
  inQ: number[]
  outQ: number[]
  logger: Logger[]
}

function snapshot(p: ReturnType<typeof Program.newProgram>): ProgramSnapshot {
  return {
    line: p.program.line,
    status: p.program.status,
    clock: p.program.clock,
    registers: {
      R0X: p.program.registers.get('R0X'),
      R1X: p.program.registers.get('R1X'),
      R2X: p.program.registers.get('R2X'),
    },
    memory: {
      MX0: p.program.memory.get('MX0'),
      MX1: p.program.memory.get('MX1'),
      MX2: p.program.memory.get('MX2'),
    },
    inQ: [...p.program.inQ.items],
    outQ: [...p.program.outQ.items],
    logger: [...p.program.logger],
  }
}

function runToEnd(p: ReturnType<typeof Program.newProgram>, code: string): void {
  p.run(code, () => { }, () => { }, 1)
}

function debugToEnd(p: ReturnType<typeof Program.newProgram>, code: string): void {
  p.prepareOperations(code)
  while (p.program.status === status.PARSED || p.program.status === status.RUNNING) {
    p.nextLine()
  }
}

function compareSnapshots(runSnap: ProgramSnapshot, debugSnap: ProgramSnapshot, testName: string): void {
  expect(runSnap.line, `${testName}: line mismatch`).toBe(debugSnap.line)
  expect(runSnap.status, `${testName}: status mismatch`).toBe(debugSnap.status)
  expect(runSnap.clock, `${testName}: clock mismatch`).toBe(debugSnap.clock)

  expect(runSnap.registers.R0X, `${testName}: R0X mismatch`).toBe(debugSnap.registers.R0X)
  expect(runSnap.registers.R1X, `${testName}: R1X mismatch`).toBe(debugSnap.registers.R1X)
  expect(runSnap.registers.R2X, `${testName}: R2X mismatch`).toBe(debugSnap.registers.R2X)

  expect(runSnap.memory.MX0, `${testName}: MX0 mismatch`).toBe(debugSnap.memory.MX0)
  expect(runSnap.memory.MX1, `${testName}: MX1 mismatch`).toBe(debugSnap.memory.MX1)
  expect(runSnap.memory.MX2, `${testName}: MX2 mismatch`).toBe(debugSnap.memory.MX2)

  expect(runSnap.outQ, `${testName}: outQ mismatch`).toEqual(debugSnap.outQ)
  expect(runSnap.inQ, `${testName}: inQ mismatch`).toEqual(debugSnap.inQ)

  expect(runSnap.logger.length, `${testName}: logger length mismatch`).toBe(debugSnap.logger.length)
  for (let i = 0; i < runSnap.logger.length; i++) {
    expect(runSnap.logger[i].type, `${testName}: logger[${i}] type mismatch`).toBe(debugSnap.logger[i].type)
    expect(runSnap.logger[i].value, `${testName}: logger[${i}] value mismatch`).toBe(debugSnap.logger[i].value)
    expect(runSnap.logger[i].ln, `${testName}: logger[${i}] ln mismatch`).toBe(debugSnap.logger[i].ln)
  }
}

describe('Debug vs Run Behavior Parity', () => {
  let pRun: ReturnType<typeof Program.newProgram>
  let pDebug: ReturnType<typeof Program.newProgram>

  beforeEach(() => {
    pRun = Program.newProgram([], [])
    pDebug = Program.newProgram([], [])
  })

  describe('Single instruction', () => {
    it('ADD r0, 1 → should match final state', () => {
      const code = `
LBL: .start
ADD: r0, 1
LBL: .end
`
      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'ADD r0, 1')
    })

    it('SUB r0, 5 → should match final state', () => {
      const code = `
LBL: .start
SUB: r0, 5
LBL: .end
`
      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'SUB r0, 5')
    })

    it('PUSH OUTPUT, 42 → should match final state', () => {
      const code = `
LBL: .start
PUSH: OUTPUT, 42
LBL: .end
`
      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'PUSH OUTPUT, 42')
    })

it('POP r0, INPUT → should match final state', () => {
      const code = `
LBL: .start
POP: r0, INPUT
LBL: .end
`
      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'POP r0, INPUT')
    })
  })

  describe('Multi-instruction sequence', () => {
    it('sequence: ADD, PUSH → should match final state', () => {
      const code = `
LBL: .start
ADD: r0, 10
ADD: r0, 5
PUSH: OUTPUT, r0
LBL: .end
`
      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'ADD+ADD+PUSH sequence')
    })
  })

  describe('Loop program', () => {
    it('simple loop with counter → should match final state', () => {
      const code = `
LBL: .start
ADD: r0, 1
JMP_P: 3, r0
LBL: .end
`
      pRun.reset([])
      pDebug.reset([])

      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'loop with JMP_P')
    })
  })

  describe('I/O operations', () => {
it('input/output flow → should match final state', () => {
      const code = `
LBL: .start
POP: r0, INPUT
POP: r1, INPUT
ADD: r2, r0
ADD: r2, r1
PUSH: OUTPUT, r2
LBL: .end
`
      const runSnap = snapshot(pRun)
      runToEnd(pRun, code)

      const debugSnap = snapshot(pDebug)
      debugToEnd(pDebug, code)

      compareSnapshots(runSnap, debugSnap, 'POP+POP+ADD+ADD+PUSH')
    })
  })
})