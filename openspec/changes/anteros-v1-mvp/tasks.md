# Tasks

Phased MVP: each group leaves a working, testable increment (design D8). Verify on physical devices (decision 53).

## 1. Project scaffold

- [ ] 1.1 Create Expo app with dev client config (expo-router, TypeScript); verify `expo run:ios` and `expo run:android` produce working dev clients on both physical devices
- [ ] 1.2 Add dependencies (op-sqlite with SQLCipher flag, react-native-quick-crypto, libsignal-protocol, react-native-webrtc, react-native-skia, zustand) and rebuild dev clients; verify each imports on device
- [ ] 1.3 Configure i18n isolation (Italian strings file) and expo-router base layout (two tabs + chat stub); verify navigation renders on both devices
- [ ] 1.4 Configure Android dev client permissions (camera, mic, storage, no FLAG_* yet) and iOS Info.plist entries; verify permission prompts appear and can be granted

## 2. Identity and onboarding

- [ ] 2.1 Implement identity generation (Ed25519 + X25519, hardware-backed storage via quick-crypto/Keystore/Secure Enclave) with unit tests for key persistence and non-exportability; verify test suite passes
- [ ] 2.2 Implement biometric unlock gate on every app open (device-lock check included) and verify manually: open → prompt → unlock; no-lock device → features disabled with explanation
- [ ] 2.3 Implement onboarding sequence (18+ declaration → identity generation → duress PIN offer with skip warning → unlock tour) with screens in i18n; verify a fresh install walks through it completely and skips nothing mandatory
- [ ] 2.4 Implement duress PIN storage and unlock path (duress unlock behaves identically on the surface, flags session state) with unit tests; verify duress unlock opens app and internal state differs

## 3. Pairing

- [ ] 3.1 Implement SDP offer/answer generation and QR encode/decode for the two-scan nearby flow; verify on two devices: scan A→B, answer B→A, both reach connected state
- [ ] 3.2 Implement deep-link pairing (offer encoded in link, answer link returned) and verify the remote flow on two devices over internet only (airplane-mode + WiFi-hotspot test for the internet-only rule)
- [ ] 3.3 Implement safety-number screen with identical derived values on both sides and dual confirmation; verify numbers match visually and the media gate opens only after both confirm
- [ ] 3.4 Implement multi-contact storage and contact lifecycle (create, delete/unpair with key destruction + log entry); verify deleting a contact blocks reconnection without a new verified pairing

## 4. Encrypted chat

- [ ] 4.1 Implement X3DH + Double Ratchet session over WebRTC DataChannel (libsignal) with unit tests for ratchet progression and out-of-order message handling; verify tests pass
- [ ] 4.2 Implement chat UI per contact (send/receive, system messages inline) on the DataChannel; verify realtime delivery on two devices
- [ ] 4.3 Implement SQLCipher storage for persistent encrypted history with per-conversation keys and unit tests; verify history survives app restart after biometric unlock
- [ ] 4.4 Implement message deletion (single + whole conversation) with log entry; verify content is gone from DB and log records it
- [ ] 4.5 Implement sender-side offline queue with delivery on reconnect; verify: send with peer offline, peer reconnects, message arrives in order
- [ ] 4.6 Implement async pickup screen (pending requests on open, badge) and no-presence-metadata invariant; verify no read receipts/online indicators exist anywhere in UI
- [ ] 4.7 Implement protocol version field and per-feature negotiation with "both must update" UI; verify mixed-version behavior with a simulated older peer

## 5. Media vault

- [ ] 5.1 Implement vault key hierarchy (hardware master key + per-file AEAD data keys) and encrypted blob storage with unit tests for wrap/unwrap and key destruction; verify tests pass
- [ ] 5.2 Implement import wizard (source picker, neutral default title, optional custom title, contact selection) storing original + normalized rendition; verify a HEIC import produces both artifacts correctly
- [ ] 5.3 Implement SQLCipher tables for catalog, permissions, and signed log; verify schema migrations run and content is ciphertext at rest
- [ ] 5.4 Implement optional encrypted export (Argon2id + AES package, logged) and verify the export package decrypts only with the password and appears in the log
- [ ] 5.5 Implement total wipe (biometric + typed confirmation, vault + identity + keys + logs) and verify a wiped device returns to fresh-install state

## 6. Sharing and permissions

- [ ] 6.1 Implement broadcast exposure model (file → N contacts, per-viewer independent permission) and catalog queries; verify exposing one file to two contacts creates independent entries
- [ ] 6.2 Implement inline attach-to-chat flow (attach → TTL config → vault entry → immediate grant); verify the fast-share path creates vault entry and grant in one flow
- [ ] 6.3 Implement request/approval flow as signed interactive chat system messages with TTL choice at approval; verify grant/refusal paths sign both logs
- [ ] 6.4 Implement delivery transfer (deliver-once: encrypted file transfer wrapped under pair key, resumable, abort semantics); verify transfer completes and resumes after connection drop
- [ ] 6.5 Implement revocation variants: per-file, panic revocation (biometric-confirmed, all contacts), in-flight abort with key-never-sent; verify partial blob is cryptographically dead after mid-transfer revocation
- [ ] 6.6 Implement delivery-key destruction on expiry/revocation/owner deletion + blob GC; verify expired blob is undecryptable and removed at next opportunity
- [ ] 6.7 Implement viewer catalog states (Request/Pending/Available/Expired/Revoked/Perpetual) with per-file usage history and viewer controls (hide, disable catalog, unpair); verify state transitions drive the UI

