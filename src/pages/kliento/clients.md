---
title: "Integrate Kliento in your clients"
description: "How to integrate Kliento in your clients using different programming languages, and with and without VeraId Authority"
layout: ../../layouts/KlientoPage.astro
permalink: /kliento/clients
---

# Integrate Kliento in your clients

Kliento is a client authentication protocol that eliminates the need for shared secrets (e.g. API keys) whilst removing the requirement for servers to configure or retrieve trusted public keys (unlike JWTs).

When using Kliento, clients obtain or generate _token bundles_ that will then be presented to servers. These bundles include cryptographic signatures that can be verified server-side without accessing remote services or pre-configuring trust relationships.

This guide explains how to implement Kliento in client applications across various programming languages and platforms.

## Using VeraId Authority

[VeraId Authority](https://docs.relaycorp.tech/veraid-authority/) is the recommended approach for obtaining these credentials as it eliminates the need to manage private keys directly, leverages existing identity providers (e.g. GitHub, AWS, GCP, Kubernetes), and provides short-lived credentials via JWT exchange.

Before clients can exchange JWTs for token bundles, you must first create _signature specs_. A signature spec defines what entity can request signatures, what service the signatures are for, and what plaintext should be signed. This allows controlled, secure delegation of signing authority without exposing private keys. Here's an example of creating a signature spec:

```http
POST /orgs/example.com/members/123/signature-specs HTTP/1.1
HOST: veraid-authority.example
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "auth": {
    "type": "oidc-discovery",
    "providerIssuerUrl": "https://accounts.google.com",
    "jwtSubjectClaim": "email",
    "jwtSubjectValue": "app@acme.iam.gserviceaccount.com"
  },
  "serviceOid": "1.3.6.1.4.1.58708.1.1",
  "ttlSeconds": 300,
  "plaintext": "SGVsbG8gd29ybGQ="
}
```

Note that `plaintext` represents the base64-encoded value that will be signed, which in the case of Kliento must be a JSON object with the properties `audience` (a string identifying the target server) and `claims` (an optional object containing a key/value pair for each claim).

Refer to the [Credentials Exchange API documentation](https://docs.relaycorp.tech/veraid-authority/credentials) for more information.

### JavaScript

JS clients can use the [`@veraid/authority-credentials`](https://github.com/CheVeraId/authority-credentials-js) library to automate token bundle provisioning. This library automatically detects and exchanges credentials from various identity providers (called "exchangers"), including GitHub Actions, AWS, GCP, and more.

For example, the following code initialises the exchanger for GitHub Actions and makes authenticated HTTP requests:

```javascript
import { initExchangerFromEnv } from '@veraid/authority-credentials';

// Replace with the actual URL for exchanging credentials
const EXCHANGE_ENDPOINT = new URL('https://veraid-authority.example/creds/123');

// Replace 'GITHUB' with the exchanger you want
const exchanger = initExchangerFromEnv('GITHUB');

// Make requests that use the Kliento token bundle
export async function authFetch(request: Request) {
  const { credential: tokenBundle } = await exchanger.exchange(EXCHANGE_ENDPOINT);
  const headers = { 'Authorization': `Kliento ${tokenBundle.toString('base64')}` }
  return fetch(request, { headers })
}
```

### GitHub Actions

Use [`CheVeraId/authority-credentials-action`](https://github.com/marketplace/actions/exchange-github-jwts-for-veraid-credentials) to obtain token bundles in GitHub workflows:

```yaml
jobs:
  authentication:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - name: Get Kliento token bundle
        id: token-bundle
        uses: CheVeraId/authority-credentials-action@v1
        with:
          exchange-endpoint: https://veraid-authority.example/creds/123
      - name: Use token bundle
        run: curl -H "Authorization: Kliento ${TOKEN_BUNDLE}" https://api.example.com
        environment:
          TOKEN_BUNDLE: ${{ steps.token-bundle.outputs.credential }}
```

Note that you must grant the workflow the `id-token: write` permission to enable OIDC token generation.

### Unsupported languages

VeraId Authority uses OpenID Connect Discovery to authenticate [clients requesting credentials](https://docs.relaycorp.tech/veraid-authority/credentials). This allows integration with Amazon Cognito, Azure, GCP, Kubernetes, and many other identity providers.

For custom implementations, send your workload identity's JWT to obtain a token bundle:

```http
GET /creds/123 HTTP/1.1
HOST: veraid-authority.example
Accept: application/vnd.veraid.signature-bundle+base64
Authorization: Bearer <JWT>
```

The response will contain a base64-encoded token bundle which can be used in the `Authorization` header with the `Kliento` scheme. If you wish to get the token bundle in binary format, omit the `Accept` header.

## Without VeraId Authority

In a future where Kliento becomes widely adopted, many clients may not need to exchange credentials with VeraId Authority. Instead, their cloud provider may issue Kliento token bundles directly. For example, GitHub could issue token bundles for GitHub Actions workloads with identifiers like `your-repo@your-org.github.io`.

Until then, if you don't want to use VeraId Authority, you will have to manage the issuance of VeraId _signature bundles_ that represent Kliento token bundles. This is an advanced topic and it mostly involves using VeraId directly, preferably via a high-level SDK like [`@relaycorp/veraid`](https://github.com/relaycorp/veraid-js). You'll basically have to generate a key pair for your _organisation_ and use the SDK to:

- Generate the value of your VeraId TXT record based on the public key of your organisation.
- Generate Kliento token bundles using your organisation's private key. A VeraId signature bundle contains:

  - A DNSSEC chain, which you'll have to retrieve.
  - The organisation's certificate (which you'll have to issue and optionally cache).
  - The signature itself, which in the case of Kliento must encapsulate a JSON object with the properties `audience` and `claims`.

  If your client is written in JavaScript, you should use the high-level [`@veraid/kliento`](https://github.com/CheVeraId/kliento-js) library.

Since your client must now securely manage a private key, we recommend using a Key Management Service (KMS) like [AWS KMS](https://aws.amazon.com/kms/) or [Azure Key Vault](https://azure.microsoft.com/en-us/products/key-vault/).

If you need help with this, [reach out to us on Reddit](https://www.reddit.com/r/VeraId/).
