const FUNCTIONS = {
  START: "startFn",
  END: "endFn",
  POP: "popFn",
  PUSH: "pushFn",
  CPY: "cpyFn",
  JMP_N: "jmpNegFn",
  JMP_P: "jmpPosFn",
  JMP_Z: "jmpZeroFn",
  JMP_U: "jmpUndFn",
  ADD: "addFn",
  SUB: "subFn",
  LOAD: "loadFn",
  PRT: "printFn",
}

const REGISTERS = {
  r0: "R0X",
  r1: "R1X",
  r2: "R2X",
}

const MEMORY = {
  mx0: "MX0",
  mx1: "MX1",
  mx2: "MX2",
}

const LISTS = {
  INPUT: "INP_LIST",
  OUTPUT: "OUT_LIST"
}

const ARG_TYPES = {
  MEM: "MEM",
  REG: "REG",
  LIST: "LST",
  NUM: "NUM",
}

const FUNCTION_TYPES = {
  PROC: "PROC",
  FLOW: "FLOW"
}

export default {
  FUNCTIONS,
  REGISTERS,
  MEMORY,
  ARG_TYPES,
  FUNCTION_TYPES,
  LISTS
}