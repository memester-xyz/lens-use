import { MetadataResponse } from "./metadata";

export interface Profile {
  profileId: string;
  name?: string;
  handle: string;
  picture?: {
    original?: {
      url?: string;
    };
  };
  ownedBy: string;
  isFollowedByMe?: boolean;
  stats: {
    totalFollowers: number;
    totalFollowing: number;
    totalPosts: number;
    totalComments: number;
    totalMirrors: number;
    totalPublications: number;
    totalCollects: number;
  };
}

export interface DefaultProfile extends Omit<Profile, "profileId"> {
  id: string;
}

export enum PublicationSortCriteria {
  TOP_COMMENTED = "TOP_COMMENTED",
  TOP_COLLECTED = "TOP_COLLECTED",
  TOP_MIRRORED = "TOP_MIRRORED",
  CURATED_PROFILES = "CURATED_PROFILES",
  LATEST = "LATEST",
}

export enum PublicationType {
  POST = "POST",
  COMMENT = "COMMENT",
  MIRROR = "MIRROR",
}

export enum TimelineTypes {
  POST = "POST",
  COMMENT = "COMMENT",
  MIRROR = "MIRROR",
  COLLECT_POST = "COLLECT_POST",
  COLLECT_COMMENT = "COLLECT_COMMENT",
}

// Relevant data from a post
export interface Post {
  id: string;
  profile: Profile;
  stats: {
    totalAmountOfMirrors: number;
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
  };
  metadata: MetadataResponse;
  createdAt: string;
  collectedBy: {
    address: string;
  };
  hasCollectedByMe?: boolean;
  mirrors?: string[];
  mirrorOf?: Post;
  appId?: string;
}

export interface PostWithMedia extends Post {
  metadata: MetadataResponse;
}

export function postHasMedia(post: Post): post is PostWithMedia {
  return (post as PostWithMedia).metadata.media !== undefined && (post as PostWithMedia).metadata.media.length > 0;
}

export interface PageInfo {
  prev: string;
  next: string;
  totalCount: number;
}

export interface TypedData {
  types: any;
  domain: any;
  value: any;
}

export interface TypedDataResponse {
  id: string;
  expiresAt: string;
  typedData: TypedData;
}
