import { IArgument } from "./argument";

const INTERNALS = ['MX0', 'MX1', 'MX2'] as const
const LITERALS = ['mx0', 'mx1', 'mx2'] as const

export type MemoryInternal = typeof INTERNALS[number];
export type MemoryLiteral = typeof LITERALS[number];
export type MemoryType = IMap

export const MEMORYMAP = new Map<MemoryLiteral, MemoryInternal>([
  [LITERALS[0], INTERNALS[0]],
  [LITERALS[1], INTERNALS[1]],
  [LITERALS[2], INTERNALS[2]],
])

interface IMap {
  map: Map<string, number>,
  get: (key: string) => number,
  set: (key: string, val: number | undefined) => void,
}

function get(rg: Map<string, number>, key: string): number {
  const value = rg.get(key) || 0;
  return value;
}

function set(rg: Map<string, number>, key: string, value: number): void {
  if (/^-?[0-9]\d*$/.test(value.toString())) {
    rg.set(key, value);
    return
  }

  rg.set(key, 0);
}

export function createMap(name: string): IMap {
  const map = new Map<string, number>();

  const obj: IMap = {
    map,

    get: (key: string) => get(map, key),
    set: (key: string, value: number) => set(map, key, value),
  }

  return obj;
}



export function isMemoryLiteral(val: string): val is MemoryLiteral {
  return LITERALS.includes(val as MemoryLiteral)
}

export interface MemoryArgument extends IArgument {
  type: 'MEM'
  literal: MemoryLiteral
  intern: MemoryInternal
}

export default {
  createMemory: () => createMap("memory")
}
