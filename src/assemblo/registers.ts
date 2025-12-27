import { IArgument } from "./argument";

const INTERNALS = ['R0X', 'R1X', 'R2X'] as const
const LITERALS = ['r0', 'r1', 'r2'] as const

export type RegisterInternal = typeof INTERNALS[number];
export type RegisterLiteral = typeof LITERALS[number];
export type RegistersType = Map<RegisterInternal, number | undefined>

export const REGISTERSMAP: Map<RegisterLiteral, RegisterInternal> = new Map([
  [LITERALS[0], INTERNALS[0]],
  [LITERALS[1], INTERNALS[1]],
  [LITERALS[2], INTERNALS[2]],
])


export function isRegisterLiteral(val: string): val is RegisterLiteral {
  return LITERALS.includes(val as RegisterLiteral)
}

export interface RegisterArgument extends IArgument {
  type: 'REG'
  literal: RegisterLiteral
  intern: RegisterInternal
}