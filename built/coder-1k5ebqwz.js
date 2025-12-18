// src/assemblo/tokens.ts
var FUNCTIONS = {
  START: "startFn",
  END: "endFn",
  POP: "popFn",
  PUSH: "pushFn",
  CPY: "cpyFn",
  JMP_N: "jmpNegFn",
  JMP_P: "jmpPosFn",
  JMP_Z: "jmpZeroFn",
  JMP_U: "jmpUndFn",
  ADD: "addFn",
  SUB: "subFn",
  LOAD: "loadFn",
  PRT: "printFn"
};
var REGISTERS = {
  r0: "R0X",
  r1: "R1X",
  r2: "R2X"
};
var MEMORY = {
  mx0: "MX0",
  mx1: "MX1",
  mx2: "MX2"
};
var LISTS = {
  INPUT: "INP_LIST",
  OUTPUT: "OUT_LIST"
};
var ARG_TYPES = {
  MEM: "MEM",
  REG: "REG",
  LIST: "LST",
  NUM: "NUM"
};
var FUNCTION_TYPES = {
  PROC: "PROC",
  FLOW: "FLOW"
};
var tokens = {
  FUNCTIONS,
  REGISTERS,
  MEMORY,
  ARG_TYPES,
  FUNCTION_TYPES,
  LISTS
};
var tokens_default = tokens;

// src/assemblo/operation.ts
class Operation {
  line;
  funcName;
  args;
  type;
  constructor(line, funcName, args, type) {
    this.line = line;
    this.funcName = funcName;
    this.args = args;
    this.type = type;
  }
}
var operation_default = Operation;

// src/assemblo/argument.ts
class Argument {
  type;
  literal;
  intern;
  constructor(type, literal, intern) {
    if (type === undefined || type === null) {
      throw new Error("Args required: type");
    }
    if (literal === undefined || literal === null) {
      throw new Error("Args required: literal");
    }
    if (intern === undefined || intern === null) {
      throw new Error("Args required: intern");
    }
    this.type = type;
    this.literal = literal;
    this.intern = intern;
  }
  static validateType(arg, expTypeList, ln) {
    let valid = false;
    for (const expType of expTypeList) {
      if (arg.type === expType) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      throw new Error(`AT LINE: ${ln}. INVALID ARGUMENT TYPE: ${arg.type}, EXPECTED: ${expTypeList.join(", ")}`);
    }
    return valid;
  }
  static validateValue(arg, expValue, ln) {
    return arg.intern === expValue;
  }
}
var argument_default = Argument;

