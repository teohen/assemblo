import assert from "node:assert";
import Program from "../src/program.mjs";
import Parser from "../src/parser.mjs";

// Send ALL NUMBERS to output EXCEPT THE NEGATIVES

const inputQ = [1, -2, 3, -4, 5];
const out = [1, 3, 5];

const code = `START
POP: r0, INPUT
JMP_U: 9, r0
JMP_N: 2, r0
PUSH: OUTPUT, r0
PRT: r0
JMP_P: 2, r0
JMP_Z: 2, r0
END`;

const program = new Program()
program.run(inputQ, code);
