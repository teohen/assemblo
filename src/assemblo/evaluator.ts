import Argument from './argument'
import Operation from './operation'
import { Label, Labels } from './program'
import tokens from './tokens'



type ArgumentValue = number | undefined

interface ConditionalFunction {
  (val: number | undefined): boolean;
}


interface Storage {
  get(key: string): number | undefined;
  set(key: string, value: number | undefined): void;
}

export interface LoggerEntry {
  type: 'error' | 'message' | 'success';  
  value: any;
  ln: number;
}

type Logger = LoggerEntry[];

class Evaluator {
  inQ: number[]
  outQ: number[]
  registers: Storage
  memory: Storage
  operations: Operation[]
  logger: Logger
  labels: Labels

  constructor(
    inQ: number[],
    outQ: number[],
    registers: Storage,
    memory: Storage,
    operations: Operation[],
    logger: Logger,
    labels: Labels
  ) {
    if (!Array.isArray(inQ)) {
      throw new Error('InQ should be a non empty array')
    }

    this.registers = registers
    this.memory = memory
    this.operations = operations
    this.logger = logger
    this.labels = labels

    this.inQ = inQ
    this.outQ = outQ

    
    this.popFn = this.popFn.bind(this)
    this.cpyFn = this.cpyFn.bind(this)
    this.addFn = this.addFn.bind(this)
    this.pushFn = this.pushFn.bind(this)
    this.loadFn = this.loadFn.bind(this)
    this.subFn = this.subFn.bind(this)
    this.printFn = this.printFn.bind(this)
    this.startFn = this.startFn.bind(this)
    this.endFn = this.endFn.bind(this)

    this.jmpNegFn = this.jmpNegFn.bind(this)
    this.jmpPosFn = this.jmpPosFn.bind(this)
    this.jmpZeroFn = this.jmpZeroFn.bind(this)
    this.jmpUndFn = this.jmpUndFn.bind(this)
    this.labelFn = this.labelFn.bind(this)
  }

  getValue(arg: Argument): ArgumentValue {
    switch (arg.type) {
    case tokens.ARG_TYPES.REG:
      return this.registers.get(arg.intern as string)

    case tokens.ARG_TYPES.NUM:
      return arg.intern as number

    case tokens.ARG_TYPES.MEM:
      return this.memory.get(arg.intern as string)

    default:
      throw new Error(`Invalid Argument: ${arg.literal}`)
    }
  }

  popFn(args: Argument[], ln: number): number {
    
    const arg1 = args[0]
    const arg2 = args[1]

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln)
    Argument.validateType(arg2, [tokens.ARG_TYPES.LIST], ln)

    if (!Argument.validateValue(arg2, (tokens.LISTS.INPUT as unknown as number))) {
      this.logger.push({
        type: 'error',
        value: `At line: ${ln}. Invalid Argument (${arg2.literal}). Expected: INPUT`,
        ln
      })
      return -1
    }

    const result = this.inQ.pop()

    if (result === undefined) {
      this.logger.push({
        type: 'error',
        value: `At line: ${ln}. Input queue is empty`,
        ln
      })
      return -1
    }

    this.registers.set(arg1.intern as string, result)

