---
title: "Integrate Kliento in your servers"
description: "How to integrate Kliento in your servers using different programming languages"
layout: ../../layouts/KlientoPage.astro
---

# Integrate Kliento in your servers

Kliento is a client authentication protocol that provides secure, offline-verifiable credentials. When clients present token bundles to your server, you simply verify them locally without accessing remote servers or pre-configuring trusted public keys—unlike JWTs which require JWKS endpoints.

This guide explains how to implement server-side verification of Kliento token bundles across different platforms.

## JavaScript

JavaScript servers can use the [`@veraid/kliento`](https://www.npmjs.com/package/@veraid/kliento) package to verify token bundles. For example, an HTTP server can verify a token bundle as follows:

```javascript
import { TokenBundle } from '@veraid/kliento';

// Replace with a unique identifier for your server
const AUDIENCE = 'https://api.example.com';

async function verifyTokenBundle(authHeaderValue: string) {
    // Verify that the token bundle is well-formed and return it if so
    const tokenBundle = TokenBundle.deserialiseFromAuthHeader(authHeaderValue);

    // Verify the token bundle and throw an error if it's invalid
    return await tokenBundle.verify(AUDIENCE);
}
```

Upon successful verification, you receive:

- `subjectId`: The identifier of the client (e.g., `example.com`, `alice@example.com`).
- `claims`: Any additional claims contained in the token.

## Kliento Verifier

If your server uses a language without a native Kliento library or you prefer to offload verification to another process, you can use [Kliento Verifier](https://github.com/CheVeraId/kliento-verifier-js), which is an HTTP server that verifies token bundles. Kliento Verifier doesn't communicate with any remote servers.

As a [Hono](https://hono.dev/) server, you can deploy it to many platforms, including [AWS Lambda](https://hono.dev/docs/getting-started/aws-lambda) and [Cloudflare Workers](https://hono.dev/docs/getting-started/cloudflare-workers). We also provide a [Docker container](https://github.com/CheVeraId/kliento-verifier-docker/pkgs/container/kliento-verifier).

To verify token bundles, you simply send `POST` requests with the required audience in the query string and the token bundle in the request body:

```http
POST /?audience=https%3A%2F%2Fapi.example.com HTTP/1.1
Host: kliento-verifier.local

<token-bundle>
```

Upon successful verification, you receive a JSON response like the following:

```json
{
  "status": "valid",
  "subjectId": "alice@example.com",
  "claims": {
    "permission": "read-only"
  }
}
```

Malformed or invalid token bundles will result in a status of `malformed` or `invalid`, respectively, and a message in the `error` field.
