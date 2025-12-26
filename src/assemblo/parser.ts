import tokens from './tokens'
import Operation from './operation'
import Argument from './argument'

class Parser {
  code: string
  lines: string[]
  operations: Operation[]
  procedures: string[]
  flow: string[]

  constructor() {
    this.code = ''
    this.lines = []
    this.operations = []
    this.procedures = []
    this.flow = []
  }

  removeWhitespace(input: string): string {
    const res = input.replaceAll('\t', '').replaceAll(' ', '')
    return res
  }

  validateArgsLength(args: string[], expLen: number, numLine: number, funcName: string): void {
    if (args.length !== expLen) {
      throw new Error(
        `AT LINE: ${numLine}. (${funcName}) GOT WRONG NUMBER OF ARGUMENTS: ${args.length}`,
      )
    }
  }

  parseArgument(arg: string, lineNum: number): Argument {
    if (arg in tokens.REGISTERS) {
      return new Argument(tokens.ARG_TYPES.REG, arg, (tokens.REGISTERS as Record<string, string>)[arg])
    }

    if (arg in tokens.MEMORY) {
      return new Argument(tokens.ARG_TYPES.MEM, arg, (tokens.MEMORY as Record<string, string>)[arg])
    }

    if (arg in tokens.LISTS) {
      return new Argument(tokens.ARG_TYPES.LIST, arg, (tokens.LISTS as Record<string, string>)[arg])
    }

    if (arg[0] === '.') {
      return new Argument(tokens.ARG_TYPES.LBL, arg, arg)
    }

    if (/^-?[0-9]\d*$/.test(arg)) {
      const numValue = parseInt(arg, 10)
      return new Argument(tokens.ARG_TYPES.NUM, numValue.toString(), numValue)
    }

    throw new Error(`AT LINE: ${lineNum}. UNKNOWN ARGUMENT: ${arg}`)
  }

  parseLine(line: string, num: number): Operation {
    const op = new Operation(num, '', [], 'FLOW')
    const ONE_ARGS = ['PRT', 'LBL']
    const parts = line.split(':')

    const fPart = parts[0]

    if (!(fPart in tokens.FUNCTIONS)) {
      throw new Error(`AT LINE: ${num}. UNKNOWN INSTRUCTION: ${fPart}`)
    }

    const functions = tokens.FUNCTIONS as Record<string, string>

    if (this.procedures.includes(functions[fPart])) {
      op.type = tokens.FUNCTION_TYPES.PROC
    } else {
      op.type = tokens.FUNCTION_TYPES.FLOW
    }

    op.funcName = functions[fPart]

    if (fPart === 'START' || fPart === 'END') return op

    const args = parts[1].split(',')

    if (!ONE_ARGS.includes(fPart)) {
      this.validateArgsLength(args, 2, num, fPart)
    }

    if (ONE_ARGS.includes(fPart)) {
      this.validateArgsLength(args, 1, num, fPart)
    }

    for (const arg of args) {
      if (arg.length > 0) op.args.push(this.parseArgument(arg, num))
    }

    return op
  }

  setUp(): void {
    this.lines = this.code.split('\n')

    this.procedures = [
      tokens.FUNCTIONS.POP,
      tokens.FUNCTIONS.CPY,
      tokens.FUNCTIONS.ADD,
      tokens.FUNCTIONS.PUSH,
      tokens.FUNCTIONS.LOAD,
      tokens.FUNCTIONS.SUB,
      tokens.FUNCTIONS.PRT,
      tokens.FUNCTIONS.LBL,
    ]
    this.flow = [
      tokens.FUNCTIONS.JMP_N,
      tokens.FUNCTIONS.JMP_P,
      tokens.FUNCTIONS.JMP_Z,
      tokens.FUNCTIONS.JMP_U,
      tokens.FUNCTIONS.START,
      tokens.FUNCTIONS.END
    ]
  }

  parse(code: string): Operation[] {
    this.code = code

    this.setUp()

    let lNumber = 1

    for (const line of this.lines) {
      const escapedLine = this.removeWhitespace(line)

      if (escapedLine.length < 1) {
        continue
      }

      const op = this.parseLine(escapedLine, lNumber)
      this.operations.push(op)
      lNumber += 1
    }

    return this.operations
  }
}

export default Parser