# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive project documentation (README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT).
- Real-time Socket.io integration for Community Map live updates.
- Server-side REST endpoints for Issue creation, AI analysis, and Stats.
- PostgreSQL database schema with seed data initialization.
- Interactive Authority Dashboard for civic moderators.
- Peer Verification Center for citizen consensus on reported issues.
- Gamification engine with reputation points and leaderboard.
- Secure JWT-based Authentication with Role-Based Access Control (RBAC).

### Changed
- Replaced hackathon mock data arrays with real dynamic API fetches.
- Hardened backend security by enforcing server-side role validation for sign-ups.
- Protected upvote endpoints with authentication middleware.

### Fixed
- Fixed bug causing false system errors by routing `/api/stats` correctly to `/api/issues/stats`.
- Removed mock demo-login bypass that bypassed database validation.
- Fixed issue creation where arbitrary upvote counts could be injected.
