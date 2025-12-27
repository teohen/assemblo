import Argument, {
  IArgument,
  ArgTypes,
  ConditionalArgument,
  NumberArgument
} from './argument'

import { RegisterArgument, RegistersType } from './registers'
import { IOperation } from './operation'
import { InputQ, OutputQ } from './lists'
import { LabelArgument, LabelType } from './labels'
import { MemoryArgument, MemoryType } from './memory'
import { Logger, LogType } from './logger'


type InstructionArgument = {
  eva: TEvaluator,
  args: IArgument[]
}

export interface ConditionalFunction {
  (): boolean;
}

type TEvaluator = {
  inQ: InputQ
  outQ: OutputQ
  registers: RegistersType
  memory: MemoryType
  operations: IOperation[]
  logger: Logger[]
  labels: LabelType
  line: number
}

export interface IEvaluator {
  eva: TEvaluator,
  tick: (line: number) => number
  validateType: (arg: IArgument, types: ArgTypes[]) => IArgument | undefined
  validateLiteral: (arg: IArgument, literal: string) => IArgument | undefined
}

const FUNCTION_LIST: Array<(arg: InstructionArgument) => number> = [
  popFn,
  pushFn,
  cpyFn,
  loadFn,
  jmpFn,
  jmpNegFn,
  jmpPosFn,
  jmpZeroFn,
  jmpUndFn,
  addFn,
  subFn,
  printFn
];

function addError(eva: TEvaluator, value: string): void {
  eva.logger.push({ ln: eva.line, type: 'error', value })
}

function addMessage(eva: TEvaluator, value?: string | number): void {
  eva.logger.push({ ln: eva.line, type: 'message', value })
}

function validateType(eva: TEvaluator, arg: IArgument, types: ArgTypes[]): IArgument | undefined {
  for (const t of types) {
    if (t === arg.type) {
      return arg
    }
  }

  addError(eva, `Invalid Argument Type: ${arg.type}. Expected: ${types}`)
  return undefined
}

function validateLiteral(eva: TEvaluator, arg: IArgument, literal: string): IArgument | undefined {
  if (arg.literal === literal) {
    return arg
  }

  addError(eva, `Invalid Argument Type: ${arg.type}. Expected: ${literal}`)
  return undefined
}

function popFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  let arg1 = validateType(eva, args[0], ['LST'])
  arg1 = validateLiteral(eva, args[0], 'INPUT')

  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['LST'])
  if (!arg2) return -1

  const firstArgument = arg1 as RegisterArgument

  const result = eva.inQ.pop()
  eva.registers.set(firstArgument.intern, result)
  return eva.line
}

function pushFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  let arg1 = validateType(eva, args[0], ['LST'])
  arg1 = validateLiteral(eva, args[0], 'INPUT')

  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['REG', 'NUM'])
  if (!arg2) return -1

  const secondArgument = arg2 as RegisterArgument | NumberArgument

  const result = secondArgument.type === 'REG' ? eva.registers.get(secondArgument.intern) : secondArgument.intern

  if (result === undefined) {
    addError(eva, `SOURCE argument (${secondArgument.literal}) is undefined`,)
    return -1
  }

  eva.outQ.push(result)

  return eva.line
}

function cpyFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const arg1 = validateType(eva, args[0], ['MEM'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['REG', 'NUM'])
  if (!arg2) return -1


  const firstArgument = arg1 as MemoryArgument
  const secondArgument = arg2 as RegisterArgument | NumberArgument


  const result = secondArgument.type === 'REG' ? eva.registers.get(secondArgument.intern) : secondArgument.intern

  if (result === undefined) {
    addError(eva, 'Cannot copy undefined value')
    return -1
  }

  eva.memory.set(firstArgument.intern, result)

  return eva.line
}

function loadFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const arg1 = validateType(eva, args[0], ['REG'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['MEM'])
  if (!arg2) return -1


  const firstArgument = arg1 as RegisterArgument
  const secondArgument = arg2 as MemoryArgument

  const result = eva.memory.get(secondArgument.intern)

  if (result === undefined) {
    addError(eva, 'Cannot copy undefined value')
    return -1
  }

  eva.registers.set(firstArgument.intern, result)

  return eva.line
}

function jmpFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const arg1 = validateType(eva, args[0], ['NUM'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['CND'])
  if (!arg2) return -1


  const firstArgument = arg1 as NumberArgument
  const secondArgument = arg2 as ConditionalArgument

  if (secondArgument.intern()) {
    return firstArgument.intern
  };

  return eva.line
}

function jmpNegFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const arg1 = validateType(eva, args[0], ['REG'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['MEM'])
  if (!arg2) return -1

  const firstArgument = arg1 as LabelArgument
  const secondArgument = arg2 as RegisterArgument

  if (!eva.labels.get(firstArgument.literal)) {
    addError(eva, `Can't find the label: ${firstArgument.literal}`)
    return -1
  }

  const valueToCheck = eva.registers.get(secondArgument.intern)

  const condition = () => {
    if (valueToCheck && valueToCheck < 0) {
      return true
    }

    return false
  }

  const condArgumet = Argument.createConditionalArgument(condition)

  return jmpFn({ eva: eva, args: [firstArgument, condArgumet] })
}

