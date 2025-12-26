import { Chance } from 'chance';
import { Argument, tokens } from '../../assemblo';

const chance = new Chance();

function rand<T>(options: T[]): T {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function randArgType() {
  return rand(Object.keys(tokens.ARG_TYPES))
}

function randReg() {
  return rand(Object.keys(tokens.REGISTERS))
}

function randMem() {
  return rand(Object.keys(tokens.MEMORY))
}

export function randLabel() {
  return "." + chance.word({ capitalize: false, length: 8 }) + "_" + chance.word({ capitalize: false, length: 15 })
}

export function newRandomArgument(): Argument {
  return new Argument(
    randArgType(),
    chance.word({ length: 30 }),
    chance.integer()
  )
}

export function newRegisterArgument(literal?: string): Argument {
  if (!literal) {
    literal = randReg()
  }

  return new Argument(tokens.ARG_TYPES.REG, literal, (tokens.REGISTERS as Record<string, string>)[literal])
}

export function newMemoryArgument(literal?: string): Argument {
  if (!literal) {
    literal = randMem()
  }

  return new Argument(tokens.ARG_TYPES.MEM, literal, (tokens.MEMORY as Record<string, string>)[literal])
}

export function newLabelArgument(literal?: string): Argument {
  if (!literal) {
    literal = randLabel()
  }

  return new Argument(tokens.ARG_TYPES.LBL, literal, literal)
}

export function newListArgument(literal?: string): Argument {
  if (!literal) {
    literal = rand(["INPUT", "OUTPUT"])
  }

  return new Argument(tokens.ARG_TYPES.LIST, literal, (tokens.LISTS as Record<string, string>)[literal])
}

export function newNumberArgument(literal?: string): Argument {
  if (!literal) {
    literal = chance.integer({ min: -1000, max: 1000 }).toString()
  }

  return new Argument(tokens.ARG_TYPES.NUM, literal, parseInt(literal))
}