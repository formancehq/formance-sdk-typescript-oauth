import { z } from 'zod';

const WellKnownSchema = z.object({
    token_endpoint: z.string(),
});

const TokenResponseSchema = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    token_type: z.string(),
});

export interface AuthorizationProviderOptions {
    endpointUrl: string,
    clientId: string,
    clientSecret: string,
    tolerance?: number
}

/**
 * Creates an access token provider that uses the OAuth 2.0 client credentials flow.
 * 
 * This function returns a function that can be used to retrieve an access token on-demand. The access token is cached
 * and refreshed automatically when it expires.
 * 
 * @param endpointUrl The URL of the formance stack you are using.
 * @param clientId The client ID of the OAuth 2.0 client.
 * @param clientSecret The client secret of the OAuth 2.0 client.
 * @param tolerance The number of milliseconds to subtract from the token expiry time. This is used to ensure that the
 *                  token is refreshed before it expires. It takes into account a potential clock skew between the client
 *                  and the server, or a delay in the network. Defaults to 5 minutes.
 */
export function createAuthorizationProvider({endpointUrl, clientId, clientSecret, tolerance = 5*60*1000}: AuthorizationProviderOptions) {
    const wellKnownUrl = `${endpointUrl}/api/auth/.well-known/openid-configuration`;

    let accessToken: string | null = null;
    let refreshAt: number | null = null;

    return async function accessTokenProvider(): Promise<{ authorization: string }> {
        // If we have a valid access token, return it
        if (accessToken && refreshAt && refreshAt > Date.now()) {
            return {
                authorization: `Bearer ${accessToken}`,
            };
        }

        // Retrieve the token endpoint from the well-known endpoint
        const response = await fetch(wellKnownUrl);
        const wellKnown = WellKnownSchema.parse(await response.json());

        // Request a new access token
        const tokenResponse = await fetch(wellKnown.token_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        const token = TokenResponseSchema.parse(await tokenResponse.json());
        accessToken = token.access_token;
        refreshAt = Date.now() + token.expires_in * 1000 - tolerance;

        return {
            authorization: `Bearer ${accessToken}`,
        };
    }
}