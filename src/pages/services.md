---
title: VeraId services
description: VeraId services
layout: ../layouts/Page.astro
permalink: /services
---

# VeraId services

VeraId itself is a generic protocol, meant to be integrated into another protocol known as a _service_.

As of this writing, [Letro](https://letro.app/en/) is the only VeraId service.
You can learn more about its VeraId integration in the [documentation for Letro Server](https://docs.relaycorp.tech/letro-server/).

We're also working on a service to leverage VeraId to bring _service accounts_ to the Internet,
allowing clients to authenticate by proving their identity (e.g. `alice@example.com`),
rather than using long-lived shared secrets like API keys.
Think AWS roles, Azure managed identities, GCP service accounts, or Kubernetes service accounts, but for the entire Internet.
Stay tuned!

## Create a VeraId service

To integrate VeraId into your protocol, thus creating a _VeraId service_, you need to:

1. Define the service.
2. Produce signatures.
3. Verify signatures.

### Define the service

VeraId is flexible enough to be integrated into any protocol,
requiring you to only define the following:

- The _Service Object Identifier_, or _service OID_, a string uniquely identifying your service. If you or your organisation don't yet have an OID arc, [there are several ways to get one](https://stackoverflow.com/questions/25452658/how-to-create-oid-object-identifiers).
- The _Time-To-Live_, or _TTL_, of signatures produced by your service. If you're supporting offline use cases, you may want to use a TTL of a few days or weeks, but if you're supporting online use cases, you may want to use a TTL of a few minutes or hours. The minimum TTL is 1 second, but we recommend a minimum of several minutes to account for clock drift. The maximum TTL is 30 days.
- Whether the service will support [member signatures or organisation signatures](/overview#signature-types), or both. Generally, you should use member signatures, which requires each member to use a VeraId-compatible app that securely manages its key pair and produces member signatures.
- Whether the _plaintext_ (i.e. the data that is signed) is attached to the signature. We recommend detaching large plaintexts for performance reasons; what constitutes a "large" plaintext will depend entirely on the devices you're targeting, so we recommend you run your own benchmarks. Generally, plaintexts in the order of a few kilobytes should pose no problem.
- The format of the plaintext. VeraId is agnostic to the format, so you can use any binary or text format.

### Produce signatures

#### Produce member signatures

To produce member signatures, you first need to obtain a member id bundle,
which you can do from a [VeraId Authority](https://docs.relaycorp.tech/veraid-authority/) instance or your own custom integration.
You should also implement a mechanism to renew the member id bundle before it expires.

If you're integrating the [VeraId Authority API](https://docs.relaycorp.tech/veraid-authority/api),
you should follow this process:

1. Register the member's public key. You can do this directly on behalf of the member, if you already have their public key. Alternatively, you can generate a single-use _public key import token_ so that the member's VeraId-compatible app can import the public key on their behalf.
2. Request a member id bundle.

Once you have a member id bundle, you can produce member signatures using one of the [VeraId libraries](/overview#core-libraries).

#### Produce organisation signatures

To produce organisation signatures, you need to obtain an organisation id bundle,
which you can do from a VeraId Authority instance or your own custom integration.

As of this writing,
support for organisation signatures in VeraId Authority is in progress,
and limited to the form of _workload identities_,
meant to authenticate server-side apps (e.g. GitHub Actions workflows, AWS Lambda functions) rather than human users.

To request an organisation id bundle via the VeraId Authority API,
you will need to:

1. Register the workload identity under the member to which it should be attributed, including the fixed plaintext to be attached to the signatures. For example, you could authorise the GitHub Actions workflows for the repository `your-org/your-repo` to act on behalf of `your-company.com` or `employee@your-company.com` on a third-party server implementing your service.
2. Have the workload request an organisation id bundle whenever it needs to authenticate with the third-party server. These credentials are short-lived, and will be valid for as long as the workload's JSON Web Token (JWT) is valid (capped at 60 minutes).

Once you have an organisation id bundle, you can produce organisation signatures using one of the [VeraId libraries](/overview#core-libraries).

### Verify signatures

Verifying VeraId signature bundles is trivial and requires no calls to remote servers.
Please refer to the [VeraId libraries](/overview#core-libraries) for more information.
