import { IOperation } from "../../assemblo/operation"
import { LabelType } from "../../assemblo/labels";
import { InputQ, OutputQ } from "../../assemblo/lists";
import { Logger } from "../../assemblo/logger";
import { MemoryType } from "../../assemblo/memory";
import { RegistersType } from "../../assemblo/registers";
import { newRegisters, newMemory, newLabels, newLogger } from "./maps";

type EvaluatorArgFixture = {
  input?: InputQ,
  output?: OutputQ,
  registers?: RegistersType,
  memory?: MemoryType,
  labels?: LabelType,
  logger?: Logger[],
  operations?: IOperation[]
}

export type EvaluatorFixture = {
  input: InputQ,
  output: OutputQ,
  operations: IOperation[]
  registers: RegistersType,
  memory: MemoryType,
  labels: LabelType,
  logger: Logger[],
}

function newEvaluator(arg: EvaluatorArgFixture): EvaluatorFixture {
  const fixEva: EvaluatorFixture = {
    input: arg.input ?? [],
    output: arg.output ?? [],
    registers: arg.registers ?? newRegisters([]),
    memory: arg.memory ?? newMemory([]),
    labels: arg.labels ?? newLabels([]),
    logger: arg.logger ?? newLogger([]),
    operations: arg.operations ?? []
  }

  return fixEva;
}

export default {
  newEvaluator
}