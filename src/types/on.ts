import { TransactionReceipt } from "@ethersproject/abstract-provider";

export type OnBroadcastedFunction = ((receipt?: TransactionReceipt) => void) | undefined;
export type OnCompletedFunction = ((receipt?: TransactionReceipt) => void) | undefined;

export interface OnFunctions {
  onBroadcasted?: OnBroadcastedFunction;
  onCompleted?: OnCompletedFunction;
}
