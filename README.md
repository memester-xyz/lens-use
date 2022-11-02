<h1 align="center">lens-use 🌱</h1>

<h2 align="center">React Hooks for Lens Protocol</h2>

<p align="center">
  <a href="https://reactjs.org/">React</a> 🤝 <a href="https://www.lens.xyz/">Lens Protocol</a>
</p>

**Standing on the shoulders of these chads (aka, dependencies):**

- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [wagmi](https://wagmi.sh/)
- [ethers](https://docs.ethers.io/v5/)

## Example

```typescript
const { data: profileResponse } = useProfile("stani.lens");

const { data: publicationsResponse } = usePublications(profileResponse?.profile?.id);

const { collect } = useCollect(publicationsResponse?.publications?.items[0].id);

const onClick = () => {
  collect();
};
```

## Installation

```bash
# npm
npm install --save @memester-xyz/lens-use

# yarn
yarn add @memester-xyz/lens-use

# pnpm
pnpm add @memester-xyz/lens-use
```

## Usage

### Basic

1. Your app must first be wrapped in Wagmi and Apollo contexts. e.g.:

```typescript
function App() {
  return (
    <WagmiConfig client={client}>
      <ApolloProvider client={apolloClient}>
        <DApp />
      </ApolloProvider>
    </WagmiConfig>
  );
}
```

2. You can then use the Lens hooks in any components inside of your DApp component:

```typescript
import { useProfile } from "@memester-xyz/lens-use";

// ...

const { data } = useProfile("stani.lens");
```

### Advanced

By default we use the currently known Polygon Mainnet Lens Hub Proxy address. There are two ways to override this but both require adding our `LensProvider` context to your app.

1. You can use the currently known Mumbai (testnet) address:

```typescript
function App() {
  return (
    <WagmiConfig client={client}>
      <ApolloProvider client={apolloClient}>
        <LensProvider network="testnet">
          <DApp />
        </LensProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
}
```

2. You can pass a custom Lens Hub contract address:

```typescript
function App() {
  return (
    <WagmiConfig client={client}>
      <ApolloProvider client={apolloClient}>
        <LensProvider lensHubAddress="0x...">
          <DApp />
        </LensProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
}
```

---

_Made with 🫡 by [memester.xyz](https://memester.xyz)_
