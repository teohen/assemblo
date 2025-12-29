export type TAddress = {
  value: number
}

export interface IAddress {
  mem: TAddress,

  get: () => number
  set: (val: number) => void
}

function createAddress(value?: number): IAddress {
  const mem: TAddress = {
    value: value || 0
  }
  const obj: IAddress = {
    mem,


    get: () => mem.value,
    set: (val: number) => mem.value = val,
  }
  return obj
}

export type TCPU = {
  pc: IAddress
}

export interface ICPU {
  state: TCPU,
  add: (destination: IAddress, source: IAddress) => IAddress
  sub: (destination: IAddress, source: IAddress) => IAddress
  mov: (destination: IAddress, source: IAddress) => IAddress
}
function createCPU(): ICPU {
  const cpu: TCPU = {
    pc: createAddress()
  }
  const obj: ICPU = {
    state: cpu,

    add: (destination: IAddress, source: IAddress) => add(cpu, destination, source),
    sub: (destination: IAddress, source: IAddress) => sub(cpu, destination, source),
    mov: (destination: IAddress, source: IAddress) => mov(cpu, destination, source),
  }
  return obj
}

function subleq(cpu: TCPU, A: IAddress, B: IAddress, C: IAddress): IAddress {
  B.set(B.get() - A.get())
  if (B.get() <= 0) {
    return C
  }

  return cpu.pc
}

function add(cpu: TCPU, destination: IAddress, source: IAddress): IAddress {
  const z = createAddress();
  const c = createAddress(cpu.pc.get());

  subleq(cpu, source, z, c)
  subleq(cpu, z, destination, c)
  subleq(cpu, z, z, c)

  return c;
}

function sub(cpu: TCPU, destination: IAddress, source: IAddress): IAddress {
  subleq(cpu, source, destination, cpu.pc)
  return cpu.pc
}

function mov(cpu: TCPU, destinaton: IAddress, source: IAddress): IAddress {
  const z = createAddress();

  const c = createAddress(cpu.pc.get());

  subleq(cpu, destinaton, destinaton, c);
  subleq(cpu, source, z, c);
  subleq(cpu, z, destinaton, c);
  subleq(cpu, z, z, c);

  return cpu.pc
}

export default {
  add,
  sub,
  mov,
  createAddress,
  createCPU
}
