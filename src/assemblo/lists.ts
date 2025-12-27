import { IArgument } from "./argument";

const INTERNALS = ['INP_LIST', 'OUTPUT_LST'] as const
const LITERALS = ['INPUT', 'OUTPUT'] as const

export type ListInternal = typeof INTERNALS[number];
export type ListLiteral = typeof LITERALS[number];

export const LISTSMAP = new Map<ListLiteral, ListInternal>([
  [LITERALS[0], INTERNALS[0]],
  [LITERALS[1], INTERNALS[1]],
])


export function isListLiteral(val: string): val is ListLiteral {
  return LITERALS.includes(val as ListLiteral)
}

export type InputQ = number[];
export type OutputQ = number[];

export interface ListArgument extends IArgument {
  type: 'LST'
  literal: ListLiteral
  intern: ListInternal
}