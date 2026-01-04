import Chance from 'chance'
import { IArgument } from '../../assemblo/argument'
import operation, { IOperation } from '../../assemblo/operation'
import fixtures from '.';

const chance = Chance();

function newOperation(fnName: string, ln: number, args: IArgument[]): IOperation {
  return operation.createOperation(ln, fnName, args)
}
function newRandomOperation(): IOperation {
  return operation.createOperation(0, chance.word(), [fixtures.Argument.newNumberArgument()])
}

export default {
  newOperation,
  newRandomOperation
}