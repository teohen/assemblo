import { Chance } from 'chance'
import { tokens } from '../../assemblo'
import Argument, { NumberArgument } from '../../assemblo/argument'
import { RegisterArgument } from '../../assemblo/registers'
import { MemoryArgument } from '../../assemblo/memory'
import { LabelArgument } from '../../assemblo/labels'
import { ListArgument } from '../../assemblo/lists'

const chance = new Chance()

function rand<T>(options: T[]): T {
  const randomIndex = Math.floor(Math.random() * options.length)
  return options[randomIndex]
}

function randReg() {
  return rand(Object.keys(tokens.REGISTERS))
}

function randMem() {
  return rand(Object.keys(tokens.MEMORY))
}

function randLabel() {
  return '.' + chance.word({ capitalize: false, length: 8 }) + '_' + chance.word({ capitalize: false, length: 15 })
}

function newRegisterArgument(literal?: string): RegisterArgument {
  if (!literal) {
    literal = randReg()
  }

  return Argument.createRegisterArgument(literal)
}

function newMemoryArgument(literal?: string): MemoryArgument {
  if (!literal) {
    literal = randMem()
  }

  return Argument.createMemoryArgument(literal)
}

function newLabelArgument(literal?: string): LabelArgument {
  if (!literal) {
    literal = randLabel()
  }

  return Argument.createLabelArgument(literal)
}

function newListArgument(literal?: string): ListArgument {
  if (!literal) {
    literal = rand(['INPUT', 'OUTPUT'])
  }

  return Argument.createListArgument(literal)
}

function newNumberArgument(literal?: number): NumberArgument {
  if (typeof literal === 'number') {
    return Argument.createNumberArgument(literal);
  }
  if (!literal) {
    literal = chance.integer({ min: -1000, max: 1000 })
  }

  return Argument.createNumberArgument(literal)
}

export default {
  newRegisterArgument,
  newMemoryArgument,
  newLabelArgument,
  newListArgument,
  newNumberArgument
}
