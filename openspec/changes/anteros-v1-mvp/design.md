# Design

## Context

Greenfield app; all product and security decisions are recorded in `analysis/threat-scenarios.md` (71 numbered decisions plus the guiding principle P0: "free but traced — allow malicious behavior, trace it in maximum detail, block where certain"), threat model and NCII/messaging research in `analysis/research-2026.md`, legal posture in `analysis/legal-2026.md`. Target: React Native non-native mobile app, amateur distribution (sideload APK + TestFlight), no deadlines, physical iOS and Android devices available for testing.

## Goals / Non-Goals

**Goals:**
- Zero-server P2P operation with every security-relevant event signed and traceable
- Owner convenience after approval (owner MAY be offline during viewing)
- Attribution as primary deterrence: visible watermark + robust stego
- All 71 decisions implemented within the v1 scope cut (decision 24)

**Non-Goals:**
- Group conversations with viewer interaction (broadcast 1:N only)
- Push notifications, background services, LAN-only connectivity
- iOS screenshot prevention beyond the secure-entry layer; prevention of external cameras
- Full accessibility coverage (declared out of scope for v1: basic labels only, decision 83)
- Cloud backups, multi-device identity sync
- App Store / Play Store publication (TestFlight + sideload only in v1)

## Decisions

**D1. Deliver-once + per-session unlock (revised from owner-side frame streaming).**
Owner-side live frame streaming was rejected because it requires the owner's app foreground for the whole viewing session, contradicting the owner-freedom requirement. Final model: file transfers once, E2E encrypted, at first approval; stored as ciphertext on the viewer; each session needs an unlock (session key) from the owner plus viewer biometrics. Alternative kept in reserve: frame streaming for "critical" per-file flag (rejected for v1: two code paths, decision 61 keeps broadcast simple).

**D2. Crypto stack split.**
libsignal (X3DH + Double Ratchet) for the chat channel only; quick-crypto (AES-256-GCM AEAD, Argon2id, Ed25519/X25519) for vault files, delivery wrapping, log signatures. Ratchet is unsuitable for 500MB payloads (storage explosion). Delivery keys are wrapped under pair keys so destroying pair/delivery keys kills blobs without touching the ratchet state.

**D3. Vault architecture.**
Per-file data keys wrapped by a hardware-backed master key (Secure Enclave / Keystore + StrongBox when present). SQLCipher database for chat/catalog/logs/metadata; media as encrypted blob files on disk. Original file preserved; normalized JPEG/AAC rendition generated at import for delivery (decision 77). Export = Argon2id + AES package, logged.

**D4. Secure rendering layer.**
App-wide screenshot/recording block: Android `FLAG_SECURE`; iOS secure-entry layer trick (documented by Apple as restricting recording/broadcast). Skia renders media + moving visible watermark + stego embed inside that layer. Known iOS quirks: RTL black strip on iOS 26 (force LTR on the secure layer), interaction constraints (layer applies to the media view, not whole window). Apply blocking app-wide (decision 63) with per-screen secure layer composition.

**D5. Permissions and logs.**
Grants carry TTL (1 view / 1h / 8h / perpetual), signed by both parties at grant time. Append-only signed log stored on both devices; unlock events include duration. Owner self-exports are logged symmetrically (deterrence symmetry, S9). Clock rollback accepted as best-effort offline: owner-signed timestamps make rollback detectable post-hoc (decision 66).

**D6. Evidence bundle.**
Generated on demand: signed consent/access chain + stego decode result + log extract + PDQ/MD5 hashes + qualified eIDAS timestamp (QTSP RFC 3161, contacted only at export) + OpenTimestamps anchor (free public calendars). StopNCII reporting via deep link, hash-only. Timestamping libs are Node-oriented: mitigate with RN polyfills; worst case a micro native module (isolated, replaceable).

**D7. Navigation and state.**
expo-router (file-based, native deep links for pairing links); zustand for UI/session state only; SQLCipher is the source of truth for data. i18n strings isolated from day one (Italian only).

**D8. Phased MVP plan.**
Each phase leaves a working, usable MVP (decision 25). Phase dependency order: identity/pairing → chat → vault → sharing/permissions → viewing/secure layer → watermark/evidence → hardening. See tasks.md.

**D9. Chunked resumable transfer protocol.**
SCTP DataChannel with application-level acks per checkpoint batch (dynamic send window, decision 91), 1MB checkpoints (decision 89), block hashes + owner-signed total hash verified before vault entry (decision 90). Partial blobs are cryptographically dead without the delivery key (D2 wrapping) and reused on resume; GC skips active transfers. Alternative rejected: SRTP media transport for files (wrong semantics, needs application protocol anyway).

**D10. Connectivity strategy.**
Public third-party STUN for NAT discovery only (same trust class as DNS/NTP/OTS calendars, decision 86); configurable server list including user-provided STUN. No TURN in v1 (decision 87): symmetric-NAT connections fail with guided diagnostics and retry policy (decision 88); v2 TURN evaluation gated on measured failure rates and explicit legal re-evaluation.

**D11. Steganographic scheme selection (decision 92).**
Comparative spike before the watermark phase: verify public implementations exist (StegaStamp, TERA, ScreenMark, I-SIFT candidates), run embed/decode round-trips, measure robustness against JPEG quality 30-80, resize 50-75%, and simulated screen-photo capture; select on measured results for the Anteros payload (viewer ID + session + timestamp ≈ 80-100 bits). The spec defines the *behavior* (embed before transmission, honest decode outcomes), not the scheme.

**D12. Signed log growth policy.**
Append-only log with block-hash chain per 1MB checkpoint segment; segments sealed with a signed anchor that the next segment references. Rotation keeps the active segment small and the bundle extractable; verification spans the full chain. (Confirming decision area: no user-facing behavior change.)

## Risks / Trade-offs

- [Skia render inside secure-entry layer fails on some devices] → Prototype in the first viewing phase before committing the full flow; fallback is Skia render + system-level FLAG_SECURE/secure-layer window composition.
- [Timestamping libs need polyfills or a micro native module] → Isolated adapter module; QTSP is pluggable at export time only.
- [iOS screenshot detection may deprecate (WhatsApp precedent 2023)] → Blocking does not depend on detection; watermark + biometrics remain independent layers. Monitor each iOS major.
- [Coerced biometrics defeats duress PIN] → Declared limit; onboarding education recommends PIN-only for at-risk users (decision 65).
- [Offline clock rollback extends TTL windows] → Accepted; owner-signed timestamps enable post-hoc detection (decision 66).
- [Rooted viewer extracts delivered blob + session key during a live session] → Accepted (decision 9): watermark attribution + signed logs remain the response; integrity signal warns the owner beforehand.
- [WebRTC IP exposure between peers] → Accepted for v1 (documented); TURN relay would reintroduce a server.

## Migration Plan

Greenfield: no migration. Rollback = previous APK/TestFlight build; the data model is local and forward-compatible via SQLCipher migrations.

## Open Questions

None — all material decisions are recorded (71 decisions, P0 principle). Deferred engineering details (Skia secure-layer composition, polyfill depth) are prototyping tasks in tasks.md, not open product questions.
