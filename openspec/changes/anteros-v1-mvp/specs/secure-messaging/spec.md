# Spec Delta

## Purpose

Defines the end-to-end encrypted text chat between paired contacts: Double Ratchet sessions over WebRTC DataChannel, encrypted persistent history, offline message queueing, async request pickup, and the absence of presence metadata.

## ADDED Requirements

### Requirement: E2EE text chat
Text messages between paired contacts SHALL be end-to-end encrypted using a Double Ratchet session over a WebRTC DataChannel. No server SHALL participate in the message path.

#### Scenario: Message exchange
- **WHEN** two paired, verified contacts are both connected
- **THEN** a text message sent by one appears decrypted on the other and is protected by Double Ratchet forward secrecy

### Requirement: Persistent encrypted history
Chat history SHALL be stored locally in an encrypted database (per-conversation keys). Users MAY delete individual messages or an entire conversation; deletions SHALL be recorded in the signed audit log.

#### Scenario: History survives restart
- **WHEN** the app is closed and reopened with biometric unlock
- **THEN** the full chat history decrypts and displays as before

#### Scenario: Message deleted
- **WHEN** a user deletes a message from a conversation
- **THEN** the deletion is recorded in the signed audit log and the message content is removed from local storage

### Requirement: Sender-side offline queue
If the peer is unreachable, an outgoing message SHALL be held encrypted on the sender's device and delivered automatically at the next reconnection. If the sender loses the device before delivery, the message is lost.

#### Scenario: Peer offline at send time
- **WHEN** a message is sent while the peer is unreachable
- **THEN** the message is queued locally and delivered automatically upon the peer's next connection

### Requirement: Async request pickup
Access requests and replies SHALL reach the peer only while connected; there SHALL be no push notifications. A user opening the app SHALL see a pickup screen listing pending requests before the home screen when any exist.

#### Scenario: Request arrives while app closed
- **WHEN** a viewer sends an access request while the owner's app is closed
- **THEN** the request is delivered when the owner next connects, and the owner sees a pickup screen listing it at app open

#### Scenario: No pending requests
- **WHEN** the user opens the app with no pending requests
- **THEN** the app opens directly to the normal home screen

### Requirement: No presence metadata
The app SHALL NOT expose read receipts, online status, or last-seen information to contacts.

#### Scenario: No presence leak
- **WHEN** either contact uses the app in any state
- **THEN** the other contact can never observe read receipts, online status, or last-seen data in any UI element

### Requirement: Protocol version negotiation
Protocol messages SHALL carry a version. Peers on different app versions SHALL communicate over compatible blocks; features requiring both sides updated SHALL be disabled with a clear "both must update" indication.

#### Scenario: Mixed versions
- **WHEN** a peer running an older app version connects
- **THEN** compatible functionality works and features requiring the newer version are disabled with an explanatory message
