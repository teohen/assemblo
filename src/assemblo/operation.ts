import Argument from "./argument";

// Assuming tokens.FUNCTION_TYPES.PROC and tokens.FUNCTION_TYPES.FLOW are strings
type FunctionType = "PROC" | "FLOW"; // If these are the only possible values

class Operation {
  line: number;
  funcName: string;
  args: Argument[];
  type: FunctionType;

  constructor(line: number, funcName: string, args: Argument[], type: FunctionType) {
    this.line = line;
    this.funcName = funcName;
    this.args = args;
    this.type = type;
  }
}

export default Operation;