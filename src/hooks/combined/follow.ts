import { useEffect } from "react";

import { OnFunctions } from "../../types/on";
import { useCreateFollowTypedData, useCreateUnfollowTypedData } from "../api/follow";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useFollow = (
  profileId: string,
  onFunctions: OnFunctions,
): { follow: () => void; loading: boolean; error: Error | null } => {
  const [createFollowTypedData, { data: followTypedData }] = useCreateFollowTypedData(profileId);

  const signReturn = useSignTypedData(followTypedData?.createFollowTypedData?.typedData);

  const {
    start: follow,
    loading,
    error,
  } = useBroadcastAPIHook(followTypedData?.createFollowTypedData?.id, undefined, signReturn, onFunctions);

  useEffect(() => {
    loading && createFollowTypedData().catch(console.error);
  }, [profileId, loading]);

  return { follow, loading, error };
};

export const useUnfollow = (
  profileId: string,
  onFunctions: OnFunctions,
): { unfollow: () => void; loading: boolean; error: Error | null } => {
  const [createUnfollowTypedData, { data: unfollowTypedData }] = useCreateUnfollowTypedData(profileId);

  const signReturn = useSignTypedData(unfollowTypedData?.createUnfollowTypedData?.typedData);

  const {
    start: unfollow,
    loading,
    error,
  } = useBroadcastAPIHook(unfollowTypedData?.createUnfollowTypedData?.id, undefined, signReturn, onFunctions);

  useEffect(() => {
    loading && createUnfollowTypedData().catch(console.error);
  }, [profileId, loading]);

  return { unfollow, loading, error };
};