## 7. Secure viewing

- [ ] 7.1 Prototype Skia rendering inside the secure layer (Android FLAG_SECURE window flag; iOS secure-entry layer composition) on both devices; verify screenshots and recordings of the prototype produce black output — this gates the rest of the phase
- [ ] 7.2 Implement per-session unlock (owner session key + viewer biometrics) and owner-offline viewing; verify viewer can watch while owner device is offline
- [ ] 7.3 Implement session lifecycle: exit kills (background, app switch, screen off) with pre-suspension blanking; incoming call kills definitively; verify each trigger on both devices
- [ ] 7.4 Implement capture detection kill (Android 34+ capture callback; iOS isCaptured/capturedDidChange): session killed immediately + log + owner notification when connected; verify with screen recording enabled on both devices
- [ ] 7.5 Implement audio background exception (background audio mode, TTL-bound) and batch navigation with per-file logging and per-file "1 view" consumption; verify audio survives screen lock and each file opening logs separately
- [ ] 7.6 Implement in-memory-only handling (no disk cache, no share targets, memory clear on session end) and viewer session UI (optional countdown per owner choice, always-visible partial session ID watermark); verify no content remains after session end

## 8. Watermark and attribution

- [ ] 8.1 Implement moving visible watermark composition (viewer identity + session ID) in Skia over all rendered media; verify watermark is present and moving on photos and videos
- [ ] 8.2 Implement steganographic embedding (robust scheme, fixed parameter set) applied to delivered renditions with unit tests for embed/decode round-trip on synthetic images; verify tests pass
- [ ] 8.3 Implement leak decode flow (import artifact → decode with fixed parameters → high-confidence / weak / no match reporting); verify round-trip decode on a screenshot of the rendered output succeeds and a heavily recompressed artifact reports honestly
- [ ] 8.4 Document measured decode success rates per leak path (digital screenshot, screen-photo, recompressed) in the repo research file; verify the documented numbers come from real runs on the two test devices

## 9. Logs and evidence bundle

- [ ] 9.1 Implement append-only signed log with dual signatures on all events (grant, unlock+duration, expiry, revocation, refusal, export, deletion) and non-forgeability unit tests; verify tamper attempts are detected
- [ ] 9.2 Implement evidence bundle generation (signed consent/access chain + stego result + log extract + PDQ/MD5 hashes) with unit tests; verify bundle contents are complete and verifiable offline
- [ ] 9.3 Integrate qualified eIDAS timestamp (QTSP RFC 3161 adapter, export-time only) and OpenTimestamps anchoring with polyfill risk spike; verify both timestamps validate against their verifiers
- [ ] 9.4 Implement StopNCII deep-link hash-only reporting flow; verify no media bytes leave the device during the flow

## 10. Security posture hardening

- [ ] 10.1 Wire duress behavior end-to-end (coerced approvals marked, silent alerts queued, sessions flagged in logs); verify full duress path on device
- [ ] 10.2 Implement compromised-device integrity signal (best-effort, self-reported) with owner warning before approval; verify warning appears for a simulated compromised report
- [ ] 10.3 Implement OS-backup exclusion for vault and keys (Android backup rules, iOS excluded files) and verify backup contains no vault data
- [ ] 10.4 Implement in-product known-limits page (external cameras, iOS detection paths, clock rollback, integrity best-effort, coerced biometrics) and operational help page (TTL, states, viewer visibility, watermarking) in i18n; verify all limits listed and reachable from onboarding, settings, and help
- [ ] 10.5 Implement one-time pairing links with pending-link revocation list; verify a reused link is rejected with explicit message and a revoked link pairs nothing
- [ ] 10.6 Implement Settings screen (profile edit with encrypted propagation, duress PIN change with biometry, PIN-only unlock switch, app info) and verify each action reflects on the paired device where applicable
- [ ] 10.7 Implement the three empty states with CTAs (home without contacts, empty vault tab, first-step guide) and basic accessibility labels on primary controls; verify fresh-install flows show the CTAs and screen reader labels exist
- [ ] 10.8 Final integration pass on both physical devices: full end-to-end scenario (pair → verify → chat → share with TTL → view → revoke → evidence) executed twice; verify every step's signed log entries exist on both sides

## Workflow follow-up (after implementation)

- Run `openspec validate --change anteros-v1-mvp --strict` before apply and before archive
- After archive: sync `analysis/threat-scenarios.md` decision numbers into the main specs where wording drifted
- Keep the repo research file updated with measured watermark decode rates as phases land
- Connectivity spike (phase 3): measure ICE success rate between the two test devices across real networks (WiFi-to-WiFi, WiFi-to-cellular) with public STUN only; record measured failure rate in the research file to inform the v2 TURN evaluation (decisions 86-88)
