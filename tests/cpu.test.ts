import { describe, expect, it } from 'bun:test';

import CPU from '../src/assemblo/cpu';

describe('CPU suite', () => {
  it('should perform the ADD operation', () => {
    const a = CPU.createAddress()
    const b = CPU.createAddress()

    a.set(5);
    b.set(10);
    const cpu = CPU.createCPU()

    cpu.add(a, b)
    expect(a.get()).toBe(15);
  });

  it('should perform the SUB operation', () => {
    const a = CPU.createAddress()
    const b = CPU.createAddress()

    a.set(10);
    b.set(5);
    const cpu = CPU.createCPU()

    cpu.sub(a, b);

    expect(a.get()).toBe(5);
  });

  it('should perform the MOV operation', () => {
    const a = CPU.createAddress()
    const b = CPU.createAddress()

    a.set(0);
    b.set(10);
    const cpu = CPU.createCPU()

    cpu.mov(a, b);

    expect(a.get()).toBe(10);
  });


});
