export type LogType = 'error' | 'message' | 'success';

export interface Logger {
  type: LogType;
  value: string | number;
  ln: number;
}