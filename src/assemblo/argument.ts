
class Argument {
  type: string
  literal: string
  intern: number | string

  constructor(type: string, literal: string, intern: number | string) {
    if (type === undefined || type === null) {
      throw new Error('Args required: type')
    }
    if (literal === undefined || literal === null) {
      throw new Error('Args required: literal')
    }
    if (intern === undefined || intern === null) {
      throw new Error('Args required: intern')
    }
    this.type = type
    this.literal = literal
    this.intern = intern
  }

  static validateType(arg: Argument, expTypeList: string[], ln: number): boolean {
    let valid = false

    for (const expType of expTypeList) {
      if (arg.type === expType) {
        valid = true
        break
      }
    }

    if (!valid) {
      throw new Error(
        `AT LINE: ${ln}. INVALID ARGUMENT TYPE: ${arg.type}, EXPECTED: ${expTypeList.join(', ')}`,
      )
    }

    return valid
  }

  static validateValue(arg: Argument, expValue: number): boolean {
    return arg.intern === expValue
  }
}

export default Argument
