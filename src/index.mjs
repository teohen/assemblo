import assert from "node:assert";

import Program from "./program.mjs";

const q = [1, -2, 3, -4, 5];
const out = [1, 3, 5];

const input = `
    POP: RAX, INPUT

		CPY: MM0, RAX
		POP: RAX, INPUT
		LOAD: RAX, MM0
		JMP: 8
		ADD: RAX, RBX
		LOAD: RAX, MM0
		PUSH: OUTPUT, RAX`;

const p = new Program(input, q);

p.parse();
p.run();

for (let i = 0; i < out.length; i++) {
  const res = p.outQ.pop();
  assert.equal(res, out[i]);
}
console.log("PASSED");