function jmpPosFn(arg: InstructionArgument): number {
  const { eva, args } = arg
  const arg1 = validateType(eva, args[0], ['REG'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['MEM'])
  if (!arg2) return -1

  const firstArgument = arg1 as LabelArgument
  const secondArgument = arg2 as RegisterArgument

  if (!eva.labels.get(firstArgument.literal)) {
    addError(eva, `Can't find the label: ${firstArgument.literal}`)
    return -1
  }

  const valueToCheck = eva.registers.get(secondArgument.intern)

  const condition = () => {
    if (valueToCheck && valueToCheck > 0) {
      return true
    }

    return false
  }

  const condArgumet = Argument.createConditionalArgument(condition)

  return jmpFn({ eva: eva, args: [firstArgument, condArgumet] })
}

function jmpZeroFn(arg: InstructionArgument): number {
  const { eva, args } = arg
  const arg1 = validateType(eva, args[0], ['REG'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['MEM'])
  if (!arg2) return -1

  const firstArgument = arg1 as LabelArgument
  const secondArgument = arg2 as RegisterArgument

  if (!eva.labels.get(firstArgument.literal)) {
    addError(eva, `Can't find the label: ${firstArgument.literal}`)
    return -1
  }

  const valueToCheck = eva.registers.get(secondArgument.intern)

  const condition = () => {
    if (valueToCheck === 0) {
      return true
    }

    return false
  }

  const condArgumet = Argument.createConditionalArgument(condition)

  return jmpFn({ eva: eva, args: [firstArgument, condArgumet] })
}

function jmpUndFn(arg: InstructionArgument): number {
  const { eva, args } = arg
  const arg1 = validateType(eva, args[0], ['REG'])
  if (!arg1) return -1

  const arg2 = validateType(eva, args[1], ['MEM'])
  if (!arg2) return -1

  const firstArgument = arg1 as LabelArgument
  const secondArgument = arg2 as RegisterArgument

  if (!eva.labels.get(firstArgument.literal)) {
    addError(eva, `Can't find the label: ${firstArgument.literal}`)
    return -1
  }

  const valueToCheck = eva.registers.get(secondArgument.intern)

  const condition = () => {
    if (valueToCheck === undefined) {
      return true
    }

    return false
  }

  const condArgumet = Argument.createConditionalArgument(condition)

  return jmpFn({ eva: eva, args: [firstArgument, condArgumet] })
}

function addFn(arg: InstructionArgument): number {
  const { eva, args } = arg
  const firstArgument = args[0] as RegisterArgument
  const secondArgument = args[1] as RegisterArgument | NumberArgument


  const val1 = eva.registers.get(firstArgument.intern)
  const val2 = secondArgument.type === 'REG' ? eva.registers.get(secondArgument.intern) : secondArgument.intern

  if (val2 === undefined) {
    addError(eva, 'SOURCE argument should not be undefined')
    return -1
  }

  const result = (val1 || 0) + val2

  eva.registers.set(firstArgument.intern, result)

  return eva.line
}

function subFn(arg: InstructionArgument): number {
  const { eva, args } = arg
  const firstArgument = args[0] as RegisterArgument
  const secondArgument = args[1] as RegisterArgument | NumberArgument


  const val1 = eva.registers.get(firstArgument.intern)
  const val2 = secondArgument.type === 'REG' ? eva.registers.get(secondArgument.intern) : secondArgument.intern

  if (val2 === undefined) {
    addError(eva, 'SOURCE argument should not be undefined')
    return -1
  }

  const result = (val1 || 0) - val2

  eva.registers.set(firstArgument.intern, result)

  return eva.line
}

function printFn(arg: InstructionArgument): number {
  const { eva, args } = arg
  const firstArgument = args[0] as RegisterArgument

  const result = eva.registers.get(firstArgument.intern)
  addMessage(eva, result)
  return eva.line
}

function tick(eva: TEvaluator, line: number): number {
  line = line
  const op = eva.operations[line - 1]

  if (!op) {
    addError(eva, 'No operation found')
    return -1
  }

  const fn = FUNCTION_LIST.find((fn) => fn.name === op.funcName)

  if (!fn) {
    addError(eva, `Instruction (${op.funcName}) not found`)
    return -1
  }

  line = fn({ eva, args: op.args })

  return eva.line
}

function newEvaluator(
  inQ?: InputQ,
  outQ?: OutputQ,
  registers?: RegistersType,
  memory?: MemoryType,
  operations?: IOperation[],
  logger?: Logger[],
  labels?: LabelType,
  line?: number
): IEvaluator {

  const eva: TEvaluator = {
    inQ: inQ || [],
    outQ: outQ || [],
    registers: registers || new Map(),
    memory: memory || new Map(),
    operations: operations || [],
    logger: logger || [],
    labels: labels || new Map(),
    line: line || 0
  }

  const obj: IEvaluator = {
    eva,
    tick: (line: number) => tick(eva, line),
    validateType: (arg: IArgument, types: ArgTypes[]) => validateType(eva, arg, types),
    validateLiteral: (arg: IArgument, literal: string) => validateLiteral(eva, arg, literal)
  }

  return obj
}

export default {
  newEvaluator
}