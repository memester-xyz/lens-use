<h1 align="center">lens-use 🌱</h1>

<h2 align="center">Deprecation Notice</h2>

<p align="center">
  Lens Protocol is working on their own <a href="https://github.com/lens-protocol/lens-sdk">React SDK</a> which should be used instead of this library.
</p>

<h2 align="center">React Hooks for Lens Protocol</h2>


<p align="center">
  <a href="https://reactjs.org/">React</a> 🤝 <a href="https://www.lens.xyz/">Lens Protocol</a>
</p>

**Standing on the shoulders of these chads (aka, dependencies):**

- [Apollo GraphQL](https://www.apollographql.com/docs/)
- [wagmi](https://wagmi.sh/)
- [ethers](https://docs.ethers.io/v5/)

**Jump straight to the [Hooks Reference](#hooks-reference)**

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

1. Your app must first be wrapped in a Wagmi context and a Apollo context (connected to the Lens API). e.g.:

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

4. The return value of any contract hook (e.g. `useContractProfile`, `useContractCollect`) is a modification of a normal Wagmi [`useContractRead`](https://wagmi.sh/docs/hooks/useContractRead#return-value) or [`useContractWrite`](https://wagmi.sh/docs/hooks/useContractWrite#return-value).

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

# Hooks Reference

- [Login](#login)
  - [useChallenge](#useChallenge)
  - [useAuthenticate](#useAuthenticate)
  - [useRefresh](#useRefresh)
- [Query](#query)
  - [useProfile](#useProfile)
  - [useProfiles](#useProfiles)
  - [useDefaultProfile](#useDefaultProfile)
  - [useProfilePicture](#useProfilePicture)
  - [useProfileHasDispatcher](#useProfileHasDispatcher)
  - [usePublication](#usePublication)
  - [usePublications](#usePublications)
  - [usePublicationComments](#usePublicationComments)
  - [useSearch](#useSearch)
- [Write](#write)
  - [useCollect](#useCollect)
  - [useComment](#useComment)
  - [useFollow](#useFollow)
  - [useUnfollow](#useUnfollow)
  - [useMirror](#useMirror)
  - [usePost](#usePost)
- [Contract](#contract)
  - [useContractCollect](#useContractCollect)
  - [useContractComment](#useContractComment)
  - [useContractFollow](#useContractFollow)
  - [useContractUnfollow](#useContractUnfollow)
  - [useContractMirror](#useContractMirror)
  - [useContractPost](#useContractPost)
  - [useContractProfile](#useContractProfile)

## Login

Hooks to help with authenticating against the Lens API.

### useChallenge

_[Lens Reference](https://docs.lens.xyz/docs/login#challenge)_

Get a challenge to be signed by the user

```typescript
const { data: challengeData } = useChallenge(address);

// challengeData.challenge.text must be signed by the user's wallet
```

### useAuthenticate

_[Lens Reference](https://docs.lens.xyz/docs/login#authenticate)_

Authenticate the signed challenge

```typescript
const [authenticate, { data: authenticateData }] = useAuthenticate(address, signedChallenge);

// Call this method to start the authentication request
authenticate();

// After the request is complete
// authenticateData.authenticate.accessToken has access token
// authenticateData.authenticate.refreshToken has refresh token
```

### useRefresh

_[Lens Reference](https://docs.lens.xyz/docs/refresh-jwt)_

Refresh the JWT

```typescript
const [refresh, { data: refreshData }] = useRefresh(refreshToken);

// Call this method to start the refresh request
refresh();

// After the request is complete
// refreshData.refresh.accessToken has access token
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

### useProfiles

_[Lens Reference](https://docs.lens.xyz/docs/get-profiles#get-by-owned-by)_

Get all profiles owned by an address

```typescript
const { data } = useProfiles(address);
```

### useDefaultProfile

_[Lens Reference](https://docs.lens.xyz/docs/get-default-profile)_

Get default profile by address

```typescript
const defaultProfile = useDefaultProfile(address);
```

### useProfilePicture

The response body from `useProfile` and `useDefaultProfile` is slightly different, so this method helps to pull out the profile picture from one of those.

```typescript
const defaultProfile = useDefaultProfile(address);
const pfpURL = useProfilePicture(defaultProfile);
```

### useProfileHasDispatcher

A simple utility which returns `true` if the profile has the dispatcher enabled.

```typescript
const dispatch = useProfileHasDispatcher(profileId);
```

### usePublication

_[Lens Reference](https://docs.lens.xyz/docs/get-publication)_

Retrieve details for a specific publication

```typescript
const { data } = usePublication(publicationId);

// Pass in profileId to get the mirrored status in your publication results
const { data } = usePublication(publicationId, profileId);
```

### usePublications

_[Lens Reference](https://docs.lens.xyz/docs/get-publications)_

Retrieve publications based on various parameters

```typescript
// Get posts from a specific profile
const { data } = usePublications(profileId);

// Get posts and comments from a specific profile
const { data } = usePublications(profileId, [PublicationType.POST, PublicationType.COMMENT]);

// Get posts from a specific profile and source
const { data } = usePublications(profileId, [PublicationType.POST], ["memester"]);
```

### usePublicationComments

_[Lens Reference](https://docs.lens.xyz/docs/get-publications)_

Retrieve publications based on various parameters

```typescript
// Get comments for a specific publication
const { data } = usePublicationComments(publicationId);
```

### useSearch

_[Lens Reference](https://docs.lens.xyz/docs/search-profiles-and-publications#search-across-profiles)_

Search profiles

```typescript
const { data } = useSearch("stani");
```

## Write

Hooks to write to Lens using the [dispatcher](https://docs.lens.xyz/docs/dispatcher) if enabled or the [broadcaster](https://docs.lens.xyz/docs/broadcast-transaction) if not. Note, your Apollo GraphQL client must be [authenticated](https://docs.lens.xyz/docs/authentication-quickstart)!

All write hooks take an optional final parameter which allows you to specify callback functions. An example is given for `useCollect` but the same applies to all hooks in this section.

### useCollect

Collect a publication using the API

```typescript
const { collect, loading, error } = useCollect(publicationId);

// Call this method to start the collect request
collect();

// You can also pass in callback functions
const { collect, loading, error } = useCollect(publicationId, {
  onBroadcasted(receipt) {
    // ...
  },
  onCompleted(receipt) {
    // receipt will be undefined if the request errored for some reason
  },
});
```

### useComment

Comment on a publication. Requires a URL with the comment metadata already uploaded

```typescript
const { collect, loading, error } = useComment(profileId, publicationId, commentURL);

// Call this method to start the comment request
comment();
```

### useFollow

Follow a profile

```typescript
const { follow, loading, error } = useFollow(profileIdToFollow);

// Call this method to start the follow request
follow();
```

### useUnfollow

Unfollow a profile

```typescript
const { unfollow, loading, error } = useUnfollow(profileIdToUnfollow);

// Call this method to start the unfollow request
unfollow();
```

### useMirror

Mirror a publication

```typescript
const { mirror, loading, error } = useMirror(profileId, publicationId);

// Call this method to start the mirror request
mirror();
```

### usePost

Post. Requires a URL with the post metadata already uploaded

```typescript
const { post, loading, error } = usePost(profileId, postURL);

// Call this method to start the post request
post();
```

## Contract

### useContractCollect

_[Lens Reference](https://docs.lens.xyz/docs/functions#collect)_

Collect a publication using the Lens Hub Contract

```typescript
const { write, data, prepareError, writeError, status } = useContractCollect(profileId, publicationId);

// Call this method to invoke the users connected wallet
write();
```

### useContractComment

_[Lens Reference](https://docs.lens.xyz/docs/functions#comment)_

Comment on a publication using the Lens Hub Contract

```typescript
const { write, data, prepareError, writeError, status } = useContractCollect(
  profileId,
  contentURI,
  profileIdPointed,
  pubIdPointed,
  collectModule,
  collectModuleInitData,
  referenceModule,
  referenceModuleInitData,
  referenceModuleData,
);

// Call this method to invoke the users connected wallet
write();
```

### useContractFollow

_[Lens Reference](https://docs.lens.xyz/docs/functions#follow)_

Follow profiles using the Lens Hub Contract

```typescript
const { write, data, prepareError, writeError, status } = useContractFollow(profileIds);

// Call this method to invoke the users connected wallet
write();
```

### useContractUnfollow

_[Lens Reference](https://docs.lens.xyz/docs/follow)_

Unfollow a profile by burning the specific Follow NFT. You must pass in the relevant follow NFT address and tokenId

```typescript
const { write, data, prepareError, writeError, status } = useContractUnfollow(followNFTAddress, tokenId);

// Call this method to invoke the users connected wallet
write();
```

### useContractMirror

_[Lens Reference](https://docs.lens.xyz/docs/functions#mirror)_

Mirror a publication using the Lens Hub Contract

```typescript
const { write, data, prepareError, writeError, status } = useContractMirror(
  profileId,
  profileIdPointed,
  pubIdPointed,
  referenceModuleData,
  referenceModule,
  referenceModuleInitData,
);

// Call this method to invoke the users connected wallet
write();
```

### useContractPost

_[Lens Reference](https://docs.lens.xyz/docs/functions#post)_

Post using the Lens Hub Contract

```typescript
const { write, data, prepareError, writeError, status } = useContractPost(
  profileId?,
  contentURI,
  collectModule,
  collectModuleInitData,
  referenceModule,
  referenceModuleInitData,
);

// Call this method to invoke the users connected wallet
write();
```

### useContractProfile

_[Lens Reference](https://docs.lens.xyz/docs/view-functions#getprofile)_

Read profile from the Lens Hub Contract

```typescript
const { data } = useContractProfile(profileId);
```

---

_Made with 🫡 by [memester.xyz](https://memester.xyz)_
