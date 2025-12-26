class Registers {
  private label: string
  private value: number

  constructor(label?: string, value?: number) {
    if (label) this.label = label
    if (value) this.value = value || 0

  }

  get(): number {
    return this.value
  }

  set(value: number) {
    this.value = value
  }
}

export default Registers
