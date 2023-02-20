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

- Production implementation: [`relaycorp/veraid-js`](https://github.com/relaycorp/veraid-js) and [`relaycorp/veraid-jvm`](https://github.com/relaycorp/veraid-jvm).
- Prototype implementation: [`vera-lib`](https://github.com/relaycorp/veraid-poc/tree/main/vera-lib).

## VeraId Certificate Authority (CA) server

This multi-tenant server will allow one or more organisations to manage their VeraId setup, and it'll also allow organisation members to claim and renew their VeraId Ids.

- Production implementation: [`relaycorp/veraid-authority`](https://github.com/relaycorp/veraid-authority).
- Prototype implementation: [`vera-ca`](https://github.com/relaycorp/veraid-poc/tree/main/vera-ca).

## VeraId CA Console

This will be the command-line interface (CLI) to the admin-only endpoints in the VeraId CA Server.

The admin user will have to log in using [device authorisation code](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow), ideally.

Prototype implementation: [`vera-ca` (`tech.relaycorp.vera.ca.cli.Main`)](https://github.com/relaycorp/veraid-poc/blob/main/vera-ca/src/main/java/tech/relaycorp/vera/ca/cli/Main.kt).

## Notable compromises

We're taking the following shortcuts to keep the cost of the MVP down:

- The VeraId CA Console is to be implemented as a CLI.
- No way for organisation users to claim their ids without admin intervention.
- No support for bot accounts as organisation members.
