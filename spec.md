---
title: "Spec"
permalink: /specs/v1
nav_order: 4
---

# Vera V1 Specification

<dl>
    <dt>Status</dt>
    <dd>Working draft</dd>
    <dt>Author</dt>
    <dd>Gus Narea, <a href="https://relaycorp.tech">Relaycorp</a></dd>
</dl>

## Overview

**THIS IS A WORKING DRAFT AT THIS POINT**

Initial provisioning done by organisation admins:

- `acme.com` MUST have DNSSEC enabled and properly configured.
- `acme.com` admin generates an Ed25519 key pair and self-issues an X.509 certificate with it. This is the root Certificate Authority (CA) for all certification paths and all digital signatures under `acme.com`.
- `TXT` record `_vera.acme.com` contains the Base64-encoded, ASN.1 DER serialisation of the root certificate. This may have to span two records due to 255-character limit.

Authenticating members and bots:

- `acme.com` admin issues certificates to members of the organisation or bots that act on behalf of the organisation -- collectively known as _signers_.
  - Each certificate contains a critical extension that specifies the context in which it can be used (e.g., Letro).
  - If the certificate is for a member, the _Distinguished Name_ MUST contain the Vera username (e.g., `alice.smith`).
- A signer provisions a certificate by providing an Ed25519 public key to the `acme.com` CA.

Digital signatures by members and bots:

- Signers must distribute each content with a _Vera signature_, which includes:
  - The CMS `SignedData` signature, embedding the signer's certificate along with any intermediary CAs. The root CA SHOULD NOT be included.
  - The `TXT` record `_vera.acme.com` along with all the intermediary records to verify the `TXT` record with DNSSEC.
- Verifiers must verify each content they receive against its respective Vera signature as follows:
  1. Verify the `TXT` record using DNSSEC.
  1. Verify the authenticity of the content using the `SignedData` value with the root certificate in the `TXT` record as they only trusted certificate.
  1. Verify that the signer's certificate is allowed to use the current service (e.g., Letro).

## Validity period

Signature verifiers MUST count the _age_ of a digital signature from the moment the `TXT` record answer was signed.

Vera service designers MUST specify the maximum Time-to-Live (TTL) for every digital signature in the service. The TTL is counted from the moment the `TXT` record answer was signed. The TTL MUST be within the following range:

- 8 hours or more, in order to allow sufficient time for signature-producing apps to renew certificates (and wait for any outages to be resolved).
- 30 days or less, in order to support Delay-Tolerant Networking.

Vera favours short-lived certificates over long-lived ones, primarily to avoid the use of revocation protocols. Consequently, service designers SHOULD require the shortest TTL that would satisfy their particular requirements.

Signature verifiers MAY require a TTL shorter than that required by the service, but still not shorter than 8 hours. Additionally, signature verifiers MAY allow their end users to specify the shorter TTL.

## Vera OID Arch

1.3.6.1.4.1.58708.1

## X.509 certificate

- Common Name MUST be the domain name in the case of an organisation certificate, the at sign (`@`) in the case of a bot certificate and the user name in the case of a user certificate.

## TXT Record Data

Space-separated fields:

- Key algorithm: An integer denoting the key algorithm.
  - `0` (RSA 2048).
  - `1` (RSA 3072).
  - `2` (RSA 4096).
- Key id type: An integer denoting how the key is identified in the following field.
  - `0` (`ID`): The key id is the key itself (e.g., Ed25519 keys). Reserved for future use.
  - `1` (`SHA256`): The key id is the SHA-256 digest.
  - `2` (`SHA384`): The key id is the SHA-384 digest.
  - `3` (`SHA512`): The key id is the SHA-512 digest.
- Key id: The Base64 (unpadded) encoding of the public key itself or its digest.
- TTL override for the DNSSEC chain: A positive integer representing the number of seconds.
- Service (optional): The OID for the service this chain applies to.

## Cryptographic algorithms supported

- Hashing: SHA-256, SHA-384 and SHA-512.
- Digital signatures: RSA-PSS with modulus 2048/3072/4096.

## DNSSEC Chain Serialisation

Serialise as an _answer_ using the message format from [RFC 1035](https://datatracker.ietf.org/doc/html/rfc1035) (Section 4.2), where:

- Header: contains the `ad` flag.
- Question: is `_vera.<name>/TXT`.
- Answer: contains the RRset for `_vera.<name>/TXT` (and respective `RRSIG`s).
- Authority: is empty.
- Additional: contains the rest of the DNSSEC chain, excluding `./DS` (which must be provided by the verifier).

## Vera Member Id Bundle

ASN.1 SEQUENCE:

- DNSSEC chain (SEQUENCE).
- Organisation certificate (SEQUENCE).
- Member certificate (SEQUENCE).

## Vera Signature Bundle

ASN.1 SEQUENCE:

- DNSSEC chain (SEQUENCE).
- Organisation certificate (SEQUENCE).
- SignedData (SEQUENCE) with content detached. Includes:
  - Member certificate and any intermediate certificates, but not the plaintext (content).
  - Vera Signature Metadata in signedAttrs:
    - Service OID.
    - Validity period (SEQUENCE).
      - Start date.
      - Expiry date.

## Vera Signed Content

ASN.1 SEQUENCE:

- Content (OCTET STRING).
- Signature (SEQUENCE).

## Security considerations

### Reliance on DNSSEC infrastructure

Every DNS zone in a Vera chain is a potential target for cyberattacks, including the [root zone](https://www.iana.org/dnssec). Not to mention that many governments control popular TLDs so, for example, the Libyan government could theoretically issue valid DNSSEC responses for `bit.ly`.

### Homographic and character encoding-based attacks
