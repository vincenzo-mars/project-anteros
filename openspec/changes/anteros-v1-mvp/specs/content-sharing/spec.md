# Spec Delta

## Purpose

Owns how a vault owner exposes files to contacts (broadcast 1:N), the permission model with per-viewer TTL grants, the request/approval flow, revocation variants, and in-flight transfer abort.

## ADDED Requirements

### Requirement: Broadcast exposure
A vault file SHALL be exposable to multiple contacts at once; each contact receives an independent permission. Viewers SHALL NOT interact with each other; the app SHALL never support group conversations.

#### Scenario: One file, many viewers
- **WHEN** the owner exposes a file to three contacts with individual TTLs
- **THEN** each contact holds an independent permission and catalog entry

### Requirement: Inline attach-to-chat sharing
Attaching a file in a chat SHALL open the import/permission flow inline: the file enters the vault, the permission (TTL) is configured inline, and the grant for that contact becomes effective immediately. Media SHALL never bypass the permission mechanism.

#### Scenario: Fast share from chat
- **WHEN** the owner attaches a photo in a chat and selects TTL "1 hour"
- **THEN** the file is added to the vault, and the contact can view it under a 1-hour permission without a separate request

### Requirement: TTL permission model
Permissions SHALL be one of: 1 view, 1 hour, 8 hours, or perpetual, chosen by the owner at approval time. Every grant, unlock, expiry, and revocation SHALL be written to the signed audit log.

#### Scenario: View-count permission consumed
- **WHEN** a viewer unlocks a file under a "1 view" permission
- **THEN** the permission is consumed upon that unlock regardless of session duration

#### Scenario: Time permission window
- **WHEN** a viewer holds a "1 hour" permission
- **THEN** they may unlock and view repeatedly within the hour, each unlock logged, and the permission expires at the deadline

### Requirement: Request and approval flow
When no active permission exists, the viewer SHALL request access by tapping the catalog entry; the owner SHALL approve or refuse, choosing the TTL at approval. The request/approval exchange happens in chat as an interactive system message and is signed by both parties.

#### Scenario: Approval grants access
- **WHEN** the owner approves a request with TTL "8 hours"
- **THEN** the viewer's catalog entry becomes active for 8 hours and both signed logs record the grant

#### Scenario: Refusal
- **WHEN** the owner refuses a request
- **THEN** the viewer's entry returns to requestable state and the refusal is recorded in both logs

### Requirement: Instant revocation and panic revocation
The owner SHALL be able to revoke any permission at any time (per-file), and perform panic revocation (all permissions for all contacts) via a dedicated biometric-confirmed control. Revocation SHALL abort any in-flight transfer immediately, ensure the delivery key is never sent, and render any partial blob cryptographically dead.

#### Scenario: Panic revocation
- **WHEN** the owner triggers panic revocation with biometric confirmation
- **THEN** all future unlocks for all contacts are blocked, active transfers abort with keys never delivered, and the event is logged

#### Scenario: Revocation mid-transfer
- **WHEN** the owner revokes while a delivery transfer is in progress
- **THEN** the transfer aborts, the delivery key is never sent, and any partial blob is garbage-collected

### Requirement: Delivery key lifecycle
Delivered encrypted files on the viewer device SHALL be encrypted with a delivery key wrapped by the pair key. Permission expiry, revocation, or owner-side file deletion SHALL destroy the delivery key, making the blob cryptographically dead, and the blob SHALL be garbage-collected at the next opportunity.

#### Scenario: Expired permission kills blob
- **WHEN** a permission expires on the viewer device
- **THEN** the delivery key is destroyed, the blob cannot be decrypted, and it is removed at the next opportunity

### Requirement: Viewer catalog states and controls
Each exposed title in the viewer's "Shared with me" view SHALL show one state: Request / Pending / Available until [time] / Expired / Revoked / Available (perpetual), plus a per-file usage history. The viewer SHALL be able to hide any entry, disable a contact's entire catalog, and unilaterally unpair.

#### Scenario: State reflects permission lifecycle
- **WHEN** a permission expires
- **THEN** the entry moves to Expired and returns to Request state for re-requesting

#### Scenario: Viewer defends against unwanted exposure
- **WHEN** the viewer hides an abusive or unwanted catalog entry
- **THEN** it disappears from their catalog and the hiding is recorded locally
