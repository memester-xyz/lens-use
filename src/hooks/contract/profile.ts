import { useContractRead } from "wagmi";

import LensHubAbi from "../../assets/abi/lenshub.json";
import { useLensHubAddress } from "../../context/LensContext";

export const useContractProfile = (profileId?: string): ReturnType<typeof useContractRead> => {
  const addressOrName = useLensHubAddress();

  return useContractRead({
    addressOrName,
    contractInterface: LensHubAbi,
    functionName: "getProfile",
    args: [profileId],
    enabled: profileId !== undefined,
  });
};