// src/assemblo/parser.ts
class Parser {
  code;
  lines;
  operations;
  procedures;
  flow;
  constructor() {
    this.code = "";
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
    if (args.length !== expLen) {
      throw new Error(`AT LINE: ${numLine}. (${funcName}) GOT WRONG NUMBER OF ARGUMENTS: ${args.length}`);
    }
  }
  parseArgument(arg, lineNum) {
    if (arg in tokens_default.REGISTERS) {
      return new argument_default(tokens_default.ARG_TYPES.REG, arg, tokens_default.REGISTERS[arg]);
    }
    if (arg in tokens_default.MEMORY) {
      return new argument_default(tokens_default.ARG_TYPES.MEM, arg, tokens_default.MEMORY[arg]);
    }
    if (arg in tokens_default.LISTS) {
      return new argument_default(tokens_default.ARG_TYPES.LIST, arg, tokens_default.LISTS[arg]);
    }
    if (/^-?[0-9]\d*$/.test(arg)) {
      const numValue = parseInt(arg, 10);
      return new argument_default(tokens_default.ARG_TYPES.NUM, numValue.toString(), numValue);
    }
    throw new Error(`AT LINE: ${lineNum}. UNKNOWN ARGUMENT: ${arg}`);
  }
  parseLine(line, num) {
    const op = new operation_default(num, "", [], "FLOW");
    const ONE_ARGS = ["PRT"];
    const parts = line.split(":");
    const fPart = parts[0];
    if (!(fPart in tokens_default.FUNCTIONS)) {
      throw new Error(`AT LINE: ${num}. UNKNOWN INSTRUCTION: ${fPart}`);
    }
    const functions = tokens_default.FUNCTIONS;
    if (this.procedures.includes(functions[fPart])) {
      op.type = tokens_default.FUNCTION_TYPES.PROC;
    } else {
      op.type = tokens_default.FUNCTION_TYPES.FLOW;
    }
    op.funcName = functions[fPart];
    if (fPart === "START" || fPart === "END")
      return op;
    const args = parts[1].split(",");
    if (!ONE_ARGS.includes(fPart)) {
      this.validateArgsLength(args, 2, num, fPart);
    }
    if (ONE_ARGS.includes(fPart)) {
      this.validateArgsLength(args, 1, num, fPart);
    }
    for (const arg of args) {
      if (arg.length > 0)
        op.args.push(this.parseArgument(arg, num));
    }
    return op;
  }
  setUp() {
    this.lines = this.code.split(`
`);
    this.procedures = [
      tokens_default.FUNCTIONS.POP,
      tokens_default.FUNCTIONS.CPY,
      tokens_default.FUNCTIONS.ADD,
      tokens_default.FUNCTIONS.PUSH,
      tokens_default.FUNCTIONS.LOAD,
      tokens_default.FUNCTIONS.SUB,
      tokens_default.FUNCTIONS.PRT
    ];
    this.flow = [
      tokens_default.FUNCTIONS.JMP_N,
      tokens_default.FUNCTIONS.JMP_P,
      tokens_default.FUNCTIONS.JMP_Z,
      tokens_default.FUNCTIONS.JMP_U,
      tokens_default.FUNCTIONS.START,
      tokens_default.FUNCTIONS.END
    ];
  }
  parse(code) {
    this.code = code;
    this.setUp();
    let lNumber = 1;
    for (const line of this.lines) {
      const escapedLine = this.removeWhitespace(line);
      if (escapedLine.length < 1) {
        continue;
      }
      const op = this.parseLine(escapedLine, lNumber);
      this.operations.push(op);
      lNumber += 1;
    }
    return this.operations;
  }
}
var parser_default = Parser;

