---
title: "Validator Requirements"
description: "Technical and operational requirements for StakeNet validators"
section_type: "page"
order: 10
domain: "stakenet"
---

# Validator Requirements

This page outlines the technical, operational, and financial requirements for becoming a StakeNet validator.

## Hardware Requirements

### Recommended Specifications

| Component | Requirement |
|-----------|-------------|
| CPU | 32-core / 64-thread AMD Epyc or Intel Xeon |
| RAM | 512 GB DDR4 ECC RAM |
| Storage | 2 TB NVMe SSD (accounts) + 8 TB NVMe SSD (ledger) |
| Network | 1 Gbps minimum, 10 Gbps recommended |
| Redundancy | Redundant power supplies, RAID for non-ledger storage |

### Minimum Specifications

| Component | Requirement |
|-----------|-------------|
| CPU | 16-core / 32-thread AMD Epyc or Intel Xeon |
| RAM | 256 GB DDR4 ECC RAM |
| Storage | 1 TB NVMe SSD (accounts) + 4 TB NVMe SSD (ledger) |
| Network | 1 Gbps dedicated |

## Network Requirements

- **Bandwidth**: Sufficient bandwidth to handle peak Solana network traffic
- **Latency**: Low latency connection to major network hubs
- **Stability**: Stable, reliable internet connection with minimal downtime
- **Redundancy**: Backup internet connections recommended

## Financial Requirements

- **Self-Stake**: Minimum 10,000 SOL self-stake
- **Operating Costs**: Ability to cover operational costs for at least 6 months
- **Performance Bond**: 1,000 SOL performance bond (returned if validator exits in good standing)

## Operational Requirements

### Performance

- **Uptime**: Minimum 99.5% uptime over a 30-day period
- **Block Production**: Consistent block production with low latency
- **Version**: Running the latest Jito validator software

### Security

- **Key Management**: Secure validator identity and vote key management
- **Infrastructure**: Secure physical or cloud infrastructure
- **Monitoring**: Comprehensive monitoring and alerting systems
- **Incident Response**: Clear incident response procedures

### Compliance

- **KYC/AML**: Completion of validator KYC/AML process
- **Terms of Service**: Adherence to StakeNet Terms of Service
- **Reporting**: Regular performance and security reporting

## Geographical Distribution

To maintain network decentralization, we consider the following factors:

- **Regional Distribution**: Preference for underrepresented regions
- **Data Center Diversity**: Preference for validators in diverse data centers
- **Cloud Diversity**: Balanced distribution across cloud providers

## Technical Knowledge

Validators must demonstrate:

- **Solana Experience**: Prior experience running Solana validators
- **Linux Administration**: Strong Linux server administration skills
- **Monitoring Skills**: Ability to set up and maintain monitoring systems
- **Security Knowledge**: Understanding of security best practices

## Application Process

The application process includes:

1. **Initial Application**: Submit basic information about your operation
2. **Technical Interview**: Assessment of technical capabilities
3. **Performance Testing**: Trial period to evaluate performance
4. **Final Approval**: Review by the StakeNet governance committee

## Ongoing Requirements

Once accepted, validators must maintain:

- **Regular Updates**: Timely software updates
- **Performance Standards**: Consistent meeting of performance metrics
- **Communication**: Responsive communication with the Jito team
- **Participation**: Active participation in the validator community

## Disqualification Criteria

Validators may be removed from StakeNet for:

- **Persistent Underperformance**: Consistently failing to meet performance standards
- **Security Incidents**: Major security breaches or vulnerabilities
- **Protocol Violations**: Violating the StakeNet protocol rules
- **Communication Failures**: Lack of responsiveness to critical communications

For more information on becoming a validator, proceed to the [Validator Setup Guide](/stakenet/validators/setup). 