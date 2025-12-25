import { Argument, Operation, tokens } from "../../assemblo";
import { Registers } from "../../assemblo/program";

interface Args {
  fnName: string;
  ln: number;
  args: Argument[]
}

export function createOperation(fnName: string, ln: number, args: Argument[]): Operation {
 return new Operation(ln, fnName, args, tokens.FUNCTION_TYPES.FLOW);
}