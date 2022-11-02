export type MetamaskError = Error & {
  code: "ACTION_REJECTED";
  reason: string;
};

export enum RelayErrorReasons {
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
  WRONG_WALLET_SIGNED = "WRONG_WALLET_SIGNED",
  NOT_ALLOWED = "NOT_ALLOWED",
}
