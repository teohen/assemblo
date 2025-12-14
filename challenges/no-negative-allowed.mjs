import Program from "../src/program.mjs";

// Send ALL NUMBERS to output EXCEPT THE NEGATIVES


const code = `START
  POP: r0, INPUT
  PRT: r0
  JMP_U:8, r0
  JMP_N: 2, r0
  PUSH: OUTPUT, r0
  JMP_P: 2, r0
  END`;

  const q = [0, 1, -2, 3, -4, 5];
  const p = new Program();
  p.reset(q);
  p.run(code, () =>{}, ()=>{}, 10);

