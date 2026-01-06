import Program from '../../assemblo/program'

const code = `
LBL: .start
ADD: r0, 1
LBL: .output
PRT: r0
JMP_N: .end, r0
SUB: r0, 1
JMP_Z: .output, r0
LBL: .end`

const q = [0, 1, -2, 3, -4, 5];

const p = Program.newProgram(q)

p.reset(q)
p.run(code, () => { }, () => { }, 10)
console.log(p.program.logger)

