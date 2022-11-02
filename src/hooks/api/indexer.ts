import { gql, QueryResult, useQuery } from "@apollo/client";
import { TransactionReceipt } from "@ethersproject/abstract-provider";

interface IndexerRequest {
  request: {
    txId?: string;
  };
}

// more: https://docs.lens.xyz/docs/has-transaction-been-indexed
interface IndexerResponse {
  hasTxHashBeenIndexed?: {
    indexed: boolean;
    txReceipt: TransactionReceipt;
    metadataStatus: {
      status: "NOT_FOUND" | "PENDING" | "METADATA_VALIDATION_FAILED" | "SUCCESS";
      reason: string;
    };
  };
}

const INDEXED = gql`
  query ($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        indexed
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
        metadataStatus {
          status
          reason
        }
      }
      ... on TransactionError {
        reason
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
      }
      __typename
    }
  }
`;

export const useIndexed = (txId?: string, broadcasting?: boolean): QueryResult<IndexerResponse, IndexerRequest> => {
  return useQuery<IndexerResponse, IndexerRequest>(INDEXED, {
    variables: {
      request: {
        txId,
      },
    },
    pollInterval: 500,
    fetchPolicy: "network-only",
    skip: !txId || !broadcasting,
  });
};
