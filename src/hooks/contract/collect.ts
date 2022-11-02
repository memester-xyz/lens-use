import { useContractWrite, usePrepareContractWrite } from "wagmi";

import LensHubAbi from "../../assets/abi/lenshub.json";
import { useLensHubAddress } from "../../context/LensContext";
import { ContractReturn } from ".";

export const useContractCollect = (profileId?: string, pubId?: string, dataBytes?: string): ContractReturn => {
  const addressOrName = useLensHubAddress();

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName,
    contractInterface: LensHubAbi,
    functionName: "collect",
    args: [profileId, pubId, dataBytes],
    enabled: profileId !== undefined && pubId !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
