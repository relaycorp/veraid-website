---
title: "User Experience"
permalink: /ux
nav_order: 2
---

# User Experience

**THIS IS A WORKING DRAFT AT THIS POINT**

## Organisation admin

Someone who manages the Vera setup for an organisation (like `acme.com`).

- Provision DNSSEC and Vera server.
- Rotate root certificate (i.e., simply update DNS).
- Revoke root certificate (if private key is compromised).
- Onboard member.
- Offboard member.

## Organisation member

A member can be either a _user_ or a _bot_. Users have unique names under the organisation (like `alice.smith` of `acme.com`). Bots, on the other hand, don't have names because they're meant to act on behalf of the organisation -- but organisation admins can still assign them names privately for internal organisation purposes.

- Provision certificate for use in a given service.
- Deprovision/revoke certificate.

## Signature producer

A developer building software that produces Vera signatures.

- Import certificate using Vera library.
- Periodically renew certificate using Vera library.
- Produce signatures using Vera library.

## Signature verifier

A developer building software that verifies Vera signatures.

- Implement verification of contents with Vera library.

## Verification consumer

An end user of an app that verifies Vera signatures.

No human intervention needed.

## Service author

An individual or team that defines the parameters to be honoured by signature producers and verifiers. Parameters include: OID of the service and maximum TTL of digital signatures (from DNSSEC answer).
