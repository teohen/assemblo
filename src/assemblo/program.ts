
import tokens from "./tokens";
import Parser from "./parser";
import Evaluator, { LoggerEntry } from "./evaluator";


export interface Label {
  name: string,
  lineNumber: number
}

export type Registers = Map<string, number | undefined>;

export type Labels = Map<string, number>;

export type Logger = LoggerEntry[];

// Define callback types
type TickFn = () => void;
type EndProgramFn = () => void;

// Status enum
export const status = {
  READY: "ready",
  PARSING: "parsing",
  PARSED: "parsed",
  RUNNING: "running",
  FINISHED: "ended",
} as const;

type StatusType = typeof status[keyof typeof status];

class Program {
  clock: number;
  parser: Parser;
  evaluator: Evaluator;
  registers: Registers;
  memory: Map<string, number | undefined>;
  inQ: number[];
  outQ: number[];
  status: StatusType;
  logger: Logger;
  line: number;
  labels: Labels;


  constructor() {
    this.clock = 2;
    this.line = 0;
    this.status = status.READY;

    // Initialize with default values - these will be overwritten in reset()
    this.parser = new Parser();
    this.evaluator = new Evaluator([], [], new Map(), new Map(), [], [], new Map());
    this.registers = new Map();
    this.memory = new Map();
    this.labels = new Map();
    this.inQ = [];
    this.outQ = [];
    this.logger = [];
    
  }

  isReady(): boolean {
    return this.status === status.READY;
  }

  isRunning(): boolean {
    return this.status === status.RUNNING;
  }

  test(expectedOutput: number[]): void {
    for (let i = 0; i < expectedOutput.length; i++) {
      const exp = expectedOutput[i];
      const out = this.outQ[i];

      if (exp !== out) {
        this.logger.push({
          type: 'error',
          value: "incorrect answer",
          ln: -1
        });
        return;
      }
    }
    this.logger.push({
      type: 'success',
      value: "PASSED!!!",
      ln: -1
    });
  }

  reset(inQ: number[]): void {
    this.line = 0;
    this.clock = 2;
    this.status = status.READY;

    this.registers = new Map();
    this.memory = new Map();
    this.labels = new Map();

    this.inQ = inQ.slice();
    this.outQ = [];
    this.logger = [];
    

    // Set up registers with undefined values
    this.registers.set(tokens.REGISTERS.r0, undefined);
    this.registers.set(tokens.REGISTERS.r1, undefined);
    this.registers.set(tokens.REGISTERS.r2, undefined);

    // Set up memory with undefined values
    this.memory.set(tokens.MEMORY.mx0, undefined);
    this.memory.set(tokens.MEMORY.mx1, undefined);
    this.memory.set(tokens.MEMORY.mx2, undefined);

    this.labels.set('.start', 0);
    this.labels.set('.end', -1);

    this.parser = new Parser();
    this.evaluator = new Evaluator(
      this.inQ,
      this.outQ,
      this.registers,
      this.memory,
      this.parser.operations,
      this.logger,
      this.labels
    );
  }

  prepareOperations(code: string): void {
    try {
      this.status = status.PARSING;
      const operations = this.parser.parse(code);
      this.evaluator.operations = operations;
      this.status = status.PARSED;
    } catch (err) {
      const error = err as Error;
      this.logger.push({
        type: 'error',
        value: error.message,
        ln: this.line
      });
      this.status = status.FINISHED;
    }
  }

  run(
    code: string,
    tickFn: TickFn,
    endProgramFn: EndProgramFn,
    delay: number
  ): void {
    if (!code) return;

    this.prepareOperations(code);

    if (this.status !== status.PARSED) return;

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

        // Check if we've reached the end of operations
        if (this.line > this.evaluator.operations.length) {
          this.status = status.FINISHED;
          clearInterval(interval);
          endProgramFn();
        }
      } catch (error) {
        const err = error as Error;
        this.logger.push({
          type: 'error',
          value: err.message,
          ln: this.line
        });
        this.status = status.FINISHED;
        clearInterval(interval);
        endProgramFn();
      }
    }, this.clock * delay);
  }

  nextLine(): void {
    if (this.status !== status.PARSED && this.status !== status.RUNNING) return;

    this.line += 1;
    this.status = status.RUNNING;

    try {
      this.line = this.evaluator.tick(this.line);

      if (this.line < 0) {
        this.status = status.FINISHED;
        return;
      }
    } catch (error) {
      const err = error as Error;
      this.logger.push({
        type: 'error',
        value: err.message,
        ln: this.line
      });
      this.status = status.FINISHED;
    }
  }
}

export default Program;
