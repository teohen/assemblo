import test, { before, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert";
import { Chance } from "chance";

import Program, { status } from "../src/program.mjs";
import Parser from "../src/parser.mjs";
import Evaluator from "../src/evaluator.mjs";
import tokens from "../src/tokens.mjs";
import Operation from "../src/operation.mjs";



const chance = new Chance();


describe("PROGRAM suite", () => {
  beforeEach(() => {
    mock.reset()
  });

  it("Should reset the program", () => {
    const input = [1]
    const p = new Program();
    p.reset(input)
    assert.equal(p.line, 0);
    assert.equal(p.status, status.READY);
    assert.equal(p.logger.length, 0);
    assert.equal(p.inQ.length, input.length)
    assert.equal(p.inQ[0], input[0])
    assert.equal(p.registers.has(tokens.REGISTERS.r0), true)
    assert.equal(p.registers.has(tokens.REGISTERS.r1), true)
    assert.equal(p.registers.has(tokens.REGISTERS.r2), true)

    assert.equal(p.memory.has(tokens.MEMORY.mx0), true)
    assert.equal(p.memory.has(tokens.MEMORY.mx1), true)
    assert.equal(p.memory.has(tokens.MEMORY.mx2), true)

    assert.equal(p.parser instanceof Parser, true);
    assert.equal(p.parser.code, '')
    assert.equal(p.parser.lines.length, 0)
    assert.equal(p.parser.operations.length, 0)
    assert.equal(p.parser.procedures.length, 0)
    assert.equal(p.parser.flow.length, 0)

    assert.equal(p.evaluator instanceof Evaluator, true);
    assert.equal(p.evaluator.registers, p.registers)
    assert.equal(p.evaluator.memory, p.memory)
    assert.equal(p.evaluator.operations, p.parser.operations)
    assert.equal(p.evaluator.logger, p.logger)
    assert.equal(p.evaluator.inQ, p.inQ)
    assert.equal(p.evaluator.outQ, p.outQ)

    assert.equal(p.parser.lines.length, 0)
    assert.equal(p.parser.operations.length, 0)
    assert.equal(p.parser.procedures.length, 0)
    assert.equal(p.parser.flow.length, 0)
  })

  it(" Should prepare the operations with the correct code", () => {
    const fakeCode = 'FAKE CODE';
    const p = new Program();
    p.reset([]);

    mock.method(p.parser, 'parse', () => ["mocked operations"]);

    p.prepareOperations(fakeCode);

    assert.equal(p.status, status.PARSED);
    assert.equal(p.logger.length, 0)
    assert.equal(p.evaluator.operations.length, 1)
    assert.equal(p.evaluator.operations[0], "mocked operations")
  })

  it(" Should prepare the operations with the a incorrect code", () => {
    const fakeCode = 'FAKE CODE';
    const p = new Program();
    p.reset([]);

    mock.method(p.parser, 'parse', () => {
      throw new Error('fake error on parse')
    });

    p.prepareOperations(fakeCode);

    assert.equal(p.status, status.FINISHED);
    assert.equal(p.logger.length, 1)
    assert.equal(p.logger[0].value, 'fake error on parse')
    assert.equal(p.logger[0].type, 'error')
    assert.equal(p.evaluator.operations.length, 0)
  })

  it(" should not execute the nextLine when status is not PARSED or RUNNING", () => {
    const input = [1]
    const p = new Program();
    p.reset(input);



    p.nextLine()

    assert.equal(p.line, 0);
    assert.equal(p.status, status.READY);
    assert.equal(p.logger.length, 0);
    assert.equal(p.inQ.length, input.length)
    assert.equal(p.inQ[0], input[0])
    assert.equal(p.registers.has(tokens.REGISTERS.r0), true)
    assert.equal(p.registers.has(tokens.REGISTERS.r1), true)
    assert.equal(p.registers.has(tokens.REGISTERS.r2), true)
    assert.equal(p.memory.has(tokens.MEMORY.mx0), true)
    assert.equal(p.memory.has(tokens.MEMORY.mx1), true)
    assert.equal(p.memory.has(tokens.MEMORY.mx2), true)
    assert.equal(p.parser instanceof Parser, true);
    assert.equal(p.parser.code, '')
    assert.equal(p.parser.lines.length, 0)
    assert.equal(p.parser.operations.length, 0)
    assert.equal(p.parser.procedures.length, 0)
    assert.equal(p.parser.flow.length, 0)
    assert.equal(p.evaluator instanceof Evaluator, true);
    assert.equal(p.evaluator.registers, p.registers)
    assert.equal(p.evaluator.memory, p.memory)
    assert.equal(p.evaluator.operations, p.parser.operations)
    assert.equal(p.evaluator.logger, p.logger)
    assert.equal(p.evaluator.inQ, p.inQ)
    assert.equal(p.evaluator.outQ, p.outQ)
    assert.equal(p.parser.lines.length, 0)
    assert.equal(p.parser.operations.length, 0)
    assert.equal(p.parser.procedures.length, 0)
    assert.equal(p.parser.flow.length, 0)

  });

  it(".only should execute the nextLine", () => {
    const fakeCode = 'FAKE CODE';
    const lineReturn = chance.integer({ min: 1, max: 100 })
    const input = [1];
    const p = new Program();
    p.reset(input);

    mock.method(p.parser, 'parse', () => [])
    const tickSpy = mock.method(p.evaluator, 'tick', (line) => lineReturn);

    p.prepareOperations(fakeCode);
    p.nextLine();

    assert.equal(p.line, lineReturn)
    assert.equal(p.status, status.RUNNING);
    assert.equal(tickSpy.mock.callCount(), 1)

  });

  it(".only should execute the nextLine and update status if return line is negative", () => {
    const fakeCode = 'FAKE CODE';
    const lineReturn = chance.integer({ min: -100, max: -1 })
    const input = [1];
    const p = new Program();
    p.reset(input);

    mock.method(p.parser, 'parse', () => [])
    const tickSpy = mock.method(p.evaluator, 'tick', () => lineReturn);

    p.prepareOperations(fakeCode);
    p.nextLine();

    assert.equal(p.line, lineReturn)
    assert.equal(p.status, status.FINISHED);
    assert.equal(tickSpy.mock.callCount(), 1)
  });

  it(".only should not run the code if its is not correclty parsed", () => {
    const fakeCode = 'FAKE CODE';
    const input = [1]
    const p = new Program();
    p.reset(input);

    mock.method(p.parser, 'parse', () => {
      throw new Error('fake error')
    });

    p.run(fakeCode);

    assert.equal(p.status, status.FINISHED);
    assert.equal(p.logger.length, 1)
    assert.equal(p.logger[0].value, 'fake error')
    assert.equal(p.logger[0].type, 'error')
    assert.equal(p.evaluator.operations.length, 0)
  });

  it(".only should run the code if correctly parsed", () => {
    const fakeCode = 'FAKE CODE';
    let lineReturn = 1
    const input = [1]
    const p = new Program();
    p.reset(input);

    mock.method(p.parser, 'parse', () => []);

    const tickSpy = mock.method(p.evaluator, 'tick', () => {
      lineReturn -= 1
      return lineReturn
    });

    p.run(fakeCode);

    assert.equal(p.line, lineReturn)
    assert.equal(p.status, status.FINISHED);
    assert.equal(tickSpy.mock.callCount(), 2)
  });

  it(".only should run the code if correctly parsed", () => {
    const fakeCode = 'FAKE CODE';
    let lineReturn = 1
    const input = [1]
    const p = new Program();
    p.reset(input);

    mock.method(p.parser, 'parse', () => []);

    const tickSpy = mock.method(p.evaluator, 'tick', () => {
      lineReturn -= 1
      if (lineReturn < 0 ) throw new Error('fake error')
      return lineReturn
    });

    p.run(fakeCode);

    assert.equal(p.status, status.FINISHED);
    assert.equal(p.logger.length, 1)
    assert.equal(p.logger[0].value, 'fake error')
    assert.equal(p.logger[0].type, 'error')
    assert.equal(p.evaluator.operations.length, 0)
    assert.equal(tickSpy.mock.callCount(), 2)
  });

});


