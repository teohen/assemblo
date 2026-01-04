import { IArgument } from "./argument";

const INTERNALS = ['INP_LIST', 'OUTPUT_LST'] as const
const LITERALS = ['INPUT', 'OUTPUT'] as const

export type ListInternal = typeof INTERNALS[number];
export type ListLiteral = typeof LITERALS[number];

export type TList = ListInput | ListOutput

type ListInput = number[]


type ListOutput = number[]

export interface IListInput {
  type: 'INPUT'
  items: ListInput,

  pop: () => number
}

export interface IListOutput {
  type: 'OUTPUT'
  items: ListOutput,

  push: (item: number) => void
}



function listPop(l: ListInput): number {
  const res = l.pop()
  return res || 0;
}

function listPush(l: ListOutput, item: number): void {
  l.push(item)
}



export const LISTSMAP = new Map<ListLiteral, ListInternal>([
  [LITERALS[0], INTERNALS[0]],
  [LITERALS[1], INTERNALS[1]],
])


export function isListLiteral(val: string): val is ListLiteral {
  return LITERALS.includes(val as ListLiteral)
}

export interface ListArgument extends IArgument {
  type: 'LST'
  literal: ListLiteral
  intern: ListInternal
}

function newInputList(lst?: number[]): IListInput {
  const items: ListInput = lst || [];

    return {
      type: 'INPUT',
      items,
      pop: () => listPop(items)
    }
}

function newOutputList(lst?: number[]): IListOutput {
  const items: ListOutput = lst || [];

    return {
      type: 'OUTPUT',
      items,
      push: (item: number) => listPush(items, item)
    }
}

function newList(name: 'INPUT', lst?: number[]): IListInput
function newList(name: 'OUTPUT', lst?: number[]):  IListOutput
function newList(name: ListLiteral, lst?: number[]): IListInput | IListOutput {
  return name === 'INPUT' ? newInputList(lst) : newOutputList(lst);
}

export default {
  createList: newList
}