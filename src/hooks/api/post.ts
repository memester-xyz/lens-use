import { gql, MutationTuple, useMutation } from "@apollo/client";

import { TypedDataResponse } from "../../types/lens";
import { CollectModule, ReferenceModule } from "../../types/modules";
import { FailedBroadcast, SuccessfulBroadcast } from "./broadcast";

interface CreatePostTypedDataRequest {
  request: {
    profileId?: string;
    contentURI?: string;
    collectModule?: CollectModule;
    referenceModule?: ReferenceModule;
  };
}

// more: https://docs.lens.xyz/docs/create-post-typed-data
interface CreatePostTypedDataResponse {
  createPostTypedData?: TypedDataResponse;
}

const CREATE_POST_TYPED_DATA = gql`
  mutation ($request: CreatePublicPostRequest!) {
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

export const useCreatePostTypedData = (
  profileId?: string,
  contentURI?: string,
  collectModule?: CollectModule,
  referenceModule?: ReferenceModule,
): MutationTuple<CreatePostTypedDataResponse, CreatePostTypedDataRequest> => {
  return useMutation<CreatePostTypedDataResponse, CreatePostTypedDataRequest>(CREATE_POST_TYPED_DATA, {
    variables: {
      request: {
        profileId,
        contentURI,
        collectModule,
        referenceModule,
      },
    },
  });
};

const CREATE_POST_VIA_DISPATCHER = gql`
  mutation ($request: CreatePublicPostRequest!) {
    createPostViaDispatcher(request: $request) {
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

interface CreatePostViaDispatcherResponse {
  createPostViaDispatcher: SuccessfulBroadcast | FailedBroadcast;
}

export const useCreatePostViaDispatcher = (
  profileId?: string,
  contentURI?: string,
  collectModule?: CollectModule,
  referenceModule?: ReferenceModule,
): MutationTuple<CreatePostViaDispatcherResponse, CreatePostTypedDataRequest> => {
  return useMutation<CreatePostViaDispatcherResponse, CreatePostTypedDataRequest>(CREATE_POST_VIA_DISPATCHER, {
    variables: {
      request: {
        profileId,
        contentURI,
        collectModule,
        referenceModule,
      },
    },
  });
};
