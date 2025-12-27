import { ConditionalFunction } from './evaluator'
import { LabelArgument } from './labels'
import { isListLiteral, ListArgument, LISTSMAP } from './lists'
import { isMemoryLiteral, MemoryArgument, MEMORYMAP } from './memory'
import { isRegisterLiteral, REGISTERSMAP, RegisterArgument } from './registers'
import tokens from './tokens'

type ArgInternals = number | string | ConditionalFunction

export type ArgTypes = 'MEM' | 'REG' | 'LST' | 'NUM' | 'LBL' | 'CND'

export interface IArgument {
  type: ArgTypes
  literal: string;
  intern: ArgInternals
}

export interface NumberArgument extends IArgument {
  type: 'NUM'
  literal: string
  intern: number
}

export interface ConditionalArgument extends IArgument {
  type: 'CND'
  literal: string
  intern: ConditionalFunction
}

function createRegisterArgument(argLit: string): RegisterArgument {
  if (!isRegisterLiteral(argLit)) {
    throw new Error(`Error creating RegisterArgument: invalid literal ${argLit}`)
  }

  const intern = REGISTERSMAP.get(argLit)
  if (!intern) {
    throw new Error(`Error creating RegisterArgument: invalid literal ${argLit}`)
  }

  return { type: 'REG', literal: argLit, intern } as RegisterArgument

}

function createMemoryArgument(argLit: string): MemoryArgument {
  if (!isMemoryLiteral(argLit)) {
    throw new Error(`Error creating MemoryArgument: invalid literal ${argLit}`)
  }

  const intern = MEMORYMAP.get(argLit)
  if (!intern) {
    throw new Error(`Error creating MemoryArgument: invalid literal ${argLit}`)
  }

  return { type: 'MEM', literal: argLit, intern } as MemoryArgument
}

function createListArgument(argLit: string): ListArgument {
  if (!isListLiteral(argLit)) {
    throw new Error(`Error creating ListArgument: invalid literal ${argLit}`)
  }

  const intern = LISTSMAP.get(argLit)
  if (!intern) {
    throw new Error(`Error creating ListArgument: invalid literal ${argLit}`)
  }

  return { type: 'LST', literal: argLit, intern } as ListArgument
}

function createLabelArgument(literal: string): LabelArgument {
  return { type: tokens.ARG_TYPES.LBL, literal, intern: literal } as LabelArgument
}

function createNumberArgument(literal: string): NumberArgument {
  const numValue = parseInt(literal, 10)

  return { type: 'NUM', literal, intern: numValue } as NumberArgument
}

function createConditionalArgument(func: ConditionalFunction): ConditionalArgument {
  return { type: 'CND', literal: func.name, intern: func } as ConditionalArgument
}

export default {
  createListArgument,
  createConditionalArgument,
  createLabelArgument,
  createMemoryArgument,
  createNumberArgument,
  createRegisterArgument,
}