    return ln
  }

  pushFn(args: Argument[], ln: number): number {
    const arg1 = args[0]
    const arg2 = args[1]

    Argument.validateType(arg1, [tokens.ARG_TYPES.LIST], ln)
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln)

    if (!Argument.validateValue(arg1, (tokens.LISTS.OUTPUT as unknown as number))) {
      this.logger.push({
        type: 'error',
        value: `At line: ${ln}. Invalid Argument (${arg1.literal}). Expected: OUTPUT`,
        ln
      })
      return -1
    }

    const result = this.getValue(arg2)

    if (result === undefined) {
      this.logger.push({
        type: 'error',
        value: `At line ${ln}. SOURCE argument (${arg2.literal}) is undefined`,
        ln
      })
      return -1
    }

    this.outQ.push(result)

    return ln
  }

  cpyFn(args: Argument[], ln: number): number {
    const arg1 = args[0]
    const arg2 = args[1]

    Argument.validateType(arg1, [tokens.ARG_TYPES.MEM], ln)
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln)

    const result = this.getValue(arg2)
    if (result === undefined) {
      this.logger.push({
        type: 'error',
        value: `At line ${ln}. Cannot copy undefined value`,
        ln
      })
      return -1
    }

    this.memory.set(arg1.intern as string, result)

    return ln
  }

  loadFn(args: Argument[], ln: number): number {
    const arg1 = args[0]
    const arg2 = args[1]

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln)
    Argument.validateType(arg2, [tokens.ARG_TYPES.MEM], ln)

    const result = this.getValue(arg2)
    if (result === undefined) {
      this.logger.push({
        type: 'error',
        value: `At line ${ln}. Cannot load undefined value from memory`,
        ln
      })
      return -1
    }

    this.registers.set(arg1.intern as string, result)
    return ln
  }

  jmpFn(args: Argument[], ln: number, cond: ConditionalFunction): number {
    const arg1 = args[0]
    const arg2 = args[1]
    Argument.validateType(arg1, [tokens.ARG_TYPES.LBL], ln)
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM,
    ], ln)



    const val = this.getValue(arg2)

    if (cond(val)) {
      const lbl = this.labels.get(arg1.literal)
      if (!lbl) {
        throw new Error(
          `AT LINE: ${ln}. CAN'T JUMP TO INVALID LABEL: ${arg1.intern}`,
        )
      }
      return lbl
    };

    return ln
  }

  jmpNegFn(args: Argument[], ln: number): number {
    const condition = (val: ArgumentValue) => {
      if (val && val < 0) {
        return true
      }

      return false
    }

    return this.jmpFn(args, ln, condition)
  }

  jmpPosFn(args: Argument[], ln: number): number {
    const condition = (val: ArgumentValue) => {
      if (val && val > 0) {
        return true
      }

      return false
    }

    return this.jmpFn(args, ln, condition)
  }

  jmpZeroFn(args: Argument[], ln: number): number {

    const condition = (val: ArgumentValue) => {
      if (val === 0) {
        return true
      }

      return false
    }

    return this.jmpFn(args, ln, condition)
  }

  jmpUndFn(args: Argument[], ln: number): number {
    const condition = (val: ArgumentValue) => {
      if (val === undefined) {
        return true
      }

      return false
    }

    return this.jmpFn(args, ln, condition)
  }

  addFn(args: Argument[], ln: number): number {
    const arg1 = args[0]
    const arg2 = args[1]

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln)
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM,
    ], ln)

    const val1 = this.getValue(arg1)
    const val2 = this.getValue(arg2)

    if (val2 === undefined) {
      this.logger.push({
        type: 'error',
        value: `At line ${ln}. SOURCE argument should not be undefined`,
        ln
      })
      return -1
    }

    const result = (val1 || 0) + val2

    this.registers.set(arg1.intern as string, result)

    return ln
  }

  subFn(args: Argument[], ln: number): number {
    const arg1 = args[0]
    const arg2 = args[1]

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln)
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln)

    const val1 = this.getValue(arg1)
    const val2 = this.getValue(arg2)

    if (val2 === undefined) {
      this.logger.push({
        type: 'error',
        value: `At line ${ln}. Argument should be a valid integer.`,
        ln
      })
      return -1
    }

    const result = (val1 || 0) - val2

    this.registers.set(arg1.intern as string, result)

    return ln
  }

  printFn(args: Argument[], ln: number): number {
    const arg1 = args[0]

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln)

    const result = this.getValue(arg1)

    this.logger.push({
      type: 'message',
      value: result,
      ln
    })
    return ln
  }

  startFn(ln: number): number {
    return ln
  }

  endFn(): number {
    return -1
  }

  labelFn(args: Argument[], ln: number): number {
    const arg1 = args[0]

    Argument.validateType(arg1, [tokens.ARG_TYPES.LBL], ln)
    this.labels.set(arg1.literal, ln)
    return ln
  }

  tick(line: number): number {
    const op = this.operations[line - 1]

    if (!op) {
      this.logger.push({
        type: 'error',
        value: `At line ${line}. No operation found`,
        ln: line
      })
      return -1
    }

    
    const f = this[op.funcName as keyof Evaluator] as (args: Argument[], ln: number) => number

    if (!f) {
      this.logger.push({
        type: 'error',
        value: `At line ${line}. Instruction (${op.funcName}) not found`,
        ln: line
      })
      return -1
    }

    switch (op.type) {
    case tokens.FUNCTION_TYPES.FLOW:
      line = f(op.args, op.line)
      break

    case tokens.FUNCTION_TYPES.PROC:
      line = f(op.args, op.line)
      break
    }

    return line
  }
}

export default Evaluator