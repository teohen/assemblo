import { IArgument } from "./argument";

const INTERNALS = ['MX0', 'MX1', 'MX2'] as const
const LITERALS = ['mx0', 'mx1', 'mx2'] as const

export type MemoryInternal = typeof INTERNALS[number];
export type MemoryLiteral = typeof LITERALS[number];
export type MemoryType = Map<MemoryInternal, number | undefined>

export const MEMORYMAP = new Map<MemoryLiteral, MemoryInternal>([
  [LITERALS[0], INTERNALS[0]],
  [LITERALS[1], INTERNALS[1]],
  [LITERALS[2], INTERNALS[2]],
])


export function isMemoryLiteral(val: string): val is MemoryLiteral {
  return LITERALS.includes(val as MemoryLiteral)
}

export interface MemoryArgument extends IArgument {
  type: 'MEM'
  literal: MemoryLiteral
  intern: MemoryInternal
}