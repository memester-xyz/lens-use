import { gql, MutationTuple, QueryResult, useMutation, useQuery } from "@apollo/client";

interface ChallengeRequest {
  request: {
    address?: string;
  };
}

interface ChallengeResponse {
  challenge: {
    text: string;
  };
}

const GET_CHALLENGE = gql`
  query ($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

export const useChallenge = (address?: string): QueryResult<ChallengeResponse, ChallengeRequest> => {
  return useQuery<ChallengeResponse, ChallengeRequest>(GET_CHALLENGE, {
    variables: {
      request: {
        address,
      },
    },
    skip: !address,
  });
};

interface AuthenticateRequest {
  request: {
    address?: string;
    signature?: string;
  };
}

interface AuthenticateResponse {
  authenticate: {
    accessToken: string;
    refreshToken: string;
  };
}

const AUTHENTICATE = gql`
  mutation ($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export const useAuthenticate = (
  address?: string,
  signature?: string,
): MutationTuple<AuthenticateResponse, AuthenticateRequest> => {
  return useMutation<AuthenticateResponse, AuthenticateRequest>(AUTHENTICATE, {
    variables: {
      request: {
        address,
        signature,
      },
    },
  });
};

interface RefreshRequest {
  request: {
    refreshToken?: string;
  };
}

interface RefreshResponse {
  refresh: {
    accessToken: string;
    refreshToken: string;
  };
}

const REFRESH_AUTHENTICATION = gql`
  mutation ($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export const useRefresh = (refreshToken?: string): MutationTuple<RefreshResponse, RefreshRequest> => {
  return useMutation<RefreshResponse, RefreshRequest>(REFRESH_AUTHENTICATION, {
    variables: {
      request: {
        refreshToken,
      },
    },
  });
};
