---
title: "Home"
nav_order: 0
---

# Vera: Domain names without the Internet

Vera will be a protocol to authenticate users and organisations, as well as any content they produce. It leverages the existing DNS infrastructure without actually using the Internet.

Apps will use Vera to verify the authenticity and integrity of any type of data, and thus reliably attribute it to an organisation (like `acme.com`) or a member of an organisation (like `alice.smith` of `acme.com`).

## Use cases

Vera can improve existing systems in many ways, such as:

- Avoiding phishing in offline messaging apps (the _raison d'être_ of this project).
- Sharing Web content offline or via email -- the actual content, not a URL.
- Decentralised document-signing -- without a gatekeeper like Adobe.
- API authentication -- without pre-shared tokens or public keys.
- User authentication -- without auth servers.

But perhaps more interestingly, it could power a new generation of systems that wouldn't be possible today. Like a new Web (Web4?) where static contents are no longer hosted on servers, but are instead hosted on BitTorrent and authenticated with Vera.

## Technical overview

Vera combines [DNSSEC](https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en) with a new Public Key Infrastructure (PKI) to produce digital signatures whose provenance can be traced back to a domain name. Any DNSSEC-enabled domain can be a trust anchor in the PKI, but it'd only have control over itself (not other domains).

Consequently, every piece of content to be verified contains enough metadata to conduct the verification. External queries, like DNS lookups, are not needed.

[Learn more about Vera's architecture](./architecture.md) or [read the spec](./spec.md).

## Prior art

We need a mechanism to assign customisable, user-friendly, globally-unique, offline-compatible identifiers to [Letro](https://letro.app/en/) users in order to avoid phishing. We didn't come across any prior attempt to achieve this in a decentralised manner, so we decided to build our own solution based on DNS.

We did find the following related technologies, but we decided not to use them or build upon them:

- **DNS-Based Authentication of Named Entities (DANE)**. It may intuitively seem like a good foundation for this work, but it really is geared towards securing the trust anchor in the Internet PKI (PKIX). That is, DANE's sole purpose is to help TLS clients authenticate the certificates used by servers. However, we're not trying to authenticate servers and our users may not even have access to the Internet.
- **Tor's Onion v3 vanity addresses**, like `bbcnewsv2vjtpsuy.onion` for BBC News. Even if we adapted the underlying algorithm to suppress the `.onion` suffix, addresses would still have a randomly-generated sequence after the customisable prefix, which wouldn't be customisable or user-friendly enough for us.
- **Blockchain-based alternative DNS roots**, like ENS. Any blockchain-based solution would require each app to store gigabytes of data (and keep it in sync) or blindly trust the information received from external sources (most likely a company like Infura).
- **Matrix.org Ids**, like `@alice.smith:acme.com`. The verification would require interacting with a server implementing the Matrix Identity Service API, which in turn requires something like [Awala](https://awala.network/) to work offline, making the overall solution slower and more complicated.
- **Extensible Resource Identifier (XRI) i-names**, like `=Alice.Smith`, `@ACME` or `@ACME*Alice.Smith`. Were XRI not defunct, we might have used it instead of DNS.

## About

This project is being incubated by [Relaycorp](https://relaycorp.tech) for use in [Letro](https://letro.app/en/), but Vera itself is completely agnostic of Letro and Relaycorp.

We could bundle it with Letro, but we think that the core functionality is generic enough and so widely applicable that it makes more sense to develop it independently. We also expect it to play a crucial role in Awala in the future, such as when we support [message broadcasting](https://github.com/AwalaNetwork/specs/issues/43).

The word _vera_ is [Ido](https://www.idolinguo.org.uk/general.htm) for _authentic_, and it's pronounced _VEH-rah_ (with a trilled R).
