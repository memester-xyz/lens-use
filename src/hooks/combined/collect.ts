import { useEffect } from "react";

import { OnFunctions } from "../../types/on";
import { useCreateCollectTypedData } from "../api/collect";
import { useBroadcastAPIHook } from "../utils/broadcast";
import { useSignTypedData } from "../utils/sign";

export const useCollect = (
  publicationId: string | undefined,
  onFunctions?: OnFunctions,
): { collect: () => void; loading: boolean; error: Error | null } => {
  const [createCollectTypedData, { data: collectTypedData }] = useCreateCollectTypedData(publicationId);

  const signReturn = useSignTypedData(collectTypedData?.createCollectTypedData?.typedData);

  const {
    start: collect,
    loading,
    error,
  } = useBroadcastAPIHook(collectTypedData?.createCollectTypedData?.id, undefined, signReturn, onFunctions);

  useEffect(() => {
    loading && createCollectTypedData().catch(console.error);
  }, [publicationId, loading]);

  return { collect, loading, error };
};
