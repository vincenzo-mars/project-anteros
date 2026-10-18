# Spec Delta

## Purpose

Establishes device-based cryptographic identities and the trusted pairing ritual between two devices, including the safety-number verification that gates all media access. Owns contact lifecycle: multi-contact, unpairing, and identity non-continuity.

## ADDED Requirements

### Requirement: Device-bound identity
Each installation SHALL generate a unique keypair-based identity (signing + X25519 exchange keys) on first run, bound to that device only. One device SHALL equal one identity; installing on a new device SHALL NOT inherit any previous identity.

#### Scenario: First run generates identity
- **WHEN** the app is started for the first time after onboarding completes
- **THEN** an identity keypair exists, stored with hardware-backed protection, and is never exportable in plaintext

#### Scenario: Reinstall is a new identity
- **WHEN** the app is installed on a new device and paired again with an existing contact
- **THEN** the peer sees a new identity with different safety numbers and progressive trust restarts

### Requirement: Pairing via QR code (nearby)
The app SHALL support pairing with a nearby device by exchanging SDP offers/answers via two QR code scans (first scan delivers the offer, second scan returns the answer).

#### Scenario: Two-device QR pairing
- **WHEN** user A selects "Nearby" pairing and user B scans A's QR, then A scans B's response QR
- **THEN** a WebRTC connection is established and both devices enter the safety-number verification screen

### Requirement: Pairing via shareable link (remote)
The app SHALL support remote pairing by encoding the SDP offer/answer into a shareable deep link that can be exchanged through any external channel, requiring one exchange in each direction.

#### Scenario: Remote link pairing
- **WHEN** user A shares a pairing link and user B opens it and replies with their link
- **THEN** both devices reach the connection and safety-number verification state as with QR pairing

### Requirement: Mandatory safety-number verification gate
After connecting, both users SHALL be shown identical human-verifiable safety numbers and each SHALL explicitly confirm they match. Media access capabilities SHALL remain locked until verification is confirmed by both parties.

#### Scenario: Verification completes
- **WHEN** both users confirm the safety numbers match
- **THEN** media viewing and sharing capabilities become available for that contact

#### Scenario: Verification not done
- **WHEN** a paired but unverified contact attempts to view an exposed file title catalog
- **THEN** the catalog is visible but no media viewing or granting capability is enabled

### Requirement: Multi-contact support
The app SHALL support pairing with multiple independent contacts, each with its own keys, catalog, permissions, and trust state.

#### Scenario: Multiple pairs coexist
- **WHEN** a user is paired with contact 1 and contact 2
- **THEN** each contact's catalog, permissions, and session state are independent

### Requirement: Unpairing revokes everything
Deleting a contact SHALL immediately revoke all permissions, destroy the pair keys, and mark the contact as revoked in the local log, while preserving log history. Reconnecting SHALL require a new pairing with new safety-number verification.

#### Scenario: Contact deleted
- **WHEN** a user deletes a contact
- **THEN** all active and future permissions for that contact are revoked, pair keys are destroyed, and the revocation is recorded in the signed log

### Requirement: Visual identity exchange
Users SHALL set a display name and avatar at onboarding, exchanged encrypted during pairing; the cryptographic identity and safety numbers remain the authoritative identity.

#### Scenario: Peer identity displayed
- **WHEN** a pairing completes
- **THEN** each side sees the peer's chosen name and avatar, and the contact appears in the contact list

### Requirement: Internet-only connectivity
Connections SHALL be initiated only when internet connectivity is active. LAN-local operation without internet SHALL NOT be initiated.

#### Scenario: No internet
- **WHEN** the device has no internet connectivity
- **THEN** connection attempts to peers are not initiated and the UI explains the requirement

### Requirement: One-time pairing links
A pairing link SHALL be consumable exactly once: the first open creates the pair, later opens are rejected with an explicit "link already used" message.

#### Scenario: Link reused
- **WHEN** a second device opens a pairing link that already created a pair
- **THEN** the pairing is rejected and the user is told the link was already used

### Requirement: Pending link revocation
The owner SHALL be able to revoke a created-but-unused pairing link from the pairing flow (list of active links).

#### Scenario: Link revoked before use
- **WHEN** the owner revokes a pending link
- **THEN** opening that link no longer pairs and the revocation is recorded locally
