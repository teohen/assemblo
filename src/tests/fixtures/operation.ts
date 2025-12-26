import { Argument, Operation, tokens } from '../../assemblo'

export function createOperation(fnName: string, ln: number, args: Argument[]): Operation {
  return new Operation(ln, fnName, args, tokens.FUNCTION_TYPES.FLOW)
}