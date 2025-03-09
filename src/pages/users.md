---
title: How to use VeraId
description: How to use VeraId to verify and produce signatures with your own domain name
layout: ../layouts/Page.astro
permalink: /users
---

# How to use VeraId

Using VeraId is--we hope--very simple!

## Verify signatures

To verify VeraId signatures, there's absolutely no user interaction needed.
All you need is an app implementing a [VeraId service](/services)!

## Produce signatures

To _produce_ VeraId signatures,
you just need to follow the instructions from your VeraId-compatible app.
Every app will handle this differently.

For example,
[Letro](https://letro.app/en/) offers the ability to get free identifiers from domains such as `applepie.rocks` and `cuppa.fans`,
with minimal configuration as shown in the screenshot below.

![Letro signup with Relaycorp-managed domain name](../assets/images/usage/letro-free-account.png)

Letro also integrates with [VeraId Authority](https://docs.relaycorp.tech/veraid-authority/) to enable users to use their own domain names.
The screenshot below shows what the user sees when they sign up with their own domain name.

![Letro signup with own domain name](../assets/images/usage/letro-own-domain.png)

After this initial setup,
the app can automatically produce signatures without further user intervention!

## Produce signatures with your own domain name

1. Enable DNSSEC on your domain, if you haven't already. Use [DNSSEC Analyzer](https://dnssec-analyzer.verisignlabs.com/) to verify that your domain is correctly configured.
2. Deploy [VeraId Authority](https://docs.relaycorp.tech/veraid-authority/). (FYI, we will offer a hosted version. Stay tuned!)
3. Configure your domain name and member(s) in your VeraId Authority instance. You can do this [via the API](https://docs.relaycorp.tech/veraid-authority/api#http-endpoints) directly, or using [its JS client](https://docs.relaycorp.tech/veraid-authority-js/).
4. Create the necessary `TXT` record.

Once VeraId is enabled for your domain,
you can integrate it with any end user app implementing a VeraId service.
