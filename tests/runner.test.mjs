// import test, { describe, it } from "node:test";
// import assert from "node:assert";

// describe("RUNNER suite", () => {
//   describe("SUCCESS", () => {
//     it("should run the POP instruction", () => {
//       const input = `POP: RAX, INPUT`;
//       const inQ = [1];

//       const p = new Program(input, inQ);
//       p.parse();
//       p.run();

//       assert.equal(p.registers.get(REG_ADD_0), 1);
//       assert.equal(p.inQ.length, 0);
//     });

//     it("should run the PUSH instruction", () => {
//       const input = `PUSH: OUTPUT, RAX`;
//       const inQ = [1];

//       const p = new Program(input, inQ);
//       p.parse();
//       p.registers.set(REG_ADD_0, 1);
//       p.run();

//       assert.equal(p.outQ.length, 1);
//       assert.equal(p.outQ[0], 1);
//     });

//     it("should run the CPY instruction", () => {
//       const input = `CPY: MM0, RAX`;
//       const inQ = [1];

//       const p = new Program(input, inQ);
//       p.parse();
//       p.registers.set(REG_ADD_0, 1);
//       p.run();

//       assert.equal(p.memory.get(MEM_ADD_0), 1);
//     });

//     it("should run the LOAD instruction", () => {
//       const input = `LOAD: RAX, MM0`;
//       const inQ = [1];

//       const p = new Program(input, inQ);
//       p.parse();
//       p.memory.set(MEM_ADD_0, 1);
//       p.run();

//       assert.equal(p.registers.get(REG_ADD_0), 1);
//     });

//     it("should run the JMP instructions", () => {
//       const tests = [
//         {
//           in: `
//           JMP_N: 3, RAX
//           LOAD: RAX, MM1
//           LOAD: RBX, MM0`,
//           jpmCond: -1,
//           exp: 1,
//         },
//         {
//           in: `JMP_P: 3, RAX
//           LOAD: RAX, MM1
//           LOAD: RBX, MM0`,
//           jpmCond: 1,
//           exp: 1,
//         },
//         {
//           in: `JMP_Z: 3, RAX
//           LOAD: RAX, MM1
//           LOAD: RBX, MM0`,
//           jpmCond: 0,
//           exp: 1,
//         },
//       ];
//       const inQ = [1];

//       for (const t of tests) {
//         const p = new Program(t.in, inQ);
//         p.parse();
//         p.memory.set(MEM_ADD_0, t.exp);
//         p.memory.set(MEM_ADD_1, 3);
//         p.registers.set(REG_ADD_0, t.jpmCond);
//         p.run();

//         assert.notEqual(p.registers.get(REG_ADD_0), 3);
//         assert.equal(p.registers.get(REG_ADD_1), t.exp);
//       }
//     });

//     it("should run the ADD instruction", () => {
//       const input = `ADD: RAX, RBX`;
//       const inQ = [1];

//       const p = new Program(input, inQ);
//       p.parse();
//       p.registers.set(REG_ADD_0, 1);
//       p.registers.set(REG_ADD_1, 1);
//       p.run();

//       assert.equal(p.registers.get(REG_ADD_0), 2);
//     });

//     it("should run the SUB instruction", () => {
//       const input = `SUB: RAX, RBX`;
//       const inQ = [1];

//       const p = new Program(input, inQ);
//       p.parse();
//       p.registers.set(REG_ADD_0, 1);
//       p.registers.set(REG_ADD_1, 1);
//       p.run();

//       assert.equal(p.registers.get(REG_ADD_0), 0);
//     });

//     // TODO: ADD TESTS FOR THE PRINT FUNCTION
//   });

//   // TODO: ADDS JUMPS TESTS
//   describe("ERROR", () => {
//     it("should throw error if wrong arg type", () => {
//       const tests = [
//         { in: "POP: MM0, INPUT", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_REG },
//         { in: "POP: RAX, MM0", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_INPUT },
//         { in: "CPY: RAX, RAX", errArg: TYPE_REG, expArg: tokens.ARG_TYPES.MEM },
//         { in: "CPY: MM0, MM0", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_REG },
//         { in: "LOAD: MM0, MM0", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_REG },
//         { in: "LOAD: RAX, RAX", errArg: TYPE_REG, expArg: tokens.ARG_TYPES.MEM },
//         { in: "ADD: MM0, RBX", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_REG },
//         { in: "ADD: RAX, MM0", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_REG },
//         { in: "PUSH: RAX, RAX", errArg: TYPE_REG, expArg: tokens.ARG_TYPES.OUT },
//         { in: "PUSH: OUTPUT, MM0", errArg: tokens.ARG_TYPES.MEM, expArg: TYPE_REG },
//       ];
//       const inQ = [1];

//       for (const t of tests) {
//         const p = new Program(t.in, inQ);

//         try {
//           p.parse();
//           p.run();
//         } catch (err) {
//           assert.equal(
//             err.message,
//             `AT LINE: 1. INVALID ARGUMENT TYPE: ${t.errArg}, EXPECTED: ${t.expArg}`,
//           );
//         }
//       }
//     });
//   });
// });
