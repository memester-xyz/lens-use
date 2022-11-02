import { useContractWrite, useSignTypedData } from "wagmi";

export interface ContractReturn {
  data: import("@wagmi/core").SendTransactionResult | undefined;
  status: ReturnType<typeof useContractWrite>["status"];
  prepareError: Error | null;
  writeError: Error | null;
  write: ReturnType<typeof useContractWrite>["write"];
}

export interface SignReturn {
  data: string | undefined;
  status: ReturnType<typeof useSignTypedData>["status"];
  error: Error | null;
  signTypedData: ReturnType<typeof useSignTypedData>["signTypedData"];
}
