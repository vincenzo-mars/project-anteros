# Proposal

## Why

Sharing intimate media exposes people to non-consensual redistribution (revenge porn): today the owner of a photo or video loses control the moment a messaging app delivers it, and victims have no technical leverage to attribute leaks or prove consent. Anteros closes this gap with a P2P, zero-server mobile app where media owners keep sole custody of their files, grant scoped, revocable, heavily logged access, and every leak is attributable through watermarking — turning deterrence from "trust me" into "you will be identified".

## What Changes

Greenfield app (React Native / Expo, iOS 16+ and Android 10+), no server ever in the communication path:

- **P2P identity and pairing**: keypair-based identities (one device = one identity), QR code (nearby) and deep link (remote) pairing flows with mandatory safety-number verification that gates all media access.
- **E2EE text chat**: Double Ratchet over WebRTC DataChannel, persistent encrypted history, sender-side offline message queue, no push, async request pickup, no presence metadata (no read receipts / online status).
- **Encrypted media vault**: hardware-backed master key (Secure Enclave / StrongBox), per-file data keys (AEAD), biometric gate on every app open, original files preserved, optional password-protected export, no cloud, total wipe (including local logs).
- **Consent-based sharing**: broadcast 1-to-many exposure of vault files via catalog titles, per-viewer permissions with TTL (1 view / 1 hour / 8 hours / perpetual), request-approve flow in chat, instant revocation, duress PIN, panic revocation.
- **Ephemeral viewing**: deliver-once encrypted transfer, viewer-side render in a secure layer (screenshot/recording blocked app-wide), session kill on app exit, background-audio exception, anti-parallelism (no PiP/split-screen), batch navigation within a session.
- **Attribution**: visible moving watermark + robust steganographic watermark applied at render, in-app leak decode flow, signed bidirectional audit logs, evidence bundle with qualified eIDAS timestamp (QTSP) + OpenTimestamps, hash-only StopNCII reporting integration.
- **Legal posture**: 18+ declared onboarding, zero server (developer is not a data controller), notices of known limits (coerced biometrics, offline clock rollback, external cameras).

## Capabilities

### New Capabilities

- `identity-pairing`: device identity, QR/deep-link pairing flows, safety-number verification gate, re-pairing semantics, contact lifecycle (multi-contact, unpair, revocation).
- `secure-messaging`: E2EE text chat over WebRTC DataChannel, Double Ratchet session, encrypted persistent history, offline sender queue, async request pickup, absence of presence metadata.
- `media-vault`: encrypted per-file storage with hardware-backed keys, biometric access, import wizard, normalized delivery renditions, optional export, total wipe.
- `content-sharing`: exposing vault files to contacts (broadcast 1:N), per-viewer TTL permissions, request/approval flow with inline configuration, revocation (per-file, panic, unpair), in-flight transfer abort.
- `media-viewing`: encrypted delivery + per-session unlock, secure-layer rendering, anti-capture blocking and detection, session lifecycle rules (exit kills, audio background exception, incoming call kill), viewer catalog states.
- `attribution-evidence`: visible + steganographic watermarking, leak decode flow, signed bidirectional audit logs, evidence bundle generation (QTSP + OpenTimestamps + content hashes), StopNCII hash-only reporting.
- `app-security-posture`: duress PIN, device-lock requirement, rooted/jailbroken handling (allowed with warning to owner), known-limits transparency, operational help page, 18+ onboarding gate.
- `app-settings`: profile editing with encrypted propagation, duress PIN management, biometry/PIN unlock policy switch, app information.

### Modified Capabilities

(none — greenfield)

## Impact

- **New app** in this repo: Expo + dev client, expo-router, zustand, op-sqlite + SQLCipher, react-native-quick-crypto, libsignal-protocol, react-native-webrtc, react-native-skia.
- **Native modules** (in dev client): screenshot/recording blocking and detection (FLAG_SECURE, secure-entry layer, capture callbacks), hardware-backed keystore access, background audio mode.
- **External touchpoints (no self-hosted server)**: public OTS calendars and a QTSP RFC 3161 service (evidence export only), StopNCII.org deep link (report flow only).
- **Risks to manage**: timestamping libs are Node-oriented (polyfills or micro native module); Skia-inside-secure-layer integration to be prototyped first; WebRTC requires physical devices for testing.
