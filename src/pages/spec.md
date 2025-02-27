---
title: "Spec"
description: "Complete technical specification for VeraId V1, including DNSSEC integration, cryptographic requirements, and digital signature implementation details"
layout: ../layouts/Page.astro
permalink: /specs/v1
---

# VeraId V1 Specification

<dl>
    <dt>Status</dt>
    <dd>Final</dd>
    <dt>Author</dt>
    <dd>Gus Narea, <a href="https://relaycorp.tech">Relaycorp</a></dd>
</dl>

## 1. Introduction

VeraId is a decentralised authentication protocol that securely attributes content to domain names. It combines DNSSEC with a new Public Key Infrastructure (PKI) to produce digital signatures that can be linked to a domain name. Every signature contains sufficient data to be independently verified without external queries, such as DNS lookups, making it suitable for offline verification scenarios.

### 1.1 Purpose

The primary purpose of VeraId is to provide a mechanism to assign customisable, user-friendly, universally-unique, offline-compatible identifiers to users and services. This enables secure attribution of content to domain names without requiring Internet connectivity at verification time.

### 1.2 Scope

This specification defines:
- The VeraId protocol architecture and components
- Certificate formats and requirements
- DNSSEC integration details
- Digital signature creation and verification processes
- Security considerations and mitigations

### 1.3 Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

Additionally, the following terms are used throughout this document:

- **Organisation**: An entity identified by a domain name (e.g., `acme.com`).
- **Organisation admin**: A person who manages the VeraId setup for an organisation.
- **Member**: A user or bot that belongs to an organisation.
- **Signer**: A member or bot that creates digital signatures.
- **Verifier**: A system that verifies digital signatures.
- **Service**: A specific context in which VeraId is used (e.g., Letro).

## 2. Protocol Overview

### 2.1 Architecture

VeraId consists of the following components:

1. **VeraId Authority**: A server that manages organisation members and issues certificates.
2. **VeraId Authority Client**: A client application used by organisation admins to interact with the Authority.
3. **VeraId Library**: Implements cryptographic and data serialisation operations.
4. **Signature Producer**: An application that creates VeraId signatures.
5. **Signature Verifier**: An application that verifies VeraId signatures.

### 2.2 Trust Model

VeraId establishes trust through DNSSEC. Any DNSSEC-enabled domain can be a trust anchor in the PKI, but it only has control over itself. This offers better security than PKIs such as Transport Layer Security (TLS), where many trust anchors (Certificate Authorities) can issue certificates for any domain.

### 2.3 Protocol Flow

The VeraId protocol operates as follows:

1. **Initial Provisioning**:
   - Organisation admin enables DNSSEC for their domain (e.g., `acme.com`).
   - Admin generates a key pair and self-issues an X.509 certificate, which serves as the root Certificate Authority (CA).
   - Admin publishes the certificate in a `TXT` record at `_vera.acme.com`.

2. **Member Authentication**:
   - Admin issues certificates to members or bots (collectively known as signers).
   - Each certificate contains a critical extension specifying its usage context.
   - Member certificates include the VeraId username in the Distinguished Name.

3. **Digital Signature Creation**:
   - Signers create a CMS `SignedData` signature, embedding their certificate and any intermediary CAs.
   - Signers include the DNSSEC chain for the `_vera.acme.com` TXT record.

4. **Digital Signature Verification**:
   - Verifiers validate the DNSSEC chain to obtain the root certificate.
   - Verifiers validate the content signature using the root certificate as the trust anchor.
   - Verifiers check that the signer's certificate is authorised for the specific service.

## 3. Certificate Requirements

### 3.1 Organisation Certificate

The organisation certificate MUST:
- Be a self-signed X.509 certificate.
- Have the domain name as the Common Name (CN) in the Subject field.
- Use one of the supported cryptographic algorithms.

### 3.2 Member Certificate

Member certificates MUST:
- Be signed by the organisation certificate or an intermediate CA.
- Include the member's username as the Common Name (CN) in the Subject field.
- Contain a critical extension specifying the service context.
- Have a validity period consistent with the service requirements.

For user certificates, the Common Name MUST be the username (e.g., `alice.smith`).
For bot certificates, the Common Name MUST be the at sign (`@`).

### 3.3 Certificate Extensions

#### 3.3.1 Service Context Extension

Each member certificate MUST include a critical extension that specifies the service context in which it can be used. The extension is identified by the OID `1.3.6.1.4.1.58708.1.1` and contains the service OID.

## 4. DNSSEC Integration

### 4.1 DNS Record Requirements

The organisation MUST have DNSSEC properly configured for its domain. The `_vera.<domain>` TXT record MUST contain the Base64-encoded, ASN.1 DER serialisation of the organisation's root certificate. Due to the 255-character limit of TXT records, this may span multiple records.

### 4.2 TXT Record Format

The TXT record contains space-separated fields:

1. **Key algorithm**: An integer denoting the key algorithm.
   - `0` (RSA 2048)
   - `1` (RSA 3072)
   - `2` (RSA 4096)

