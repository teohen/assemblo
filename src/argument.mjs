class Argument {
  type;
  literal;
  intern;

  constructor(type, literal, intern) {
    if (type === undefined || literal === null) {
      throw new Error('Args required: type');
    }
    if (literal === undefined || literal === null) {
      throw new Error('Args required: literal');
    }
    if (intern === undefined || intern === null) {
      throw new Error('Args required: intern');
    }
    this.type = type;
    this.literal = literal;
    this.intern = intern;
  }
  static validateType(arg, expTypeList, ln) {
    let valid = false;
    let errorType = "";
    for (const expType of expTypeList) {
      if (arg.type == expType) {
        valid = true
      }
    }

    if (!valid) {
      throw new Error(
        `AT LINE: ${ln}. INVALID ARGUMENT TYPE: ${arg.type}, EXPECTED: ${expTypeList}`,
      );
    }

    return valid;
  }

  static validateValue(arg, expValue, ln) {
    return !(arg.intern != expValue)
  }
}



export default Argument;