// src/assemblo/evaluator.ts
class Evaluator {
  inQ;
  outQ;
  registers;
  memory;
  operations;
  logger;
  constructor(inQ, outQ, registers, memory, operations, logger) {
    if (!Array.isArray(inQ) || inQ.length === 0) {
      throw new Error("InQ should be a non empty array");
    }
    this.registers = registers;
    this.memory = memory;
    this.operations = operations;
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
      case tokens_default.ARG_TYPES.REG:
        return this.registers.get(arg.intern);
      case tokens_default.ARG_TYPES.NUM:
        return arg.intern;
      case tokens_default.ARG_TYPES.MEM:
        return this.memory.get(arg.intern);
      default:
        throw new Error(`Invalid Argument: ${arg.literal}`);
    }
  }
  popFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.REG], ln);
    argument_default.validateType(arg2, [tokens_default.ARG_TYPES.LIST], ln);
    if (!argument_default.validateValue(arg2, tokens_default.LISTS.INPUT, ln)) {
      this.logger.push({
        type: "error",
        value: `At line: ${ln}. Invalid Argument (${arg2.literal}). Expected: INPUT`,
        ln
      });
      return -1;
    }
    const result = this.inQ.pop();
    if (result === undefined) {
      this.logger.push({
        type: "error",
        value: `At line: ${ln}. Input queue is empty`,
        ln
      });
      return -1;
    }
    this.registers.set(arg1.intern, result);
    return ln;
  }
  pushFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.LIST], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    if (!argument_default.validateValue(arg1, tokens_default.LISTS.OUTPUT, ln)) {
      this.logger.push({
        type: "error",
        value: `At line: ${ln}. Invalid Argument (${arg1.literal}). Expected: OUTPUT`,
        ln
      });
      return -1;
    }
    const result = this.getValue(arg2);
    if (result === undefined) {
      this.logger.push({
        type: "error",
        value: `At line ${ln}. SOURCE argument (${arg2.literal}) is undefined`,
        ln
      });
      return -1;
    }
    this.outQ.push(result);
    return ln;
  }
  cpyFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.MEM], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    const result = this.getValue(arg2);
    if (result === undefined) {
      this.logger.push({
        type: "error",
        value: `At line ${ln}. Cannot copy undefined value`,
        ln
      });
      return -1;
    }
    this.memory.set(arg1.intern, result);
    return ln;
  }
  loadFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.REG], ln);
    argument_default.validateType(arg2, [tokens_default.ARG_TYPES.MEM], ln);
    const result = this.getValue(arg2);
    if (result === undefined) {
      this.logger.push({
        type: "error",
        value: `At line ${ln}. Cannot load undefined value from memory`,
        ln
      });
      return -1;
    }
    this.registers.set(arg1.intern, result);
    return ln;
  }
  jmpNegFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.NUM], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    if (arg1.intern > this.operations.length || arg1.intern < 0) {
      throw new Error(`AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.intern}`);
    }
    const val = this.getValue(arg2);
    if (val === undefined) {
      return ln;
    }
    if (val < 0)
      return arg1.intern - 1;
    return ln;
  }
  jmpPosFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.NUM], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    if (arg1.intern > this.operations.length || arg1.intern < 0) {
      throw new Error(`AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.intern}`);
    }
    const val = this.getValue(arg2);
    if (val === undefined) {
      return ln;
    }
    if (val > 0)
      return arg1.intern - 1;
    return ln;
  }
  jmpZeroFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.NUM], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    if (arg1.intern > this.operations.length || arg1.intern < 0) {
      throw new Error(`AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.intern}`);
    }
    const val = this.getValue(arg2);
    if (val === undefined) {
      return ln;
    }
    if (val === 0)
      return arg1.intern - 1;
    return ln;
  }
  jmpUndFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.NUM], ln);
    argument_default.validateType(arg2, [tokens_default.ARG_TYPES.REG], ln);
    if (arg1.intern > this.operations.length || arg1.intern < 0) {
      throw new Error(`AT LINE: ${ln}. CAN'T JUMP TO INVALID LINE: ${arg1.intern}`);
    }
    const val = this.getValue(arg2);
    if (val === undefined)
      return arg1.intern - 1;
    return ln;
  }
  addFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.REG], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    const val1 = this.getValue(arg1);
    const val2 = this.getValue(arg2);
    if (val2 === undefined) {
      this.logger.push({
        type: "error",
        value: `At line ${ln}. SOURCE argument should not be undefined`,
        ln
      });
      return -1;
    }
    const result = (val1 || 0) + val2;
    this.registers.set(arg1.intern, result);
    return ln;
  }
  subFn(args, ln) {
    const arg1 = args[0];
    const arg2 = args[1];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.REG], ln);
    argument_default.validateType(arg2, [
      tokens_default.ARG_TYPES.REG,
      tokens_default.ARG_TYPES.NUM
    ], ln);
    const val1 = this.getValue(arg1);
    const val2 = this.getValue(arg2);
    if (val2 === undefined) {
      this.logger.push({
        type: "error",
        value: `At line ${ln}. Argument should be a valid integer.`,
        ln
      });
      return -1;
    }
    const result = (val1 || 0) - val2;
    this.registers.set(arg1.intern, result);
    return ln;
  }
  printFn(args, ln) {
    const arg1 = args[0];
    argument_default.validateType(arg1, [tokens_default.ARG_TYPES.REG], ln);
    const result = this.getValue(arg1);
    this.logger.push({
      type: "message",
      value: result,
      ln
    });
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
    if (!op) {
      this.logger.push({
        type: "error",
        value: `At line ${line}. No operation found`,
        ln: line
      });
      return -1;
    }
    const f = this[op.funcName];
    if (!f) {
      this.logger.push({
        type: "error",
        value: `At line ${line}. Instruction (${op.funcName}) not found`,
        ln: line
      });
      return -1;
    }
    switch (op.type) {
      case tokens_default.FUNCTION_TYPES.FLOW:
        line = f(op.args, op.line);
        break;
      case tokens_default.FUNCTION_TYPES.PROC:
        line = f(op.args, op.line);
        break;
    }
    return line;
  }
}
var evaluator_default = Evaluator;

