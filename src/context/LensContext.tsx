import { createContext, useContext, useMemo } from "react";

interface LensStorage {
  lensHubAddress?: string;
  network?: "mainnet" | "testnet";
}

const LensContext = createContext<LensStorage>({
  lensHubAddress: undefined,
  network: "mainnet",
});

export interface LensProviderProps {
  lensHubAddress?: string;
  network?: "mainnet" | "testnet";
}

function LensProvider({ children, lensHubAddress, network }: React.PropsWithChildren<LensProviderProps>): JSX.Element {
  const contextValue = useMemo(() => {
    return { lensHubAddress, network };
  }, [lensHubAddress, network]);

  return <LensContext.Provider value={contextValue}>{children}</LensContext.Provider>;
}

const useLensHubAddress = (): string => {
  const context = useContext(LensContext);

  if (context?.lensHubAddress) {
    return context.lensHubAddress;
  }

  if (context?.network === "testnet") {
    return "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
  }

  return "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
};

export { LensContext, LensProvider, useLensHubAddress };
