import { gql, MutationTuple, useMutation } from "@apollo/client";

import { TypedDataResponse } from "../../types/lens";

interface FollowRequest {
  request: {
    follow?: Array<{
      profile?: string;
      // TODO: Support follow modules
      // followModule: string;
    }>;
  };
}

// more: https://docs.lens.xyz/docs/create-follow-typed-data
interface FollowResponse {
  createFollowTypedData: TypedDataResponse;
}

const FOLLOW = gql`
  mutation ($request: FollowRequest!) {
    createFollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          FollowWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          profileIds
          datas
        }
      }
    }
  }
`;

export const useCreateFollowTypedData = (profile?: string): MutationTuple<FollowResponse, FollowRequest> => {
  return useMutation<FollowResponse, FollowRequest>(FOLLOW, {
    variables: {
      request: {
        follow: [
          {
            profile,
          },
        ],
      },
    },
  });
};

interface UnfollowRequest {
  request: {
    profile?: string;
  };
}

// more: https://docs.lens.xyz/docs/create-unfollow-typed-data
interface UnfollowResponse {
  createUnfollowTypedData: TypedDataResponse;
}

const UNFOLLOW = gql`
  mutation ($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`;

export const useCreateUnfollowTypedData = (profile?: string): MutationTuple<UnfollowResponse, UnfollowRequest> => {
  return useMutation<UnfollowResponse, UnfollowRequest>(UNFOLLOW, {
    variables: {
      request: {
        profile,
      },
    },
  });
};
