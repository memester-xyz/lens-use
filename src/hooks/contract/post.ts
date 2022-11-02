import { useContractWrite, usePrepareContractWrite } from "wagmi";

import LensHubAbi from "../../assets/abi/lenshub.json";
import { useLensHubAddress } from "../../context/LensContext";
import { ContractReturn } from ".";

export const useContractPost = (
  profileId?: string,
  contentURI?: string,
  collectModule?: string,
  collectModuleInitData?: string,
  referenceModule?: string,
  referenceModuleInitData?: string,
): ContractReturn => {
  const addressOrName = useLensHubAddress();

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName,
    contractInterface: LensHubAbi,
    functionName: "post",
    args: [
      {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      },
    ],
    enabled:
      profileId !== undefined &&
      contentURI !== undefined &&
      collectModule !== undefined &&
      collectModuleInitData !== undefined &&
      referenceModule !== undefined &&
      referenceModuleInitData !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
