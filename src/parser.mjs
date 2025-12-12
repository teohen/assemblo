
import tokens from "./tokens.mjs";
import Operation from "./operation.mjs";
import Argument from "./argument.mjs";

class Parser {
  code;
  lines;
  operations;
  procedures;
  flow;
  ONE_ARGS;

  constructor() {
    this.code = '';
    this.lines = [];
    this.operations = [];
    this.procedures = [];
    this.flow = [];
  }

  removeWhitespace(input) {
    const res = input.replaceAll("\t", "").replaceAll(" ", "");
    return res;
  }

  validateArgsLength(args, expLen, numLine, funcName) {
    if (args.length != expLen) {
      throw new Error(
        `AT LINE: ${numLine}. (${funcName}) GOT WRONG NUMBER OF ARGUMENTS: ${args.length}`,
      );
    }
  }

  parseArgument(arg, lineNum) {

    if (arg in tokens.REGISTERS) {
      return new Argument(tokens.ARG_TYPES.REG, arg, tokens.REGISTERS[arg]);
    }

    if (arg in tokens.MEMORY) {
      return new Argument(tokens.ARG_TYPES.MEM, arg, tokens.MEMORY[arg]);
    }

    if (arg in tokens.LISTS) {
      return new Argument(tokens.ARG_TYPES.LIST, arg, tokens.LISTS[arg]);
    }
    
    if (/^[1-9]\d*$/.test(arg)) {
      return new Argument(tokens.ARG_TYPES.NUM, parseInt(arg), parseInt(arg));
    }

    throw new Error(`AT LINE: ${lineNum}. UNKNOWN ARGUMENT: ${arg}`);
  }

  parseLine(line, num) {
    const op = new Operation(num, undefined, [], undefined);

    const ONE_ARGS = ["PRT"];
    const parts = line.split(":");

    const fPart = parts[0];

    if (!(fPart in tokens.FUNCTIONS)) {
      throw new Error(`AT LINE: ${num}. UNKNOWN INSTRUCTION: ${fPart}`);
    }

    if (this.procedures.includes(tokens.FUNCTIONS[fPart])) {
      op.type = tokens.FUNCTION_TYPES.PROC
    } else {
      op.type = tokens.FUNCTION_TYPES.FLOW
    }

    op.funcName = tokens.FUNCTIONS[fPart]

    if (fPart == "START" || fPart == "END") return op;

    const args = parts[1].split(",");


    if (!ONE_ARGS.includes(fPart)) {
      this.validateArgsLength(args, 2, num, fPart)
    }

    if (ONE_ARGS.includes(fPart)) {
      this.validateArgsLength(args, 1, num, fPart)
    }

    for (const arg of args) {
      if (arg.length > 0) op.args.push(this.parseArgument(arg, num));
    }

    return op;
  }

  setUp() {
    this.lines = this.code.split("\n");

    this.procedures = [
      tokens.FUNCTIONS.POP,
      tokens.FUNCTIONS.CPY,
      tokens.FUNCTIONS.ADD,
      tokens.FUNCTIONS.PUSH,
      tokens.FUNCTIONS.LOAD,
      tokens.FUNCTIONS.SUB,
      tokens.FUNCTIONS.PRT,
    ];
    this.flow = [
      tokens.FUNCTIONS.JMP_N,
      tokens.FUNCTIONS.JMP_P,
      tokens.FUNCTIONS.JMP_Z,
      tokens.FUNCTIONS.JMP_U,
      tokens.FUNCTIONS.START,
      tokens.FUNCTIONS.END
    ];
  }

  parse(code) {
    this.code = code;

    this.setUp()

    let lNumber = 1;

    for (let line of this.lines) {
      const escapedLine = this.removeWhitespace(line);

      if (escapedLine.length < 1) {
        continue;
      }

      const op = this.parseLine(escapedLine, lNumber);
      this.operations.push(op);
      lNumber += 1;
    }

    return this.operations
  }
}

export default Parser;