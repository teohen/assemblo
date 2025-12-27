import { tokens } from '../../assemblo'
import { IArgument } from '../../assemblo/argument'
import operation, { IOperation } from '../../assemblo/operation'

function newOperation(fnName: string, ln: number, args: IArgument[]): IOperation {
  return operation.createOperation(ln, fnName, args)
}

export default {
  newOperation
}