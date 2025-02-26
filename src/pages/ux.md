---
title: "User Experience"
description: "Comprehensive guide to VeraId user roles and workflows, including organisation administration, member management, and signature verification processes"
layout: ../layouts/Markdown.astro
permalink: /ux
---

# User Experience

**THIS IS A WORKING DRAFT AT THIS POINT**

## Organisation admin

Someone who manages the VeraId setup for an organisation (like `acme.com`).

- Provision DNSSEC and VeraId server.
- Rotate asymmetric key (i.e., simply update DNS).
- Onboard member.
- Offboard member.

## Organisation member

A member can be either a _user_ or a _bot_. Users have unique names under the organisation (like `alice.smith` of `acme.com`). Bots, on the other hand, don't have names because they're meant to act on behalf of the organisation -- but organisation admins can still assign them names privately for internal organisation purposes.

- Provision certificate for use in a given service.
- Deprovision/revoke certificate.

## Signature producer

A developer building software that produces VeraId signatures.

- Import certificate using VeraId library.
- Periodically renew certificate using VeraId library.
- Produce signatures using VeraId library.

## Signature verifier

A developer building software that verifies VeraId signatures.

- Implement verification of contents with VeraId library.

## Verification consumer

An end user of an app that verifies VeraId signatures.

No human intervention needed.

## Service author

An individual or team that defines the parameters to be honoured by signature producers and verifiers. Parameters include: OID of the service and maximum TTL of digital signatures (from DNSSEC answer).
