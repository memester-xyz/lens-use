import { useEffect, useState } from "react";

import { OnFunctions } from "../../types/on";
import { FailedBroadcast, SuccessfulBroadcast, useBroadcast, wasSuccessfulBroadcast } from "../api/broadcast";
import { useIndexed } from "../api/indexer";
import { SignReturn } from "../contract";

export const useBroadcastAPIHook = (
  id: string | undefined,
  dispatchBroadcast: SuccessfulBroadcast | FailedBroadcast | undefined,
  { signTypedData, error: signError, data, status }: SignReturn,
  { onCompleted, onBroadcasted }: OnFunctions,
): { start: () => void; loading: boolean; error: Error | null } => {
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [txId, setTxId] = useState<string | undefined>();

  const [broadcast, { data: broadcastData }] = useBroadcast(id, data);

  const { data: indexedData } = useIndexed(txId, broadcasting);

  useEffect(() => {
    if (loading && !writing && id && signTypedData) {
      setWriting(true);
      signTypedData();
    }
  }, [signTypedData, loading, id]);

  useEffect(() => {
    if (status === "error") {
      setError(signError);
    }
  }, [signError]);

  useEffect(() => {
    if (status === "error") {
      setLoading(false);
      setWriting(false);
      setBroadcasting(false);
    }
  }, [status]);

  useEffect(() => {
    if (!broadcasting) {
      if (dispatchBroadcast && wasSuccessfulBroadcast(dispatchBroadcast)) {
        setBroadcasting(true);
        setTxId(dispatchBroadcast.txId);
      } else if (id && data) {
        setBroadcasting(true);
        broadcast().catch(console.error);
      }
    }
  }, [id, data, dispatchBroadcast]);

  useEffect(() => {
    if (broadcastData?.broadcast && broadcasting) {
      if (wasSuccessfulBroadcast(broadcastData.broadcast)) {
        setTxId(broadcastData.broadcast.txId);
      } else {
        setBroadcasting(false);
        setLoading(false);
        setWriting(false);
        setError(new Error(broadcastData.broadcast.reason));
        onCompleted?.();
      }
    }
  }, [broadcastData]);

  useEffect(() => {
    if (txId && broadcasting) {
      if (indexedData?.hasTxHashBeenIndexed?.txReceipt) {
        onBroadcasted?.(indexedData?.hasTxHashBeenIndexed?.txReceipt);
      }

      if (indexedData?.hasTxHashBeenIndexed?.indexed) {
        setBroadcasting(false);
        setLoading(false);
        setWriting(false);
        if (indexedData?.hasTxHashBeenIndexed?.metadataStatus?.status === "METADATA_VALIDATION_FAILED") {
          setError(new Error(indexedData.hasTxHashBeenIndexed.metadataStatus.reason));
        } else {
          onCompleted?.(indexedData.hasTxHashBeenIndexed.txReceipt);
        }
      }
    }
  }, [indexedData]);

  const start = (): void => {
    setLoading(true);
  };

  return { start, loading, error };
};
