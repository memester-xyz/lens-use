import { useSignTypedData as useSignTypedDataWagmi } from "wagmi";

import { TypedData } from "../../types/lens";
import { omitDeep } from "../../utils/omit-deep";
import { SignReturn } from "../contract";

export const useSignTypedData = (toSign: TypedData | undefined): SignReturn => {
  return useSignTypedDataWagmi({
    domain: omitDeep(toSign?.domain, "__typename"),
    types: omitDeep(toSign?.types, "__typename"),
    value: omitDeep(toSign?.value, "__typename"),
  });
};
