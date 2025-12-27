import { IArgument } from './argument'

export interface IOperation {
  line: number;
  funcName: string;
  args: IArgument[];
}

function createOperation(line: number, funcName: string, args: IArgument[]): IOperation {
  return { line, funcName, args  } as IOperation;
}

export default {
  createOperation
}