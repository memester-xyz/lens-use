import { gql, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { DefaultProfile } from "../../types/lens";

interface ProfilesRequest {
  request: {
    ownedBy?: string;
  };
}

// more: https://docs.lens.xyz/docs/get-profiles
interface ProfilesResponse {
  profiles?: {
    items: DefaultProfile[];
  };
}

const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        attributes {
          displayType
          traitType
          key
          value
        }
        followNftAddress
        metadata
        isDefault
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        dispatcher {
          address
          canUseRelay
        }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
        followModule {
          ... on FeeFollowModuleSettings {
            type
            amount {
              asset {
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          ... on ProfileFollowModuleSettings {
            type
          }
          ... on RevertFollowModuleSettings {
            type
          }
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export const useProfiles = (ownedBy?: string): QueryResult<ProfilesResponse, ProfilesRequest> => {
  return useQuery<ProfilesResponse, ProfilesRequest>(GET_PROFILES, {
    variables: {
      request: {
        ownedBy,
      },
    },
    skip: !ownedBy,
  });
};

interface DefaultProfileRequest {
  request: {
    ethereumAddress?: string;
  };
}

// more: https://docs.lens.xyz/docs/get-default-profile
interface DefaultProfileResponse {
  defaultProfile?: DefaultProfile;
}

const GET_DEFAULT_PROFILE = gql`
  query ($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
    }
  }
`;

// TODO: Allow selecting profile
export const useDefaultProfile = (ethereumAddress?: string): DefaultProfileResponse => {
  const [response, setResponse] = useState<DefaultProfileResponse>({ defaultProfile: undefined });

  const defaultProfileQuery = useQuery<DefaultProfileResponse, DefaultProfileRequest>(GET_DEFAULT_PROFILE, {
    variables: {
      request: {
        ethereumAddress,
      },
    },
    skip: !ethereumAddress,
  });

  const profilesQuery = useProfiles(ethereumAddress);

  useEffect(() => {
    if (defaultProfileQuery.data?.defaultProfile) {
      setResponse({ defaultProfile: defaultProfileQuery.data?.defaultProfile });
    } else if (profilesQuery.data?.profiles?.items && profilesQuery.data?.profiles?.items.length > 0) {
      setResponse({ defaultProfile: profilesQuery.data?.profiles?.items[0] });
    }
  }, [ethereumAddress, profilesQuery, defaultProfileQuery]);

  return response;
};

interface ProfileRequest {
  request: {
    handle?: string;
  };
}

// more: https://docs.lens.xyz/docs/get-profile
interface ProfileResponse {
  profile?: DefaultProfile;
}

const GET_PROFILE = gql`
  query ($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      isFollowedByMe
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
    }
  }
`;

export const useProfile = (handle?: string): QueryResult<ProfileResponse, ProfileRequest> => {
  return useQuery<ProfileResponse, ProfileRequest>(GET_PROFILE, {
    variables: {
      request: { handle },
    },
    skip: !handle,
  });
};

interface DispatcherRequest {
  request: {
    profileId?: string;
  };
}

// more: https://docs.lens.xyz/docs/dispatcher
interface DispatcherResponse {
  profile?: {
    dispatcher?: {
      address: string;
      canUseRelay: boolean;
    };
  };
}

const HAS_DISPATCHER = gql`
  query ($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      id
      dispatcher {
        address
        canUseRelay
      }
    }
  }
`;

export const useProfileHasDispatcher = (profileId?: string): boolean => {
  const [dispatch, setDispatch] = useState(false);

  const { data } = useQuery<DispatcherResponse, DispatcherRequest>(HAS_DISPATCHER, {
    variables: {
      request: { profileId },
    },
    skip: !profileId,
  });

  useEffect(() => {
    setDispatch(data?.profile?.dispatcher?.canUseRelay ?? false);
  }, [data]);

  return dispatch;
};

function isDefaultProfileResponse(
  response: ProfileResponse | DefaultProfileResponse,
): response is DefaultProfileResponse {
  return (response as DefaultProfileResponse).defaultProfile !== undefined;
}

function isProfileResponse(response: ProfileResponse | DefaultProfileResponse): response is ProfileResponse {
  return (response as ProfileResponse).profile !== undefined;
}

export const useProfilePicture = (response?: ProfileResponse | DefaultProfileResponse): string | undefined => {
  if (response) {
    if (isProfileResponse(response)) {
      return response.profile?.picture?.original?.url;
    } else if (isDefaultProfileResponse(response)) {
      return response.defaultProfile?.picture?.original?.url;
    }
  }
};
