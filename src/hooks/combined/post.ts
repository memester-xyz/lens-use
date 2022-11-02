import { useEffect, useState } from "react";

import { OnFunctions } from "../../types/on";
import { publicationIdFromReceipt } from "../../utils/tx";
import { useCreatePostTypedData, useCreatePostViaDispatcher } from "../api/post";
import { useProfileHasDispatcher } from "../api/profile";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const usePost = (
  profileId: string | undefined,
  postURL: string | undefined,
  { onBroadcasted, onCompleted }: OnFunctions,
): {
  post: () => void;
  loading: boolean;
  error: Error | null;
  publicationId: string | undefined;
} => {
  const dispatch = useProfileHasDispatcher(profileId);

  const [publicationId, setPublicationId] = useState<string | undefined>(undefined);

  const [createPostTypedData, { data: postTypedData, reset: resetTypedData }] = useCreatePostTypedData(
    profileId,
    postURL,
    {
      freeCollectModule: {
        followerOnly: false,
      },
    },
  );

  const [createPostViaDispatcher, { data: postViaDispatcher, reset: resetViaDispatcher }] = useCreatePostViaDispatcher(
    profileId,
    postURL,
    {
      freeCollectModule: {
        followerOnly: false,
      },
    },
  );

  const signReturn = useSignTypedData(postTypedData?.createPostTypedData?.typedData);

  const {
    start: post,
    loading,
    error,
  } = useBroadcastAPIHook(
    postTypedData?.createPostTypedData?.id,
    postViaDispatcher?.createPostViaDispatcher,
    signReturn,
    {
      onCompleted(receipt) {
        const parsedPublicationId = publicationIdFromReceipt(receipt);
        setPublicationId(parsedPublicationId);
        onCompleted?.(receipt);
      },
      onBroadcasted,
    },
  );

  useEffect(() => {
    resetTypedData();
    resetViaDispatcher();
  }, [postURL]);

  useEffect(() => {
    if (loading && postURL) {
      if (dispatch) {
        createPostViaDispatcher().catch(console.error);
      } else {
        createPostTypedData().catch(console.error);
      }
    }
  }, [postURL, loading]);

  return { post, loading, error, publicationId };
};
