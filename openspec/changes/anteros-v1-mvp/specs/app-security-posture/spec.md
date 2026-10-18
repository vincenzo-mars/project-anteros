# Spec Delta

## Purpose

Owns the cross-cutting security posture: duress PIN, device integrity handling, zero-server architectural principle, transparency about known limits, and the 18+ onboarding gate.

## ADDED Requirements

### Requirement: Duress PIN
At onboarding the user SHALL be offered a duress PIN, usable as an alternative unlock code. Entering it SHALL make the app appear fully functional while marking all approvals as coerced, sending silent alerts, and flagging sessions in logs. Skipping SHALL be possible only with an explicit warning.

#### Scenario: Duress unlock
- **WHEN** the user unlocks the app with the duress PIN
- **THEN** the app works normally in appearance while all subsequent approvals are marked coerced in the log and silent alerts are queued

#### Scenario: Skipped duress setup
- **WHEN** the user skips duress PIN setup at onboarding
- **THEN** the app shows an explicit warning explaining the loss of coercion signaling

### Requirement: Coerced biometrics disclosed as a limit
The app SHALL document (in onboarding education and spec) that an attacker forcing immediate biometric unlock defeats the duress PIN, and SHALL advise users at concrete physical risk to prefer PIN-only unlock.

#### Scenario: Onboarding education
- **WHEN** the user completes security onboarding
- **THEN** the material explains when to disable biometry in favor of PIN-only unlock

### Requirement: Compromised-device policy
Devices that are rooted or jailbroken SHALL be allowed to use the app, with the owner informed via a best-effort integrity signal before granting access to that viewer. The signal SHALL be documented as self-reported and spoofable by advanced adversaries.

#### Scenario: Owner warned about rooted viewer
- **WHEN** a viewer device reports a compromised integrity signal
- **THEN** the owner sees the warning before approving and decides autonomously

### Requirement: Device lock requirement
The app SHALL refuse vault access and media viewing on devices without a screen lock (biometry or passcode), explained at onboarding.

#### Scenario: No screen lock
- **WHEN** the app runs on a device with no lock configured
- **THEN** vault and viewing features are disabled with an actionable explanation

### Requirement: Zero-server architecture principle
The app SHALL operate without any self-hosted server: no accounts, no telemetry, no push tokens, no content storage outside devices. Any future feature requiring a server component SHALL require explicit re-evaluation of the legal posture.

#### Scenario: No server contact
- **WHEN** the app performs any communication
- **THEN** it contacts only the paired peer and, at explicit export time, the public timestamping services

### Requirement: Onboarding gate and security setup
First run SHALL guide a mandatory sequence: 18+ declaration, identity generation, duress PIN offer, and a biometric/unlock tour including the trade-off education. The app SHALL declare an 18+ audience.

#### Scenario: Onboarding completed
- **WHEN** a new user finishes onboarding
- **THEN** identity exists, duress decision is recorded, and the security education has been shown before any content features unlock

### Requirement: Known-limits transparency
The app SHALL document in-product (onboarding and help) the limits that cannot be eliminated: external cameras, iOS post-facto screenshot detection paths, offline clock rollback, and best-effort device integrity. Reference implementation SHALL keep these limits listed in the spec.

#### Scenario: Limits available to users
- **WHEN** a user opens the security help section
- **THEN** the known limits are listed in plain language with their mitigations

### Requirement: Operational help page
The app SHALL provide a single operational help page explaining: what a TTL grant means, what Revoked/Expired states mean, what the other party sees during viewing, and how watermarking works.

#### Scenario: Help explains concepts
- **WHEN** the user opens the help page
- **THEN** TTL, states, viewer visibility, and watermarking are explained in plain language
