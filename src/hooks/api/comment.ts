import { gql, MutationTuple, useMutation } from "@apollo/client";

import { TypedDataResponse } from "../../types/lens";
import { CollectModule, ReferenceModule } from "../../types/modules";
import { FailedBroadcast, SuccessfulBroadcast } from "./broadcast";

interface CreateCommentTypedDataRequest {
  request: {
    profileId?: string;
    publicationId?: string;
    contentURI?: string;
    collectModule?: CollectModule;
    referenceModule?: ReferenceModule;
  };
}

// more: https://docs.lens.xyz/docs/create-comment-typed-data
interface CreateCommentTypedDataResponse {
  createCommentTypedData?: TypedDataResponse;
}

const CREATE_COMMENT_TYPED_DATA = gql`
  mutation ($request: CreatePublicCommentRequest!) {
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
          referenceModuleData
        }
      }
    }
  }
`;

export const useCreateCommentTypedData = (
  profileId?: string,
  publicationId?: string,
  contentURI?: string,
  collectModule?: CollectModule,
  referenceModule?: ReferenceModule,
): MutationTuple<CreateCommentTypedDataResponse, CreateCommentTypedDataRequest> => {
  return useMutation<CreateCommentTypedDataResponse, CreateCommentTypedDataRequest>(CREATE_COMMENT_TYPED_DATA, {
    variables: {
      request: {
        profileId,
        publicationId,
        contentURI,
        collectModule,
        referenceModule,
      },
    },
  });
};

const CREATE_COMMENT_VIA_DISPATCHER = gql`
  mutation ($request: CreatePublicCommentRequest!) {
    createCommentViaDispatcher(request: $request) {
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

interface CreateCommentViaDispatcherResponse {
  createCommentViaDispatcher: SuccessfulBroadcast | FailedBroadcast;
}

export const useCreateCommentViaDispatcher = (
  profileId?: string,
  publicationId?: string,
  contentURI?: string,
  collectModule?: CollectModule,
  referenceModule?: ReferenceModule,
): MutationTuple<CreateCommentViaDispatcherResponse, CreateCommentTypedDataRequest> => {
  return useMutation<CreateCommentViaDispatcherResponse, CreateCommentTypedDataRequest>(CREATE_COMMENT_VIA_DISPATCHER, {
    variables: {
      request: {
        profileId,
        publicationId,
        contentURI,
        collectModule,
        referenceModule,
      },
    },
  });
};
