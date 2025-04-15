---
title: Alternatives to Kliento
description: Compare Kliento to alternatives
layout: ../../layouts/KlientoPage.astro
---

# Alternatives to Kliento

Kliento offers a distinct approach to client authentication, addressing common limitations found in traditional methods. It aims to provide secure, offline-verifiable credentials without shared secrets or key distribution mechanisms. Let's compare it to some prevalent alternatives.

## API keys

API keys are randomly-generated strings used as shared secrets for authentication.

**Pros:**

- Easy to generate and understand initially.
- Established pattern in the industry.

**Cons:**

- **Shared secret risk:** Keys must be securely distributed and stored on both client and server, whilst Kliento uses public-key cryptography anchored in DNSSEC.
- **Management overhead:** Rotation, revocation, and auditing can be complex, especially at scale, whereas Kliento relies on DNSSEC/X.509 lifecycle management with short-lived tokens.

## Identity federation

Identity federation protocols allow relying parties (servers) to trust authentication performed by a dedicated Identity Provider (IdP). Examples include OpenID Connect (OIDC) and SAML. Workload identity systems like SPIFFE/SPIRE also fall broadly into this category.

**Pros:**

- Established standards with wide adoption and tooling support.
- In the case of SPIFFE, rich attestation capabilities for workload identity verification.

**Cons:**

- **Online dependency:** Servers need to fetch the IdP's public keys upfront or during the authentication process, unlike Kliento bundles which contain the entire chain of trust for offline verification.
- **Centralised trust:** Verification depends on the availability and trustworthiness of specific IdPs, whereas Kliento's trust is anchored in DNSSEC.
- **Infrastructure complexity:** Requires deploying and managing federation infrastructure (especially with SPIFFE/SPIRE).

## Kliento and SPIFFE

Kliento and SPIFFE overlap in their core mission of authenticating workloads, but they approach this challenge through distinct yet complementary mechanisms. SPIFFE excels at establishing trusted identities within controlled environments through its robust attestation framework, whilst Kliento provides offline-verifiable credentials across organisational boundaries.

For example, we're considering whether to use SPIFFE's multi-factor attestation capabilities to make credential issuance decisions in VeraId Authority. A workload could present a SPIFFE Verifiable Identity Document (SVID) with strong attestation properties (e.g. hardware verification, configuration validation) to VeraId Authority, which then issues a Kliento token bundle after validating the SVID.
