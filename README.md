<h1 align="center">lens-use 🌱</h1>

<h2 align="center">React Hooks for Lens Protocol</h2>

<p align="center">
  <a href="https://reactjs.org/">React</a> 🤝 <a href="https://www.lens.xyz/">Lens Protocol</a>
</p>

**Standing on the shoulders of these chads (aka, dependencies):**

- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [wagmi](https://wagmi.sh/)
- [ethers](https://docs.ethers.io/v5/)

# Example

```typescript
const { data: profileResponse } = useProfile("stani.lens");

const { data: publicationsResponse } = usePublications(profileResponse?.profile?.id);

const { collect } = useCollect(publicationsResponse?.publications?.items[0].id);

const onClick = () => {
  collect();
};
```

# Installation

```bash
# npm
npm install --save @memester-xyz/lens-use

# yarn
yarn add @memester-xyz/lens-use

# pnpm
pnpm add @memester-xyz/lens-use
```

# Usage

## Basic

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

3. The return value of any API hook (e.g. `useProfile`, `useChallenge`) is a typed Apollo GraphQL return value. i.e.

   - [`QueryResult`](https://www.apollographql.com/docs/react/api/react/hooks/#result) for queries
   - [`MutationTuple`](https://www.apollographql.com/docs/react/api/react/hooks/#mutationtupletdata-tvariables-result-tuple) for mutations.

4. The return value of any contract hook (e.g. `useContractCollect`) is a modification of a normal Wagmi [`useContractWrite`](https://wagmi.sh/docs/hooks/useContractWrite#return-value).

5. The return value of any action hook (e.g. `useCollect`) is an object containing:
   - a write method with the same name as the hook action (e.g. `collect()`)
   - a loading boolean when the request is in flight `loading`
   - an Error object or undefined `error`

Full API specification is below in the [hooks](#hooks) section.

## Advanced

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

# Hooks

- [Login](#login)
  - [useChallenge](#useChallenge)
  - [useAuthenticate](#useAuthenticate)
  - [useRefresh](#useRefresh)
- [Query](#query)
  - [useProfile](#useProfile)
- [Write](#write)
  - [useCollect](#useCollect)
- [Contract](#contract)
  - [useContractCollect](#useContractCollect)

## Login

Hooks to help with authenticating against the Lens API.

### useChallenge

_[Lens Reference](https://docs.lens.xyz/docs/login#challenge)_

Get a challenge to be signed by the user.

```typescript
const { data: challengeData } = useChallenge(address);

// challengeData.challenge.text must be signed by the user's wallet
```

### useAuthenticate

_[Lens Reference](https://docs.lens.xyz/docs/login#authenticate)_

Authenticate the signed challenge

```typescript
const [authenticate, { data: authenticateData }] = useAuthenticate(address, signedChallenge);

authenticate();

// authenticateData.authenticate.accessToken has acccess token
// authenticateData.authenticate.refreshToken has refresh token
```

### useRefresh

_[Lens Reference](https://docs.lens.xyz/docs/refresh-jwt)_

Refresh the JWT

```typescript
const [refresh, { data: refreshData }] = useRefresh(refreshToken);

refresh();

// refreshData.refresh.accessToken has acccess token
// refreshData.refresh.refreshToken has refresh token
```

## Query

Hooks to query the Lens API. Note, some of these require authentication, check the Lens Reference.

### useProfile

_[Lens Reference](https://docs.lens.xyz/docs/get-profile#get-by-handle)_

Get a profile by handle

```typescript
const { data } = useProfile(handle);
```

## Write

Hooks to write to Lens using the [dispatcher](https://docs.lens.xyz/docs/dispatcher) if enabled or the [broadcaster](https://docs.lens.xyz/docs/broadcast-transaction) if not. Note, your Apollo GraphQL client must be authenticated! [Example here](https://github.com/lens-protocol/api-examples/blob/master/src/apollo-client.ts#L40).

### useCollect

Collect a publication using the API

```typescript
const { collect, loading, error } = useCollect(publicationId);

collect();
```

## Contract

### useContractCollect

_[Lens Reference](https://docs.lens.xyz/docs/functions#collect)_

Collect a publication using the Lens Hub Contract

```typescript
const { write, data, prepareError, writeError, status } = useContractCollect(
  profileId,
  publicationId,
  collectModuleBytes,
);

write();
```

---

_Made with 🫡 by [memester.xyz](https://memester.xyz)_
