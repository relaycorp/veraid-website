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
- Revoke certificate (if private key is compromised).
- Onboard member.
- Offboard member.
- Provision bot id.
- Deprovision bot id.

Bots are basically members without usernames, so they act on behalf of the organisation in the context of a specific service.

## Organisation member

A member of an organisation (like `alice.smith` of `acme.com`).

- Provision id.
- Deprovision/revoke id.

## Signature producer

A developer building software that produces Vera signatures.

- Import ids using Vera library.
- Renew ids using Vera library.
- Produce signatures using Vera library.

## Signature verifier

A developer building software that verifies Vera signatures.

- Implement verification of contents with Vera library.

## Verification consumer

An end user of an app that verifies Vera signatures.

No human intervention needed.
