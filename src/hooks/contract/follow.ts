import { useContractWrite, usePrepareContractWrite } from "wagmi";

import FollowNFTAbi from "../../assets/abi/follow-nft.json";
import LensHubAbi from "../../assets/abi/lenshub.json";
import { useLensHubAddress } from "../../context/LensContext";
import { ContractReturn } from ".";

export const useContractFollow = (profileIds?: string[], datas?: string[]): ContractReturn => {
  const addressOrName = useLensHubAddress();

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName,
    contractInterface: LensHubAbi,
    functionName: "follow",
    args: [profileIds, datas],
    enabled: profileIds !== undefined && profileIds.length > 0 && datas !== undefined && datas.length > 0,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};

export const useContractUnfollow = (followNFTAddress?: string, tokenId?: string): ContractReturn => {
  const { config, error: prepareError } = usePrepareContractWrite({
    contractInterface: FollowNFTAbi,
    addressOrName: followNFTAddress ?? "",
    functionName: "burn",
    args: [tokenId],
    enabled: followNFTAddress !== undefined && tokenId !== undefined,
  });

  const { write, data, error: writeError, status } = useContractWrite(config);

  return { write, data, prepareError, writeError, status };
};
