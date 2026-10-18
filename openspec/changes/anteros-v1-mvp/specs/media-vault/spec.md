# Spec Delta

## Purpose

Owns the encrypted on-device storage of the user's own media: hardware-backed keys, per-file encryption, biometric access, import wizard, delivery renditions, optional export, and total wipe.

## ADDED Requirements

### Requirement: Hardware-backed vault keys
The vault SHALL be encrypted with per-file data keys (AEAD), wrapped by a master key generated on-device and stored in hardware-backed storage (Secure Enclave / Android Keystore with StrongBox when available). Master keys SHALL never be exportable in plaintext.

#### Scenario: Vault at rest
- **WHEN** the device is locked or the app is closed
- **THEN** file contents are ciphertext and data keys are wrapped under hardware-backed storage

### Requirement: Biometric access gate
Opening the app SHALL require biometric (or device passcode) authentication on every open. A device without any screen lock SHALL NOT allow vault access or media viewing.

#### Scenario: App open requires authentication
- **WHEN** the user brings the app to foreground
- **THEN** biometric or passcode authentication is required before any content is shown

#### Scenario: Device without screen lock
- **WHEN** a device has no biometry and no screen lock configured
- **THEN** vault and media viewing are disabled with an explanation in onboarding

### Requirement: Import wizard
The user SHALL add media through a short import wizard: pick source (gallery, camera, files), title (neutral auto-generated default, custom optional), and select contacts to expose it to. The file SHALL enter the encrypted vault immediately upon import.

#### Scenario: File imported
- **WHEN** the user completes the import wizard
- **THEN** the original file is stored encrypted in the vault and, if contacts were selected, exposure entries with the chosen titles exist for those contacts

### Requirement: Original preserved, delivery rendition normalized
The vault SHALL preserve the original file unmodified. A normalized delivery rendition (e.g., HEIC to JPEG, audio to AAC) SHALL be produced at import for universal viewer-side decoding.

#### Scenario: Original kept intact
- **WHEN** a HEIC photo is imported
- **THEN** the vault retains the original HEIC file and the delivery package contains a JPEG rendition

### Requirement: Optional encrypted export
The user MAY export a vault file to outside storage; the export SHALL be encrypted with a password (Argon2id + AES) and SHALL be recorded in the signed audit log.

#### Scenario: Export performed
- **WHEN** the user exports a file with a password
- **THEN** an encrypted package is created at the chosen destination and the export event appears in the signed log

### Requirement: Total wipe
The user SHALL be able to delete everything (vault, identity, keys, and local logs) with biometric confirmation plus typed confirmation. The other party's copy of shared signed logs survives as their own record.

#### Scenario: Total wipe performed
- **WHEN** the user confirms total wipe with biometric and typed confirmation
- **THEN** all local data including logs is destroyed and the app returns to a fresh-install state

### Requirement: No cloud backup
The vault SHALL be excluded from all OS-level cloud backups. Losing the device without an export loses the files.

#### Scenario: No cloud copy
- **WHEN** OS backup runs
- **THEN** no vault content or keys is included in any cloud backup
