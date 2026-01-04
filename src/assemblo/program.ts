
import tokens from './tokens'
import Parser, { IParser } from './parser'
import Evaluator, { IEvaluator } from './evaluator'
import Operation, { IOperation } from './operation'
import Argument from './argument'
import Register, { RegistersType } from './registers'
import Lists, { IListInput, IListOutput} from './lists'
import Label, { LabelType } from './labels'
import Memory, { MemoryType } from './memory'
import { Logger } from './logger'


type TickFn = () => void;
type EndProgramFn = () => void;

export const status = {
  READY: 'ready',
  PARSING: 'parsing',
  PARSED: 'parsed',
  RUNNING: 'running',
  FINISHED: 'ended',
} as const

type StatusType = typeof status[keyof typeof status];

type TProgram = {
  clock: number
  parser: IParser
  evaluator: IEvaluator
  registers: RegistersType
  memory: MemoryType
  inQ: IListInput
  outQ: IListOutput
  status: StatusType
  logger: Logger[]
  line: number
  labels: LabelType
}

interface IProgram {
  program: TProgram,

  test: (answer: []) => void
  reset: (inputQ: IListInput) => void
  convertLabels: (operations: IOperation[]) => IOperation[]
  prepareOperations: (code: string) => void
  startRunning: () => void
  run: (code: string, tickFn: TickFn, endProgramFn: EndProgramFn, delay: number) => void
  nextLine: () => void
}

function newProgram(inQ: IListInput, outQ: IListOutput): IProgram {
  const p: TProgram = {
    inQ: inQ,
    outQ: outQ,
    line: 0,
    clock: 2,
    status: status.READY,
    parser: Parser.newParser(),
    evaluator: Evaluator.newEvaluator(),
    registers: Register.createRegister(),
    memory: Memory.createMemory(),
    labels: Label.createLabels(),
    //TODO: See how to create a new Logger
    logger: []
  }


  const obj: IProgram = {
    program: p,

    test: (answer: []) => test(p, answer),
    reset: (inputQ: IListInput) => reset(p, inputQ),
    convertLabels: (operations: IOperation[]) => convertLabels(operations),
    prepareOperations: (code: string) => prepareOperations(p, code),
    startRunning: () => startRunning(p),
    run: (code: string, tickFn: TickFn, endProgramFn: EndProgramFn, delay: number) => run(p, code, tickFn, endProgramFn, delay),
    nextLine: () => nextLine(p)
  }

  return obj;
}

function test(p: TProgram, expectedOutput: number[]): void {
  for (let i = 0; i < expectedOutput.length; i++) {
    const exp = expectedOutput[i]
    const out = p.outQ.items[i]

    if (exp !== out) {
      p.logger.push({
        type: 'error',
        value: 'incorrect answer',
        ln: -1
      })
      return
    }
  }
  p.logger.push({
    type: 'success',
    value: 'PASSED!!!',
    ln: -1
  })
}

function reset(p: TProgram, inQ: IListInput): void {
  p.line = 0
  p.clock = 2
  p.status = status.READY

  p.registers = Register.createRegister()
  p.memory = Memory.createMemory()
  p.labels = Label.createLabels()

  p.inQ = Lists.createList('INPUT', inQ.items)
  p.outQ = Lists.createList('OUTPUT', [])
  p.logger = []


  p.registers.set(tokens.REGISTERS.r0, 0)
  p.registers.set(tokens.REGISTERS.r1, 0)
  p.registers.set(tokens.REGISTERS.r2, 0)
  p.memory.set(tokens.MEMORY.mx0, 0)
  p.memory.set(tokens.MEMORY.mx1, 0)
  p.memory.set(tokens.MEMORY.mx2, 0)


  p.parser = Parser.newParser()
  p.evaluator = Evaluator.newEvaluator(
    p.inQ,
    p.outQ,
    p.registers,
    p.memory,
    p.parser.parser.operations,
    p.logger,
  )
}

function convertLabels(operations: IOperation[]): IOperation[] {
  return operations.map((op) => {
    if (op.funcName !== 'labelFn') return op


    return Operation.createOperation(
      op.line,
      'jmpFn',
      [
        Argument.createNumberArgument(op.line),
        Argument.createConditionalArgument(() => true),
      ]
    )
  })
}

function prepareOperations(p: TProgram, code: string): void {
  try {
    p.status = status.PARSING
    const parsedCode = p.parser.parse(code);
    const operations = convertLabels(parsedCode);

    p.evaluator.eva.operations = operations
    p.status = status.PARSED
  } catch (err) {
    const error = err as Error
    p.logger.push({
      type: 'error',
      value: error.message,
      ln: p.line
    })
    p.status = status.FINISHED
  }
}

function startRunning(p: TProgram): void {
  const startLine = p.labels.get('.start')
  if (!startLine) {
    p.logger.push({
      type: 'error',
      value: '.start LABEL is required to run program',
      ln: -1
    })
    return
  }

  p.line = startLine
  p.status = status.RUNNING
}

function run(p: TProgram,
  code: string,
  tickFn: TickFn,
  endProgramFn: EndProgramFn,
  delay: number
): void {
  if (!code) return

  prepareOperations(p, code)

  if (p.status !== status.PARSED) return

  p.line = 1
  p.status = status.RUNNING


  const interval = setInterval(() => {
    try {
      p.line = p.evaluator.tick(p.line)
      tickFn()

      if (p.line < 0) {
        p.status = status.FINISHED
        clearInterval(interval)
        endProgramFn()
        return
      }

      p.line += 1

      if (p.line > p.evaluator.eva.operations.length) {
        p.status = status.FINISHED
        clearInterval(interval)
        endProgramFn()
      }
    } catch (error) {
      const err = error as Error
      p.logger.push({
        type: 'error',
        value: err.message,
        ln: p.line
      })
      p.status = status.FINISHED
      clearInterval(interval)
      endProgramFn()
    }
  }, p.clock * delay)
}

function nextLine(p: TProgram): void {
  if (p.status !== status.PARSED && p.status !== status.RUNNING) return

  p.line += 1
  p.status = status.RUNNING

  try {
    p.line = p.evaluator.tick(p.line)

    if (p.line < 0) {
      p.status = status.FINISHED
      return
    }
  } catch (error) {
    const err = error as Error
    p.logger.push({
      type: 'error',
      value: err.message,
      ln: p.line
    })
    p.status = status.FINISHED
  }
}

export default {
  newProgram
}
