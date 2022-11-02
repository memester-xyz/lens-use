import { useContractWrite, usePrepareContractWrite } from "wagmi";

import LensHubAbi from "../../assets/abi/lenshub.json";
import { useLensHubAddress } from "../../context/LensContext";
import { ContractReturn } from ".";

export const useContractMirror = (
  profileId?: string,
  profileIdPointed?: string,
  pubIdPointed?: string,
  referenceModuleData?: string,
  referenceModule?: string,
  referenceModuleInitData?: string,
): ContractReturn => {
  const addressOrName = useLensHubAddress();

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName,
    contractInterface: LensHubAbi,
    functionName: "mirror",
    args: [
      { profileId, profileIdPointed, pubIdPointed, referenceModuleData, referenceModule, referenceModuleInitData },
    ],
    enabled:
      profileId !== undefined &&
      profileIdPointed !== undefined &&
      pubIdPointed !== undefined &&
      referenceModuleData !== undefined &&
      referenceModule !== undefined &&
      referenceModuleInitData !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
