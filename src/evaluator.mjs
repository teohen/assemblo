import tokens from "./tokens.mjs";
import Argument from "./argument.mjs";

class Evaluator {
  inQ;
  outQ;
  registers;
  memory;
  operations;
  logger;


  constructor(inQ, outQ, registers, memory, operations, logger) {
    if (!Array.isArray(inQ) && inQ.length == 0) {
      throw new Error("InQ should be a non empty array")
    }

    this.registers = registers;
    this.memory = memory;
    this.operations = operations
    this.logger = logger;

    this.inQ = inQ;
    this.outQ = outQ;

    this.popFn = this.popFn.bind(this);
    this.cpyFn = this.cpyFn.bind(this);
    this.addFn = this.addFn.bind(this);
    this.pushFn = this.pushFn.bind(this);
    this.loadFn = this.loadFn.bind(this);
    this.subFn = this.subFn.bind(this);
    this.printFn = this.printFn.bind(this);
    this.startFn = this.startFn.bind(this);
    this.endFn = this.endFn.bind(this);


    this.jmpNegFn = this.jmpNegFn.bind(this);
    this.jmpPosFn = this.jmpPosFn.bind(this);
    this.jmpZeroFn = this.jmpZeroFn.bind(this);
    this.jmpUndFn = this.jmpUndFn.bind(this);
  }

  getValue(arg) {
    switch (arg.type) {
      case tokens.ARG_TYPES.REG:
        return this.registers.get(arg.intern);

      case tokens.ARG_TYPES.NUM:
        return arg.intern;

      case tokens.ARG_TYPES.MEM:
        return this.memory.get(arg.intern);

      default:
        throw new Error(`Invalid Argument: ${arg.literal}`)
    }

  }

  popFn(args, ln) {
    // POP: REG, INPUT
    const arg1 = args[0];
    const arg2 = args[1];

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln);
    Argument.validateType(arg2, [tokens.ARG_TYPES.LIST], ln);

    Argument.validateValue(arg2, tokens.LISTS.INPUT);

    const result = this.inQ.pop();

    this.registers.set(arg1.intern, result);

    return ln;
  }

  pushFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];

    Argument.validateType(arg1, [tokens.ARG_TYPES.LIST], ln);
    Argument.validateType(arg2,
      [
        tokens.ARG_TYPES.REG,
        tokens.ARG_TYPES.NUM
      ], ln);

    const result = this.getValue(arg2);
    this.outQ.push(result);

    return ln;
  }

  cpyFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];

    Argument.validateType(arg1, [tokens.ARG_TYPES.MEM], ln);

    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln);

    const result = this.getValue(arg2);
    this.memory.set(arg1.intern, result);

    return ln;
  }

  loadFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln);
    Argument.validateType(arg2, [tokens.ARG_TYPES.MEM], ln);

    const result = this.getValue(arg2); 
    this.registers.set(arg1.intern, result);
    return ln;
  }

  jmpNegFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    Argument.validateType(arg1, [tokens.ARG_TYPES.NUM], ln);
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln);

    if (arg1.literal > this.operations.length || arg1.literal < 0) {
      throw new Error(
        `AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.literal}`,
      );
    }

    const val = this.getValue(arg2)

    if (val < 0) return arg1.intern - 1;

    return ln;
  }

  jmpPosFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    Argument.validateType(arg1, [tokens.ARG_TYPES.NUM], ln);
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln);

    if (arg1.literal > this.operations.length || arg1.literal < 0) {
      throw new Error(
        `AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.literal}`,
      );
    }

    const val = this.getValue(arg2);

    if (val > 0) return arg1.intern - 1;

    return ln;
  }

  jmpZeroFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    Argument.validateType(arg1, [tokens.ARG_TYPES.NUM], ln);
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM,
    ]
      , ln);

    if (arg1.literal > this.operations.length || arg1.literal < 0) {
      throw new Error(
        `AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.literal}`,
      );
    }

    const val = this.getValue(arg2);

    if (val == 0) return arg1.intern - 1;

    return ln;
  }

  jmpUndFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    Argument.validateType(arg1, [tokens.ARG_TYPES.NUM], ln);
    Argument.validateType(arg2, [tokens.ARG_TYPES.REG], ln);

    if (arg1.literal > this.operations.length || arg1.literal < 0) {
      throw new Error(
        `AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.literal}`,
      );
    }

    const val = this.getValue(arg2);

    if (val == undefined) return arg1.intern - 1;

    return ln;
  }

  addFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln);
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM,
    ], ln);

    const val1 = this.getValue(arg1);
    const val2 = this.getValue(arg2);

    if (val2 === undefined) {
      this.logger.push({ type: 'error', value: `At line ${ln}. Source argument should not be undefined` })
      return -1;
    }

    const result = (val1 || 0) + val2 

    this.registers.set(arg1.intern, result);

    return ln;
  }

  subFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln);
    Argument.validateType(arg2, [
      tokens.ARG_TYPES.REG,
      tokens.ARG_TYPES.NUM
    ], ln);

    const val1 = this.getValue(arg1)
    const val2 = this.getValue(arg2)

    if (val2 === undefined) {
      this.logger.push({ type: 'error', value: `At line ${ln}. Argument should be a valid integer.` })
      return -1;
    }

    const result = (val1 || 0) - val2

    this.registers.set(arg1.intern, result);

    return ln;
  }

  printFn(args, ln) {
    const arg1 = args[0];

    Argument.validateType(arg1, [tokens.ARG_TYPES.REG], ln);

    const result = this.getValue(arg1)


    this.logger.push({ type: 'message', value: result })
    return ln;
  }

  startFn(args, ln) {
    return ln;
  }

  endFn(args, ln) {
    return -1;
  }

  tick(line) {
    const op = this.operations[line - 1];
    const f = this[op.funcName];

    if (!f) {
      this.logger.push({ type: 'error', value: `At line ${line}. Instruction (${op.funcName}) not found` })
      return -1
    }

    switch (op.type) {
      case tokens.FUNCTION_TYPES.FLOW:
        line = f(op.args, op.line);
        break;

      case tokens.FUNCTION_TYPES.PROC:
        line = f(op.args, op.line)
        break;
    }

    return line;
  }
}

export default Evaluator;
