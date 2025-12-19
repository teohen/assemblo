import tokens from "./tokens.mjs";
import Parser from "./parser.mjs";
import Evaluator from "./evaluator.mjs";

export const status = {
  READY: "ready",
  PARSING: "parsing",
  PARSED: "parsed",
  RUNNING: "running",
  FINISHED: "ended",
}

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
  instCounter;

  constructor() {
  }

  isReady() {
    return this.status === status.RUNNING
  }

  isRunning() {
    return this.status === status.RUNNING
  }

  test(expectedOutput) {
    for (let i = 0; i < expectedOutput.length; i++) {
      const exp = expectedOutput[i]
      const out = this.outQ[i];

      if (exp != out) {
        return false
      }
    }
    
    return true
  }

  reset(inQ) {
    this.line = 0;
    this.clock = 2;
    this.instCounter = 0;
    this.status = status.READY;


    this.registers = new Map();
    this.memory = new Map();

    this.inQ = inQ.slice();
    this.outQ = [];
    this.logger = [];

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
      this.parser.operations,
      this.logger
    );
  }

  prepareOperations(code) {
    try {
      this.status = status.PARSING;
      const operations = this.parser.parse(code)
      this.evaluator.operations = operations
      this.status = status.PARSED;
    } catch (err) {
      this.logger.push({ type: 'error', value: err.message, ln: this.line });
      this.status = status.FINISHED
    }
  }

  run(code, tickFn, endProgramFn, delay) {
    if (!code) return;
    this.prepareOperations(code)

    if (this.status != status.PARSED) return;
    this.line = 1
    this.status = status.RUNNING;

    const interval = setInterval(() => {
      try {
        this.line = this.evaluator.tick(this.line)
        this.instCounter += 1
        tickFn()
        if (this.line < 0) {
          this.status = status.FINISHED;
          clearInterval(interval);
          endProgramFn()
        }
        this.line += 1;
      } catch (error) {
        this.logger.push({ type: 'error', value: error.message, ln: this.ln })
        this.status = status.FINISHED;
        clearInterval(interval);
        endProgramFn()
      }
    }, this.clock * delay)
  }

  nextLine() {
    if (this.status != status.PARSED && this.status != status.RUNNING) return;

    this.line += 1
    this.status = status.RUNNING;
    this.line = this.evaluator.tick(this.line)
    this.instCounter += 1
    if (this.line < 0) {
      this.status = status.FINISHED;
      return;
    }

  }
}

export default Program;
