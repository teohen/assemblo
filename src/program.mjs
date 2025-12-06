import tokens from "./tokens.mjs";
import Argument from "./argument.mjs";
import Parser from "./parser.mjs";
import Runner from "./runner.mjs";

class Program {
  parser;
  runner;
  registers;
  memory;
  inQ;
  outQ;
  running;

  constructor(inQ) {
    if (!Array.isArray(inQ) || inQ.length == 0) {
      throw new Error("InQ should be a non empty array")
    }

    this.line = 0;
    this.running = false;
    this.debugging = false;

    this.registers = new Map();
    this.memory = new Map();

    this.inQ = inQ;
    this.outQ = [];

    this.registers = new Map();
    this.memory = new Map();

    this.registers.set(tokens.REGISTERS.r0, undefined);
    this.registers.set(tokens.REGISTERS.r1, undefined);
    this.registers.set(tokens.REGISTERS.r2, undefined);

    this.memory.set(tokens.MEMORY.mx0, undefined);
    this.memory.set(tokens.MEMORY.mx1, undefined);
    this.memory.set(tokens.MEMORY.mx2, undefined);

    this.parser = new Parser();
    this.runner = new Runner(this.inQ, this.outQ, this.registers, this.memory, this.running);
  }

  resetProgram() {
    this.runner = []
    this.runner.operations = [];
    this.running = false;
    this.line = 1
  }

  prepareEval(code) {
    const operations = this.parser.parse(code)
    this.runner.operations = operations
    this.running = true
    this.line = 1
  }


  run(code) {
    this.prepareEval(code)

    while (true) {
      this.line = this.runner.tick(this.line)
      if (this.line < 0) {
        this.running = false;
        break;
      }
      this.line += 1;
    }
    this.running = false
  }

  nextLine(code) {
    if (code) this.prepareEval(code)

    if (this.line < 0) {
      this.running = false;
      return;
    }

    this.line = this.runner.tick(this.line)
    
    this.line += 1
  }
}

export default Program;
