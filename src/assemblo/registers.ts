import { IArgument } from "./argument";

const INTERNALS = ['R0X', 'R1X', 'R2X'] as const
const LITERALS = ['r0', 'r1', 'r2'] as const

export type RegisterInternal = typeof INTERNALS[number];
export type RegisterLiteral = typeof LITERALS[number];


export type RegistersType = IMap;


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

export const REGISTERSMAP: Map<RegisterLiteral, RegisterInternal> = new Map([
  [LITERALS[0], INTERNALS[0]],
  [LITERALS[1], INTERNALS[1]],
  [LITERALS[2], INTERNALS[2]],
]);



export function isRegisterLiteral(val: string): val is RegisterLiteral {
  return LITERALS.includes(val as RegisterLiteral)
}

export interface RegisterArgument extends IArgument {
  type: 'REG'
  literal: RegisterLiteral
  intern: RegisterInternal
}

export default {
  createRegister: (name?: string) => name ? createMap(name) : createMap("registers")
}
