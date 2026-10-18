# Spec Delta

## Purpose

Owns deterrence and attribution: visible moving watermark plus robust steganographic watermark applied at render, the in-app leak decode flow, signed bidirectional audit logs, the court-oriented evidence bundle, and hash-only StopNCII reporting.

## ADDED Requirements

### Requirement: Visible moving watermark
Every rendered frame during a viewing session SHALL carry a visible watermark with viewer identity and session identifier in a moving position that survives cropping attempts.

#### Scenario: Watermark present on every frame
- **WHEN** a viewer watches a photo or video
- **THEN** the visible watermark identifying viewer and session appears on screen and changes position over time

### Requirement: Steganographic watermark embedding
The owner's device SHALL embed a robust steganographic watermark (viewer identity, session ID, timestamp) into the rendered content before transmission, designed to survive digital re-compression and screen-camera capture with best-effort reliability.

#### Scenario: Embed before transmission
- **WHEN** content is rendered for a viewer
- **THEN** the steganographic payload is embedded in the delivered rendition

### Requirement: Leak decode flow
The app SHALL provide an in-app flow where the owner imports a suspected leak artifact; the app attempts steganographic decoding with a fixed parameter set and reports: high-confidence match (viewer + session + timestamp), weak match (indication only), or no match, honestly.

#### Scenario: High-confidence attribution
- **WHEN** a leak artifact containing the stego payload is imported
- **THEN** the app identifies the viewer and session and offers to generate the evidence bundle

#### Scenario: Decode fails honestly
- **WHEN** the artifact is too degraded for decoding
- **THEN** the app reports no match and points to visible watermark and logs as remaining attribution paths

### Requirement: Signed bidirectional audit logs
All security-relevant events (requests, approvals, refusals, grants with TTL, unlocks with duration, expiries, revocations, exports, deletions) SHALL be recorded in logs signed by both parties, stored on both devices. Neither party SHALL be able to forge the other's signature.

#### Scenario: Unlock logged with duration
- **WHEN** a viewer completes a viewing session
- **THEN** both logs record the unlock with viewer identity, file, timestamps, and duration

### Requirement: Evidence bundle
The app SHALL generate a court-oriented evidence bundle containing: the signed consent/access chain, extracted watermark results, signed log extracts, content hashes (PDQ/MD5), a qualified eIDAS timestamp (QTSP, RFC 3161), and an OpenTimestamps anchor. The QTSP SHALL be contacted only at bundle export time.

#### Scenario: Bundle generated
- **WHEN** the owner exports the evidence bundle
- **THEN** the package contains signed chains, attribution results, hashes, and both timestamp proofs, ready for legal use

### Requirement: StopNCII hash-only reporting
The evidence bundle flow SHALL include guided reporting to StopNCII.org using hash-only submission (deep link), without uploading the media itself.

#### Scenario: Guided hash reporting
- **WHEN** the owner chooses to report to StopNCII
- **THEN** the app opens the StopNCII flow with locally computed hashes and never uploads the media

### Requirement: Owner-side export tracing
Vault file exports by the owner SHALL be recorded in the signed log, making the owner's own actions attributable symmetric to viewer actions.

#### Scenario: Owner export logged
- **WHEN** the owner exports a vault file
- **THEN** the export appears in the signed log with timestamp and destination type
