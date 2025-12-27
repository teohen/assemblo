import { IArgument } from "./argument";

export type LabelInternal = string;
export type LabelLiteral = string;

export type LabelType = Map<LabelInternal, number | undefined>


export interface LabelArgument extends IArgument {
  type: 'LBL'
  literal: LabelLiteral
  intern: LabelInternal
}
