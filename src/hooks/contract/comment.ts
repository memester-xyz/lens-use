import { useContractWrite, usePrepareContractWrite } from "wagmi";

import LensHubAbi from "../../assets/abi/lenshub.json";
import { useLensHubAddress } from "../../context/LensContext";
import { ContractReturn } from ".";

export const useContractComment = (
  profileId?: string,
  contentURI?: string,
  profileIdPointed?: string,
  pubIdPointed?: string,
  collectModule?: string,
  collectModuleInitData?: string,
  referenceModule?: string,
  referenceModuleInitData?: string,
  referenceModuleData?: string,
): ContractReturn => {
  const addressOrName = useLensHubAddress();

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName,
    contractInterface: LensHubAbi,
    functionName: "comment",
    args: [
      {
        profileId,
        contentURI,
        profileIdPointed,
        pubIdPointed,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
        referenceModuleData,
      },
    ],
    enabled:
      profileId !== undefined &&
      contentURI !== undefined &&
      profileIdPointed !== undefined &&
      pubIdPointed !== undefined &&
      collectModule !== undefined &&
      collectModuleInitData !== undefined &&
      referenceModule !== undefined &&
      referenceModuleInitData !== undefined &&
      referenceModuleData !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
