import { IOperation } from "../../assemblo/operation"
import { LabelType } from "../../assemblo/labels";
import List, { IListInput, IListOutput } from "../../assemblo/lists";
import { Logger } from "../../assemblo/logger";
import { MemoryType } from "../../assemblo/memory";
import { RegistersType } from "../../assemblo/registers";
import { newRegisters, newMemory, newLabels, newLogger } from "./maps";

type EvaluatorArgFixture = {
  input?: IListInput,
  output?: IListOutput,
  registers?: RegistersType,
  memory?: MemoryType,
  labels?: LabelType,
  logger?: Logger[],
  operations?: IOperation[]
}

export type EvaluatorFixture = {
  input: IListInput,
  output: IListOutput,
  operations: IOperation[]
  registers: RegistersType,
  memory: MemoryType,
  labels: LabelType,
  logger: Logger[],
}

function newEvaluator(arg: EvaluatorArgFixture): EvaluatorFixture {
  const fixEva: EvaluatorFixture = {
    input: arg.input ?? List.createList('INPUT'),
    output: arg.output ?? List.createList('OUTPUT'),
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
