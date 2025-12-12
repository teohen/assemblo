class Operation {
  line;
  funcName;
  args;
  type;

  constructor(line, funcName, args, type) {
    this.line = line;
    this.funcName = funcName;
    this.args = args;
    this.type = type;
  }
}

export default Operation;
