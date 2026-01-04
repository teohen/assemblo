import { IArgument } from "./argument";

export type LabelInternal = string;
export type LabelLiteral = string;

export type LabelType = IMap

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



export interface LabelArgument extends IArgument {
  type: 'LBL'
  literal: LabelLiteral
  intern: LabelInternal
}

export default {
  createLabels: () => createMap("labels")
}
