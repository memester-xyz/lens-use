import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";

export const publicationIdFromReceipt = (receipt: TransactionReceipt | undefined): string | undefined => {
  if (receipt?.logs[0] && receipt.logs[0].topics.length === 3) {
    let profileId = ethers.utils.hexStripZeros(receipt?.logs[0].topics[1]);
    if (profileId.length % 2 === 1) {
      profileId = `${profileId.substring(0, 2)}0${profileId.substring(2)}`;
    }
    let postId = ethers.utils.hexStripZeros(receipt?.logs[0].topics[2]);
    if (postId.length % 2 === 1) {
      postId = `${postId.substring(0, 2)}0${postId.substring(2)}`;
    }

    return `${profileId}-${postId}`;
  }
};
