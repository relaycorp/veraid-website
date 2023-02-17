---
title: "Architecture"
permalink: /architecture
nav_order: 3
---

# VeraId Architecture (MVP)

This document describes the systems and software architecture of the various component that will make up the Minimum Viable Product (MVP) version of VeraId.

![](diagrams/vera-architecture.svg)

## VeraId library

This library, available in JavaScript and JVM/Android, will implement all the cryptographic and data serialisation operations needed by the various components in VeraId.

Its JS version will use PKI.js, ASN1.js and a new [DNSSEC verification library](https://github.com/relaycorp/dnssec-verifier-js). Its JVM/Android version will use Bouncy Castle and dnsjava ([with a custom resolver](https://github.com/dnsjava/dnsjava/issues/255)).

Prototype implementation: [`vera-lib`](https://github.com/relaycorp/veraid-poc/tree/main/vera-lib).

## VeraId Certificate Authority (CA) server

This multi-tenant server will allow one or more organisations to manage their VeraId setup, and it'll also allow organisation members to claim and renew their VeraId Ids.

It will support the following API endpoints, which are to be consumed by the VeraId CA Console (used by organisation admins) and VeraId signature producers (used by organisation members):

- `POST /orgs/`: Create org.
  - Auth: OAuth2 (_admin_).
  - Input:
    - org (e.g., `acme.com`).
    - Access type (invite-only or open).
    - Services (e.g., Letro).
    - [Awala endpoint middleware](https://github.com/relaycorp/relayverse/issues/28) URL (optional).
  - Output: TXT record.
- `DELETE /orgs/{org}/`: Delete org.
  - Auth: OAuth2 (_org admin_).
- `POST /orgs/{org}/user-invites/`: Create user invite, if access type is invite-only.
  - Auth: OAuth2 (_org admin_).
  - Input: Username and service id.
  - Output: Single-use claim token.
- `POST /orgs/{org}/users/`*: Claim invite and request VeraId, if access type is invite-only.
  - Auth: Single-use claim token.
  - Input: VeraId public key.
  - Output: VeraId certificate.
- `POST /orgs/{org}/users/{user}/ids/`*: Renew VeraId.
  - Auth: Signed request with the asymmetric key in the VeraId.
  - Input: None.
  - Output: New VeraId certificate.
- `DELETE /orgs/{org}/users/{user}/`: Delete user.
  - Auth: OAuth2 (_org admin_).
- `POST /orgs/{org}/awala/`: [Awala endpoint middleware](https://github.com/relaycorp/relayverse/issues/28) backend.
  - Auth: Awala Endpoint Middleware.
  - Awala service messages:
    - `UserInviteClaim` (if access type is invite-only).
      - Input: Single-use claim token.
      - Output: VeraId certificate.
    - `UserIdRequest` (if access type is open).
      - Input: VeraId public key and desired username.
      - Output: VeraId certificate.
    - `UserIdRenewal`.
      - Input: Username, signed with asymmetric key in the VeraId.
      - Output: New VeraId certificate.

\* We may skip this endpoint in v1 because the endpoint `POST /orgs/{org}/awala/` already supports this functionality.

This server will have the following background processes:

- [Awala endpoint middleware](https://github.com/relaycorp/relayverse/issues/28) backend. Used to respond to the requests made to `POST /orgs/{org}/awala/`.

Prototype implementation: [`vera-ca`](https://github.com/relaycorp/veraid-poc/tree/main/vera-ca).

## VeraId CA Console

This will be the command-line interface (CLI) to the admin-only endpoints in the VeraId CA Server.

The admin user will have to log in using [device authorisation code](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow), ideally.

Prototype implementation: [`vera-ca` (`tech.relaycorp.vera.ca.cli.Main`)](https://github.com/relaycorp/veraid-poc/blob/main/vera-ca/src/main/java/tech/relaycorp/vera/ca/cli/Main.kt).

## Notable compromises

We're taking the following shortcuts to keep the cost of the MVP down:

- The VeraId CA Console is to be implemented as a CLI.
- No way for organisation users to claim their ids without admin intervention.
- No support for bot accounts as organisation members.