// src/assemblo/program.ts
var status = {
  READY: "ready",
  PARSING: "parsing",
  PARSED: "parsed",
  RUNNING: "running",
  FINISHED: "ended"
};

class Program {
  clock;
  parser;
  evaluator;
  registers;
  memory;
  inQ;
  outQ;
  status;
  logger;
  line;
  constructor() {
    this.clock = 2;
    this.line = 0;
    this.status = status.READY;
    this.parser = new parser_default;
    this.evaluator = new evaluator_default([], [], new Map, new Map, [], []);
    this.registers = new Map;
    this.memory = new Map;
    this.inQ = [];
    this.outQ = [];
    this.logger = [];
  }
  isReady() {
    return this.status === status.READY;
  }
  isRunning() {
    return this.status === status.RUNNING;
  }
  test(expectedOutput) {
    for (let i = 0;i < expectedOutput.length; i++) {
      const exp = expectedOutput[i];
      const out = this.outQ[i];
      if (exp !== out) {
        this.logger.push({
          type: "error",
          value: "incorrect answer",
          ln: -1
        });
        return;
      }
    }
    this.logger.push({
      type: "success",
      value: "PASSED!!!",
      ln: -1
    });
  }
  reset(inQ) {
    this.line = 0;
    this.clock = 2;
    this.status = status.READY;
    this.registers = new Map;
    this.memory = new Map;
    this.inQ = inQ.slice();
    this.outQ = [];
    this.logger = [];
    this.registers.set(tokens_default.REGISTERS.r0, undefined);
    this.registers.set(tokens_default.REGISTERS.r1, undefined);
    this.registers.set(tokens_default.REGISTERS.r2, undefined);
    this.memory.set(tokens_default.MEMORY.mx0, undefined);
    this.memory.set(tokens_default.MEMORY.mx1, undefined);
    this.memory.set(tokens_default.MEMORY.mx2, undefined);
    this.parser = new parser_default;
    this.evaluator = new evaluator_default(this.inQ, this.outQ, this.registers, this.memory, this.parser.operations, this.logger);
  }
  prepareOperations(code) {
    try {
      this.status = status.PARSING;
      const operations = this.parser.parse(code);
      this.evaluator.operations = operations;
      this.status = status.PARSED;
    } catch (err) {
      const error = err;
      this.logger.push({
        type: "error",
        value: error.message,
        ln: this.line
      });
      this.status = status.FINISHED;
    }
  }
  run(code, tickFn, endProgramFn, delay) {
    if (!code)
      return;
    this.prepareOperations(code);
    if (this.status !== status.PARSED)
      return;
    this.line = 1;
    this.status = status.RUNNING;
    const interval = setInterval(() => {
      try {
        this.line = this.evaluator.tick(this.line);
        tickFn();
        if (this.line < 0) {
          this.status = status.FINISHED;
          clearInterval(interval);
          endProgramFn();
          return;
        }
        this.line += 1;
        if (this.line > this.evaluator.operations.length) {
          this.status = status.FINISHED;
          clearInterval(interval);
          endProgramFn();
        }
      } catch (error) {
        const err = error;
        this.logger.push({
          type: "error",
          value: err.message,
          ln: this.line
        });
        this.status = status.FINISHED;
        clearInterval(interval);
        endProgramFn();
      }
    }, this.clock * delay);
  }
  nextLine() {
    if (this.status !== status.PARSED && this.status !== status.RUNNING)
      return;
    this.line += 1;
    this.status = status.RUNNING;
    try {
      this.line = this.evaluator.tick(this.line);
      if (this.line < 0) {
        this.status = status.FINISHED;
        return;
      }
    } catch (error) {
      const err = error;
      this.logger.push({
        type: "error",
        value: err.message,
        ln: this.line
      });
      this.status = status.FINISHED;
    }
  }
}
var program_default = Program;

