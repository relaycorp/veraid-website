---
title: "Overview"
description: "Overview"
layout: ../../layouts/KlientoPage.astro
---

# Technical Overview of Kliento

Kliento is a client authentication protocol designed to simplify how workloads authenticate to servers. It provides secure, offline-verifiable credentials, removing the need for shared secrets like API keys. Unlike JWTs, Kliento also eliminates the requirement for servers to manage trusted public keys via mechanisms like JWKS endpoints during verification.

Through its use of user-friendly identifiers based on domain names, Kliento extends the concept of _workload identities_—akin to AWS Roles or GCP Service Accounts—to the broader internet in a vendor-neutral manner.

## VeraId Fundamentals

Since Kliento is a small extension to [VeraId](/), a brief overview of VeraId is helpful.

VeraId is a decentralised protocol that attributes digital content to domain names using a chain of trust that can be verified entirely offline. It establishes identity through domain names (e.g., `example.com` for an organisation), verified via DNSSEC. Organisations then issue X.509 certificates to themselves and, optionally, to their members (like `alice@example.com` or bots identified simply by the organisation's domain). Organisations and members use their private keys to sign content using the Cryptographic Message Syntax (CMS).

Critically, VeraId packages the signature, the certificate chain, and necessary DNSSEC proofs into a single _VeraId Signature Bundle_, enabling complete offline verification of the signature and the signer's identity.

For a deeper dive, please refer to the [VeraId Technical Overview](/overview).

## How Kliento Extends VeraId

Kliento leverages the VeraId framework by defining a specific structure and meaning for the content signed within a VeraId Signature Bundle, effectively transforming it into a client authentication token.

Specifically, Kliento mandates that the **plaintext data signed by the VeraId member must be a JSON object**. This JSON object, known as the Kliento _Token_, must adhere to the following schema:

- **`audience` (string, required):** A unique identifier for the intended recipient (server or service) of the token. This prevents replay attacks across different services.
- **`claims` (object, optional):** A key-value map where both keys and values are strings. This provides a mechanism similar to JWT claims, allowing the client's identity provider to embed additional authorisation information or metadata into the token. The specific claims and their meanings are defined by the server application.

When a VeraId Signature Bundle encapsulates a signature over a JSON object conforming to this Kliento Token schema, the entire bundle is referred to as a **Kliento Token Bundle**.

## Kliento Token Bundle Architecture

A Kliento Token Bundle, therefore, is a self-contained binary blob comprising several key components:

1. **The Kliento Token:** The JSON object containing the `audience` and optional `claims`.
2. **The CMS Signature:** The digital signature over the Kliento Token, created using the member's private key.
3. **The X.509 Certificate Chain:** Linking the member's certificate back to the organisation's self-signed certificate.
4. **The DNSSEC Proofs:** Demonstrating the organisation's control over the domain name associated with its certificate, anchored in the DNS root.

This self-contained structure is crucial for enabling servers to verify the bundle entirely offline.

## Verification Process

Servers typically receive the Kliento Token Bundle encoded (e.g., Base64) within an HTTP `Authorization` header using the `Kliento` scheme. The verification process involves deserialising the bundle and then performing the standard VeraId verification. This validates the integrity of the DNSSEC proofs, the certificate chain, and the CMS signature, ultimately confirming the authenticity of the signed Kliento Token and attributing it to a specific VeraId `subjectId`.

Following successful VeraId verification, the server performs Kliento-specific checks: it confirms that the `audience` claim within the token matches its own identifier and ensures the token bundle is within its validity period, as determined by the expiry times in the VeraId certificate chain.

Libraries like [`@veraid/kliento`](https://www.npmjs.com/package/@veraid/kliento) or the standalone [Kliento Verifier](/kliento/servers#kliento-verifier) service handle this entire process. Successful verification yields the authenticated client's `subjectId` and the `claims` from the token; any failure during verification leads to rejection.

## Security Properties

Kliento's security model, built upon VeraId, offers several advantages:

- **No Shared Secrets:** Authentication relies on public key cryptography anchored in DNSSEC, eliminating the need to distribute API keys or other shared secrets.
- **Offline Verification:** Servers verify tokens locally, enhancing resilience, performance, and privacy as no external calls are needed during verification.
- **Short-Lived Credentials:** Although the underlying VeraId protocol allows for credentials to be valid for up to 90 days, Kliento caps the validity of its token bundles at 60 minutes.
- **Audience Restriction:** The mandatory `audience` field prevents tokens issued for one service from being replayed against another.

However, certain considerations remain:

- **DNSSEC Dependency:** Security fundamentally relies on the integrity of the DNSSEC infrastructure and the organisation's operational security in managing their domain and keys.
- **Time Sensitivity:** Correct verification depends on the verifier having an accurately synchronised clock, as validity is time-based.

In essence, Kliento provides a robust, decentralised, and developer-friendly approach to client authentication by layering specific token semantics onto the verifiable, offline-first identity framework of VeraId.
