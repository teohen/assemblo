class Argument {
  type;
  literal;
  intern;

  constructor(type, literal, intern) {
    if (!type || !literal || !intern) throw new Error('Args required: type, literal and intern')
    this.type = type;
    this.literal = literal;
    this.intern = intern;
  }
  static validateType(arg, expType, ln) {
    if (arg.type != expType) {
      throw new Error(
        `AT LINE: ${ln}. INVALID ARGUMENT TYPE: ${arg.type}, EXPECTED: ${expType}`,
      );
    }

    return true;
  }
}



export default Argument;
