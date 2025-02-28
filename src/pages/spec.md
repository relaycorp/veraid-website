---
title: "Spec"
description: "Complete technical specification for VeraId V1, including DNSSEC integration, cryptographic requirements, and digital signature implementation details"
layout: ../layouts/Page.astro
---

# VeraId V1 Specification

By Gus Narea, [Relaycorp](https://relaycorp.tech). February 2025.

## 1. Introduction

VeraId is a decentralised authentication protocol that securely attributes content to domain names, providing a robust mechanism for proving ownership and authorship without requiring continuous Internet connectivity. By combining the decentralised nature of DNS with established cryptographic standards, VeraId enables secure content verification in both online and offline environments.

### 1.1. Purpose and Scope

The purpose of VeraId is to provide a secure, decentralised authentication protocol that enables the attribution of content to domain names and their associated users. VeraId addresses the need for reliable authentication in scenarios where continuous Internet connectivity cannot be guaranteed or is undesirable.

This V1 specification defines the core protocol components, data structures, cryptographic operations, and verification procedures that constitute the VeraId ecosystem. It provides the necessary information for implementers to create interoperable tools and applications that can produce and verify VeraId signatures.

The scope of this specification encompasses:

- The DNS-based trust model and its integration with DNSSEC.
- Certificate issuance and management for organisations and members.
- Production and verification of digital signatures.
- Serialisation formats for all protocol artefacts.
- Security considerations and mitigations.

### 1.2. Problem Statement

Traditional authentication systems typically require continuous Internet connectivity to verify credentials against centralised authorities. This requirement becomes problematic in several scenarios:

1. **Offline environments:** Users in areas with unreliable or no Internet connectivity need reliable authentication mechanisms that work offline.
2. **Content attribution:** Proving that a particular piece of content was produced by a specific entity without relying on centralised certification authorities.
3. **User-friendly identifiers:** Existing solutions like PGP rely on cryptographic fingerprints or long key identifiers that are not user-friendly and prone to human error.
4. **Self-sovereignty:** Many authentication systems place trust in central authorities that can issue credentials for any entity, creating unnecessary trust dependencies and security risks.

VeraId addresses these challenges by providing a protocol built on DNSSEC that allows content to be securely attributed to user-friendly identifiers (domain names and usernames) in a fully verifiable manner, without requiring online connectivity during verification.

### 1.3. Design Goals

VeraId is designed with the following primary goals:

1. **Decentralisation:** The protocol avoids the need for centralised authorities beyond the DNS hierarchy itself. Each domain owner has exclusive control over their domain and its associated members.
2. **Offline verification:** All signature bundles contain sufficient information to be independently verified without requiring external network queries.
3. **User-friendly identifiers:** Identities are based on familiar, human-readable domain names and usernames rather than cryptographic fingerprints or hashes.
4. **Battle-tested foundations:** The protocol builds upon well-established standards:
   - DNSSEC for securing DNS responses.
   - X.509 for certificate management.
   - Cryptographic Message Syntax (CMS) for digital signatures.
5. **Minimal trust assumptions:** The protocol ensures that no entity can issue credentials on behalf of domains they do not control, unlike traditional PKIs where any CA can issue certificates for any domain.
6. **Service-specific binding:** Signatures are bound to specific services, preventing their unauthorised use across different contexts.

### 1.4. Terminology

- **Organisation:** A domain name that participates in the VeraId protocol by configuring DNSSEC and publishing the necessary VeraId TXT record.
- **Member:** An entity (user or bot) that acts on behalf of an organisation.
- **User:** A specific type of member identified by a username within an organisation.
- **Bot:** A special type of member that acts on behalf of the organisation as a whole.
- **VeraId TXT Record:** A DNS TXT record at `_veraid.<domain>` that contains the organisation's public key information.
- **Organisation Certificate:** A self-signed X.509 certificate owned by an organisation that serves as the root of trust for all signatures produced on behalf of that organisation.
- **Member Certificate:** An X.509 certificate issued by the organisation certificate to a member.
- **Member ID Bundle:** A data structure containing a member certificate, its issuing organisation certificate, and the DNSSEC chain proving the authenticity of the organisation's VeraId TXT record.
- **Signature Bundle:** A data structure containing a digital signature and all the information needed to verify it offline.
- **Member Signature Bundle:** A signature bundle containing a signature produced by a member using their private key.
- **Organisation Signature Bundle:** A signature bundle containing a signature produced directly by an organisation using its private key, with a required member attribution that assigns authorship of the content to a specific member.
- **DNSSEC Chain:** A sequence of DNS responses that allows a verifier to cryptographically validate the authenticity of a DNS record.
- **Service OID:** An Object Identifier (OID) that uniquely identifies a service or application context where a VeraId signature is valid.

## 2. Protocol Overview

### 2.1. Architecture

VeraId combines DNSSEC, X.509 certificates, and CMS signatures to create a decentralised authentication system. The architecture consists of several layered components:

1. **DNS Layer:** Provides the domain name hierarchy and DNSSEC-based verification of domain ownership.
2. **PKI Layer:** Establishes a per-organisation Public Key Infrastructure where each organisation issues certificates to its members.
3. **Signature Layer:** Enables members to produce unforgeable digital signatures on behalf of their organisation.

Each organisation serves as an independent trust anchor, responsible for managing its own members and certificates. The DNSSEC infrastructure provides a secure foundation for verifying the authenticity of the organisation's public key.

VeraId's self-contained verification model allows signature bundles to be verified independently, without requiring connectivity to the Internet or the organisation's infrastructure.

### 2.2. Trust Model

VeraId's trust model differs significantly from traditional PKIs such as the one used for TLS:

1. **Domain-specific trust roots:** Each organisation is only able to issue certificates for itself and its members. Unlike traditional PKIs where any Certificate Authority can issue certificates for any domain, VeraId enforces a strict hierarchy where domain control is the only path to certificate issuance.
2. **DNSSEC as the foundation:** Trust is anchored in DNSSEC, relying on the hierarchical nature of DNS to establish domain control. The chain of trust begins with the DNS root zone and extends through each DNS subdelegation to the organisation's domain.
3. **Self-contained verification:** Signature bundles include all necessary information (DNSSEC chains, certificates) to allow completely offline verification.
4. **Short-lived certificates:** VeraId favours short-lived certificates over revocation mechanisms, reducing complexity and vulnerability to disconnected operation.
5. **Two signature types with different trust models:**
   - **Member signatures:** Produced by members using their private keys, these signatures cryptographically prove that a specific member created the content. The verification chain goes from DNSSEC to the organisation certificate to the member certificate to the signature.
   - **Organisation signatures:** Produced directly by organisations using their private keys, these signatures prove that the organisation vouches for the content. When including member attribution, the organisation claims (but does not cryptographically prove) that a specific member created the content.

By relying on DNSSEC, VeraId inherits its security properties and limitations. The protocol's trust is ultimately rooted in the DNS hierarchy, including the root zone and TLD operators.

### 2.3. Key Components

The VeraId protocol consists of the following core components:

1. **VeraId TXT Record:** A DNS TXT record at `_veraid.<domain>` containing the organisation's public key information, including key algorithm, key ID type, key ID, TTL override, and optional service OID.
2. **Organisation Certificate:** A self-issued X.509 certificate containing the organisation's public key. This certificate serves as the root Certificate Authority (CA) for all certification paths and digital signatures under the organisation's domain.
3. **Member Certificates:** X.509 certificates issued by the organisation to individual users or bots. User certificates include the username in the Common Name field, whilst bot certificates use the at sign (`@`) as their Common Name.
4. **DNSSEC Chain:** A serialised collection of DNS responses that provide cryptographic proof of the authenticity of the organisation's VeraId TXT record.
5. **Member ID Bundle:** A structure containing a member certificate, the issuing organisation certificate, and the DNSSEC chain necessary to verify the organisation's authority.
6. **Signature Bundle:** A structure containing a CMS SignedData value, the organisation certificate, and the DNSSEC chain. There are two types of bundles, which determine the signer of the SignedData value:
   - **Member Signature Bundles** are signed by a member.
   - **Organisation Signature Bundles** are signed directly by the organisation, but attributed to a specific member.

These components work together to create a secure chain of trust from the DNS root to the individual signatures produced by organisation members or by the organisation itself.

### 2.4. Workflow Summary

The VeraId protocol involves the following key workflows:

1. **Organisation Setup:**
   - The organisation must have DNSSEC properly configured for its domain.
   - The organisation generates an asymmetric key pair (RSA) and self-issues an X.509 certificate.
   - The organisation publishes a VeraId TXT record at `_veraid.<domain>` containing its key information.
2. **Member Registration:**
   - The organisation issues X.509 certificates to its members (users and bots).
   - For users, certificates include the username in the Common Name.
   - For bots, certificates use the at sign (`@`) as the Common Name.
   - Each certificate contains appropriate extensions for its intended use context.
3. **Signature Production:**
   - **Member signatures:**
     - Members use their private keys to sign content.
     - The signature is packaged with the member's certificate, the organisation certificate, and the DNSSEC chain into a signature bundle.
   - **Organisation signatures:**
     - The organisation uses its private key to sign content directly.
     - The organisation MUST include member attribution to indicate which member authored the content.
     - The signature is packaged with the organisation certificate and the DNSSEC chain into a signature bundle.
4. **Signature Verification:**
   - Verifiers extract and validate the DNSSEC chain to confirm the organisation's public key.
   - The organisation certificate is validated using the public key from the TXT record.
   - For member signatures:
     - The member certificate is validated against the organisation certificate.
     - The digital signature is verified using the member's public key.
   - For organisation signatures:
     - The digital signature is verified using the organisation's public key.
     - The member attribution is extracted and presented to the user.
   - Additional checks ensure the signature is valid for the intended service and time period.

Each of these workflows contributes to the overall security and integrity of the VeraId ecosystem.

## 3. DNS Integration

### 3.1. DNSSEC Requirements

DNSSEC is a fundamental component of VeraId, providing the cryptographic foundation for validating domain ownership. Participating domains MUST have DNSSEC properly configured and operational.

Organisations implementing VeraId MUST:

1. Ensure their domain has a complete DNSSEC chain of trust from the root zone to their domain.
2. Configure DNSSEC signing for all relevant zones.
3. Maintain valid and current DNSSEC signatures.
4. Properly manage DNSSEC key rollovers.

Verifiers MUST:

1. Have access to the DNSSEC trust anchors, particularly the root zone KSK.
2. Implement full DNSSEC validation according to relevant RFCs.
3. Reject any VeraId signatures where DNSSEC validation fails.

The protocol relies on the following DNSSEC record types:

- DNSKEY records for public keys used for zone signing.
- DS records for delegation signing.
- RRSIG records providing signatures for DNS resource record sets.
- TXT records containing the VeraId-specific data.

The VeraId protocol does not impose additional requirements beyond standard DNSSEC implementations but depends on their correct operation.

### 3.2. VeraId TXT Record Format

Each organisation participating in the VeraId protocol MUST publish a TXT record at `_veraid.<domain>` with the following format:

```
<key-algorithm> <key-id-type> <key-id> <ttl-override> [<service-oid>]
```

Where:

1. **Key Algorithm** (required): An integer denoting the key algorithm:
   - `1`: RSA-PSS with modulus 2048 bits.
   - `2`: RSA-PSS with modulus 3072 bits.
   - `3`: RSA-PSS with modulus 4096 bits.
2. **Key ID Type** (required): An integer denoting how the key is identified:
   - `1`: The key ID is the SHA-256 digest of the key.
   - `2`: The key ID is the SHA-384 digest of the key.
   - `3`: The key ID is the SHA-512 digest of the key.
3. **Key ID** (required): The Base64-encoded (unpadded) representation of the key digest, as specified by the Key ID Type.
4. **TTL Override** (required): A positive integer representing the number of seconds for the maximum validity period of signatures. This value MUST be between 28,800 seconds (8 hours) and 2,592,000 seconds (30 days).
5. **Service OID** (optional): An Object Identifier (in dotted decimal notation) identifying a specific service for which this record is valid. If omitted, the record applies to all services.

Multiple TXT records MAY be published at the same hostname to support different keys, key algorithms, or services. A domain MAY also publish service-specific records alongside a generic record (without a service OID).

Verifiers MUST select the appropriate TXT record based on the key information and service OID in the signature being verified.

Example TXT record:

```
_veraid.example.com. IN TXT "1 3 dGhpcyBpcyBub3QgYSByZWFsIGtleSBkaWdlc3Q 86400"
```

This example specifies an RSA-2048 key identified by its SHA-512 digest with a TTL override of 24 hours (86400 seconds).

### 3.3. DNSSEC Chain Serialisation

The DNSSEC chain for a VeraId signature MUST be serialised in a format that allows for offline verification. The serialisation format is based on the DNS message format defined in RFC 1035, with specific requirements for VeraId:

1. The serialised chain MUST include all DNS responses necessary to validate the `_veraid.<domain>/TXT` record, from the targeted domain up to (but not including) the root zone.
2. The serialised chain MUST be structured as a DNS message with the following components:
   - Header: MUST include the authenticated data (`ad`) flag set to indicate DNSSEC validation.
   - Question section: MUST contain a single question for `_veraid.<domain>/TXT`.
   - Answer section: MUST contain the RRset for `_veraid.<domain>/TXT` and its associated RRSIG records.
   - Authority section: MUST be empty.
   - Additional section: MUST contain all other records necessary for DNSSEC validation, excluding the root zone DS records (which verifiers MUST provide).

The serialised chain is encoded as an ASN.1 SET OF OCTET STRING, where each OCTET STRING contains a complete DNS message contributing to the validation chain.

```asn1
DnssecChain ::= SET OF OCTET STRING
```

Implementations MUST include all necessary DNSKEY, DS, and RRSIG records required for validating the chain. The serialisation SHOULD be optimised to minimise redundancy and size while ensuring completeness for offline validation.

### 3.4. TTL Considerations

TTL (Time-to-Live) values play a crucial role in determining the validity period of VeraId signatures. The protocol establishes the following requirements:

1. Service designers MUST specify a maximum TTL for signatures in their service, which MUST be:
   - At least 8 hours (28,800 seconds), to allow sufficient time for certificate renewal during outages.
   - At most 30 days (2,592,000 seconds), to support offline, delay-tolerant networking scenarios.
2. The age of a digital signature MUST be calculated from the time when the DNSSEC answer for the `_veraid.<domain>` TXT record was signed.
3. The TTL override value in the VeraId TXT record represents the maximum validity period for signatures, counted from the DNSSEC signing time.
4. Verifiers MAY enforce a TTL shorter than that required by the service, but not shorter than the 8-hour minimum.
5. Verifiers MAY allow their end users to specify a shorter TTL (but still not shorter than 8 hours) than the one in the TXT record.

VeraId favours short-lived certificates over revocation mechanisms to simplify the protocol and eliminate dependencies on online revocation checking. Service designers SHOULD specify the shortest TTL that satisfies their specific requirements.

## 4. Cryptographic Foundation

### 4.1. Supported Algorithms

VeraId relies on established cryptographic algorithms to ensure security and interoperability. The protocol defines the following supported algorithms:

1. **Hashing Algorithms:**
   - SHA-256: Recommended for general use.
   - SHA-384: Recommended for higher security applications.
   - SHA-512: Recommended for highest security applications.
2. **Digital Signature Algorithms:**
   - RSA-PSS with modulus 2048 bits: Minimum acceptable security level.
   - RSA-PSS with modulus 3072 bits: Recommended for general use.
   - RSA-PSS with modulus 4096 bits: Recommended for high-security applications.

All compliant implementations MUST support these algorithms. The choice of algorithm strength should be appropriate for the security requirements of the application.

For RSA-PSS signatures:

- RSA-2048 MUST use SHA-256 for both key identification and signature operations.
- RSA-3072 MUST use SHA-384 for both key identification and signature operations.
- RSA-4096 MUST use SHA-512 for both key identification and signature operations.

Future versions of the protocol MAY introduce additional algorithms, but this V1 specification intentionally limits the supported algorithms to those with well-established security properties and widespread implementation support.

### 4.2. Key Management

Proper key management is essential for the security of the VeraId protocol. The following requirements apply:

1. **Key Generation:**
   - Keys MUST be generated using a cryptographically secure random number generator.
   - RSA key generation MUST follow industry best practices for prime generation and testing.
   - The minimum modulus size for RSA keys is 2048 bits.
2. **Key Storage:**
   - Private keys MUST be protected from unauthorised access.
   - Organisation private keys SHOULD be stored with the highest level of protection available, preferably in hardware security modules (HSMs).
   - Member private keys SHOULD be protected with appropriate measures, such as operating system security mechanisms or hardware tokens.
3. **Key Rotation:**
   - Organisations SHOULD establish a regular schedule for rotating their keys.
   - Key rotation SHOULD be performed by generating a new key pair and updating the VeraId TXT record.
   - During key rotation, organisations SHOULD maintain both the old and new keys in DNS for a transition period, allowing for graceful migration.
   - Member certificates issued under the old key remain valid until their expiration but SHOULD be renewed under the new key when practical.
4. **Key Compromise:**
   - In the event of a key compromise, immediate rotation is REQUIRED.
   - The compromised key's TXT record SHOULD be removed as soon as possible.
   - Short certificate lifetimes help mitigate the impact of key compromises.

Implementations SHOULD provide guidance and tools to assist with secure key management practices appropriate to the security requirements of the organisation.

### 4.3. Certificate Structure

VeraId uses X.509 certificates with specific requirements for organisations and members. All certificates MUST comply with the X.509v3 standard (RFC 5280).

#### Organisation Certificate Profile:

1. **Version:** MUST be v3 (value = 2).
2. **Subject:** CommonName (CN) MUST contain the organisation's domain name.
3. **Issuer:** MUST be identical to the Subject (self-issued).
4. **Validity:**
   - SHOULD be appropriate for the organisation's key rotation policy.
   - SHOULD NOT exceed 1 year.
5. **Subject Public Key Info:**
   - Algorithm: rsaEncryption.
   - Key size: 2048, 3072, or 4096 bits.
6. **Extensions:**
   - Basic Constraints:
     - MUST be present and marked critical.
     - CA flag MUST be TRUE.
     - Path length constraint MAY be present.
   - Subject Key Identifier: MUST be present.
   - Authority Key Identifier: MUST be present and match the Subject Key Identifier.

#### Member Certificate Profile:

1. **Version:** MUST be v3 (value = 2).
2. **Subject:**
   - CommonName (CN):
     - For users: MUST contain the username.
     - For bots: MUST be the at sign (`@`).
3. **Issuer:**
   - MUST match the Subject of the issuing organisation certificate.
4. **Validity:**
   - SHOULD be short-lived, preferably not exceeding 30 days.
   - MUST NOT be longer than the validity period of the issuing organisation certificate.
5. **Subject Public Key Info:**
   - Algorithm: rsaEncryption.
   - Key size: 2048, 3072, or 4096 bits.
6. **Extensions:**
   - Basic Constraints:
     - MUST be present and marked critical.
     - CA flag MUST be FALSE.
   - Subject Key Identifier: MUST be present.
   - Authority Key Identifier: MUST be present and match the Subject Key Identifier of the issuing certificate.

Certificates MUST NOT include extensions not specified in this profile without careful consideration of their security implications.

### 4.4. Signature Format

VeraId signatures use the Cryptographic Message Syntax (CMS) as defined in RFC 5652, with specific requirements for the VeraId protocol:

1. **SignedData Structure:**
   - The content type MUST be id-data (1.2.840.113549.1.7.1).
   - The version MUST be 3.
   - The digestAlgorithms set MUST include the algorithm used for signing.
   - The encapContentInfo content field MAY be absent for detached signatures.
2. **Signer Info:**
   - For member signatures, the SignerInfo structure MUST include the signer's certificate.
   - For organisation signatures, the signer's certificate MAY be included if it differs from the organisation certificate in the signature bundle.
   - Both signature types MAY include intermediate certificates if the signer's certificate is issued through a certification path from the organisation certificate.
   - The digest algorithm MUST match the key strength (SHA-256 for RSA-2048, etc.).
   - The signature algorithm MUST be RSA-PSS.
3. **Signed Attributes:**
   - MUST include the content type attribute (1.2.840.113549.1.9.3).
   - MUST include the message digest attribute (1.2.840.113549.1.9.4).
   - MUST include the VeraId signature metadata attribute (`1.3.6.1.4.1.58708.1.0`) containing:
     - Service OID: The OID of the service for which the signature is valid.
     - Validity period: The start and end dates for signature validity.
   - For organisation signatures, MUST include the VeraId member attribution attribute (`1.3.6.1.4.1.58708.1.2`) containing:
     - A UTF8String identifying the member to whom the organisation attributes the content.
4. **Certificate Chain:**
   - For member signatures, MUST include the member's certificate.
   - For organisation signatures where the signer is not the organisation itself (e.g., a delegated signer), MUST include the signer's certificate.
   - MAY include intermediate certificates if applicable.
   - MUST NOT include the organisation certificate from the signature bundle.

The VeraId signature metadata is encoded as an ASN.1 structure and is defined in section 7.3.

## 5. Identity Model

### 5.1. Organisations

In the VeraId protocol, an organisation is represented by a domain name and serves as the foundational identity unit. Organisations have full control over their VeraId implementation and member management.

Organisations MUST:

1. Own or control a domain name with properly configured DNSSEC.
2. Generate and safeguard an RSA key pair for their organisation certificate.
3. Self-issue an X.509 certificate with the domain name as the CommonName.
4. Publish a VeraId TXT record at `_veraid.<domain>` with the appropriate key information.
5. Manage the issuance and revocation of member certificates.

The organisation is the trust anchor for all certificates and signatures within its domain. No external authority can issue valid certificates for the organisation or its members.

Newly registered domains SHOULD wait at least the maximum TTL (30 days) before implementing VeraId to prevent potential attacks using DNSSEC chains from previous domain owners.

Subdomains MAY implement VeraId separately from their parent domains, provided they have their own DNSSEC configuration. Each subdomain operates as an independent organisation within the VeraId ecosystem.

### 5.2. Members

Members are entities that act on behalf of an organisation and come in two forms: users and bots.

**Users:**

- Represent individual people within an organisation.
- Identified by a username within the organisation's domain (e.g., `alice.smith@example.com`).
- Their certificates MUST have the username as the CommonName.
- Usernames MUST comply with the naming restrictions specified in section 5.3.

**Bots:**

- Represent automated processes acting on behalf of the organisation as a whole.
- Identified by the organisation's domain name (e.g., `example.com`).
- Their certificates MUST have the at sign (`@`) as the CommonName.
- Internally, organisations MAY assign private identifiers to bots for management purposes, but these identifiers MUST NOT be included in certificates.

Members are issued certificates by their organisation, which authorises them to produce signatures on behalf of the organisation. These certificates bind the member identity to a public key and may include additional restrictions on their use.

The protocol makes a clear distinction between users (who represent individuals) and bots (which represent the organisation itself), reflected in both the certificate structure and the resulting signature verification output.

### 5.3. Naming Conventions and Restrictions

VeraId imposes specific restrictions on member names to prevent phishing attacks and ensure consistent processing across implementations:

1. **User Names:**
   - MUST NOT contain at signs (`@`).
   - MUST NOT contain whitespace characters other than simple spaces (e.g., no tabs, newlines, carriage returns).
   - SHOULD be chosen to avoid visual confusion with other usernames.
   - SHOULD use consistent case and normalisation forms.
2. **Display Considerations:**
   - User interfaces SHOULD NOT truncate usernames or domain names.
   - Implementations SHOULD display member identifiers in full to avoid confusion.
   - Implementations SHOULD highlight or visually distinguish the domain portion of identifiers.
3. **Homographic Attack Prevention:**
   - Implementations SHOULD implement mitigations against homographic attacks.
   - Domain names SHOULD be displayed using Punycode when they contain non-ASCII characters.
   - Implementations MAY refuse to process signatures from domains with mixed scripts.
4. **Bot Names:**
   - MUST use the at sign (`@`) as the CommonName in certificates.
   - When displaying bot identities, implementations SHOULD clearly indicate they represent the organisation rather than an individual.

Organisations SHOULD establish and enforce consistent naming policies for their users to maintain clarity and prevent confusion.

## 6. Certificate Management

### 6.1. Organisation Certificate Issuance

Organisation certificates form the foundation of the VeraId trust model and MUST be self-issued by the organisation.

The process for issuing an organisation certificate is as follows:

1. The organisation generates an RSA key pair with a modulus of 2048, 3072, or 4096 bits.
2. The organisation creates a self-signed X.509 certificate with the following characteristics:
   - Subject and Issuer fields both containing the organisation's domain name as CommonName.
   - A validity period appropriate for the organisation's security policy.
   - The Basic Constraints extension with the CA flag set to TRUE.
   - Subject Key Identifier and Authority Key Identifier extensions.
3. The organisation calculates the appropriate key identifier as specified in the VeraId TXT Record Format (section 3.2).
4. The organisation publishes a VeraId TXT record at `_veraid.<domain>` containing the key algorithm, key ID type, key ID, TTL override, and optional service OID.
5. The organisation ensures that DNSSEC is properly configured and that the TXT record is signed.

The organisation certificate SHOULD be created with appropriate key management procedures, ideally using hardware security modules or similar protection mechanisms for the private key.

Organisations MAY issue multiple organisation certificates with different keys for different purposes or for key rotation, publishing corresponding TXT records for each.

### 6.2. Member Certificate Issuance

Member certificates authorise specific members (users or bots) to produce signatures on behalf of the organisation.

The process for issuing a member certificate is as follows:

1. The member generates an RSA key pair with a modulus of 2048, 3072, or 4096 bits.
2. The member provides the public key to the organisation's certificate issuance system.
3. The organisation verifies the member's identity according to its internal policies.
4. The organisation issues an X.509 certificate with the following characteristics:
   - Subject CommonName containing the member's username (for users) or the at sign (`@`) (for bots).
   - Issuer matching the Subject of the organisation certificate.
   - A validity period appropriate for the member type and service requirements.
   - The Basic Constraints extension with the CA flag set to FALSE.
   - Subject Key Identifier extension.
   - Authority Key Identifier matching the Subject Key Identifier of the organisation certificate.
5. The organisation delivers the certificate to the member through a secure channel.

Organisations SHOULD implement appropriate authorisation checks and approval workflows before issuing member certificates.

Service-specific extensions MAY be included in member certificates to restrict their use to specific contexts or applications.

### 6.3. Certificate Validity Periods

VeraId favours short-lived certificates over complex revocation mechanisms. The following guidelines apply to certificate validity periods:

1. **Organisation Certificates:**
   - SHOULD have a validity period aligned with the organisation's key management policy.
   - SHOULD NOT exceed 1 year.
   - MAY be shorter if the organisation implements frequent key rotation.
2. **Member Certificates:**
   - SHOULD be short-lived, with validity periods of 30 days or less.
   - MUST NOT exceed the validity period of the issuing organisation certificate.
   - MAY be as short as a few hours for high-security applications.
   - SHOULD balance security requirements with operational concerns about renewal frequency.
3. **Validity Period Intersection:**
   - For signature verification, the validity period is the intersection of:
     - The organisation certificate validity period.
     - The member certificate validity period.
     - The signature metadata validity period.
     - The DNSSEC record validity period (as determined by the TTL override).
   - Signatures are only valid when the verification time falls within this intersection.

Short certificate lifetimes provide natural revocation through expiration, reducing the complexity of the protocol and eliminating dependencies on online revocation checking mechanisms.

### 6.4. Certificate Revocation

VeraId primarily relies on short-lived certificates to manage certificate lifecycle, but situations may arise where explicit revocation is necessary.

1. **Organisation Certificates:**
   - Revocation is achieved by removing or updating the VeraId TXT record.
   - Old signatures using the revoked certificate will no longer verify once the DNSSEC chain is refreshed.
   - In case of key compromise, immediate removal of the TXT record is essential.
2. **Member Certificates:**
   - The primary revocation mechanism is natural expiration.
   - For urgent revocation, organisations SHOULD maintain internal revocation lists.
   - Implementations MAY provide additional revocation mechanisms appropriate to their specific needs.
3. **Revocation Checking:**
   - The VeraId protocol does not require online revocation checking.
   - Implementations MAY implement additional revocation checking mechanisms.
   - Any additional revocation mechanisms SHOULD be designed to work in offline scenarios.

The reliance on short-lived certificates significantly reduces the impact of key compromise and the need for complex revocation infrastructures. Organisations SHOULD issue member certificates with the shortest practical validity periods for their use cases.

## 7. Signature Production and Verification

### 7.1. Member ID Bundle

The Member ID Bundle is a self-contained package that provides all the information needed for a member to produce verifiable signatures. It is serialised using ASN.1 DER encoding with the following structure:

```asn1
MemberIdBundle ::= SEQUENCE {
    version                  [0] INTEGER DEFAULT 0,
    dnssecChain              [1] DnssecChain,
    organisationCertificate  [2] Certificate,
    memberCertificate        [3] Certificate
}
```

Where:

- `version` is the format version (currently 0).
- `dnssecChain` contains the serialised DNSSEC chain proving the authenticity of the organisation's VeraId TXT record.
- `organisationCertificate` is the organisation's self-issued X.509 certificate.
- `memberCertificate` is the X.509 certificate issued to the member by the organisation.

The Member ID Bundle links the member to their organisation and provides all the cryptographic material needed to verify this relationship. It serves as a precursor to signature production and is typically distributed to members by their organisation's certificate management system.

Member ID Bundles are not inherently confidential, as they contain only public information, but their integrity is critical for secure signature production.

### 7.2. Signature Bundle

The Signature Bundle is the core artefact of the VeraId protocol, containing a digital signature and all the information needed to verify it offline. It is serialised using ASN.1 DER encoding with the following structure:

```asn1
SignatureBundle ::= SEQUENCE {
    version                  [0] INTEGER DEFAULT 0,
    dnssecChain              [1] DnssecChain,
    organisationCertificate  [2] Certificate,
    signature                [3] ContentInfo
}
```

Where:

- `version` is the format version (currently 0).
- `dnssecChain` contains the serialised DNSSEC chain proving the authenticity of the organisation's VeraId TXT record.
- `organisationCertificate` is the organisation's self-issued X.509 certificate.
- `signature` is a CMS `ContentInfo` containing a `SignedData` structure.

VeraId supports two types of signature bundles, which share the same structure but differ in their content and verification process:

1. **Member signatures:** The `SignedData` structure contains:
   - The member certificate (and any intermediate certificates if applicable).
   - The digital signature over the content, produced using the member's private key.
   - Signature attributes, including the VeraId signature metadata.
   - Optionally, the signed content itself (for encapsulated signatures).
2. **Organisation signatures:** The `SignedData` structure contains:
   - The digital signature over the content, produced using the organisation's private key.
   - Signature attributes, including the VeraId signature metadata.
   - The member attribution attribute identifying the member who authored the content.
   - Optionally, intermediate certificates if the organisation uses a certification path.
   - Optionally, the signed content itself (for encapsulated signatures).

The signature type is determined by the presence of the member attribution attribute: if present, it's an organisation signature; if absent, it's a member signature.

For detached signatures, the plaintext content must be provided separately during verification.

The Signature Bundle is self-contained and provides all the information needed for offline verification of the signature, without requiring any network lookups or external data sources.

### 7.3. Signature Metadata

Each VeraId signature includes metadata that binds it to a specific service and validity period. This metadata is included as a signed attribute in the CMS `SignedData` structure, ensuring it cannot be modified without invalidating the signature.

The signature metadata is encoded as an ASN.1 structure:

```asn1
SignatureMetadata ::= SEQUENCE {
    serviceOid      [0] OBJECT IDENTIFIER,
    validityPeriod  [1] DatePeriod
}

DatePeriod ::= SEQUENCE {
    start  [0] GeneralizedTime,
    end    [1] GeneralizedTime
}
```

Where:

- `serviceOid` is the Object Identifier of the service for which the signature is valid.
- `validityPeriod` specifies the time period during which the signature is considered valid.

The signature metadata serves several key purposes:

1. **Service binding:** Prevents signatures created for one service from being reused in another context.
2. **Temporal scoping:** Allows signers to limit the validity period of signatures independent of certificate lifetimes.
3. **Freshness indication:** Provides verifiers with information about when the signature was created.

Verifiers MUST check that the signature metadata's service OID matches the expected service and that the verification time falls within the specified validity period.

The validity period in the signature metadata is intersected with the validity periods of certificates and DNSSEC records to determine the overall validity period of the signature.

### 7.4. Verification Process

The verification of a VeraId signature involves multiple steps that validate the entire chain of trust from the DNSSEC infrastructure to the signature itself. Implementations MUST perform the following verification steps:

1. **Parse the Signature Bundle:**
   - Extract the DNSSEC chain, organisation certificate, and CMS signature.
   - Validate the structure of each component.
2. **Validate the DNSSEC chain:**
   - Verify that the chain starts from a trusted DNSSEC anchor.
   - Verify all DNSSEC signatures in the chain.
   - Confirm that the chain leads to the `_veraid.<domain>` TXT record.
   - Extract the organisation's public key information from the TXT record.
3. **Validate the organisation certificate:**
   - Verify that the certificate's public key matches the key identified in the TXT record.
   - Verify that the certificate's CommonName matches the domain name.
   - Confirm that the certificate is self-signed and valid.
   - Check that the certificate has the CA flag set in the Basic Constraints extension.
4. **Determine the signature type:**
   - Extract the signed attributes from the CMS `SignedData` structure.
   - Check for the presence of the member attribution attribute (`1.3.6.1.4.1.58708.1.2`).
   - If the member attribution attribute is present, it is an organisation signature.
   - If the member attribution attribute is absent, it is a member signature.
5. **Extract and validate certificates:**
   - Extract the organisation certificate from the signature bundle.
   - Extract the signer's certificate from the CMS `SignedData` structure if present.
     - For member signatures, the signer's certificate MUST be present.
     - For organisation signatures, the signer's certificate MAY be present if it differs from the organisation certificate.
   - Construct and validate the certification path:
     - The path starts with the organisation certificate from the signature bundle.
     - The path ends with the signer's certificate (which may be the organisation certificate itself for organisation signatures).
     - Any intermediate certificates in the `SignedData` structure MUST be included in the path.
   - Verify that all certificates in the path are valid at the verification time.
6. **Validate the signature metadata:**
   - Extract the service OID and validity period from the signature metadata attribute.
   - Verify that the service OID matches the expected service.
   - Confirm that the verification time falls within the signature validity period.
7. **Determine the overall validity period:**
   - Calculate the intersection of:
     - The validity periods of all certificates in the certification path, from the organisation certificate to the signer's certificate (if different).
     - The signature metadata validity period.
     - The DNSSEC record validity period (using the TTL override).
   - Verify that the verification time falls within this intersection.
8. **Verify the digital signature:**
   - Use the signer's public key to verify the signature over the content.
   - For detached signatures, use the externally provided content.
   - For encapsulated signatures, extract the content from the CMS structure.
9. **Produce verification output:**
   - Always include the organisation name.
   - Include the member name (for users only, not for bots):
     - For member signatures, from the signer certificate.
     - For organisation signatures, from the member attribution.
   - Always include the signature type (member or organisation).

If all these steps succeed, the signature is considered valid, and the content is confirmed to originate from the identified member of the specified organisation or from the organisation itself.

The verification process MUST be performed in full, without skipping any steps, to ensure the security properties of the VeraId protocol.

### 7.5. Member Attribution

For organisation signatures, a required signed attribute is included in the CMS `SignedData` structure to attribute the content to a specific member:

```asn1
MemberAttribution ::= UTF8String
```

The member attribution attribute (`1.3.6.1.4.1.58708.1.2`) serves the following purposes:

1. **Content authorship:** Indicates which member authored the content, even when the organisation signs directly.
2. **Operational flexibility:** Allows organisations to produce signatures on behalf of members without requiring certificate management for ephemeral members.
3. **Accountability:** Maintains a record of which member is responsible for the content, even when using organisation signatures.
4. **Signature type identification:** Enables reliable determination of the signature type during verification.

The member attribution value MUST conform to the same naming conventions defined for member names in section 5.3. For users, this is the username; for bots, this is the at sign (`@`).

Member attribution is a claim made by the organisation, not cryptographically proven by the member. Verifiers MUST present this distinction clearly to end users.

## 8. Service Integration

### 8.1. Service OIDs

VeraId uses Object Identifiers (OIDs) to uniquely identify services and applications that use the protocol. Service OIDs serve as namespaces that prevent signature reuse across different contexts.

1. **OID Structure:**
   - The VeraId root OID is `1.3.6.1.4.1.58708.1`.
   - Official service OIDs MUST be allocated under this root.
   - For example, the test service OID is `1.3.6.1.4.1.58708.1.1`.
2. **OID Allocation:**
   - Service designers MUST obtain a unique OID for their service.
   - Third-party services MUST use OIDs from their own namespace.
   - The VeraId OID arc is reserved exclusively for official services under the VeraId project umbrella.
3. **OID Usage:**
   - The service OID MUST be included in the signature metadata.
   - Verifiers MUST check that the OID in the signature matches the expected service.
   - VeraId TXT records MAY specify a service OID to restrict key usage.
4. **Versioning:**
   - Service designers SHOULD include version information in their OID structure.
   - Major protocol changes SHOULD use a new OID.
   - Minor, backward-compatible changes MAY use the same OID.

Service OIDs ensure that signatures created for one service cannot be repurposed for another, even if all other aspects of the signature are valid. This provides important namespace isolation and prevents cross-service attacks.

### 8.2. Service-Specific Validation Rules

Services using VeraId MAY define additional validation rules beyond the core protocol requirements. These rules allow services to implement domain-specific security policies.

1. **TTL Constraints:**
   - Services MUST specify a maximum TTL for signatures.
   - The TTL MUST be within the range of 8 hours to 30 days.
   - Services SHOULD choose the shortest TTL that meets their requirements.
2. **Content Type Restrictions:**
   - Services MAY restrict the types of content that can be signed.
   - Content type restrictions SHOULD be documented in the service specification.
   - Verifiers SHOULD check content type compliance during verification.
3. **Member Type Restrictions:**
   - Services MAY restrict which member types can produce valid signatures.
   - For example, a service might only accept signatures from users (not bots).
   - Such restrictions SHOULD be enforced during verification.
4. **Certificate Extensions:**
   - Services MAY define custom certificate extensions for additional authorisation.
   - Such extensions SHOULD be clearly documented.
   - Verifiers MUST check for and validate any required extensions.

Service designers SHOULD document their validation rules comprehensively to ensure consistent implementation across different verifiers. These rules SHOULD be designed to maintain the security properties of the VeraId protocol while addressing service-specific requirements.

### 8.3. Implementation Guidelines

Service developers integrating VeraId should adhere to the following guidelines to ensure secure and consistent implementation:

1. **User Interface Considerations:**
   - Clearly display the full member identifier (username and domain).
   - Visually distinguish between user and bot signatures.
   - Indicate when signatures are expired or otherwise invalid.
   - Avoid truncating or eliding parts of member identifiers.
2. **Error Handling:**
   - Provide clear, actionable error messages for verification failures.
   - Distinguish between different types of validation errors.
   - Log detailed information about verification failures for debugging.
   - Never fall back to less secure verification methods on failure.
3. **Integration Patterns:**
   - Separate signature verification from application logic.
   - Implement verification as a self-contained module or library.
   - Use dependency injection to allow for testing and component replacement.
   - Consider signature verification as a security boundary in the application.
4. **Performance Optimisations:**
   - Cache verification results when appropriate (respecting validity periods).
   - Implement efficient ASN.1 parsing routines.
   - Consider performance implications of cryptographic operations.
   - Balance security requirements with resource constraints.
5. **Testing:**
   - Test with a variety of valid and invalid signatures.
   - Include edge cases in test scenarios.
   - Verify correct handling of expired certificates.
   - Test with different key sizes and algorithms.
   - Ensure verification fails as expected with tampered data.

These guidelines help ensure that VeraId integrations provide consistent security properties and user experience across different implementations and platforms.

## 9. Security Considerations

### 9.1. DNSSEC Dependency

VeraId's security model relies fundamentally on DNSSEC, which introduces specific security considerations:

1. **Trust Anchors:**
   - The VeraId protocol inherits trust from the DNSSEC root zone.
   - Compromise of the root KSK would undermine the entire system.
   - Implementations MUST securely manage and update DNSSEC trust anchors.
2. **TLD Control:**
   - Many TLDs are controlled by governments or private entities.
   - A malicious TLD operator could theoretically issue fraudulent DNSSEC responses.
   - Organisations SHOULD consider the governance of their TLD when assessing security.
3. **DNSSEC Implementation Vulnerabilities:**
   - Flaws in DNSSEC implementations could affect VeraId security.
   - Implementations SHOULD use well-tested, actively maintained DNSSEC libraries.
   - Security updates for DNSSEC components SHOULD be promptly applied.
4. **DNSSEC Adoption:**
   - Not all domains support DNSSEC, limiting VeraId adoption.
   - DNSSEC misconfiguration can lead to verification failures.
   - Organisations MUST properly maintain their DNSSEC configuration.
5. **Key Rollovers:**
   - DNSSEC key rollovers at any level can temporarily affect verification.
   - Organisations SHOULD follow best practices for DNSSEC key management.
   - Implementations SHOULD handle temporary DNSSEC validation failures gracefully.

Whilst these dependencies introduce potential vulnerabilities, the distributed nature of DNS provides significant security advantages compared to centralised PKI models, particularly for offline verification scenarios.

### 9.2. Homographic and Character Encoding Attacks

User-friendly identifiers like domain names and usernames are susceptible to visual spoofing attacks:

1. **Homographic Attacks:**
   - Different Unicode characters that appear visually similar can be used for spoofing.
   - For example, Cyrillic "о" (U+043E) looks similar to Latin "o" (U+006F).
   - Implementations SHOULD detect and warn about mixed-script identifiers.
   - User interfaces SHOULD display domain names in Punycode when they contain non-ASCII characters.
2. **Normalisation Issues:**
   - Different Unicode normalisation forms can represent the same visual character.
   - Implementations SHOULD normalise identifiers before display or comparison.
   - The preferred normalisation form is NFC (Normalization Form C).
3. **Bidirectional Text:**
   - Bidirectional text can be manipulated to hide or reorder parts of identifiers.
   - Implementations SHOULD apply the Unicode Bidirectional Algorithm correctly.
   - User interfaces SHOULD clearly indicate reading direction for identifiers.
4. **Display Guidelines:**
   - User interfaces MUST NOT truncate usernames, domain names, or identifiers.
   - Identifiers SHOULD be displayed with a distinct font or style.
   - Domain and username portions SHOULD be visually differentiated.
   - Implementations SHOULD consider using visual security indicators.

These attacks primarily affect human perception rather than cryptographic verification. Proper implementation of user interfaces is critical to help users correctly identify the source of signed content.

### 9.3. Domain Ownership Changes

Domain transfers present specific security challenges for the VeraId protocol:

1. **Waiting Period:**
   - Organisations SHOULD delay implementing VeraId until at least the maximum TTL (30 days) has elapsed since the domain was registered or acquired.
   - This prevents the DNSSEC chain from the previous owner from remaining valid.
2. **Signature Validity After Transfer:**
   - Signatures created before a domain transfer remain cryptographically valid.
   - Verifiers MAY implement additional checks for recent domain transfers.
   - Service policies SHOULD address the handling of signatures across ownership changes.
3. **Domain Expiration:**
   - Expired domains can be registered by new owners.
   - Verifiers SHOULD consider domain registration date when processing signatures.
   - Signatures SHOULD NOT be trusted if the domain has changed hands since issuance.
4. **Subdomain Delegation:**
   - Changes in subdomain delegation may affect VeraId verification.
   - Organisations SHOULD carefully manage subdomain delegation.
   - Signature verification considers the state of delegations at verification time.

Domain ownership changes represent a fundamental challenge to any domain-based authentication system. VeraId's approach of using short-lived certificates and signatures helps mitigate these risks by limiting the time window during which historical signatures remain valid.

### 9.4. Offline Verification Limitations

Offline verification introduces specific security considerations:

1. **Time Synchronisation:**
   - Accurate verification requires correct system time.
   - Devices with incorrect clocks may incorrectly validate expired signatures.
   - Implementations SHOULD check for obviously incorrect system time.
   - Critical applications SHOULD use external time sources when available.
2. **Replay Attacks:**
   - Valid signatures can be replayed beyond their intended context.
   - Services SHOULD implement additional measures (e.g., nonces) for replay-sensitive operations.
   - Signature metadata SHOULD include context-specific information when appropriate.
3. **Revocation Limitations:**
   - Offline verification cannot check real-time revocation status.
   - The protocol relies on short validity periods rather than revocation checking.
   - In high-security contexts, verification SHOULD go online when possible to check current status.
4. **Freshness Guarantees:**
   - Offline verification can only guarantee that a signature was valid at some point.
   - Applications requiring strong freshness guarantees SHOULD use additional mechanisms.
   - The signature validity period provides some time-bounding guarantees.
5. **Network Partition Attacks:**
   - Adversaries may attempt to prevent devices from going online to check current status.
   - Applications SHOULD track and report extended offline periods.
   - Critical operations MAY require periodic online connectivity.

These limitations are inherent to any offline verification system and reflect fundamental tradeoffs between availability and security. VeraId provides a balanced approach that offers strong verification guarantees whilst supporting offline operation.

### 9.5. Organisation Signatures and Member Attribution

Organisation signatures with member attribution introduce specific security considerations that implementers and developers should be aware of:

1. **Trust Model Shift:**
   - Member signatures provide cryptographic proof that a specific member created the content, with the member's private key directly signing the content.
   - Organisation signatures with member attribution provide only a claim by the organisation about which member authored the content, without cryptographic proof from the member.
   - This distinction represents a fundamental shift in the trust model from cryptographic verification to organisational attestation.
2. **Potential for Misattribution:**
   - Organisations have the technical ability to attribute content to any member, whether or not that member actually created the content.
   - Malicious or compromised organisations could falsely attribute content to members who did not create it.
   - This risk is mitigated by the fact that the organisation must still sign the content with its private key, creating an auditable record of the attribution.
3. **Accountability Considerations:**
   - Member signatures create direct cryptographic accountability for the member.
   - Organisation signatures shift accountability to the organisation, even when content is attributed to a specific member.
   - Legal and regulatory frameworks may treat these different types of signatures differently with respect to non-repudiation and liability.
4. **Operational Security:**
   - Organisation signatures require access to the organisation's private key, which should be more tightly controlled than member private keys.
   - Organisations should implement strict access controls and audit mechanisms for the use of organisation signatures, particularly when attributing content to members.
   - The use of certification paths in organisation signatures introduces additional complexity and potential security vulnerabilities.
5. **Verification Presentation:**
   - Verification interfaces MUST clearly distinguish between cryptographically proven member signatures and organisation signatures with member attribution.
   - End users of applications implementing VeraId may need to be informed about the different trust implications of these signature types.
   - Implementations SHOULD use distinct visual indicators or terminology to prevent confusion between the two signature types.

To mitigate these risks, developers integrating VeraId SHOULD:

- Prefer member signatures over organisation signatures when practical.
- Limit the use of organisation signatures to specific use cases where certificate management for members is impractical.
- Implement strong audit logging for all organisation signatures, especially those with member attribution.
- Clearly communicate the distinction between signature types to end users.
- Consider implementing additional verification steps for organisation signatures with member attribution in high-security contexts.

## 10. Implementation Guidance

### 10.1. Reference Implementations

Reference implementations of the VeraId protocol are available to assist developers in creating compliant and interoperable systems:

1. **Core Libraries:**

   - [JavaScript/TypeScript (`@relaycorp/veraid`)](https://github.com/relaycorp/veraid-js).
   - [Kotlin/JVM (`tech.relaycorp:veraid`)](https://github.com/relaycorp/veraid-jvm).

2. **Related Tools:**
   - [VeraId Authority](https://github.com/relaycorp/veraid-authority): Server for managing organisations and members.
   - [VeraId Authority Client](https://github.com/relaycorp/veraid-authority-js): JavaScript client library for interacting with VeraId Authority.

The reference implementations serve as definitive interpretations of this specification. Where ambiguities exist in the specification, the behaviour of the reference implementations should be considered normative.

Implementations MUST:

- Follow all requirements in this specification.
- Pass all tests in the test suite of the reference implementation.
- Handle all defined error conditions appropriately.
- Maintain backward compatibility with the reference implementation.

Implementers are encouraged to contribute improvements and clarifications back to the reference implementations and this specification.

### 10.2. Interoperability Considerations

To ensure interoperability between different VeraId implementations:

1. **Strict Validation:**
   - Implementations MUST strictly validate all inputs.
   - Implementations MUST reject malformed data rather than attempting to repair it.
   - ASN.1 parsing MUST be strict and reject any non-conformant encodings.
2. **Format Compatibility:**
   - Implementations MUST correctly handle all ASN.1 DER encoding rules.
   - Implementations MUST handle BER-encoded ASN.1 if the encoding is also valid DER.
   - X.509 extensions MUST be encoded correctly.
3. **Character Encoding:**
   - Implementations MUST handle UTF-8 encoded strings correctly.
   - Domain names SHOULD be handled in their ASCII form after Punycode conversion.
   - Usernames MUST be compared using case-sensitive comparison.
4. **Time Representation:**
   - Implementations SHOULD use UTC (`Z` suffix) in all `GeneralizedTime` values, including those in X.509 certificates.
   - When timezone information is absent from a `GeneralizedTime` value in any VeraId structure, implementations MUST interpret it as UTC.
   - Implementations MUST correctly handle and compare `GeneralizedTime` values with different timezone representations.
5. **Algorithm Support:**
   - Implementations MUST support all mandatory cryptographic algorithms.
   - Implementations MAY support additional algorithms for future compatibility.
   - Implementations MUST reject signatures using unsupported algorithms.
6. **Version Handling:**
   - Implementations MUST check version fields in all structures.
   - Implementations MUST reject structures with unsupported versions.
   - Implementations SHOULD be designed to accommodate future versions.

Regular interoperability testing between different implementations is recommended to ensure ongoing compatibility.

### 10.3. Performance Optimisations

VeraId implementations can benefit from several performance optimisations whilst maintaining security:

1. **Caching Strategies:**
   - Cache parsed certificates and DNSSEC chains to avoid repeated parsing.
   - Cache verification results for the duration of their validity.
   - Use LRU (Least Recently Used) or similar algorithms for cache management.
   - Ensure cache entries are invalidated when they expire.
2. **Size Optimisations:**
   - Minimise the size of DNSSEC chains by removing redundant records.
   - Use the minimum required set of certificates in signature bundles.
   - Consider compression for storage or transmission (whilst maintaining original formats for cryptographic operations).
3. **Computational Efficiency:**
   - Use efficient ASN.1 parsing libraries.
   - Implement lazy parsing for large structures.
   - Consider hardware acceleration for cryptographic operations when available.
   - Batch operations when processing multiple signatures.
4. **Memory Management:**
   - Implement streaming processing for large documents.
   - Avoid keeping entire documents in memory when possible.
   - Free resources promptly after use.
   - Consider memory constraints on resource-limited devices.
5. **Parallel Processing:**
   - Parallelise independent verification steps when possible.
   - Consider using worker threads for CPU-intensive operations.
   - Balance parallelisation benefits against overhead costs.

These optimisations MUST NOT compromise security or correctness. Performance-critical applications SHOULD profile their verification code to identify bottlenecks and focus optimisation efforts accordingly.

### 10.4. Member vs Organisation Signatures

Developers integrating VeraId into their applications must decide whether to use member signatures or organisation signatures with member attribution. This decision should be based on the specific requirements of the application and the security considerations outlined in Section 9.5.

#### 10.4.1. Implementation Recommendations

1. **Library/SDK Design:**
   - VeraId libraries and SDKs SHOULD provide distinct functions for creating member signatures and organisation signatures.
   - Verification functions SHOULD be unified, with the signature type included in the verification output.
   - Libraries SHOULD NOT require developers to specify the signature type during verification, as this should be determined automatically from the signature bundle.
2. **Use Case Considerations:**
   - Member signatures are recommended for applications where non-repudiation at the individual level is critical.
   - Organisation signatures with member attribution are appropriate for applications where certificate management for individual members is impractical or where organisational accountability is sufficient.
3. **Hybrid Approaches:**
   - Some applications may benefit from supporting both signature types, allowing flexibility based on the specific context or user role.
   - In hybrid implementations, clear policies should govern when each signature type is used.

#### 10.4.2. User Interface Recommendations

1. **Signature Type Indication:** User interfaces SHOULD clearly indicate whether a signature is a member signature or an organisation signature with member attribution. Different visual indicators (icons, colors, labels) SHOULD be used to distinguish between the two signature types.
2. **Attribution Presentation:** For organisation signatures, interfaces SHOULD clearly indicate that the member attribution is a claim made by the organisation, not cryptographic proof. Example phrasing: `Signed by example.com on behalf of alice` rather than `Signed by alice of example.com`.
3. **Verification Details:** Interfaces SHOULD provide access to detailed verification information, including the full certification path and validity periods. Advanced users SHOULD be able to view the complete verification process and results.
4. **Error Handling:** Clear error messages SHOULD be displayed when verification fails, with appropriate guidance for users. Different error handling may be appropriate for different signature types, reflecting their distinct trust models.

## Appendices

### A. ASN.1 Schemas

The following ASN.1 schemas define the data structures used in the VeraId protocol:

```asn1
-- Top-level schemas for VeraId components

-- DNSSEC chain is a set of DNS messages
DnssecChain ::= SET OF OCTET STRING

-- Default tag defines all tags as IMPLICIT
-- Member ID Bundle
MemberIdBundle ::= SEQUENCE {
    version                  [0] INTEGER DEFAULT 0,
    dnssecChain              [1] DnssecChain,
    organisationCertificate  [2] Certificate,
    memberCertificate        [3] Certificate
}

-- Signature Bundle
SignatureBundle ::= SEQUENCE {
    version                  [0] INTEGER DEFAULT 0,
    dnssecChain              [1] DnssecChain,
    organisationCertificate  [2] Certificate,
    signature                [3] ContentInfo
}

-- Signature metadata (included as a signed attribute)
SignatureMetadata ::= SEQUENCE {
    serviceOid      [0] OBJECT IDENTIFIER,
    validityPeriod  [1] DatePeriod
}

-- Date period structure
DatePeriod ::= SEQUENCE {
    start  [0] GeneralizedTime,
    end    [1] GeneralizedTime
}

-- Member attribution (included as a signed attribute in organisation signatures)
MemberAttribution ::= UTF8String
```

All VeraId data structures MUST be encoded using ASN.1 Distinguished Encoding Rules (DER). Implementations MUST reject structures that are not valid DER.

The ASN.1 structures reference standard types from other specifications:

- Certificate is defined in X.509 (RFC 5280).
- ContentInfo is defined in CMS (RFC 5652).

All implementations MUST strictly adhere to these schemas. Any deviation in structure or encoding may result in verification failures.

### B. OID Registry

The following Object Identifiers (OIDs) are defined for use in the VeraId protocol:

1. **VeraId Base OID:**

   - `1.3.6.1.4.1.58708.1` (iso.org.dod.internet.private.enterprise.relaycorp.veraid).

2. **Protocol OIDs:**

   - `1.3.6.1.4.1.58708.1.0`: Signature Metadata Attribute.
   - `1.3.6.1.4.1.58708.1.2`: Member Attribution Attribute.

3. **Service OIDs:**
   - `1.3.6.1.4.1.58708.1.1`: Test Service.

Third-party services implementing VeraId MUST register and use their own OIDs under their own arcs. The VeraId OID arc (`1.3.6.1.4.1.58708.1`) is reserved exclusively for official services and protocol components under the VeraId project umbrella.

OID registration procedures:

1. OIDs under the VeraId base OID are managed by the VeraId maintainers and reserved for official VeraId project purposes.
2. Third parties MUST NOT use OIDs under the VeraId arc for their services.
3. Third parties without their own OID arc SHOULD obtain one from their national registration authority or through IANA's Private Enterprise Number (PEN) registry.
4. Once allocated, OIDs are never reassigned to different services.

Services SHOULD use versioning in their OID structure to manage protocol evolution. Major, incompatible changes SHOULD use a new OID, whilst minor, backward-compatible changes MAY use the same OID.
