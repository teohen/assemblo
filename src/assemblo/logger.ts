export type LogType = 'error' | 'message' | 'success';

export interface Logger {
  type: LogType;
  value: any;
  ln: number;
}