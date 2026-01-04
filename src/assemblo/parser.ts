import tokens from './tokens'
import Operation, { IOperation } from './operation'
import Argument, {
  IArgument,
} from './argument'

type TParser = {
  code: string
  lines: string[]
  operations: IOperation[]
  procedures: string[]
  flow: string[]
}

export interface IParser {
  parser: TParser,
  parseArgument: (arg: string, lineNum: number) => IArgument
  parseLine: (line: string, num: number) => IOperation
  setUp: () => void
  parse: (code: string) => IOperation[]
}


function removeWhitespace(input: string): string {
  const res = input.replaceAll('\t', '').replaceAll(' ', '')
  return res
}

function validateArgsLength(args: string[], expLen: number, numLine: number, funcName: string): void {
  if (args.length !== expLen) {
    throw new Error(
      `AT LINE: ${numLine}. (${funcName}) GOT WRONG NUMBER OF ARGUMENTS: ${args.length}`,
    )
  }
}

function parseArgument(arg: string, lineNum: number): IArgument {
  if (arg in tokens.REGISTERS) {
    return Argument.createRegisterArgument(arg)
  }

  if (arg in tokens.MEMORY) {
    return Argument.createMemoryArgument(arg)
  }

  if (arg in tokens.LISTS) {
    return Argument.createListArgument(arg)
  }

  if (arg[0] === '.') {
    return Argument.createLabelArgument(arg)
  }

  if (/^-?[0-9]\d*$/.test(arg)) {
    const num = Argument.createNumberArgument(arg);
    if (num) return num
  }

  throw new Error(`AT LINE: ${lineNum}. UNKNOWN ARGUMENT: ${arg}`)
}

function parseLine(p: TParser, line: string, num: number): IOperation {
  const op = Operation.createOperation(num, '', [])
  const ONE_ARGS = ['PRT', 'LBL']
  const parts = line.split(':')

  const fPart = parts[0]

  if (!(fPart in tokens.FUNCTIONS)) {
    throw new Error(`AT LINE: ${num}. UNKNOWN INSTRUCTION: ${fPart}`)
  }

  const functions = tokens.FUNCTIONS as Record<string, string>

  op.funcName = functions[fPart]

  if (fPart === 'START' || fPart === 'END') return op

  const args = parts[1].split(',')

  if (!ONE_ARGS.includes(fPart)) {
    validateArgsLength(args, 2, num, fPart)
  }

  if (ONE_ARGS.includes(fPart)) {
    validateArgsLength(args, 1, num, fPart)
  }

  for (const arg of args) {
    if (arg.length > 0) op.args.push(parseArgument(arg, num))
  }

  return op
}

function setUp(p: TParser): void {
  p.lines = p.code.split('\n')

  p.procedures = [
    tokens.FUNCTIONS.POP,
    tokens.FUNCTIONS.CPY,
    tokens.FUNCTIONS.ADD,
    tokens.FUNCTIONS.PUSH,
    tokens.FUNCTIONS.LOAD,
    tokens.FUNCTIONS.SUB,
    tokens.FUNCTIONS.PRT,
    tokens.FUNCTIONS.LBL,
  ]
  p.flow = [
    tokens.FUNCTIONS.JMP_N,
    tokens.FUNCTIONS.JMP_P,
    tokens.FUNCTIONS.JMP_Z,
    tokens.FUNCTIONS.JMP_U,
    tokens.FUNCTIONS.START,
    tokens.FUNCTIONS.END
  ]
}

function parse(p: TParser, code: string): IOperation[] {
  p.code = code;

  setUp(p)

  let lNumber = 1

  for (const line of p.lines) {
    const escapedLine = removeWhitespace(line)

    if (escapedLine.length < 1) {
      continue
    }

    const op = parseLine(p, escapedLine, lNumber)
    p.operations.push(op)
    lNumber += 1
  }

  return p.operations
}



function newParser(
  code?: string,
  lines?: string[],
  operations?: IOperation[],
  procedures?: string[],
  flow?: string[]
): IParser {

  const newCode = code || "";

  const parser: TParser = {
    code: newCode,
    lines: lines || [],
    operations: operations || [],
    procedures: procedures || [],
    flow: flow || []
  }


  const obj: IParser = {
    parser,
    parse: (code: string) => parse(parser, code),
    parseArgument: (arg: string, lineNum: number) => parseArgument(arg, lineNum),
    parseLine: (line: string, num: number) => parseLine(parser, line, num),
    setUp: () => setUp(parser),
  }

  return obj
}

export default {
  newParser
}
