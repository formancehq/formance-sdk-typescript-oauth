# @formance/formance-sdk-oauth

This package provides a simple way to authenticate with the [Formance](https://formance.com) API.

## Installation

```bash
npm install @formance/formance-sdk-oauth
```

## Usage

```typescript
import { SDK as Formance } from "@formance/formance-sdk";
import { createAuthorizationProvider } from "@formance/formance-sdk-oauth"

const FORMANCE_ENDPOINT = "https://xxxxxxxxxxxx-xxxxx.sandbox.formance.cloud"

const formance = new Formance({
    security: createAuthorizationProvider({
        endpointUrl: FORMANCE_ENDPOINT,
        clientId: "<OAuth client id>",
        clientSecret: "<OAuth client secret>",
    }),
    serverURL: FORMANCE_ENDPOINT,
});
```

## API Reference

### `createAuthorizationProvider`

Return a function that can be used to return an authorization header for authenticating with the Formance API. Internally, it uses the [OAuth 2.0 Client Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.4) with no scope to obtain an access token.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `options` | `OAuthOptions` | Options for the OAuth provider. |

`OAuthOptions` reference

| Name | Type | Description |
| --- | --- | --- |
| `endpointUrl` | `string` | The URL of the Formance API for your stack. |
| `clientId` | `string` | The OAuth client id. |
| `clientSecret` | `string` | The OAuth client secret. |
| `tolerance?` | `number` | The number of seconds to allow for clock skew. Defaults to 5 minutes. |

#### Returns

A function that can be used to return an authorization header for authenticating with the Formance API.

