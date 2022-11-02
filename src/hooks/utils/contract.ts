import { useEffect, useState } from "react";

import { ContractReturn } from "../contract";

export const useContractAPIHook = (
  { write, writeError, prepareError, data, status }: ContractReturn,
  onCompleted?: (hash?: string) => void,
): { start: () => void; loading: boolean; error: Error | null } => {
  const [loading, setLoading] = useState(false);
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (loading && !writing && write) {
      setWriting(true);
      write();
    }
  }, [write, loading]);

  useEffect(() => {
    if (status === "error") {
      setError(writeError);
    }
  }, [writeError]);

  useEffect(() => {
    if (status === "error") {
      setError(prepareError);
    }
  }, [prepareError]);

  useEffect(() => {
    if (status === "error") {
      setLoading(false);
      setWriting(false);
    }
  }, [status]);

  useEffect(() => {
    data
      ?.wait(1)
      .then((receipt) => {
        setLoading(false);
        setWriting(false);
        onCompleted?.(receipt.transactionHash);
      })
      .catch((error) => {
        setLoading(false);
        setWriting(false);
        setError(error);
        onCompleted?.();
      });
  }, [data]);

  const start = (): void => {
    setLoading(true);
  };

  return { start, loading, error };
};