// src/ui/challenges/challenges.ts
var challenges = {
  "no-negatives": {
    title: "No Negatives",
    id: "no-negatives",
    description: "Don't send any negative numbers to the output!",
    text: `<p>Write a program that process an INPUT list of integers and outputs a list containing only the non-negative integers from the INPUT list. </p>
    <p><strong>Constraints</strong>: The INPUT list will contain integers ranging from -100 to 100.</p>
    <p><strong>Result</strong>: The output must be a list of positive integers only, presented in the same order from the INPUT list.</p>
<p>hint: try start using POP to take the first item from the INPUT list to a register</p>
    `,
    input: [0, 1, -2, 3, -4, 5],
    expected: [5, 3, 1]
  },
  "multiplication-miracle": {
    title: "The Multiplication Miracle",
    id: "multiplication-miracle",
    description: "Perform the multiplication instruction",
    text: `<p>Write a program to process an INPUT list of integers. For each two items in the INPUT list, multiply them and push the result to the output. </p>
    <p><strong>Constraints</strong>:<br> The INPUT list will contain an odd sequence of integers ranging from -100 to 100. <br></p>
    <p><strong>Result</strong>:<br> The output must be a list containing the result of the multiplication.</p>
    `,
    input: [-3, 2, -1, -4, 3, 0, 6, 5, 4, 3, 2, 1],
    expected: [2, 12, 30, 0, 4, -6]
  },
  "same-sign": {
    title: "Same sign",
    id: "same-sign",
    description: "Compare two values to check their sign.",
    text: `<p>Write a program to process an INPUT list of integers. For each two items in the INPUT list, push 0 to the OUTPUT if the items have the same sign (positive or negative) or push 1 if the signs are different. </p>
    <p><strong>Constraints</strong>:<br> The INPUT list will contain an odd sequence of integers ranging from -100 to 100. <br></p>
    <p><strong>Result</strong>:<br> The output must be a list containing 0s and 1s in the right sequence.</p>
    `,
    input: [4, -8, 5, -4, 2, -4, -2, -8, 2, 4],
    expected: [0, 0, 1, 1, 1]
  }
};
var challenges_default = challenges;

// src/ui/coder/codemirror.ts
var codemirror_default = {};

