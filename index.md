---
title: "Home"
nav_order: 0
---

# VeraId: Domain names without the Internet

VeraId is a new authentication protocol that apps can use to verify the integrity of any content, and reliably attribute it to a domain name (like `acme.com`) or a _member_ of it (like `alice@acme.com`), without querying any server on the Internet.

The protocol is essentially a thin layer on top of existing DNS infrastructure. It's also [open](./spec.md), decentralised and has [open source implementations](./architecture.md). 

## Use cases

VeraId can improve existing systems in many ways, such as:

- Avoiding phishing in offline communication apps (the _raison d'être_ of this project).
- Signing documents or software without gatekeepers like Adobe.
- Authenticating API clients without bearer tokens or pre-shared public keys.

But perhaps more interestingly, it could power a new generation of decentralised systems that wouldn't be possible today -- like [peer-to-peer web hosting](https://en.wikipedia.org/wiki/Peer-to-peer_web_hosting) with contents reliably attributed to their respective domain names.

## Technical overview

VeraId combines DNSSEC with a new Public Key Infrastructure (PKI) to produce digital signatures that can be linked to a domain name. Consequently, every signature contains enough data to be independently verified without external queries, such as DNS lookups.

Any DNSSEC-enabled domain can be a trust anchor in the PKI, but it'd only have control over itself (not other domains). This offers far better security than the Transport Layer Security (TLS), which allows many trust anchors (_Certificate Authorities_) to issue certificates for any domain.

Designing and implementing _yet another_ auth protocol is not something we took lightly: We know it's hard to get them right and the consequences can be catastrophic. Unfortunately, [no existing technology satisfied our needs](./prior-art.md).

Watch the video below for a walk-through of the protocol and a demo of the [prototype](https://github.com/relaycorp/veraid-poc).

{% include embed_youtube_video.html id="K2vbMOjur_E" %}

[Learn more about the architecture](./architecture.md){: .btn .mr-2 }
[Read the spec](./spec.md){: .btn .mr-2 }

## About

This project is led by [Relaycorp](https://relaycorp.tech) and funded by the [Open Technology Fund](https://opentech.fund) for use in [Letro](https://letro.app/en/), but VeraId itself is completely agnostic of Letro and Relaycorp.

We could've bundled it with Letro, but the core functionality is generic enough and so widely applicable that it makes more sense to develop it independently. We also expect it to play a crucial role in [Awala](https://awala.network/) in the future, such as when we support [message broadcasting](https://github.com/AwalaNetwork/specs/issues/43).

The word _vera_ is [Ido](https://www.idolinguo.org.uk/general.htm) for _authentic_, and it's pronounced _VEH-rah_ (with a trilled R).
