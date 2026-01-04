import Argument, {
  IArgument,
  ArgTypes,
  NumberArgument
} from './argument'

import Register, { RegisterArgument, RegistersType } from './registers'
import { IOperation } from './operation'
import Lists, { IListInput, IListOutput,} from './lists'
import Memory, { MemoryArgument, MemoryType } from './memory'
import { Logger } from './logger'


type InstructionArgument = {
  eva: TEvaluator,
  args: IArgument[]
}

export interface ConditionalFunction {
  (): boolean;
}

type TEvaluator = {
  inQ: IListInput
  outQ: IListOutput
  registers: RegistersType
  memory: MemoryType
  operations: IOperation[]
  logger: Logger[]
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
  addFn,
  subFn,
  prtFn
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

function getValue(eva: TEvaluator, argument: RegisterArgument | NumberArgument): number {
  if (argument.type === 'NUM') {
    return argument.intern
  }

  return eva.registers.get(argument.intern);
}

function popFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const arg1 = validateType(eva, args[0], ['REG'])


  if (!arg1) return -1

  let arg2 = validateType(eva, args[1], ['LST'])
  arg2 = validateLiteral(eva, args[1], 'INPUT')
  if (!arg2) return -1

  const firstArgument = arg1 as RegisterArgument

  const result = eva.inQ.pop()

  eva.registers.set(firstArgument.intern, result)
  return eva.line
}

function pushFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  let arg1 = validateType(eva, args[0], ['LST'])
  arg1 = validateLiteral(eva, args[0], 'OUTPUT')

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


  const firstArgument = Argument.createNumberArgument(args[0].literal);
  if (!firstArgument) return -1

  if (typeof args[1].intern !== 'function') {
    return -1
  }

  const secondArgument = Argument.createConditionalArgument(args[1].intern);

  if (!secondArgument) return -1

  if (secondArgument.intern()) {
    return firstArgument.intern
  };

  return eva.line
}

function jmpNegFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const firstArgument = Argument.createNumberArgument(args[0].literal);
  if (!firstArgument) return -1

  const secondArgument = Argument.createNumberArgument(args[1].literal) || Argument.createRegisterArgument(args[1].literal);
  if (!secondArgument) return -1

  const valueToCheck = getValue(eva, secondArgument);
  const condArgumet = Argument.createConditionalArgument(() => valueToCheck < 0)

  return jmpFn({ eva: eva, args: [firstArgument, condArgumet] })
}

function jmpPosFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const firstArgument = Argument.createNumberArgument(args[0].literal);
  if (!firstArgument) return -1

  const secondArgument = Argument.createNumberArgument(args[1].literal) || Argument.createRegisterArgument(args[1].literal)

  if (!secondArgument) return -1

  const valueToCheck = getValue(eva, secondArgument);
  const condArgumet = Argument.createConditionalArgument(() => valueToCheck > 0)
  return jmpFn({ eva: eva, args: [firstArgument, condArgumet] })
}

function jmpZeroFn(arg: InstructionArgument): number {
  const { eva, args } = arg

  const firstArgument = Argument.createNumberArgument(args[0].literal);
  if (!firstArgument) return -1

  const secondArgument = Argument.createNumberArgument(args[1].literal) || Argument.createRegisterArgument(args[1].literal)

  if (!secondArgument) return -1

  const valueToCheck = getValue(eva, secondArgument);
  const condArgumet = Argument.createConditionalArgument(() => valueToCheck == 0)
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

function prtFn(arg: InstructionArgument): number {
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
    addError(eva, `Instruction (${op.funcName}) does not exist.`)
    return -1
  }

  line = fn({ eva, args: op.args })

  return line
}

function newEvaluator(
  inQ?: IListInput,
  outQ?: IListOutput,
  registers?: RegistersType,
  memory?: MemoryType,
  operations?: IOperation[],
  logger?: Logger[],
  line?: number
): IEvaluator {

  const eva: TEvaluator = {
    inQ: inQ || Lists.createList('INPUT'),
    outQ: outQ || Lists.createList('OUTPUT'),
    registers: registers || Register.createRegister("registers"),
    memory: memory || Memory.createMemory(),
    operations: operations || [],
    logger: logger || [],
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
