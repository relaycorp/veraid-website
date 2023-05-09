---
title: "Architecture"
permalink: /architecture
nav_order: 3
---

# VeraId Architecture (MVP)

This document describes the systems and software architecture of the various component that make up the Minimum Viable Product (MVP) version of VeraId.

![](diagrams/vera-architecture.svg)

## VeraId library

This library, available in JavaScript and JVM/Android, implements all the cryptographic and data serialisation operations needed by the various components in VeraId.

- JavaScript implementation: [`@relaycorp/veraid`](https://github.com/relaycorp/veraid-js).
- Android/JVM implementation: [`tech.relaycorp:veraid`](https://github.com/relaycorp/veraid-jvm).

## VeraId Authority server

This is a cloud-native app that allows organisations to manage their VeraId members and the issuance of their respective bundles.

- GitHub project: [`relaycorp/veraid-authority`](https://github.com/relaycorp/veraid-authority).
