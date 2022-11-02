import { useEffect } from "react";

import { OnFunctions } from "../../types/on";
import { useCreateMirrorTypedData, useCreateMirrorViaDispatcher } from "../api/mirror";
import { useProfileHasDispatcher } from "../api/profile";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useMirror = (
  profileId: string | undefined,
  publicationId: string | undefined,
  onFunctions?: OnFunctions,
): { mirror: () => void; loading: boolean; error: Error | null } => {
  const dispatch = useProfileHasDispatcher(profileId);
  const [createMirrorTypedData, { data: mirrorTypedData }] = useCreateMirrorTypedData(profileId, publicationId);

  const [createMirrorViaDispatcher, { data: mirrorViaDispatcher }] = useCreateMirrorViaDispatcher(
    profileId,
    publicationId,
  );

  const signReturn = useSignTypedData(mirrorTypedData?.createMirrorTypedData?.typedData);

  const {
    start: mirror,
    loading,
    error,
  } = useBroadcastAPIHook(
    mirrorTypedData?.createMirrorTypedData?.id,
    mirrorViaDispatcher?.createMirrorViaDispatcher,
    signReturn,
    onFunctions,
  );

  useEffect(() => {
    if (loading) {
      if (dispatch) {
        createMirrorViaDispatcher().catch(console.error);
      } else {
        createMirrorTypedData().catch(console.error);
      }
    }
  }, [profileId, publicationId, loading]);

  return { mirror, loading, error };
};
