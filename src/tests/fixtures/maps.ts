import Chance from "chance";

const chance = new Chance();

interface Item {
  name: string;
  value?: number;
}

export function newMap(items: Item[]) {
  const newMap = new Map();
  for (const i of items) {
    let v = i.value ?? chance.integer({ min: -1000, max: 1000 })

    newMap.set(i.name, v);
  }
  return newMap;
}

export function newFilledMap(items: Item[]) {
  const newMap = new Map();
  for (const i of items) {
    newMap.set(i.name, i.value);
  }
  return newMap;
}