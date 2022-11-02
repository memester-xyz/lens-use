import { gql, MutationTuple, useMutation } from "@apollo/client";

import { RelayErrorReasons } from "../../types/error";

interface BroadcastRequest {
  request: {
    id?: string;
    signature?: string;
  };
}

export interface SuccessfulBroadcast {
  txId: string;
  txHash: string;
}
export interface FailedBroadcast {
  reason: RelayErrorReasons;
}

export const wasSuccessfulBroadcast = (
  broadcast: SuccessfulBroadcast | FailedBroadcast,
): broadcast is SuccessfulBroadcast => (broadcast as SuccessfulBroadcast).txId !== undefined;

export const wasFailedBroadcast = (broadcast: SuccessfulBroadcast | FailedBroadcast): broadcast is FailedBroadcast =>
  (broadcast as FailedBroadcast).reason !== undefined;

// more: https://docs.lens.xyz/docs/broadcast-transaction
interface BroadcastResponse {
  broadcast: SuccessfulBroadcast | FailedBroadcast;
}

const BROADCAST = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txHash
        txId
      }
      ... on RelayError {
        reason
      }
    }
  }
`;

export const useBroadcast = (id?: string, signature?: string): MutationTuple<BroadcastResponse, BroadcastRequest> => {
  return useMutation<BroadcastResponse, BroadcastRequest>(BROADCAST, {
    variables: {
      request: {
        id,
        signature,
      },
    },
  });
};
