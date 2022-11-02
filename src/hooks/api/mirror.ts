import { gql, MutationTuple, useMutation } from "@apollo/client";

import { TypedDataResponse } from "../../types/lens";
import { ReferenceModule } from "../../types/modules";
import { FailedBroadcast, SuccessfulBroadcast } from "./broadcast";

interface MirrorRequest {
  request: {
    profileId?: string;
    publicationId?: string;
    referenceModule?: ReferenceModule;
  };
}

// more: https://docs.lens.xyz/docs/create-mirror-typed-data
interface MirrorResponse {
  createMirrorTypedData: TypedDataResponse;
}

const MIRROR = gql`
  mutation ($request: CreateMirrorRequest!) {
    createMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`;

export const useCreateMirrorTypedData = (
  profileId?: string,
  publicationId?: string,
  referenceModule?: ReferenceModule,
): MutationTuple<MirrorResponse, MirrorRequest> => {
  return useMutation<MirrorResponse, MirrorRequest>(MIRROR, {
    variables: {
      request: {
        profileId,
        publicationId,
        referenceModule,
      },
    },
  });
};

const CREATE_MIRROR_VIA_DISPATCHER = gql`
  mutation ($request: CreateMirrorRequest!) {
    createMirrorViaDispatcher(request: $request) {
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

interface CreateMirrorViaDispatcherResponse {
  createMirrorViaDispatcher: SuccessfulBroadcast | FailedBroadcast;
}

export const useCreateMirrorViaDispatcher = (
  profileId?: string,
  publicationId?: string,
  referenceModule?: ReferenceModule,
): MutationTuple<CreateMirrorViaDispatcherResponse, MirrorRequest> => {
  return useMutation<CreateMirrorViaDispatcherResponse, MirrorRequest>(CREATE_MIRROR_VIA_DISPATCHER, {
    variables: {
      request: {
        profileId,
        publicationId,
        referenceModule,
      },
    },
  });
};
