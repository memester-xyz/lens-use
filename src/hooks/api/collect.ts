import { gql, MutationTuple, useMutation } from "@apollo/client";

import { TypedDataResponse } from "../../types/lens";

interface CollectRequest {
  request: {
    publicationId?: string;
  };
}

// more: https://docs.lens.xyz/docs/create-collected-typed-data
interface CollectResponse {
  createCollectTypedData: TypedDataResponse;
}

const COLLECT = gql`
  mutation ($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;

export const useCreateCollectTypedData = (publicationId?: string): MutationTuple<CollectResponse, CollectRequest> => {
  return useMutation<CollectResponse, CollectRequest>(COLLECT, {
    variables: {
      request: {
        publicationId,
      },
    },
  });
};
