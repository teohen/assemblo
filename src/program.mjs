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
  parser;
  evaluator;
  registers;
  memory;
  inQ;
  outQ;
  status;
  logger;

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
        this.logger.push({ type: 'error', value: "incorrect answer" })
        return
      }
    }
    this.logger.push({ type: 'success', value: "PASSED!!!" })

  }

  reset(inQ) {
    this.line = 0;
    this.status = status.READY;


    this.registers = new Map();
    this.memory = new Map();

    this.inQ = inQ;
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
      this.logger.push({ type: 'error', value: err.message })
      this.status = status.FINISHED
    }
  }

  run(code) {
    if (!code) return;
    this.prepareOperations(code)

    if (this.status != status.PARSED) return;

    
    this.line = 1
    this.status = status.RUNNING;

    while (true) {
      try {
        this.line = this.evaluator.tick(this.line)
        if (this.line < 0) {
          this.status = status.FINISHED;
          break;
        }
        this.line += 1;
      } catch (error) {
        this.logger.push({ type: 'error', value: error.message })
        this.status = status.FINISHED;
        break;
      }
    }

    this.status = status.FINISHED;
  }

  nextLine() {
    if (this.status != status.PARSED && this.status != status.RUNNING) return;

    this.line += 1
    this.status = status.RUNNING;
    this.line = this.evaluator.tick(this.line)
    if (this.line < 0) {
      this.status = status.FINISHED;
      return;
    }

  }
}

export default Program;
