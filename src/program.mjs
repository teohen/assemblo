import tokens from "./tokens.mjs";
import Parser from "./parser.mjs";
import Evaluator from "./evaluator.mjs";

const STATUS = {
  READY: "ready",
  RUNNING: "running",
  ENDED: "ended",
}

class Program {
  parser;
  evaluator;
  registers;
  memory;
  inQ;
  outQ;
  running;
  status;
  logger;

  constructor() {
  }

  reset(inQ) {
    this.line = 0;
    this.status = STATUS.READY;

    this.logger = [];

    this.debugging = false;
    this.registers = new Map();
    this.memory = new Map();

    this.inQ = inQ;
    this.outQ = [];

    this.registers.set(tokens.REGISTERS.r0, undefined);
    this.registers.set(tokens.REGISTERS.r1, undefined);
    this.registers.set(tokens.REGISTERS.r2, undefined);

    this.memory.set(tokens.MEMORY.mx0, undefined);
    this.memory.set(tokens.MEMORY.mx1, undefined);
    this.memory.set(tokens.MEMORY.mx2, undefined);

    this.parser = new Parser();
    this.evaluator = new Evaluator(
      this.inQ,
      this.outQ,
      this.registers,
      this.memory,
      this.logger
    );
  }

  prepareEval(code) {
    try {
      const operations = this.parser.parse(code)
      this.evaluator.operations = operations
    } catch (error) {
      console.log("ERROE")
      throw error
    }

  }

  run(code) {
    this.prepareEval(code)
    this.status = STATUS.RUNNING;
    this.line = 1

    while (true) {
      try {
        this.line = this.evaluator.tick(this.line)
        if (this.line < 0) {
          this.status = STATUS.ENDED;
          break;
        }
        this.line += 1;
      } catch (error) {
        this.logger.push({ type: 'error', value: error.message })
        this.status = STATUS.ENDED;
        break;
      }
    }

    this.status = STATUS.ENDED;
  }

  nextLine() {
    if (this.status == STATUS.ENDED) return;

    this.line += 1
    this.status = STATUS.RUNNING;
    this.line = this.evaluator.tick(this.line)
    if (this.line < 0) {
      this.status = STATUS.ENDED;
      return;
    }

  }
}

export default Program;
