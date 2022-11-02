import { useEffect } from "react";

import { OnFunctions } from "../../types/on";
import { useCreateCommentTypedData, useCreateCommentViaDispatcher } from "../api/comment";
import { useProfileHasDispatcher } from "../api/profile";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useComment = (
  profileId: string | undefined,
  publicationId: string | undefined,
  commentURL: string | undefined,
  onFunctions?: OnFunctions,
): { comment: () => void; loading: boolean; error: Error | null } => {
  const dispatch = useProfileHasDispatcher(profileId);

  const [createCommentTypedData, { data: commentTypedData, reset: resetTypedData }] = useCreateCommentTypedData(
    profileId,
    publicationId,
    commentURL,
    {
      freeCollectModule: {
        followerOnly: false,
      },
    },
  );

  const [createCommentViaDispatcher, { data: commentViaDispatcher, reset: resetViaDispatcher }] =
    useCreateCommentViaDispatcher(profileId, publicationId, commentURL, {
      freeCollectModule: {
        followerOnly: false,
      },
    });

  const signReturn = useSignTypedData(commentTypedData?.createCommentTypedData?.typedData);

  const {
    start: comment,
    loading,
    error,
  } = useBroadcastAPIHook(
    commentTypedData?.createCommentTypedData?.id,
    commentViaDispatcher?.createCommentViaDispatcher,
    signReturn,
    onFunctions,
  );

  useEffect(() => {
    resetTypedData();
    resetViaDispatcher();
  }, [commentURL]);

  useEffect(() => {
    if (loading && commentURL) {
      if (dispatch) {
        createCommentViaDispatcher().catch(console.error);
      } else {
        createCommentTypedData().catch(console.error);
      }
    }
  }, [commentURL, loading]);

  return { comment, loading, error };
};
