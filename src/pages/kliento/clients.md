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
  "plaintext": "eyJhdWRpZW5jZSI6Imh0dHA6Ly9sb2NhbGhvc3QvIn0K"
}
```

Note that `plaintext` represents the base64-encoded value that will be signed, which in the case of Kliento must be a JSON object with the properties `audience` (a string identifying the target server) and `claims` (an optional object containing a key/value pair for each claim). In the example above, `plaintext` represents the base64 encoding of `{"audience":"https://localhost/"}`.

The response to the request above will be a JSON object containing the URL that your client will use to exchange token bundles (`exchangeUrl`).

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

Although this example obtains a token bundle for each request, you reuse it for as long as it is valid (up to 5 minutes in your signature spec).

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

In a future where Kliento becomes widely adopted, many clients may not need VeraId Authority if their cloud provider issues Kliento token bundles directly. For example, GitHub could issue token bundles for GitHub Actions workloads with identifiers like `your-repo@your-org.github.io`.

Until then, if you don't want to use VeraId Authority, you will have to manage the issuance of VeraId _signature bundles_ that represent Kliento token bundles using a VeraId library like [`@relaycorp/veraid`](https://github.com/relaycorp/veraid-js). You'll basically have to generate a key pair for your _organisation_ and use the SDK to generate the VeraId TXT record (based on the public key of your organisation) and issue Kliento token bundles using your organisation's private key.

Since your client must now securely manage a private key, we recommend using a Key Management Service (KMS) like [AWS KMS](https://aws.amazon.com/kms/). If you're using JavaScript, consider using the [`@relaycorp/webcrypto-kms`](https://github.com/relaycorp/webcrypto-kms-js) library.

### Generate VeraId TXT record

The value of the VeraId TXT record is mostly derived from the public key of your organisation, but it also contains the maximum validity period of the DNSSEC chain.

For example, you can use the VeraId JavaScript library to generate such values as follows:

```javascript
import { generateTxtRdata } from "@relaycorp/veraid";

const TTL_OVERRIDE_SECONDS = 3600; // 1 hour

const publicKey = await getYourPublicKey();
const txtRecord = await generateTxtRdata(publicKey, TTL_OVERRIDE_SECONDS);
```

You'd then paste the result into the `TXT` record of your `_veraid.<your-domain>` subdomain. Evidently, you only need to do this once.

### Issue Kliento token bundles

Once your domain is properly configured, your client can issue Kliento token bundles using the organisation's private key. This basically involves generating VeraId signature bundles that encapsulate Kliento tokens (the end result being the token bundles).

For example, the VeraId JavaScript library could be used with the [`@veraid/kliento`](https://github.com/CheVeraId/kliento-js) library to issue Kliento token bundles as follows:

```javascript
import {
  OrganisationSigner,
  selfIssueOrganisationCertificate,
  VeraidDnssecChain,
} from "@relaycorp/veraid";
import { Token, TokenBundle } from "@veraid/kliento";

// VeraId configuration
const ORG_NAME = "your-company.com";
const MEMBER_NAME = "alice";
const TTL_SECONDS = 300; // 5 minutes

// Kliento configuration
const AUDIENCE = "https://localhost/";
const TOKEN = new Token(AUDIENCE, { claim1: "value1" });

async function issueTokenBundle() {
  const domainName = `${ORG_NAME}.`;

  // Retrieve DNSSEC chain or retrieve it from cache
  const dnssecChain = await VeraidDnssecChain.retrieve(domainName);

  // Issue organisation certificate or retrieve it from cache
  const keyPair = await getYourKeyPair();
  const expiry = new Date(Date.now() + TTL_SECONDS * 1000);
  const certificate = await selfIssueOrganisationCertificate(domainName, keyPair, expiry);

  // Finally, issue token bundle and return it as an ArrayBuffer
  const signer = new OrganisationSigner(dnssecChain, certificate, MEMBER_NAME);
  const tokenBundle = await TokenBundle.sign(TOKEN, keyPair.privateKey, signer, expiry);
  return tokenBundle.serialise();
}
```

If you went down this route, we'd love to hear about it on [r/VeraId](https://reddit.com/r/VeraId) so we can see if we can make things easier in the future.
