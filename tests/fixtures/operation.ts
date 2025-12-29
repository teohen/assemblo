import { tokens } from '../../src/assemblo'
import { IArgument } from '../../src/assemblo/argument'
import operation, { IOperation } from '../../src/assemblo/operation'

function newOperation(fnName: string, ln: number, args: IArgument[]): IOperation {
  return operation.createOperation(ln, fnName, args)
}

export default {
  newOperation
}