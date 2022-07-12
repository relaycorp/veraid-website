---
title: "Home"
nav_order: 0
---

# Vera: Domain names without the Internet

Vera will be a protocol to authenticate users and organisations, as well as any content they produce. It'll leverage the existing DNS infrastructure without actually using the Internet.

Apps will use Vera to verify the authenticity and integrity of any type of data, and thus reliably attribute it to an organisation (like `acme.com`) or a member of an organisation (like `alice.smith` of `acme.com`).

## Use cases

Vera can improve existing systems in many ways, such as:

- Avoiding phishing in offline messaging apps (the _raison d'être_ of this project).
- Sharing Web content offline or via email -- the actual content, not a URL.
- Decentralised document-signing -- without a gatekeeper like Adobe.
- API authentication without bearer tokens or pre-shared public keys.
- User authentication without auth servers -- and therefore offline-compatible.

But perhaps more interestingly, it could power a new generation of systems that wouldn't be possible today, such as a new Web where static contents are hosted on BitTorrent (instead of servers) and authenticated with Vera -- Web 4.0 if you like.

## Technical overview

Vera combines DNSSEC with a new Public Key Infrastructure (PKI) to produce digital signatures whose provenance can be traced back to a domain name. Any DNSSEC-enabled domain can be a trust anchor in the PKI, but it'd only have control over itself (not other domains).

Consequently, every digital signature contains enough data to be independently verified. External queries, such as DNS lookups, are not needed.

Designing and implementing _yet another_ auth protocol is not something we take lightly: We know it's hard to get them right and the consequences can be catastrophic. Unfortunately, [no existing technology satisfied our needs](./prior-art.md).

Watch the video below for a walk-through of the protocol and a demo of the [prototype](https://github.com/VeraDomains/poc).

{% include embed_youtube_video.html id="K2vbMOjur_E" %}

[Learn more about the architecture](./architecture.md){: .btn .mr-2 }
[Read the spec](./spec.md){: .btn .mr-2 }

## About

This project is being incubated by [Relaycorp](https://relaycorp.tech) for use in [Letro](https://letro.app/en/), but Vera itself is completely agnostic of Letro and Relaycorp.

We could bundle it with Letro, but we think that the core functionality is generic enough and so widely applicable that it makes more sense to develop it independently. We also expect it to play a crucial role in [Awala](https://awala.network/) in the future, such as when we support [message broadcasting](https://github.com/AwalaNetwork/specs/issues/43).

The word _vera_ is [Ido](https://www.idolinguo.org.uk/general.htm) for _authentic_, and it's pronounced _VEH-rah_ (with a trilled R).
