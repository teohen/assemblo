
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test"
import { Chance } from "chance";

import Program, { status } from "../assemblo/program";
import fixture from "./fixtures"
import List from "../assemblo/lists"


const chance = new Chance();


describe("PROGRAM suite", () => {
  beforeEach(() => {
    mock.restore()
  });


  it("Should reset the program", () => {
    const input = [1];

    const p = Program.newProgram(input, []);
    p.reset(input)

    expect(p.program.line).toBe(0)
    expect(p.program.status).toBe(status.READY)
    expect(p.program.clock).toBe(2)
    expect(p.program.logger).toEqual([])
    expect(p.program.inQ.items).toMatchObject(input)
    expect(p.program.inQ.pop).toBeInstanceOf(Function)

    expect(p.program.inQ).not.toBe(input)

    expect(p.program.registers.get('R0X')).toBe(0)
    expect(p.program.registers.get('R1X')).toBe(0)
    expect(p.program.registers.get('R2X')).toBe(0)

    expect(p.program.memory.get("MX0")).toBe(0)
    expect(p.program.memory.get("MX1")).toBe(0)
    expect(p.program.memory.get("MX2")).toBe(0)

    const { parser } = p.program.parser
    expect(parser.code).toBe('');
    expect(parser.lines).toEqual([])
    expect(parser.operations).toEqual([])
    expect(parser.procedures).toEqual([])
    expect(parser.flow).toEqual([])

    const { eva } = p.program.evaluator

    expect(eva.registers).toBe(p.program.registers)
    expect(eva.memory).toBe(p.program.memory)
    expect(eva.operations).toBe(parser.operations)
    expect(eva.logger).toBe(p.program.logger)
    expect(eva.inQ).toBe(p.program.inQ)
    expect(eva.outQ).toBe(p.program.outQ)
  })

  it("Should prepare the operations with the correct code", () => {
    const fakeCode = chance.paragraph();
    const input = List.createList('INPUT');

    const p = Program.newProgram(input.items, []);
    p.reset(input.items);

    const randomOperation = fixture.Operation.newRandomOperation()
    spyOn(p.program.parser, "parse").mockImplementation(() => [randomOperation]);

    p.prepareOperations(fakeCode);

    expect(p.program.status, status.PARSED)
    expect(p.program.logger).toEqual([])
    expect(p.program.evaluator.eva.operations).toEqual([randomOperation])
  })

  it("Should prepare the operations with the a incorrect code", () => {
    const fakeCode = chance.paragraph();
    const input = List.createList('INPUT');

    const p = Program.newProgram(input.items, []);
    p.reset(input.items);

    const randomOperation = fixture.Operation.newRandomOperation()
    spyOn(p.program.parser, "parse").mockImplementation(() => { throw new Error('Error on parse') });

    p.prepareOperations(fakeCode);

    expect(p.program.status, status.FINISHED)
    expect(p.program.logger).toEqual([{ type: 'error', value: 'Error on parse', ln: randomOperation.line }])
    expect(p.program.evaluator.eva.operations).toEqual([])
  })

  it("should not execute the nextLine when status is not PARSED or RUNNING", () => {
    const input = List.createList('INPUT');
    const p = Program.newProgram(input.items, [])
    p.reset(input.items);

    p.nextLine()

    expect(p.program.line).toBe(0)
    expect(p.program.status).toBe(status.READY)
    expect(p.program.clock).toBe(2)
    expect(p.program.logger).toEqual([])
    expect(p.program.inQ).toMatchObject(input)
    expect(p.program.inQ.pop).toBeInstanceOf(Function)

    expect(p.program.inQ).not.toBe(input)

    expect(p.program.registers.get('R0X')).toBe(0)
    expect(p.program.registers.get('R1X')).toBe(0)
    expect(p.program.registers.get('R2X')).toBe(0)

    expect(p.program.memory.get("MX0")).toBe(0)
    expect(p.program.memory.get("MX1")).toBe(0)
    expect(p.program.memory.get("MX2")).toBe(0)

    const { parser } = p.program.parser
    expect(parser.code).toBe('');
    expect(parser.lines).toEqual([])
    expect(parser.operations).toEqual([])
    expect(parser.procedures).toEqual([])
    expect(parser.flow).toEqual([])

    const { eva } = p.program.evaluator

    expect(eva.registers).toBe(p.program.registers)
    expect(eva.memory).toBe(p.program.memory)
    expect(eva.operations).toBe(parser.operations)
    expect(eva.logger).toBe(p.program.logger)
    expect(eva.inQ).toBe(p.program.inQ)
    expect(eva.outQ).toBe(p.program.outQ)
  });

  it(" should execute the nextLine", () => {
    const input = List.createList('INPUT');
    const fakeCode = chance.paragraph();
    const randomLineReturn = chance.integer({ min: 0 });

    const p = Program.newProgram(input.items, [])
    p.reset(input.items);

    spyOn(p.program.parser, "parse").mockImplementation(() => [fixture.Operation.newRandomOperation()]);
    const spyTick = spyOn(p.program.evaluator, "tick").mockImplementation((line) => randomLineReturn);

    p.prepareOperations(fakeCode);
    p.nextLine();

    expect(p.program.line).toBe(randomLineReturn)
    expect(p.program.status).toBe(status.RUNNING)
    expect(spyTick).toBeCalled()
  });

  it("should execute the nextLine and update status if return line is negative", () => {
    const input = List.createList('INPUT');
    const fakeCode = chance.paragraph();
    const randomLineReturn = chance.integer({ max: 0 });

    const p = Program.newProgram(input.items, [])
    p.reset(input.items);

    spyOn(p.program.parser, "parse").mockImplementation(() => [fixture.Operation.newRandomOperation()]);
    const spyTick = spyOn(p.program.evaluator, "tick").mockImplementation((line) => randomLineReturn);

    p.prepareOperations(fakeCode);
    p.nextLine();

    expect(p.program.line).toBe(randomLineReturn)
    expect(p.program.status).toBe(status.FINISHED)
    expect(p.program.line).toBe(randomLineReturn)
    expect(spyTick).toBeCalled()
  });

  it("should finish program and print parsing error to the console", () => {
    const input = List.createList('INPUT');
    const fakeCode = chance.paragraph();

    const p = Program.newProgram(input.items, []);
    p.reset(input.items);

    const spyTick = spyOn(p.program.parser, "parse").mockImplementation(() => { throw new Error('Error on parse') });

    p.run(fakeCode, () => { }, () => { }, 1);

    expect(p.program.line).toBe(0)
    expect(p.program.status).toBe(status.FINISHED)
    expect(spyTick).toBeCalled()
    expect(p.program.logger).toEqual([{ type: 'error', ln: 0, value: 'Error on parse' }])
    expect(p.program.evaluator.eva.operations).toEqual([])
  });

  it("should run the code if correctly parsed", (done) => {
    const input = List.createList('INPUT');
    const fakeCode = chance.paragraph();
    let lineReturn = 1

    const p = Program.newProgram(input.items, [])
    p.reset(input.items);


    spyOn(p.program.parser, "parse").mockImplementation(() => [fixture.Operation.newRandomOperation()]);

    const spyTick = spyOn(p.program.evaluator, "tick").mockImplementation(() => {
      lineReturn -= 1
      return lineReturn
    });

    p.run(fakeCode, () => { }, () => {
      expect(p.program.line).toBe(lineReturn)
      expect(p.program.status).toBe(status.FINISHED)
      expect(spyTick).toBeCalledTimes(2)
      done();
    }, 1);
  });



  it("should finish program and print running error to console", (done) => {
    const input = List.createList('INPUT');
    const fakeCode = chance.paragraph();
    let lineReturn = 1

    const p = Program.newProgram(input.items, [])
    p.reset(input.items);


    const randomOperation = fixture.Operation.newRandomOperation()
    spyOn(p.program.parser, "parse").mockImplementation(() => [randomOperation]);

    const spyTick = spyOn(p.program.evaluator, "tick").mockImplementation(() => {
      lineReturn -= 1
      if (lineReturn < 0) throw new Error('fake error')
      return lineReturn
    });

    p.run(fakeCode, () => { }, () => {
      expect(p.program.status, status.FINISHED)

      expect(p.program.evaluator.eva.operations).toEqual([randomOperation])
      expect(spyTick).toBeCalledTimes(2)
      expect(p.program.logger).toEqual([{ type: 'error', ln: 1, value: 'fake error' }])
      done()
    }, 1);
  });
});
