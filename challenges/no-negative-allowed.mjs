import assert from "node:assert";
import Program from "../src/program.mjs";
import Parser from "../src/parser.mjs";

// Send ALL NUMBERS to output EXCEPT THE NEGATIVES


const code = `START
  POP: r0, r1
  JMP_U: 9, r0
  JMP_N: 2, r0
  PUSH: OUTPUT, r0
  PRT: r0
  JMP_P: 2, r0
  JMP_Z: 2, r0
  END`;

  const q = [1, -2, 3, -4, 5];
  const p = new Program();
  p.reset(q);
  p.run(code)

