---
title: "Home"
nav_order: 0
---

# Vera: Domain names without the Internet

Vera will be a technology that apps could use to authenticate organisations and users using the existing DNS infrastructure -- but without accessing the Internet.

Apps can use Vera to verify the authenticity and integrity of any given piece of data, and thus reliably attribute it to an organisation (like `acme.com`) or member of an organisation (like `alice.smith` of `acme.com`).

## Use cases

[There are many potential use cases](./use-cases.md), such as:

- Avoiding phishing in offline messaging apps (this project's _raison d'être_).
- Sharing Web content offline or via email -- the actual content, not a URL.
- Decentralised document-signing -- without a gatekeeper like Adobe.
- Authenticating third-party bots in an API -- without sharing tokens or keys.
- Making DDoS attacks expensive on centralised and decentralised networks.

## Technical overview

Vera combines [DNSSEC](https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en) with a new Public Key Infrastructure (PKI) to produce digital signatures whose provenance can be traced back to a domain name.

Any DNSSEC-enabled domain can be a trust anchor in the PKI, but it only has control over itself (not other domains or subdomains).

[Learn more about Vera's architecture](./architecture.md) or [read the spec](./spec.md).

## About

This project is being incubated by [Relaycorp](https://relaycorp.tech) for use in [Letro](https://letro.app/en/) (an [Awala](https://awala.network) service), but Vera itself is completely agnostic of Letro, Awala and Relaycorp.

We could bundle it with Letro, but we think that the core functionality is generic enough and so widely applicable that it makes more sense to develop it independently.

The word _vera_ is [Ido](https://www.idolinguo.org.uk/general.htm) for _authentic_, and it's pronounced _VEH-rah_ (with a trilled R).
