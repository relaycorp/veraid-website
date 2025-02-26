---
title: "Architecture"
description: "Technical overview of VeraId's system architecture, including the core cryptographic library and cloud-native authority server components"
layout: ../layouts/Page.astro
permalink: /architecture
---

# VeraId Architecture

This document describes the systems and software architecture of the various components that make up VeraId.

![](/diagrams/architecture.svg)

## VeraId library

This library, available in JavaScript and Kotlin, implements all the cryptographic and data serialisation operations needed by the various components in VeraId.

- JavaScript implementation: [`@relaycorp/veraid`](https://github.com/relaycorp/veraid-js).
- Kotlin implementation (JVM/Android): [`tech.relaycorp:veraid`](https://github.com/relaycorp/veraid-jvm).

## VeraId Authority server

This is a cloud-native app that allows organisations to manage their VeraId members and the issuance of their respective bundles.

- GitHub project: [`relaycorp/veraid-authority`](https://github.com/relaycorp/veraid-authority).
- JavaScript client: [`@relaycorp/veraid-authority`](https://github.com/relaycorp/veraid-authority-js).
