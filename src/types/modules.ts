export interface CollectModule {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export interface ReferenceModule {
  followerOnlyReferenceModule: boolean;
}
