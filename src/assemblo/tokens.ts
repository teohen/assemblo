interface Tokens {
  FUNCTIONS: typeof FUNCTIONS;
  REGISTERS: typeof REGISTERS;
  MEMORY: typeof MEMORY;
  LISTS: typeof LISTS;
  ARG_TYPES: typeof ARG_TYPES;
  FUNCTION_TYPES: typeof FUNCTION_TYPES;
}

const FUNCTIONS = {
  START: 'startFn',
  END: 'endFn',
  POP: 'popFn',
  PUSH: 'pushFn',
  CPY: 'cpyFn',
  JMP_N: 'jmpNegFn',
  JMP_P: 'jmpPosFn',
  JMP_Z: 'jmpZeroFn',
  JMP_U: 'jmpUndFn',
  ADD: 'addFn',
  SUB: 'subFn',
  LOAD: 'loadFn',
  PRT: 'printFn',
  LBL: 'labelFn'
} as const

const REGISTERS = {
  r0: 'R0X',
  r1: 'R1X',
  r2: 'R2X',
} as const

const MEMORY = {
  mx0: 'MX0',
  mx1: 'MX1',
  mx2: 'MX2',
} as const

const LISTS = {
  INPUT: 'INP_LIST',
  OUTPUT: 'OUT_LIST'
} as const

const ARG_TYPES = {
  MEM: 'MEM',
  REG: 'REG',
  LIST: 'LST',
  NUM: 'NUM',
  LBL: 'LBL',
  CND: 'CND',
} as const


const FUNCTION_TYPES = {
  PROC: 'PROC',
  FLOW: 'FLOW'
} as const

// Create the tokens object with proper typing
const tokens: Tokens = {
  FUNCTIONS,
  REGISTERS,
  MEMORY,
  ARG_TYPES,
  FUNCTION_TYPES,
  LISTS,
}

export default tokens