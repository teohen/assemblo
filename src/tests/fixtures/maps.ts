import Chance from 'chance'
import { RegistersType } from '../../assemblo/registers';
import { MemoryType } from '../../assemblo/memory';
import { LabelType } from '../../assemblo/labels';
import { Logger } from '../../assemblo/logger';


const chance = new Chance()

interface Item {
  name: string;
  value?: number;
}

export function newMap(items: Item[]) {
  const newMap = new Map()
  for (const i of items) {
    const v = i.value ?? chance.integer({ min: -1000, max: 1000 })

    newMap.set(i.name, v)
  }
  return newMap
}

export function newFilledMap(items: Item[]) {
  const newMap = new Map()
  for (const i of items) {
    newMap.set(i.name, i.value)
  }
  return newMap
}


export function newRegisters(items: Item[]): RegistersType {
  return newMap(items) as RegistersType;
}

export function newMemory(items: Item[]): MemoryType {
  return newMap(items) as MemoryType;
}

export function newLabels(items: Item[]): LabelType {
  return newMap(items) as LabelType;
}
export function newLogger(items: Item[]): Logger[] {
  return []
}