2. **Key ID type**: An integer denoting how the key is identified.
   - `0` (`ID`): The key ID is the key itself (reserved for future use)
   - `1` (`SHA256`): The key ID is the SHA-256 digest
   - `2` (`SHA384`): The key ID is the SHA-384 digest
   - `3` (`SHA512`): The key ID is the SHA-512 digest

3. **Key ID**: The Base64 (unpadded) encoding of the public key or its digest.

4. **TTL override**: A positive integer representing the number of seconds.

5. **Service** (optional): The OID for the service this chain applies to.

### 4.3 DNSSEC Chain Serialisation

The DNSSEC chain MUST be serialised as an _answer_ using the message format from [RFC 1035](https://datatracker.ietf.org/doc/html/rfc1035) (Section 4.2), where:

- Header: Contains the `ad` flag.
- Question: Is `_vera.<domain>/TXT`.
- Answer: Contains the RRset for `_vera.<domain>/TXT` (and respective `RRSIG`s).
- Authority: Is empty.
- Additional: Contains the rest of the DNSSEC chain, excluding `./DS` (which must be provided by the verifier).

## 5. Cryptographic Requirements

### 5.1 Supported Algorithms

#### 5.1.1 Hashing Algorithms
- SHA-256
- SHA-384
- SHA-512

#### 5.1.2 Digital Signature Algorithms
- RSA-PSS with modulus 2048/3072/4096

### 5.2 Key Management

Organisation admins SHOULD rotate their keys periodically. This is accomplished by generating a new key pair, issuing a new self-signed certificate, and updating the DNS TXT record.

## 6. Data Structures

### 6.1 VeraId Member ID Bundle

ASN.1 SEQUENCE:
- Version (INTEGER). `0` is the only valid value at the moment.
- DNSSEC chain (SEQUENCE).
- Organisation certificate (SEQUENCE).
- Member certificate (SEQUENCE).

### 6.2 VeraId Signature Bundle

ASN.1 SEQUENCE:
- Version (INTEGER). `0` is the only valid value at the moment.
- DNSSEC chain (SEQUENCE).
- Organisation certificate (SEQUENCE).
- SignedData (SEQUENCE) with content detached. Includes:
  - Member certificate and any intermediate certificates, but not the plaintext (content).
  - VeraId Signature Metadata in signedAttrs:
    - Service OID.
    - Validity period (SEQUENCE).
      - Start date (GeneralizedTime).
      - Expiry date (GeneralizedTime).

### 6.3 VeraId Signed Content

ASN.1 SEQUENCE:
- Content (OCTET STRING).
- Signature (SEQUENCE).

## 7. Signature Creation and Verification

### 7.1 Signature Creation

To create a VeraId signature, the signer MUST:

1. Obtain a valid member certificate for the specific service.
2. Create a CMS `SignedData` structure with:
   - The content to be signed (detached).
   - The member certificate and any intermediate certificates (excluding the root CA).
   - The VeraId Signature Metadata in the signed attributes.
3. Include the DNSSEC chain for the `_vera.<domain>` TXT record.
4. Serialise the signature bundle according to the ASN.1 format specified in section 6.2.

### 7.2 Signature Verification

To verify a VeraId signature, the verifier MUST:

1. Verify the DNSSEC chain to obtain the organisation's root certificate.
2. Verify the authenticity of the content using the `SignedData` value with the root certificate as the only trusted certificate.
3. Verify that the signer's certificate is allowed to use the current service by checking the service context extension.
4. Verify that the signature has not expired by checking the validity period in the signature metadata against the DNSSEC answer signing time.

## 8. Validity Period

Signature verifiers MUST count the age of a digital signature from the moment the `TXT` record answer was signed.

VeraId service designers MUST specify the maximum Time-to-Live (TTL) for every digital signature in the service. The TTL is counted from the moment the `TXT` record answer was signed. The TTL MUST be within the following range:

- 8 hours or more, to allow sufficient time for signature-producing apps to renew certificates.
- 30 days or less, to support Delay-Tolerant Networking.

VeraId favours short-lived certificates over long-lived ones, primarily to avoid the use of revocation protocols. Consequently, service designers SHOULD require the shortest TTL that would satisfy their particular requirements.

Signature verifiers MAY require a TTL shorter than that required by the service, but still not shorter than 8 hours. Additionally, signature verifiers MAY allow their end users to specify the shorter TTL.

## 9. Security Considerations

### 9.1 Reliance on DNSSEC Infrastructure

Every DNS zone in a VeraId chain is a potential target for cyberattacks, including the [root zone](https://www.iana.org/dnssec). Many governments control popular TLDs, so for example, the Libyan government could theoretically issue valid DNSSEC responses for `bit.ly`.

### 9.2 Homographic and Character Encoding-based Attacks

User interfaces SHOULD NOT truncate user names, domain names, or IDs, to mitigate phishing attacks. User names MUST NOT include whitespace characters other than simple spaces (e.g., `\t`, `\n`, `\r`) or at signs (`@`).

### 9.3 Newly-registered Domain Names

Organisation admins SHOULD delay using VeraId until at least the maximum TTL (90 days) has elapsed since the domain was registered (or acquired). Otherwise, the DNSSEC chain from the previous owner may still be valid.

### 9.4 Certificate Revocation

VeraId does not implement a certificate revocation mechanism. Instead, it relies on short-lived certificates. If a certificate needs to be revoked before its expiration, the organisation admin should:

1. Remove the member from the VeraId Authority.
2. Update any affected services to reject signatures from that member.

## 10. Implementation Considerations

### 10.1 Performance Optimisations

Implementations SHOULD cache verified DNSSEC chains and certificates to improve performance, especially in offline scenarios.

### 10.2 Interoperability

Implementations MUST follow the ASN.1 serialisation formats specified in this document to ensure interoperability between different implementations.

### 10.3 Error Handling

Implementations SHOULD provide detailed error information when signature verification fails, to aid in troubleshooting.

## 11. References

### 11.1 Normative References

- [RFC 1035](https://datatracker.ietf.org/doc/html/rfc1035) - Domain Names - Implementation and Specification
- [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) - Key words for use in RFCs to Indicate Requirement Levels
- [RFC 4033](https://datatracker.ietf.org/doc/html/rfc4033) - DNS Security Introduction and Requirements
- [RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280) - Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile
- [RFC 5652](https://datatracker.ietf.org/doc/html/rfc5652) - Cryptographic Message Syntax (CMS)

### 11.2 Informative References

- [VeraId JavaScript Implementation](https://github.com/relaycorp/veraid-js)
- [VeraId JVM Implementation](https://github.com/relaycorp/veraid-jvm)
- [VeraId Authority Server](https://github.com/relaycorp/veraid-authority)
- [VeraId Authority JavaScript Client](https://github.com/relaycorp/veraid-authority-js)

## Appendix A: ASN.1 Module

```asn1
VeraIdV1 DEFINITIONS ::= BEGIN

-- VeraId Member ID Bundle
MemberIdBundle ::= SEQUENCE {
    version INTEGER, -- 0 for V1
    dnssecChain OCTET STRING,
    organisationCertificate Certificate,
    memberCertificate Certificate
}

-- VeraId Signature Bundle
SignatureBundle ::= SEQUENCE {
    version INTEGER, -- 0 for V1
    dnssecChain OCTET STRING,
    organisationCertificate Certificate,
    signedData SignedData
}

-- VeraId Signature Metadata
SignatureMetadata ::= SEQUENCE {
    serviceOID OBJECT IDENTIFIER,
    validityPeriod ValidityPeriod
}

ValidityPeriod ::= SEQUENCE {
    startDate GeneralizedTime,
    expiryDate GeneralizedTime
}

-- VeraId Signed Content
SignedContent ::= SEQUENCE {
    content OCTET STRING,
    signature SignatureBundle
}

END
```

## Appendix B: Example Implementation

The following pseudocode demonstrates the basic operations for creating and verifying VeraId signatures:

```
// Create a VeraId signature
function createSignature(content, memberCertificate, privateKey, serviceOID):
    // Create signature metadata
    metadata = {
        serviceOID: serviceOID,
        validityPeriod: {
            startDate: currentTime(),
            expiryDate: currentTime() + serviceTTL
        }
    }
    
    // Create CMS SignedData
    signedData = createCMSSignedData(
        content,
        memberCertificate,
        privateKey,
        metadata
    )
    
    // Get DNSSEC chain
    domain = extractDomainFromCertificate(memberCertificate)
    dnssecChain = getDNSSECChain("_vera." + domain)
    
    // Get organisation certificate
    orgCert = extractCertificateFromDNSSEC(dnssecChain)
    
    // Create signature bundle
    signatureBundle = {
        version: 0,
        dnssecChain: dnssecChain,
        organisationCertificate: orgCert,
        signedData: signedData
    }
    
    return signatureBundle

// Verify a VeraId signature
function verifySignature(content, signatureBundle, serviceOID):
    // Verify DNSSEC chain
    if (!verifyDNSSECChain(signatureBundle.dnssecChain)):
        return false
    
    // Extract organisation certificate
    orgCert = signatureBundle.organisationCertificate
    
    // Verify certificate chain
    if (!verifyCertificateChain(signatureBundle.signedData.certificates, orgCert)):
        return false
    
    // Extract metadata
    metadata = extractSignatureMetadata(signatureBundle.signedData)
    
    // Verify service OID
    if (metadata.serviceOID != serviceOID):
        return false
    
    // Verify validity period
    dnssecSigningTime = extractSigningTime(signatureBundle.dnssecChain)
    if (dnssecSigningTime < metadata.validityPeriod.startDate ||
        dnssecSigningTime > metadata.validityPeriod.expiryDate):
        return false
    
    // Verify content signature
    return verifyCMSSignature(
        content,
        signatureBundle.signedData,
        orgCert
    )
```