// src/ui/coder/ui.ts
var consoleElem = document.getElementById("consoleOutput");
var challengeElem = document.getElementById("challengeInfo");
var codeInfo = document.getElementById("codeInfo");
var registersTable = document.getElementById("registersTable");
var memoryTable = document.getElementById("memoryTable");
var runBtn = document.getElementById("runBtn");
var debugBtn = document.getElementById("debugBtn");
var nextLineBtn = document.getElementById("nextLineBtn");
var restoreBtn = document.getElementById("restoreBtn");
var submitBtn = document.getElementById("submitBtn");
var runDelay = document.getElementById("runDelay");
function renderCodeInfo(p, inputStack) {}
function renderRegistersMemoryInfo(p) {}
function renderConsoleOutput(p) {
  consoleElem?.replaceChildren();
  for (const log of p.logger) {
    consoleElem?.appendChild(createConsoleOuput(log));
  }
  if (consoleElem)
    consoleElem.scrollTop = consoleElem.scrollHeight;
}
function renderChallengeInfo(challenge) {
  if (!challenge)
    return;
  const challengeEls = createChallengeInfo(challenge);
  for (const el of challengeEls) {
    challengeElem?.appendChild(el);
  }
}
function createChallengeInfo(c) {
  const elemTitle = document.createElement("h3");
  elemTitle.innerText = c.title;
  const elemText = document.createElement("p");
  elemText.innerHTML = c.text;
  return [elemTitle, elemText];
}
function createConsoleOuput(log) {
  const output = document.createElement("div");
  output.classList.add("alert");
  output.role = "alert";
  switch (log.type) {
    case "error":
      output.classList.add("alert-danger");
      break;
    case "message":
      output.classList.add("alert-secondary");
      break;
    default:
      output.classList.add("alert-success");
  }
  output.innerText = log.value;
  return output;
}
function updateIcon(elem, text, type) {
  const runningIcon = `<i class="fas fa-sync-alt fa-spin"></i> ${text}`;
  const playIcon = `<i class="fas fa-play"></i> ${text}`;
  const bugIcon = `<i class="fas fa-bug"></i> ${text}`;
  if (type == "spin")
    elem.innerHTML = runningIcon;
  else if (type == "play")
    elem.innerHTML = playIcon;
  else
    elem.innerHTML = bugIcon;
}
function debugging() {
  if (debugBtn?.innerText.includes("Debugging..."))
    return;
  updateIcon(debugBtn, "Debugging... (click to cancel)", "spin");
}
function running() {
  if (runBtn?.innerText.includes("Running..."))
    return;
  updateIcon(runBtn, "Running...", "spin");
}
function resetIcons() {
  updateIcon(runBtn, "Run", "play");
  updateIcon(debugBtn, "Debug", "bug");
}
function updateButtons(p) {
  if (p.status === status.FINISHED) {
    if (runBtn)
      runBtn.hidden = true;
    if (debugBtn)
      debugBtn.hidden = true;
    if (submitBtn)
      submitBtn.hidden = true;
    if (runDelay)
      runDelay.hidden = true;
    if (restoreBtn)
      restoreBtn.hidden = false;
  } else if (p.status === status.READY) {
    resetIcons();
    if (runBtn)
      runBtn.hidden = false;
    if (debugBtn)
      debugBtn.hidden = false;
    if (submitBtn)
      submitBtn.hidden = false;
    if (runDelay)
      runDelay.hidden = false;
    if (restoreBtn)
      restoreBtn.hidden = false;
    if (nextLineBtn)
      nextLineBtn.hidden = true;
  } else if (p.status === status.RUNNING) {
    if (codemirror_default.options.readOnly) {
      debugging();
      if (runBtn)
        runBtn.hidden = true;
      if (debugBtn)
        debugBtn.hidden = false;
    } else {
      running();
      if (runBtn)
        runBtn.hidden = false;
      if (debugBtn)
        debugBtn.hidden = true;
    }
    if (submitBtn)
      submitBtn.hidden = true;
    if (runDelay)
      runDelay.hidden = true;
    if (restoreBtn)
      restoreBtn.hidden = true;
  } else if (p.status === status.PARSED) {
    if (runBtn)
      runBtn.hidden = true;
    if (debugBtn)
      debugBtn.hidden = false;
    if (submitBtn)
      submitBtn.hidden = true;
    if (runDelay)
      runDelay.hidden = true;
    if (restoreBtn)
      restoreBtn.hidden = true;
    if (nextLineBtn)
      nextLineBtn.hidden = false;
  }
}
function clearEditor() {
  for (let i = 0;i < codemirror_default.lineCount(); i++) {
    codemirror_default.removeLineClass(i, "background", "red-line");
    codemirror_default.removeLineClass(i, "background", "yellow-line");
  }
}
function updateUI(p, inputStack) {
  renderCodeInfo(p, inputStack);
  renderRegistersMemoryInfo(p);
  renderConsoleOutput(p);
  updateButtons(p);
}
function updateEditor(p) {
  if (p.status === status.READY) {
    codemirror_default.setOption("readOnly", false);
  }
  const errors = p.logger.find((i) => i.type === "error");
  clearEditor();
  codemirror_default.addLineClass(p.line - 1, "background", "yellow-line");
  if (errors)
    codemirror_default.addLineClass(errors.ln - 1, "background", "red-line");
}
document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (savedTheme === "dark") {
    codemirror_default.setOption("theme", "monokai");
    htmlElement.setAttribute("data-bs-theme", "dark");
  }
  themeToggle?.addEventListener("click", function() {
    if (htmlElement.getAttribute("data-bs-theme") === "dark") {
      htmlElement.setAttribute("data-bs-theme", "light");
      codemirror_default.setOption("theme", "default");
      localStorage.setItem("theme", "light");
    } else {
      codemirror_default.setOption("theme", "monokai");
      htmlElement.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
});
var ui_default = {
  renderChallengeInfo,
  updateUI,
  updateEditor
};

// src/ui/coder/script.ts
var runBtn2 = document.getElementById("runBtn");
var debugBtn2 = document.getElementById("debugBtn");
var nextLineBtn2 = document.getElementById("nextLineBtn");
var restoreBtn2 = document.getElementById("restoreBtn");
var submitBtn2 = document.getElementById("submitBtn");
var delay = document.getElementById("runDelay");
var runDelay2 = delay?.firstElementChild;
var urlParams = new URLSearchParams(window.location.search);
var paramChallenge = urlParams.get("challenge");
var p = new program_default;
var inputStack = [];
var expected = [];
var challenge;
if (paramChallenge) {
  const ch = challenges_default[paramChallenge];
  inputStack = ch.input;
  expected = ch.expected;
  challenge = ch;
  if (submitBtn2)
    submitBtn2.hidden = false;
}
ui_default.renderChallengeInfo(challenge);
p.reset(inputStack);
ui_default.updateUI(p, inputStack);
runBtn2?.addEventListener("click", function() {
  if (p.status === status.RUNNING)
    return;
  const code = codemirror_default.getValue();
  p.reset(inputStack);
  let lastLine = p.line;
  p.run(code, () => {
    ui_default.updateUI(p, inputStack);
    ui_default.updateEditor(p);
    lastLine = p.line;
  }, () => {
    ui_default.updateUI(p, inputStack);
  }, parseInt(runDelay2?.value));
});
debugBtn2?.addEventListener("click", function() {
  if (p.status === status.READY) {
    p.prepareOperations(codemirror_default.getValue());
  } else {
    p.reset(inputStack);
  }
  ui_default.updateUI(p, inputStack);
  codemirror_default.setOption("readOnly", !codemirror_default.options.readOnly);
});
nextLineBtn2?.addEventListener("click", () => {
  p.nextLine();
  ui_default.updateUI(p, inputStack);
  ui_default.updateEditor(p);
});
restoreBtn2?.addEventListener("click", () => {
  p.reset(inputStack);
  ui_default.updateUI(p, inputStack);
  ui_default.updateEditor(p);
});
submitBtn2?.addEventListener("click", () => {
  const code = codemirror_default.getValue();
  p.reset(inputStack);
  p.run(code, () => {
    ui_default.updateUI(p, inputStack);
  }, () => {
    p.test(expected);
    ui_default.updateUI(p, inputStack);
  }, 1);
});
var autoSaveTimeout;
codemirror_default.on("change", function() {
  if (autoSaveTimeout)
    clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(function() {
    localStorage.setItem("code", codemirror_default.getValue());
  }, 750);
});
