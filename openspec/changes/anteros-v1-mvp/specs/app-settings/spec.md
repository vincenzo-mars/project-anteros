# Spec Delta

## Purpose

Owns the app-level settings surface: profile editing with encrypted propagation, duress PIN management, biometry/PIN unlock policy switch, and app information.

## ADDED Requirements

### Requirement: Profile editing
The user SHALL be able to change display name and avatar in settings; the change SHALL propagate encrypted to all existing contacts.

#### Scenario: Name change propagates
- **WHEN** the user changes their display name
- **THEN** paired contacts see the updated name and the change is recorded in the signed log

### Requirement: Duress PIN management
The user SHALL be able to change or disable the duress PIN in settings, gated by biometric confirmation.

#### Scenario: Duress change
- **WHEN** the user changes the duress PIN with biometric confirmation
- **THEN** the new duress code replaces the old one and the old code no longer triggers duress state

### Requirement: Unlock policy switch
The user SHALL be able to disable biometric unlock in favor of PIN-only unlock (recommended for users at concrete coercion risk, per the onboarding education).

#### Scenario: PIN-only mode
- **WHEN** the user disables biometry
- **THEN** every app open requires the PIN and biometry is no longer requested

### Requirement: App information
Settings SHALL include app version and a link to the operational help page and known-limits page.

#### Scenario: Info accessible
- **WHEN** the user opens Settings
- **THEN** version, help, and known-limits entries are reachable
