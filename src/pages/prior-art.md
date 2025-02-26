---
title: "Prior art"
description: "Documentation of the technologies we considered but didn't use"
layout: ../layouts/Markdown.astro
permalink: /prior-art
---

# Prior art

We need a mechanism to assign customisable, user-friendly, universally-unique, offline-compatible identifiers to [Letro](https://letro.app/en/) users to avoid phishing. We didn't find any prior attempt to achieve this in a decentralised manner, so we decided to build our own solution based on DNS.

We did consider the following technologies, but we decided not to use them or build upon them:

## Federated auth protocols

This includes protocols like OAuth2/OIDC and SAML.

Compliant servers (e.g., `identity-provider.com`) often return auth responses for other domains (e.g., `alice.smith@acme.com`), which is fine and even desirable on the Web, but would be problematic in an offline context as we wouldn't know if the auth server has the authority to authenticate users from other domains. A simple workaround could be to only trust email addresses whose domains match those of their respective auth servers.

More importantly, however: we wouldn't have the auth servers' public keys to verify their responses offline, and pre-sharing such keys for every possible server is simply unfeasible. Alternatively, we could not use such keys and rely on TLSNotary instead, but that'd make the solution hard to use and add significant data overhead (e.g., the server's certificate chain).

## W3C Decentralized Identifier (DID) methods

We did a cursory survey of the many DID methods available (127 as of this writing), and we couldn't find a suitable one. Apart from blockchain-based methods, which we're ruling out for the reasons explained below, we looked at the following methods:

- DNS (`did:dns`) and Web (`did:web`). They both _recommend_ the use of DNSSEC to resolve records, but neither offers a secure way to use the DID offline.
- Peer (`did:peer`). This method is meant to be used privately between two parties, and therefore doesn't provide ids that are customisable, user-friendly or universally-unique.

## Tor's Onion v3 vanity addresses

For example, `bbcnewsv2vjtpsuy.onion` is the Onion v3 vanity address for BBC News.

Even if we adapted the underlying algorithm to suppress the `.onion` suffix, addresses would still have a randomly-generated sequence after the customisable prefix, which wouldn't be customisable or user-friendly enough for us.

## Blockchain-based technologies

This includes alternative DNS roots (like ENS) and many W3C DIDs.

Any blockchain-based solution would require each app to store gigabytes of data (and keep it in sync) or blindly trust the information received from external sources (most likely Infura Inc).

Even if Zero-Knowledge Proofs could overcome these limitations, we'd rather not depend on a technology that's more complicated, more costly and less battle-tested than DNSSEC.

There are valid use cases for blockchain technology, but this isn't one of them.

## DNS-Based Authentication of Named Entities (DANE)

Intuitively, it may seem like a good foundation for VeraId, but DANE really is geared towards securing the trust anchor in the Internet PKI (PKIX). That is, its sole purpose is to enable clients to authenticate TLS servers. However, we're not trying to authenticate servers and our users may not even have access to the Internet.

## Signed HTTP Exchanges (SXGs)

SXG is a protocol that allows HTTP servers to sign their response with their TLS certificates,
so that a third party can cache and serve such responses to users on the website's behalf.
However,
the initial use cases we need to support don't involve HTTP.

## Extensible Resource Identifier (XRI) i-names

`=Alice.Smith`, `@ACME` and `@ACME*Alice.Smith` are some i-name examples.

We would've gladly used i-names instead of domain names for UX reasons. Unfortunately, XRI is a defunct technology and it didn't offer a PKI analogous to DNSSEC.
